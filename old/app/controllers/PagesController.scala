package controllers

import models.Id

// Reactive Mongo imports

import javax.inject.Inject

import controllers.PageController._
import models.Page._
import models.PageContent._
import models._
import org.joda.time.DateTime
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json._
import play.api.mvc.{Action, Controller}
import play.modules.reactivemongo.json._
import play.modules.reactivemongo.json.collection.JSONCollection

import scala.concurrent.Future

object PageController {

  case class ResPage(url: String, name: String, id: Id, content: Option[String], style: Option[String])

  implicit val resPageForms = Json.format[ResPage]

  case class PushPage(url: String, name: String, content: String, style: String)

  implicit val pushPageForms = Json.format[PushPage]

  case class PageExists(page: Option[ResPage])

  implicit val pageExistsForms = Json.format[PageExists]

  case class MostUsedAggrResult(_id: Id, nbComment: Int)

  implicit val mostUsedAggrResultForm = Json.format[MostUsedAggrResult]

  case class MostUsedResult(page: ResPage, nbComment: Int)

  implicit val mostUsedResultForm = Json.format[MostUsedResult]


}


class PageController @Inject()(val db: DbWrapper, val userController: UserController) extends Controller {

  def digestUrl(url: String) = org.apache.commons.codec.digest.DigestUtils.sha256Hex(url)

  def create(cp: PushPage, byUser: Id): Future[Id] = {

    val cleanedUrl = UrlRules.cleanUrl(cp.url).toString
    val p: Page = Page(cleanedUrl, digestUrl(cleanedUrl), cp.name, DateTime.now(), byUser)

    val cleanedHtml = HtmlFormatter.cleanHtml(cp.content, cp.url)

    //Test if the page already exists
    val query = Json.obj("url" -> cleanedUrl)
    db.page.find[PageWithId](query).flatMap { pages =>

      if (pages.isEmpty) {
        db.page.insert(p).flatMap { newId =>
          val c: PageContent = PageContent(cleanedHtml, cp.style, newId, DateTime.now(), byUser)
          db.page_content.insert(c).map { newContentId => newId }
        }
      } else {
        Future {
          pages(0)._id
        }
      }

    }

  }

  def create_js = Action.async(parse.json(maxLength = 1024 * 1024 * 10)) { request =>
    userController.withCurrentUser(request) { user =>
      create(request.body.validate[PushPage].get, user._id).map { newId =>
        Ok(newId.toJson)
      }
    }
  }

  //For large datas, use https://www.playframework.com/documentation/2.2.x/ScalaStream
  def getPage(pageId: String, full: Boolean) = Action.async {

    val fp = getPageById(Id(pageId))
    if (full) {

      fp.flatMap(_ match {
        case None => Future {
          NotFound("")
        }
        case Some(p) =>
          getPageContentByPageId(Id(pageId)).map(_ match {
            case None => NotFound("") //TODO check error
            case Some(pc) =>
              Ok(Json.toJson(ResPage(p.url, p.name, p._id, Some(pc.content), Some(pc.style))))
          })
      })
    } else {
      fp.map { op => op match {
        case None => NotFound("")
        case Some(p) =>
          Ok(Json.toJson(ResPage(p.url, p.name, p._id, None, None)))
      }
      }

    }

  }

  def getPageById(id: Id) = db.page.findById[PageWithId](id)

  def getPageContentByPageId(id: Id) = db.page_content.findOne[PageContent](Json.obj("pageId" -> id))


  def delete(pageId: String) = Action.async {
    //TODO anyone should not be able to delete any page
    //TODO maybe check before that no comment have been put on the page
    db.page.removeById(Id(pageId)).flatMap { res =>
      //TODO test res is good
      db.page_content.remove(Json.obj("pageId" -> pageId))
    }.map { res => Ok }
  }

  def getAllPages = Action.async {
    //TODO will soon be too large to handle
    db.page.findAll[PageWithId].map { pages =>
      Ok(Json.toJson(pages))
    }
  }


  def exists_js(pageUrl: String) = Action.async {

    val cleanedUrl = UrlRules.cleanUrl(pageUrl).toString

    db.page.find[PageWithId](Json.obj("url" -> cleanedUrl)).map { pages =>
      val res = if (pages.length == 0) {
        PageExists(None)
      } else {
        val page = pages(0) //TODO should do something different, like verification when creating page
        PageExists(Some(ResPage(page.url, page.name, page._id, None, None)))
      }
      Ok(Json.toJson(res))
    }

  }


  def mostCommented(size: Int = 10): Future[List[MostUsedAggrResult]] = {

    val col: JSONCollection = db.comment.getCollection
    import col.BatchCommands.AggregationFramework.{Descending, Group, Limit, Sort, SumValue}

    val groupVal = Group(Json.toJson("$pageId"))("nbComment" -> SumValue(1))
    val orderByNbComment = Sort(Descending("nbComment"))
    val limitByN = Limit(size)

    col.aggregate(
      groupVal,
      List(orderByNbComment, limitByN)
    ).map {
      _.result[MostUsedAggrResult]
    }

  }


  def mostCommented_js(size: Int = 10) = Action.async { request =>


    val res = mostCommented().flatMap { listRes =>
      val futureRes = listRes.map { curRes =>
        this.db.page.findById[PageWithId](curRes._id).map { optPage =>
          optPage.map { page =>
            Some(MostUsedResult(ResPage(page.url, page.name, page._id, None, None), curRes.nbComment))
          }.getOrElse(None)
        }
      }

      Future.sequence(futureRes).map {
        _.filter(_.isDefined).map(_.get)
      }

    }

    res.map { listRes =>
      Ok(Json.toJson(listRes))
    }

  }


  def findByText(pageSize: Int = 10, pageNum: Int = 0, text: String) = {

    val query = Json.obj("$text" -> Json.obj("$search" -> text))
    val sort = Json.obj("created" -> -1)

    val skipNum = pageSize * pageNum

    db.page.find[PageWithId](query, pageSize, skipNum, sort)
  }

  def findByRegExp(pageSize: Int = 10, pageNum: Int = 0, text: String) = {

    val nameSearch = Json.obj("name" -> Json.obj("$regex" -> text, "$options" -> "i"))
    val urlSearch = Json.obj("url" -> Json.obj("$regex" -> text, "$options" -> "i"))
    val query = Json.obj("$or" -> Json.arr(nameSearch, urlSearch))

    val sort = Json.obj("created" -> -1)

    val skipNum = pageSize * pageNum

    db.page.find[PageWithId](query, pageSize, skipNum, sort)
  }

  def findAll(pageSize: Int = 10, pageNum: Int = 0) = {

    val query = Json.obj()

    val sort = Json.obj("created" -> -1)

    val skipNum = pageSize * pageNum

    db.page.find[PageWithId](query, pageSize, skipNum, sort)
  }

  //TODO use two aggregate to have the total count on each query
  //https://stackoverflow.com/questions/17767580/mongodb-aggregation-framework-total-count?rq=1
  def cleverSearch(pageSize: Int= 10, pageNum: Int=0, text: String) = {
    if(text.isEmpty){
      findAll(pageSize, pageNum)
    } else if(text.length <= 6){
      findByRegExp(pageSize, pageNum, text)
    } else {
      findByText(pageSize, pageNum, text)
    }
  }


  def findByText_js(pageSize: Int = 10, pageNum: Int = 0, text: String) = Action.async { request =>

    cleverSearch(pageSize, pageNum, text).map { resElements =>
      val resToClient = resElements.map { e => ResPage(e.url, e.name, e._id, None, None) }
      Ok(Json.toJson(resToClient))
    }

  }


}