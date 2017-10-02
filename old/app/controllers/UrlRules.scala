package controllers

import java.net.{URL, URI}

//TODO on every aspect of URI, we can have null, make it very solid
//TODO add in test : https://www.google.com

trait UrlRule {
  def transformUrl(url: URI): URI
  def isUrlGood(url: URI): Boolean
}

class DefaultUrlRule extends UrlRule {
  override def transformUrl(url: URI): URI = url
  override def isUrlGood(url: URI): Boolean = true
}


class GoogleUrlRule extends UrlRule {

  override def transformUrl(url: URI): URI = {
    //Might want to check on this one : https://moz.com/ugc/the-ultimate-guide-to-the-google-search-parameters
    val query = url.getQuery
    if(query.length == 0) return url

    val newQuery = url.getQuery.split("&").filter { _.startsWith("q=") }.mkString("&")

    new URI(url.getScheme, url.getUserInfo, url.getHost, url.getPort, url.getPath, newQuery, url.getFragment)
  }

  def rightHost(host: String) =  host.startsWith("www.google.") || host.startsWith("google.")

  override def isUrlGood(url: URI): Boolean = {
    rightHost(url.getHost) && url.getPath.endsWith("search")
  }
}


class GoogleHashRule extends UrlRule {

  override def transformUrl(url: URI): URI = {
    new URI(url.getScheme, url.getUserInfo, url.getHost, url.getPort, "/search", url.getFragment, null)
  }

  def rightHost(host: String) =  host.startsWith("www.google.") || host.startsWith("google.")

  override def isUrlGood(url: URI): Boolean = {
    val path = if(url.getPath == null) "" else url.getPath
    val fragment = if(url.getFragment == null) "" else url.getFragment
    rightHost(url.getHost) && path == "/" && fragment.startsWith("q=")
  }

}


/**
 * This class goal is to remove/change the url to simplify them
 * example : google.com add a lot of query parameters, but only the q= is relevant
 *
 *
 */
object UrlRules {

  lazy val rules = List(
    new GoogleUrlRule(),
    new GoogleHashRule(),
    new DefaultUrlRule()
  )

  lazy val defaultRule = new DefaultUrlRule()

  def cleanUrl(url: URL): URI = UrlRules.cleanUrl(url.toURI)
  def cleanUrl(url: String): URI = UrlRules.cleanUrl(new URI(url))
  def cleanUrl(url: URI): URI ={

    var rule: UrlRule = defaultRule
    for(rule <- rules ){

      if(rule.isUrlGood(url)){
        return rule.transformUrl(url)
      }
    }

    defaultRule.transformUrl(url)
  }

}

