import controllers.PageController.PushPage
import org.junit.runner._
import org.specs2.runner._
import play.api.http._
import play.api.test._
import utils.ExtendedSpecification

import scala.language.reflectiveCalls


/**
 * Add your spec here.
 * You can mock out a whole application including requests, plugins etc.
 * For more information, consult the wiki.
 */
@RunWith(classOf[JUnitRunner])
class ApplicationSpec extends ExtendedSpecification {

  "page crud" in new WithApplication {
    val c = uclient

    //Create 3 elements
    val page1 = df.pushPage
    val page2 = df.pushPage
    val page3 = df.pushPage

    val page1Id = c.post_page(page1)
    val page2Id = c.post_page(page2)
    val page3Id = c.post_page(page3)

    //Remove element in the middle
    shouldStatusCode(Status.OK) { () => c.del_page(page2Id) }
    shouldStatusCode(Status.OK) { () => c.del_page(page2Id) } //TODO have a different return if page don't exists
    shouldStatusCode(Status.NOT_FOUND) { () => c.get_page(page2Id, full = true) }

    //Get each elements
    val page1res = c.get_page(page1Id)
    val page3res = c.get_page(page3Id)

    (page1res.url, page1res.name) must_==(page1.url, page1.name)
    (page3res.url, page3res.name) must_==(page3.url, page3.name)

    page1res.name must_== page1.name
    page3res.name must_== page3.name

    //Deleted element should not exists
    //TODO
  }

  "comment crud" in new WithApplication {
    val c = uclient
    val pageId = c.post_page(df.pushPage)

    //Create elements
    val comment1 = df.commentPush
    val comment2 = df.commentPush
    val comment3 = df.commentPush

    val c1id = c.post_comment(pageId, comment1)
    val c2id = c.post_comment(pageId, comment2)
    val c3id = c.post_comment(pageId, comment3)

    ////Delete one
    shouldStatusCode(OK) { () => c.del_comment(pageId, c2id) }
    shouldStatusCode(OK) { () => c.del_comment(pageId, c2id) }
    //TODO should be NOT_FOUND

    //get others
    val com1 = c.get_comment(pageId, c1id)
    shouldStatusCode(NOT_FOUND) { () => c.get_comment(pageId, c2id) }
    shouldStatusCode(NOT_FOUND) { () => c.get_comment(pageId, df.uniqId) }
    shouldStatusCode(NOT_FOUND) { () => c.get_comment(df.uniqId, c1id) }
    val com3 = c.get_comment(pageId, c3id)

    (com1.selector, com1.content) must_==(comment1.selector, comment1.content)
    (com3.selector, com3.content) must_==(comment3.selector, comment3.content)

    //Check bad page get
    shouldStatusCode(Status.NOT_FOUND) { () =>
      c.get_comment(pageId, df.uniqId)
    }

    //Check get all
    val comments = c.get_comment(pageId)
    comments.size must_== 2 //com1 + com3
    comments.map(_.content).toSeq must_== Seq(com1.content, com3.content)

  }

  "comment should be created by its creator" in new WithApplication {

    val c = uclient
    val pageId = c.post_page(df.pushPage)
    val cid = c.id //TODO test without that, it should brake but it's bad

    val comId = c.post_comment(pageId, df.commentPush)

    c.get_comment(pageId, comId).userId must_== cid
    uclient.get_comment(pageId, comId).userId must_== cid
  }

  "test page exists" in new WithApplication {

    val c = uclient
    val page = df.pushPage
    val pageId = c.post_page(page)

    c.get_page_exists(page.url.toString).page must_!= None
    c.get_page_exists(df.uniqUrl.toString).page must_== None

  }

  "most commented page" in new WithApplication {

    val c = uclient

    c.post_comment(c.post_page(df.pushPage), df.commentPush)

    val listRes = c.get_page_most_commented(10) //should go without errors
    listRes.length must_!= 0 //no more than 0 elements

  }

  "search text in pages name/url" in new WithApplication {
    val c = uclient

    val (u1, u2) = (df.uniqId.oid, df.uniqId.oid)

    c.makeSureDateAreDifferents
    val p = PushPage(df.uniqUrl, s"$u1 $u2", df.html(), df.style)

    val p_id = c.post_page(p)

    c.get_page_find(1, 0, df.uniqId.oid).length must_== 0

    List(p.url, u1, u2).foreach { searchText: String =>
      c.get_page_find(1, 0, searchText)(0).id must_== p_id
    }

    c.get_page_find(1, 0, df.uniqId.oid).length must_== 0

  }


}
