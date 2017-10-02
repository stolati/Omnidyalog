import controllers.UserController._
import models.DBUserStatus
import org.junit.runner._
import org.specs2.runner._
import play.api.test._
import utils.ExtendedSpecification

import scala.language.reflectiveCalls

@RunWith(classOf[JUnitRunner])
class HtmlCrawlerSpec extends ExtendedSpecification {

  //Creating a user unauthentified, then signup should have the infos of the unauthentified into the signup
  //- and the signup user should have the same id as unauthentified
  //Creating a user unauthentified, then login, should not keep the informations
  //unauthentified -> sign up -> log out -> login  should work
  //unauthentified, again should have the same id

  "Grab a simple page" in new WithApplication {
    val url = "https://www.google.com/#q=mike+is+the+best"




  }

}
