package controllers

import javax.inject.Inject

import models.Id
import play.api.Logger
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json._
import play.modules.reactivemongo.ReactiveMongoApi
import play.modules.reactivemongo.json._
import play.modules.reactivemongo.json.collection.{JSONCollection, _}
import reactivemongo.api._
import reactivemongo.api.indexes.{Index, IndexType}
import reactivemongo.bson._

import scala.concurrent.Future

//TODO have thoses functions : https://mongodb.github.io/casbah/guide/querying.html
//coll.insert(elem)
//coll.count()
//coll.findAll() //is find() but findAll is more precise
//coll.find(req)
//coll.findOne(req)
//coll.update() //later, this is more complex
//coll.remove()
//coll.drop() //remove completely the collection
//coll.find()
//coll.findOneById()

class CollectionWrapper(collection: JSONCollection) {

  def getCollection = collection

  def findAll[T: Reads]() = find[T](Json.obj())

  //TODO the fields one don't work, and I don't know why, certainly import missings
  //def find[T: Reads](fields: (String, JsValueWrapper)*) = find(Json.obj(fields:_*))

  def find[T: Reads](query: JsObject): Future[List[T]] = {
    collection.find(query).
      cursor[T](ReadPreference.nearest).collect[List]()
  }

  def find[T: Reads](query: JsObject, projection: JsObject): Future[List[T]] = {
    collection.find(query, projection).
      cursor[T](ReadPreference.nearest).collect[List]()
  }

  def find[T: Reads](query: JsObject, limit: Int, sortBy: JsObject): Future[List[T]] = find[T](query, limit, 0, sortBy)

  def find[T: Reads](query: JsObject, limit: Int, skipNum: Int, sortBy: JsObject): Future[List[T]] = {
    val queryOpt = QueryOpts().batchSize(limit).skip(skipNum)
    collection.find(query).options(queryOpt).sort(sortBy).
      cursor[T](ReadPreference.nearest).collect[List]().map { elems =>
      elems.slice(skipNum, skipNum + limit) //TODO this is reaaaaallllly not great
    }
  }


  //TODO when NotFound, crash instead, to correct
  def findOne[T: Reads](query: JsObject): Future[Option[T]] =
    this.find[T](query).map { pages =>
      pages.length match {
        case 0 => None
        case 1 => Some(pages(0))
        case _ => throw new InternalError("multiples result found ")
      }
    }


  def findById[T: Reads](id: Id): Future[Option[T]] = findOne[T](Json.obj("_id" -> id.toJson))

  def insert[T: Writes](elem: T): Future[Id] = {

    //This adding so we can have the id of inserted object
    val cleanPage: JsObject = Json.toJson(elem).as[JsObject]
    val newId = BSONObjectID.generate.stringify
    val cleanPageWithId = cleanPage + ("_id" -> Json.obj("$oid" -> newId))

    collection.insert(cleanPageWithId).map { lastError =>
      //lastError.elements.map(f =>
      //  Logger.warn(s"key : ${f._1} , value : ${f._2}")
      //)
      if (lastError.ok) {
        Logger.warn("OK")
        Id(newId)
      } else {
        Logger.warn("KO")
        //TODO log into mongoDB, print exception, return json "internal error" in this order
        throw lastError
      }
    }

  }


  def remove(query: JsObject) = collection.remove(query)

  def removeById(id: Id) = remove(Json.obj("_id" -> id.toJson))

  //def remove(query : JsObject) = collection.remove(querya)

  //def removeById(id: String) = remove(Json.ob(""))

}


class DbWrapper @Inject()(val reactiveMongoApi: ReactiveMongoApi) {

  def getCollection(name: String) = new CollectionWrapper(reactiveMongoApi.db.collection[JSONCollection](name))

  lazy val comment = getCollection("comment")
  lazy val page = {
    val res = getCollection("page")

    //Create the text index
    val fields = Seq(
      ("name", IndexType.Text),
      ("url", IndexType.Text)
    )

    res.getCollection.indexesManager.ensure(Index(fields, Some("text_name_index")))

    res
  }

  lazy val page_content = getCollection("page_content")

  lazy val user = getCollection("user")
  lazy val favorites = getCollection("favorites")

}

