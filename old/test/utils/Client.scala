package utils

import play.api.Logger
import play.api.http.HttpVerbs
import play.api.libs.json.{JsValue, Json, _}
import play.api.mvc.{Cookies, Result}
import play.api.test.Helpers._
import play.api.test._
import play.api.http.Status

import scala.concurrent.Future
import scala.language.reflectiveCalls

class StatusException(statusCode: Int) extends Exception(s"Status code : ${statusCode}") {
  def getStatusCode = statusCode
}


//TODO make it immutable
class RequestWrapper(myClient: Client, myVerb: String) {
  var client = myClient
  var verb = myVerb
  var myQuery: String = ""
  var myPath: String = "/"
  var bodyJs: Option[JsValue] = None

  def query(params: (String, String)*) = {
    myQuery = Client.toQueryString(Map(params: _*))
    this
  }

  def path(paths: String*) = {
    myPath = Client.toUrlPath(paths)
    this
  }

  def body[T: Writes](elem: T) = {
    bodyJs = Some(Json.toJson(elem))
    this
  }

  def call = {

    if(bodyJs.isDefined){

      var req = FakeRequest(verb, myPath + myQuery, Client.jsonHeaders, bodyJs.get)
      req = req.withCookies(client.cookies.toSeq:_*)
      val res = route(req).get
      Logger.warn("new session : " + session(res).toString)
      client.cookies = cookies(res)
      res

    } else {

      var req = FakeRequest(verb, myPath + myQuery)
      req = req.withCookies(client.cookies.toSeq:_*)
      val res = route(req).get
      Logger.warn("new session : " + session(res).toString)
      client.cookies = cookies(res)
      res

    }

  }

  def checkStatus(fres: Future[Result]) = {

    val resStatus = status(fres)

    if(resStatus != Status.OK)
      throw new StatusException(resStatus)

    fres
  }

  def asStatusCode = status(call)

  def asJson: JsValue = contentAsJson(checkStatus(call))

  def asBytes: Array[Byte] = contentAsBytes(checkStatus(call))

  def asString: String = contentAsString(checkStatus(call))

  def as[T: Reads]: T = Json.toJson(asJson).as[T]

  def asUnit: Unit = checkStatus(call)

}


object Req {

  def cli = new Client()

}


object Client extends HttpVerbs {

  def toQueryString(params: Map[String, String]): String = {
    if (params == None) return ""
    import java.net.URLEncoder
    val encoded = for {(name, value) <- params
                       encodedValue = value match {
                         //case Some(x) => URLEncoder.encode(x.toString, "UTF8")
                         case x => URLEncoder.encode(x.toString, "UTF8")
                       }
    } yield name + "=" + encodedValue

    val res = encoded.mkString("&")
    (if (res.isEmpty) "" else "?") + res
  }

  def toUrlPath(path: Seq[String]) = {
    var fullPath = path.mkString("/")
    if (!fullPath.startsWith("/")) fullPath = "/" + fullPath
    fullPath
  }

  val jsonHeaders = FakeHeaders(Seq("Content-type" -> "application/json"))

}



/**
 * request specialized for json
 */
class Client extends HttpVerbs {

  var cookies: Cookies = Cookies.fromCookieHeader(None)

  def get(paths: String*) = new RequestWrapper(this, GET).path(paths: _*)

  def post(paths: String*) = new RequestWrapper(this, POST).path(paths: _*)

  def put(paths: String*) = new RequestWrapper(this, PUT).path(paths: _*)

  def delete(paths: String*) = new RequestWrapper(this, DELETE).path(paths: _*)

  def makeSureDateAreDifferents: Unit = {
    Thread.sleep(1001);
  }

}


