package utils

import controllers.CommentsController.{CommentGet, CommentPush}
import controllers.PageController.{MostUsedResult, PageExists, PushPage, ResPage}
import controllers.UserCommentController.CommentInPage
import controllers.UserController.{Loging, MyUser, SigningInfo}
import models.Id

/*** Client types ***/

class BasicHelperClient extends Client {

  lazy val id = get_user_current.id
  def email: String = ""

  def post_page(fullPage: PushPage) = post("page").body(fullPage).as[Id]
  def get_page(id: Id, full: Boolean = false) = get(s"page/${id.oid}").query("full" -> full.toString).as[ResPage]
  def del_page(id: Id) = delete(s"page/${id.oid}").asUnit
  def get_all_page = get("page").as[List[ResPage]]

  def post_comment(pageId: Id, comment: CommentPush) = post(s"page/${pageId.oid}/comment").body(comment).as[Id]
  def del_comment(pageId: Id, commentId: Id) = delete(s"page/${pageId.oid}/comment/${commentId.oid}").asUnit
  def get_comment(pageId: Id) = get(s"page/${pageId.oid}/comment").as[List[CommentGet]]
  def get_comment(pageId: Id, commentId: Id) = get(s"page/${pageId.oid}/comment/${commentId.oid}").as[CommentGet]

  def get_user_current = get("user/current").as[MyUser]
  def post_user_signin(signingInfo: SigningInfo) = post("user/signin").body(signingInfo).as[MyUser]
  def post_user_logout = post("user/logout").asUnit
  def post_user_login(loging: Loging) = post("user/login").body(loging).as[MyUser]

  def get_page_exists(pageUrl: String) = get("page/exists").query("url" -> pageUrl).as[PageExists]

  def get_user_comments_last(size: Int = 10) = get("user/comments/last").query("size" -> size.toString).as[List[CommentInPage]]

  def get_favorites = get("user/favorites").as[List[ResPage]]
  def post_favorites(pageId: Id) = post("user/favorites").body(pageId).asUnit
  def del_favorites(pageId: Id) = delete(s"user/favorites/${pageId.oid}").asUnit

  def get_page_most_commented(size: Int = 10) = get("page/most_commented").as[List[MostUsedResult]]

  def get_page_find(pageSize: Int, pageNum: Int, text: String) =
    get("page/find").query("pageSize" -> pageSize.toString, "pageNum" -> pageNum.toString, "text" -> text).as[List[ResPage]]

}



class UnauthenticatedClient extends BasicHelperClient

class EmailConnectedClient(dataFactory: DataFactory) extends BasicHelperClient {

  def password = "pass" //Everybody have the same password

  val _email = dataFactory.uniqEmail
  override def email = _email

  post_user_signin(SigningInfo(email, password))

}
