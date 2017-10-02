package controllers

import java.util.UUID

import org.cyberneko.html.HTMLElements
import org.cyberneko.html.HTMLElements.Element
import org.jsoup.nodes.Document
import play.api.data.Forms._
import play.api.data._
import play.api.mvc.{Action, Controller}

import play.api.Logger
import play.api.libs.json._
import java.net.URL

import org.jsoup.Jsoup;
import scala.collection.convert.wrapAll._

import play.api.Play

import scala.collection.parallel
;

/**
 * Created by me on 28/05/15.
 */
class HtmlController extends Controller {

    def innerFrame = Action {
      Ok(views.html.innerFrame())
    }

  def index = Action {
    Redirect("/ng2")
  }

  def ng2 = Action { Ok(views.html.ng2("Hello world")) }
  def spa = Action { Ok(views.html.spa("Hello world")) }
  def dev = Action { Ok(views.html.dev("Hello world")) }

}



object HtmlFormatter {

  def cleanHtml(input: String, url: String): String = cleanHtml(input, new URL(url))

  def _cleanAttributesNContent(element: org.jsoup.nodes.Element) = {
    val newElement = element.ownerDocument().createElement(element.tagName)
    element.replaceWith(newElement) //more direct, but less subtle

    //element.attributes.foreach { attr => element.removeAttr(attr.getKey) } //TODO keep id ?
    //element.children.foreach( _.remove )
    //element.textNodes.foreach { cn => if(cn != null) cn.remove }
  }

  def cleanHtml(input: String, url: URL) ={
    val jsoupDoc = Jsoup.parse(input)

    // TODO see : https://stackoverflow.com/questions/2725156/complete-list-of-html-tag-attributes-which-have-a-url-value
    // TODO see : https://stackoverflow.com/questions/5775469/whats-the-valid-way-to-include-an-image-with-no-src
    //TODO clean cp.content and cp.style
    // - remove hidden elements
    // - limit z-index to a level (and level each ones)
    // - change url : keep the image or link to original site

    //Remove the plugins added elements
    val queryToDelete = List("#StayFocusd-infobar", //From the chrome extention
      "#wc-connection-frame") //used by one of the crawl method
    queryToDelete.foreach ( q =>
      jsoupDoc.select(q).foreach( _.remove )
    )

    //TODO for cleaning read : https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet

    jsoupDoc.getElementsByTag("iframe").foreach(_cleanAttributesNContent)
    jsoupDoc.getElementsByTag("script").foreach(_cleanAttributesNContent)

    jsoupDoc.getElementsByTag("a").foreach(_.attr("href", "#"))
    jsoupDoc.getElementsByTag("form").foreach(_.attr("action", "#"))

    jsoupDoc.getElementsByAttribute("src").foreach { e =>
      e.attr("src", composeUrl(url, e.attr("src")))
    }

    jsoupDoc.outputSettings().prettyPrint(false)
    var res = jsoupDoc.html()
    //I don't know how to tell json to not put them in place
    //So i remove them myself
    res = res.replaceAll("^<html><head></head><body>", "")
    res = res.replaceAll("</body></html>$", "")
    res
  }

  def composeUrl(url: URL, reference: String) = {
    if(reference.startsWith("data:")){
      reference
    } else {
      try {
        new URL(url, reference).toString
      }catch{
        case e: java.net.MalformedURLException =>
          Logger.error("malformed url : ")
          Logger.error(e.toString)
          ""
      }
    }

  }

}


case class ServerUrls(httpUrl: String, httpsUrl: String)

object ServerUrls {

  val get = {
    val httpUrl = Play.current.configuration.getString("url.http").get
    val httpsUrl = Play.current.configuration.getString("url.https").get
    ServerUrls(httpUrl, httpsUrl)
  }

}
