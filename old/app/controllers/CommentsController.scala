package controllers

import javax.inject.Inject

import controllers.CommentsController.CommentGet
import models.Comment._
import models.{DBUserWithId, Comment, CommentWithId, Id}
import org.joda.time.DateTime
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json._
import play.api.mvc.{Action, Controller}

import scala.concurrent.Future

//TODO put in/out objects into their own files
//For better readability and maybe automatic generation (with rest api use)
object CommentsController {

  case class CommentPush(selector: String, content: String, parentComment: Option[Id])
  implicit val commentPushForms = Json.format[CommentPush]

  case class CommentGet(selector: String, content: String, userId: Id, created: DateTime, id: Id, parentId: Option[Id])
  implicit val commentGetForms = Json.format[CommentGet]

  def commentGet(c: CommentWithId) = CommentGet(c.selector, c.content, c.userId, c.created, c._id, c.parentComment)

}


class CommentsController @Inject()(val db: DbWrapper, val userController: UserController) extends Controller {


  def create(comment: Comment): Future[CommentWithId] = {
    db.comment.insert(comment).map { newId => comment.withId(newId) }
  }

  def create_js(pageId: String) = Action.async(parse.json) { request =>
    val pushComment = request.body.validate[CommentsController.CommentPush].get
    userController.withCurrentUser(request){ user:DBUserWithId =>
      val c: Comment = Comment(Id(pageId), pushComment.selector, pushComment.content, user._id, DateTime.now, pushComment.parentComment)

      create(c).map { comWithId =>
        Ok(comWithId._id.toJson)
      }
    }
  }

  def getCommentById(id: Id) = db.comment.findById[CommentWithId](id)

  def get(pageId: String, commentId: String) = Action.async {
    getCommentById(Id(commentId)).map { optCom =>
      optCom.map { com =>
        if(com.pageId.oid == pageId) {
          val res = CommentsController.commentGet(com)
          Ok(Json.toJson(res))
        } else {
          NotFound
        }
      }.getOrElse(NotFound)
    }
  }

  def delete(pageId: String, commentId: String) = Action.async {
    db.comment.remove(Json.obj("_id" -> Id(commentId), "pageId" -> Id(pageId))).map { res =>
      //TODO check errors, missing element
      Ok
    }
  }

  def getByPage(pageId: String) = Action.async {
    db.comment.find[CommentWithId](Json.obj("pageId" -> Id(pageId).toJson)).map { comments =>
      val commentsGet = comments.map{ c => CommentsController.commentGet(c) }
      Ok(Json.toJson(commentsGet))
    }
  }

}