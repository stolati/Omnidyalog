package controllers

import javax.inject.Inject

import akka.actor.FSM.Failure
import controllers.CommentsController.CommentGet
import controllers.UserCommentController.CommentInPage
import models._
import org.joda.time.DateTime
import play.Logger
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json._
import play.api.mvc.{Action, Controller}
import models.Comment._
import models.Page._

import scala.concurrent.Future

//TODO put in/out objects into their own files
//For better readability and maybe automatic generation (with rest api use)
object UserCommentController {

  case class CommentInPage(created: DateTime, pageTitle: String, pageUrl: String, commentId: Id)
  implicit val commentInPageForm = Json.format[CommentInPage]

}


class UserCommentController @Inject()(val db: DbWrapper, val userController: UserController) extends Controller {

  def getLastCommentsInPage_js(size : Int=10) = Action.async { request =>
    userController.withCurrentUser(request) { user =>
      getLastCommentsInPage(user, size).map { commentsInPage =>
        Logger.info(Json.toJson(commentsInPage).toString)
        Ok(Json.toJson(commentsInPage))
      }
    }
  }

  def getLastCommentsInPage(user: DBUserWithId, size: Int): Future[List[CommentInPage]] = {
    val query = Json.obj(
      "userId" -> user._id
    )
    val sortBy = Json.obj(
      "created" -> -1
    )

    db.comment.find[CommentWithId](query, size, sortBy).flatMap { comments =>
      val res = comments.map { comment =>
        db.page.findById[PageWithId](comment.pageId).flatMap { optPage =>
          optPage.map { page =>
            Future { CommentInPage(comment.created, page.name, page.url, comment._id) }
          }.getOrElse( Future.failed(new Exception("Comment didn't find associate page")))
        }
      }
      Future.sequence(res)
    }
  }


}