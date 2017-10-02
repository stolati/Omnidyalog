import org.junit.runner._
import org.specs2.runner._
import play.Logger
import play.api.test._
import play.libs.Json
import utils.ExtendedSpecification

import scala.language.reflectiveCalls

@RunWith(classOf[JUnitRunner])
class FavoritePagesSpec extends ExtendedSpecification {


  "crud on favorite with unauthenticated" in new WithApplication {

    val c = uclient
    c.get_favorites.length must_== 0

    val pageContents = List(df.pushPage, df.pushPage, df.pushPage)
    val pages = pageContents.map{c.post_page(_)}

    pages.foreach(c.post_favorites(_))

    c.del_favorites(pages(1)) //remove the middle one

    val favs = c.get_favorites.toSet

    favs.size must_== 2
    favs.map(_.id) must_== Set(pages(0), pages(2))

  }

  "crud on favorite with authenticated" in new WithApplication {

    val e = eclient
    e.get_favorites.length must_== 0

    val pageContents = List(df.pushPage, df.pushPage, df.pushPage)
    val pages = pageContents.map{e.post_page(_)}

    pages.foreach(e.post_favorites(_))

    e.del_favorites(pages(1)) //remove the middle one

    val favs = e.get_favorites.toSet

    favs.size must_== 2
    favs.map(_.id) must_== Set(pages(0), pages(2))
  }

}
