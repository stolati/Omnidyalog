package controllers

import controllers.UserController.Loging
import models.DBUser._
import models.{DBUser, DBUserStatus, DBUserWithId, Id}
import org.jasypt.util.password.StrongPasswordEncryptor
import org.joda.time.DateTime

// Reactive Mongo imports

import javax.inject.Inject

import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json._
import play.api.mvc._
import play.modules.reactivemongo.json._

import scala.concurrent.Future


object UserController {

  //Show the information about this user for himself
  case class MyUser(id: Id, status: String, email: Option[String])
  implicit val myUserFormat = Json.format[MyUser]

  def myUserFromUser(user: DBUserWithId) = MyUser(user._id, user.status, user.email)

  case class SigningInfo(email: String, password: String)
  implicit val signingiInfoFormat = Json.format[SigningInfo]

  case class Loging(email: String, password: String)
  implicit val logingFormat = Json.format[Loging]

  //Show only what a user can se about other users
  //case class OtherUser()

  lazy val passwordEncryptor = new StrongPasswordEncryptor()

}


/**
 * Created by mickaelkerbrat on 7/15/15.
 */
class UserController @Inject()(val db: DbWrapper) extends Controller {

  val user_uid_name = "user_uid"

  def getSessionUserId[T](request: Request[T]) = request.session.get(user_uid_name)

  def setSessionUserId[T](request: Request[T], uid: String) = request.session + (user_uid_name -> uid)

  def cleanSessionUserId[T](request: Request[T]) = request.session - user_uid_name

  def newUserCreation(): Future[DBUserWithId] = {

    import DBUserStatus._
    val user = DBUser(NO_AUTHENTIFICATION, None, DateTime.now(), None)

    db.user.insert(user).map { userUid =>
      user.withId(userUid)
    }
  }


  def getOrCreateUser(opUserId: Option[String]): Future[DBUserWithId] = {
    opUserId.map { userId =>
      db.user.findById[DBUserWithId](Id(userId)).flatMap { opUserJs =>
        opUserJs match {
          case Some(a) => Future {
            a
          }
          case None => newUserCreation
        }
      }
    }.getOrElse(newUserCreation)
  }


  def getCurrentUser_js = Action.async { request =>
    getOrCreateUser(getSessionUserId(request)).map { user =>
      val res = Json.toJson(UserController.myUserFromUser(user))
      Ok(res).withSession(user_uid_name -> user._id.oid)
    }
  }

  def getCurrentUser[T](request: Request[T]): Future[DBUserWithId] = {
    getOrCreateUser(getSessionUserId(request))
  }

  /*
  def withCurrentUser[T](request: Request[T])(code: (DBUserWithId) => Result): Future[Result] = {
    this.getCurrentUser(request).map { curUser =>
      code.apply(curUser).withSession(user_uid_name -> curUser._id.oid)
    }
  }
  */

  def withCurrentUser[T](request: Request[T])(code: (DBUserWithId) => Future[Result]): Future[Result] = {
    this.getCurrentUser(request).flatMap { curUser =>
      code.apply(curUser).map { res =>
        res.withSession(user_uid_name -> curUser._id.oid)
      }
    }
  }

  def login(): Unit = {
    //does the current user have information on it ?
    // if yes, ask, if not delete the current_user and login the other one


  }

  def signin_js() = Action.async(parse.json) { request =>
    //TODO this could be automated Action.async(parse[SigningInfo]) instead
    //TODO validate the email, for now it's just any string, see validate part
    val signObj = request.body.validate[UserController.SigningInfo].get
    val curId = getSessionUserId(request)

    signin(curId, signObj.email, signObj.password).map { resUser =>
      val myUser = UserController.myUserFromUser(resUser)
      Ok(Json.toJson(myUser)).withSession(user_uid_name -> resUser._id.oid)
    }

  }

  def logout_js = Action { request =>
    Ok("").withNewSession
  }


  /** Part where we use a password/email **/

  def signin(optCurrentId: Option[String], email: String, password: String): Future[DBUserWithId] = {

    getOrCreateUser(optCurrentId).flatMap { curUser =>

      curUser.email.map { curUserEmail =>
        //We already have an email
        Future.failed(new Exception("User have already an email"))
      }.getOrElse {
        emailExists(email).flatMap { itExists =>
          if (itExists) {
            //TODO Two choices, first we create a new user from scratch
            //TODO second we as the user to logout first
            Future.failed(new Exception("Email already exists"))
          } else {
            val passwordData = Some(UserController.passwordEncryptor.encryptPassword(password))
            val newUser = DBUserWithId(curUser._id, DBUserStatus.EMAIL, Some(email), curUser.created, passwordData)
            db.user.getCollection.update(Json.obj("_id" -> curUser._id), newUser).map { updated =>
              newUser
            }
          }
        }
      }
    }
  }

  def emailExists(email: String): Future[Boolean] = {
    db.user.findOne[JsValue](Json.obj("email" -> email)).map { (res: Option[JsValue]) =>
      res.nonEmpty
    }
  }

  def login_js = Action.async(parse.json) { request =>
    val li = request.body.validate[Loging].get

    login(li.email, li.password).map { optRes =>
      optRes.map { resOk =>
        val res = UserController.myUserFromUser(resOk)
        Ok(Json.toJson(res)).withSession(user_uid_name -> resOk._id.oid)
      }.getOrElse {
        BadRequest("").withNewSession
      }
    }
  }


  def login(email: String, password: String) = {
    db.user.findOne[DBUserWithId](Json.obj("email" -> email)).map { optRes =>
      optRes.flatMap { res =>
        if(res.password.isEmpty || ! UserController.passwordEncryptor.checkPassword(password, res.password.get)){
          None
        } else {
          Some(res)
        }
      }
    }
  }




}
