import controllers.CommentsController
import controllers.CommentsController.CommentPush
import controllers.UserController._
import models.DBUserStatus
import org.junit.runner._
import org.specs2.runner._
import play.Logger
import play.api.test._
import play.libs.Json
import utils.ExtendedSpecification

import scala.language.reflectiveCalls

@RunWith(classOf[JUnitRunner])
class UserCommentSpec extends ExtendedSpecification {

  //Creating a user unauthentified, then signup should have the infos of the unauthentified into the signup
  //- and the signup user should have the same id as unauthentified
  //Creating a user unauthentified, then login, should not keep the informations
  //unauthentified -> sign up -> log out -> login  should work
  //unauthentified, again should have the same id

  "Having no comment mean getting 0 comments back" in new WithApplication {
    uclient.get_user_comments_last(3).length must_== 0
  }

  "Having less than 3 comments on same page" in new WithApplication {
    val c = uclient
    val pageId = c.post_page(df.pushPage)

    val com1 = c.post_comment(pageId, df.commentPush)
    c.makeSureDateAreDifferents
    val com2 = c.post_comment(pageId, df.commentPush)

    val comments = c.get_user_comments_last(3)

    comments.length must_== 2
    comments(0).commentId must_== com2
    comments(1).commentId must_== com1
  }

  "Having exactly 3 comments on same page" in new WithApplication {
    val c = uclient

    Logger.info("##########"  + c.id.toJson.toString)

    val pageId = c.post_page(df.pushPage)

    val com1 = c.post_comment(pageId, df.commentPush)
    c.makeSureDateAreDifferents
    val com2 = c.post_comment(pageId, df.commentPush)
    c.makeSureDateAreDifferents
    val com3 = c.post_comment(pageId, df.commentPush)

    val comments = c.get_user_comments_last(3)
    Logger.info("########### " + Json.toJson(comments).toString)

    comments.length must_== 3
    comments(0).commentId must_== com3
    comments(1).commentId must_== com2
    comments(2).commentId must_== com1
  }

  "Having more than 3 comments on same page" in new WithApplication {
    val c = uclient
    val pageId = c.post_page(df.pushPage)

    val com1 = c.post_comment(pageId, df.commentPush)
    c.makeSureDateAreDifferents
    val com2 = c.post_comment(pageId, df.commentPush)
    c.makeSureDateAreDifferents
    val com3 = c.post_comment(pageId, df.commentPush)
    c.makeSureDateAreDifferents
    val com4 = c.post_comment(pageId, df.commentPush)

    val comments = c.get_user_comments_last(3)

    comments.length must_== 3
    comments(0).commentId must_== com4
    comments(1).commentId must_== com3
    comments(2).commentId must_== com2
  }

  "Having less than 3 comments on different pages" in new WithApplication {
    val c = uclient
    val pages = List(df.pushPage, df.pushPage)
    val pagesId = pages.map { p => c.post_page(p) }

    val com1 = c.post_comment(pagesId(0), df.commentPush)
    c.makeSureDateAreDifferents
    val com2 = c.post_comment(pagesId(1), df.commentPush)

    val comments = c.get_user_comments_last(3)

    comments.length must_== 2
    comments(0).commentId must_== com2
    comments(0).pageTitle must_== pages(1).name
    comments(1).commentId must_== com1
    comments(1).pageTitle must_== pages(0).name

  }

  "Having exactly 3 comments on different pages" in new WithApplication {
    val c = uclient
    val pages = List(df.pushPage, df.pushPage, df.pushPage)
    val pagesId = pages.map { p => c.post_page(p) }

    val com1 = c.post_comment(pagesId(0), df.commentPush)
    c.makeSureDateAreDifferents
    val com2 = c.post_comment(pagesId(1), df.commentPush)
    c.makeSureDateAreDifferents
    val com3 = c.post_comment(pagesId(2), df.commentPush)

    val comments = c.get_user_comments_last(3)

    comments.length must_== 3
    comments(0).commentId must_== com3
    comments(0).pageTitle must_== pages(2).name
    comments(1).commentId must_== com2
    comments(1).pageTitle must_== pages(1).name
    comments(2).commentId must_== com1
    comments(2).pageTitle must_== pages(0).name
  }

  "Having more than 3 comments on different pages" in new WithApplication {
    val c = uclient
    val pages = List(df.pushPage, df.pushPage, df.pushPage, df.pushPage)
    val pagesId = pages.map { p => c.post_page(p) }

    val com1 = c.post_comment(pagesId(0), df.commentPush)
    c.makeSureDateAreDifferents
    val com2 = c.post_comment(pagesId(1), df.commentPush)
    c.makeSureDateAreDifferents
    val com3 = c.post_comment(pagesId(2), df.commentPush)
    c.makeSureDateAreDifferents
    val com4 = c.post_comment(pagesId(3), df.commentPush)

    val comments = c.get_user_comments_last(3)
    Logger.info("##########"  + c.id.toJson.toString)
    Logger.info("########### " + Json.toJson(comments).toString)

    comments.length must_== 3
    comments(0).commentId must_== com4
    comments(0).pageTitle must_== pages(3).name
    comments(1).commentId must_== com3
    comments(1).pageTitle must_== pages(2).name
    comments(2).commentId must_== com2
    comments(2).pageTitle must_== pages(1).name
  }

  "Comment with parent" in new WithApplication {
    val c = uclient
    val pageId = c.post_page(df.pushPage)

    val comment1Id = c.post_comment(pageId, df.commentPush)

    val comment2 = CommentPush(df.selector, df.randomText(10), Some(comment1Id))

    val comment2Id = c.post_comment(pageId, comment2)

    c.get_comment(pageId, comment2Id).parentId must_== Some(comment1Id)

  }




}
