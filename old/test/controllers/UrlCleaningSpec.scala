package controllers

import controllers.PageController.PushPage
import org.junit.runner._
import org.specs2.runner._
import play.api.test._
import utils.ExtendedSpecification

import scala.language.reflectiveCalls

@RunWith(classOf[JUnitRunner])
class UrlCleaningSpec extends ExtendedSpecification {

  //Creating a user unauthentified, then signup should have the infos of the unauthentified into the signup
  //- and the signup user should have the same id as unauthentified
  //Creating a user unauthentified, then login, should not keep the informations
  //unauthentified -> sign up -> log out -> login  should work
  //unauthentified, again should have the same id

  def getUrlFrom(url: String) = {
    val c = uclient
    val pageId = c.post_page(PushPage(url, df.randomText(10), df.html(), df.style))
    c.get_page(pageId, false).url
  }


  "default url" in new WithApplication {

    val urls = List(df.uniqUrl, df.uniqUrl, df.uniqUrl, df.uniqUrl)

    urls.foreach { url =>
      getUrlFrom(url) must_== url
    }

  }


  "google url" in new WithApplication {

    {
      val goUrl = "https://www.google.com/search?q=hello+world&rlz=1C1MSNA_enUS650US650&oq=hello+world&aqs=chrome..69i57j0l2j69i61l3.2487j0j7&sourceid=chrome&es_sm=93&ie=UTF-8"
      val cleanedGoUrl = "https://www.google.com/search?q=hello+world"
      getUrlFrom(goUrl) must_== cleanedGoUrl
    }

    {
      val goUrl = "https://www.google.com/#q=hello+toto"
      val cleanedGoUrl = "https://www.google.com/search?q=hello+toto"
      getUrlFrom(goUrl) must_== cleanedGoUrl
    }

  }

}
