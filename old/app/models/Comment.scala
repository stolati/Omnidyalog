package models

import org.joda.time.DateTime
import play.api.libs.json.Json

case class Comment(pageId: Id, selector: String, content: String, userId: Id, created: DateTime, parentComment: Option[Id]){
  def withId(id: Id) = CommentWithId(id, pageId, selector, content, userId, created, parentComment)

  def isEndPage = selector == Comment.END_PAGE
}

case class CommentWithId(_id: Id, pageId: Id, selector: String, content: String, userId: Id, created: DateTime, parentComment: Option[Id]){
  def isEndPage = selector == Comment.END_PAGE
}

object Comment {
  val END_PAGE = "<END_PAGE>"

  implicit val commentFormat = Json.format[Comment]
  implicit val commentWithIdFormat = Json.format[CommentWithId]
}



