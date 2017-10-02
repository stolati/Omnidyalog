package models

import play.api.libs.json._
import reactivemongo.bson.BSONObjectID
import Id._

case class Id(oid: String) {
  //Test that the string is a valid objectId
  if(BSONObjectID.parse(oid).isFailure){
    throw new Exception(s"[${oid}] not a valid ObjectId")
  }

  def toJson = Json.toJson(this)(idWrite)
}

object Id {

  implicit val idRead = new Reads[Id] {
    def reads(js: JsValue): JsResult[Id] = {
      JsSuccess(Id((js \ "$oid").as[String]))
    }
  }

  implicit val idWrite = new Writes[Id] {
    override def writes(id: Id): JsValue = {
      Json.obj("$oid" -> id.oid)
    }
  }

}



