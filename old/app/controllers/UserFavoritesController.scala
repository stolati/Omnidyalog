package controllers

import javax.inject.Inject

import controllers.PageController.ResPage
import models.Id
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
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

import models.Favorite._

object UserFavoritesController {

  /* there are just page Id */
  /* and when we want to show the favorite, we go for the page */

}

class UserFavoritesController @Inject()(val db: DbWrapper, val userController: UserController, val pageController: PageController) extends Controller {

  def get(userId: Id)  = {
    get_or_create_favs(userId).flatMap { favs =>
      val listFuture = favs.pagesId.map { pageId =>
        db.page.findById[PageWithId](pageId).map { optPage =>
          optPage.map { page =>
            Some(ResPage(page.url, page.name, page._id, None, None))
          }.getOrElse( None )
        }.filter(_.isDefined).map{_.get}
      }
      Future.sequence(listFuture)
    }

  }

  def post(userId: Id, pageId: Id) = {
    get_or_create_favs(userId).flatMap{ favs =>
      var newFavs = Favorite(userId, favs.pagesId)
      if(!favs.pagesId.contains(pageId)){
        newFavs = Favorite(userId, pageId :: favs.pagesId)
      }

      //TODO use the update instead
      db.favorites.removeById(favs._id).flatMap{ resRemove =>
        db.favorites.insert(newFavs)
      }
    }
  }


  def delete(userId: Id, pageId: Id) = {
    get_or_create_favs(userId).flatMap{ favs =>
      var newFavs = Favorite(userId, favs.pagesId)
      if(favs.pagesId.contains(pageId)){
        newFavs = Favorite(userId, favs.pagesId.filter(_ != pageId))
      }

      //TODO use the update instead
      db.favorites.removeById(favs._id).flatMap{ resRemove =>
        db.favorites.insert(newFavs)
      }
    }
  }


  def get_js = Action.async { request =>
    userController.withCurrentUser(request) { user =>
      get(user._id).map{ resPages =>
        Ok(Json.toJson(resPages))
      }
    }
  }

  def post_js = Action.async(parse.json) { request =>
    val pageId = request.body.validate[Id].get

    userController.withCurrentUser(request) { user =>
      post(user._id, pageId).map { postRes =>
        Ok("")
      }
    }
  }

  def delete_js(pageId: String) = Action.async { request =>
    userController.withCurrentUser(request) { user =>
      userController.withCurrentUser(request) { user =>
        delete(user._id, Id(pageId)).map { postRes =>
          Ok("")
        }
      }
    }
  }


  def get_or_create_favs(userId: Id) = {
    val query = Json.obj( "userId" -> userId )

    db.favorites.findOne[FavoriteWithId](query).flatMap { optFavs =>
      optFavs.map(e => Future{e}).getOrElse {

        //Create blank favs
        val fav2create = Favorite(userId, List())
        db.favorites.insert(fav2create).map { newId =>
          FavoriteWithId(newId, userId, List())
        }
      }
    }
  }


  //def get_favorites = get("user/favorites").as[List[ResPage]]
  //def post_favorites(pageId: Id) = post("user/favorites").body(pageId).asUnit
  //def del_favorites(pageId: Id) = delete(s"user/favorites/${pageId}").asUnit

}
