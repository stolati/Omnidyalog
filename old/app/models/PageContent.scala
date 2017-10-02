package models

import org.joda.time.DateTime
import play.api.libs.json._


case class PageContent(content: String, style: String, pageId: Id, created: DateTime, created_by: Id)
case class PageContentWithId(_id: Id, content: String, style: String, pageId: Id, created: DateTime, created_by: Id)


object PageContent {

  implicit val pageContentFormat = Json.format[PageContent]
  implicit val pageContentWithIdFormat = Json.format[PageContentWithId]

}

