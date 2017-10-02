import controllers.PageController.PushPage
import org.junit.runner._
import org.specs2.runner._
import play.api.test._
import utils.ExtendedSpecification

import scala.language.reflectiveCalls


@RunWith(classOf[JUnitRunner])
class HtmlCleaningSpec extends ExtendedSpecification {

  "cleaning links" in new WithApplication {
    val c = uclient

    val html = "<h1>Hello wor<a href=\"/toto/tutu/tralal\">dl</a> ! </h1>"
    val page = PushPage(df.uniqUrl, df.randomText(3), html, df.style)
    val savedPage = c.get_page(c.post_page(page), full = true)
    val htmlWaiting = "<h1>Hello wor<a href=\"#\">dl</a> ! </h1>"

    savedPage.content.get must_== htmlWaiting
  }


  "cleaning iframes" in new WithApplication {
    val c = uclient

    def html = "<h1>Hello wor<iframe toto=\"tutu\"></iframe>dl</h1>"

    val page = PushPage(df.uniqUrl, df.randomText(2), html, df.style)
    val savedPage = c.get_page(c.post_page(page), full = true)

    val htmlWaiting = "<h1>Hello wor<iframe></iframe>dl</h1>"

    savedPage.content.get must_== htmlWaiting
  }


  "cleaning script" in new WithApplication {
    val c = uclient

    val html = "<h1>Hello wor<script>scriptcontent</script>dl</h1>"

    val page = PushPage(df.uniqUrl, df.randomText(2), html, df.style)
    val savedPage = c.get_page(c.post_page(page), full = true)

    val htmlWaiting = "<h1>Hello wor<script></script>dl</h1>"

    savedPage.content.get must_== htmlWaiting
  }

  "link img absolute" in new WithApplication {
    val c = uclient

    def url = "http://www.example.com/titi/tutu?tralala=trolo#/same/here"

    def html = "<h1>Hello wor<img scr=\"/toto\"/>dl</h1>"

    val page = PushPage(url, df.randomText(2), html, df.style)
    val savedPage = c.get_page(c.post_page(page), full = true)

    val htmlWaiting = "<h1>Hello wor<img scr=\"http://www.example.com/toto\"/>dl</h1>"
    //TODO process that it doesn't work
    //savedPage.content.get must_== htmlWaiting

  }


}
