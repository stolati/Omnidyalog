package models

import org.joda.time.DateTime
import play.api.libs.json._
import play.api.libs.functional.syntax._

//TODO idea, having Id with types (so we can automatically search for them)

case class Page(url: String, url_hash: String, name: String, created: DateTime, created_by: Id)
case class PageWithId(_id: Id, url: String, url_hash: String, name: String, created: DateTime, created_by: Id)

object Page {

  implicit val pageFormat = Json.format[Page]
  implicit val pageWithIdFormat = Json.format[PageWithId]

}


