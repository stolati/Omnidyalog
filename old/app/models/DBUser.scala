package models

import org.joda.time.DateTime
import play.api.libs.json.Json

/**
 * Created by Mickael on 7/22/2015.
 */

//TODO instead of enumeration I used string, correct that

object DBUserStatus {
  val NO_AUTHENTIFICATION = "NO_AUTHENTIFICATION"
  val EMAIL = "EMAIL"
}

case class DBUser(status: String, email: Option[String], created: DateTime, password: Option[String]) {
  def withId(id: Id) = DBUserWithId(id, status, email, created, password)
}

case class DBUserWithId(_id: Id, status: String, email: Option[String], created: DateTime, password: Option[String]) {
  def withoutId = DBUser(status, email, created, password)

  def validate = {
    //TODO test that we have email only if status is email, and vice versa, and password also

  }
}

object DBUser {
  implicit val dbUserFormat = Json.format[DBUser]
  implicit val dbUserWithIdFormat = Json.format[DBUserWithId]
}
