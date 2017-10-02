package models

import org.joda.time.DateTime
import play.api.libs.json._
import play.api.libs.functional.syntax._

//TODO idea, having Id with types (so we can automatically search for them)

case class Favorite(userId: Id, pagesId: List[Id])
case class FavoriteWithId(_id: Id, userId: Id, pagesId: List[Id])

object Favorite {

  implicit val favoriteFormat = Json.format[Favorite]
  implicit val favoriteWithIdFormat = Json.format[FavoriteWithId]

}


