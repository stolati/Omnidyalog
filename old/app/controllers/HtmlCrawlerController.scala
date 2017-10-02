package controllers

import java.net.URL
import javax.inject.Inject

import com.gargoylesoftware.htmlunit._
import com.gargoylesoftware.htmlunit.html._
import models.Id
import play.api.Logger
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc.{Action, Controller}

import scala.collection.JavaConversions._
import scala.concurrent.Future

class HtmlCrawlerController @Inject()(val db: DbWrapper, val userController: UserController, val pageController: PageController) extends Controller {


  def crawl(url: String, userId: Id): Future[Id] = {
    val client = new WebClient(BrowserVersion.FIREFOX_38)
    client.getOptions.setCssEnabled(false)
    client.getOptions.setJavaScriptEnabled(false)
    client.getOptions.setDoNotTrackEnabled(true)
    client.getOptions.setUseInsecureSSL(true)

    val urlObj = new URL(url)

    Future{
      val page = client.getPage[HtmlPage](urlObj)
      while (page.isBeingParsed){
        Thread.sleep(500)
      }
      page
    }.flatMap { page =>

      val title = page.getTitleText

      page.getByXPath("//link").map{ _.asInstanceOf[HtmlLink] }.foreach { link =>
        val styleContent = client.loadWebResponse(link.getWebRequest).getContentAsString

        val newNode = page.createElement("style")
        newNode.appendChild(page.createTextNode(styleContent))
        //Copy the attribute from link to style

        link.replace(newNode)
      }

      //Clean a little bit the head
      page.getByXPath("//script").foreach { _.asInstanceOf[HtmlElement].remove }
      page.getByXPath("//title").foreach { _.asInstanceOf[HtmlElement].remove }
      page.getByXPath("//meta").foreach { _.asInstanceOf[HtmlElement].remove }

      Logger.warn("page head as XML: " + page.getHead.asXml)
      //It seems that the style are empty

      val newPage = PageController.PushPage(
        url,
        title,
        if (page.getBody != null) page.getBody.asXml() else "", //unsafe, body may be null.
        page.getHead.getChildNodes.map(_.asXml).mkString("\n") //get only the content of it
      )

      pageController.create(newPage, userId)
    }

  }

  def crawl_js(url: String) = Action.async { request =>
    userController.withCurrentUser(request){ user =>
      crawl(url, user._id).map { pageId =>
        Ok(pageId.toJson)
      }
    }
  }

  def crawl_n_redirect(url: String) = Action.async { request =>
    userController.withCurrentUser(request){ user =>
      crawl(url, user._id).map{ pageId =>
        Redirect(s"/ng2#/showPage/${pageId.oid}")
      }
    }
  }

}
