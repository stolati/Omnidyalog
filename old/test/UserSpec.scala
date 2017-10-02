import controllers.UserController._
import models.DBUserStatus
import org.junit.runner._
import org.specs2.runner._
import play.Logger
import play.api.test._
import utils.{UnauthenticatedClient, Client, ExtendedSpecification}

import scala.language.reflectiveCalls

@RunWith(classOf[JUnitRunner])
class UserSpec extends ExtendedSpecification {

  //Creating a user unauthentified, then signup should have the infos of the unauthentified into the signup
  //- and the signup user should have the same id as unauthentified
  //Creating a user unauthentified, then login, should not keep the informations
  //unauthentified -> sign up -> log out -> login  should work
  //unauthentified, again should have the same id

  "Two user should have different id" in new WithApplication {

    val c1, c2 = uclient

    val u1 = c1.get_user_current
    val u2 = c2.get_user_current

    u1.id must_!= u2.id
  }

  "User should have the same id" in new WithApplication {

    val c = uclient

    val u1 = c.get_user_current
    val u2 = c.get_user_current

    u1.id must_== u2.id
  }

  "New user should be unauthenticated" in new WithApplication {
    val u = uclient.get_user_current
    u.status must_== DBUserStatus.NO_AUTHENTIFICATION
    u.email must_== None
  }

  "User signing can transform an unauthenticated" in new WithApplication {
    val c = uclient
    val sinfo = df.signingInfo

    val u_un = c.get_user_current
    val u_auth = c.post_user_signin(sinfo)
    val u_auth2 = c.get_user_current

    u_un.id must_== u_auth.id
    u_auth must_== u_auth2
    u_auth.email must_== Some(sinfo.email)
  }

  "User signing can be created from nowhere" in new WithApplication {
    val c = uclient
    val sinfo = df.signingInfo

    val u_auth = c.post_user_signin(sinfo)
    val u_auth2 = c.get_user_current

    u_auth must_== u_auth2
    u_auth.email must_== Some(sinfo.email)
  }

  "User already signed should create a new one" in new WithApplication {
    //For now, just throw exception
    val c = uclient
    c.post_user_signin(df.signingInfo)

    //shouldStatusCode(BAD_REQUEST){ () => c.post_user_signin(df.signingInfo) }
    shouldThrow{ () => c.post_user_signin(df.signingInfo) }
  }

  "User cannot signing with an existing email" in new WithApplication {
    val sinfo = df.signingInfo

    uclient.post_user_signin(sinfo)

    //TODO shouldStatusCode(BAD_REQUEST) { () => uclient.post_user_signin(sinfo) }
    shouldThrow{ () => uclient.post_user_signin(sinfo) }
  }

  "Logout is giving me another user" in new WithApplication {
    val c = uclient
    val u1 = c.post_user_signin(df.signingInfo)
    c.post_user_logout
    val u2 = c.get_user_current

    u1.id must_!= u2.id
  }

  "Logout then logging give the same user" in new WithApplication {
    val c = uclient
    val sinfo = df.signingInfo
    val goodLogin = Loging(sinfo.email, sinfo.password)

    val u1 = c.post_user_signin(sinfo)
    c.post_user_logout
    val u2 = c.post_user_login(goodLogin)

    u1 must_== u2
  }

  "Logging don't work with bad email" in new WithApplication {
    val c = uclient
    val sinfo = df.signingInfo
    val badLogin = Loging(df.uniqEmail, sinfo.password)

    c.post_user_signin(sinfo)
    c.post_user_logout

    shouldStatusCode(BAD_REQUEST) { () => c.post_user_login(badLogin) }
  }

  "Logging don't work with bad password" in new WithApplication {
    val c = uclient
    val sinfo = df.signingInfo
    val badLogin = Loging(sinfo.email, sinfo.password + "_but_different")

    c.post_user_signin(sinfo)
    c.post_user_logout

    shouldStatusCode(BAD_REQUEST) { () => c.post_user_login(badLogin) }
 }
}
