package utils


import java.net.URI
import java.util.{Date, UUID}

import controllers.CommentsController
import controllers.PageController.PushPage
import controllers.UserController.SigningInfo
import models.Id
import org.jsoup.nodes.Element
import org.jsoup.parser.Tag
import reactivemongo.bson.BSONObjectID

import scala.collection.JavaConverters._
import scala.collection.immutable._

/*
Extends utils.DataFactory
 */
class DataFactory {

  lazy val df = new org.fluttercode.datafactory.impl.DataFactory()

  /* Very uniq elements */
  def uniqStr = UUID.randomUUID.toString.replaceAll("-", "")

  /* We need a very uniq email adress for each peoples */
  def uniqEmail = email.replace("@", uniqStr + "@")

  def uniqUrl = new URI(
    item("http", "https"), null, uniqHost(),
    item(80, 443, numberBetween(10, 65535)),
    "/" + (if (chance(10)) "" else path()),
    if (chance(20)) "" else query(),
    if (chance(20)) ""
    else {
      if (chance(50)) path() else query()
    }

  ).toString

  def path(length: Int = numberBetween(0, 10)): String =
    Range(0, length).map(i => randomWord).mkString("/")

  def query(length: Int = numberBetween(0, 10)): String = {
    Range(0, length).map { i =>
      val k = java.net.URLEncoder.encode(randomWord, "UTF-8")
      val v = java.net.URLEncoder.encode(randomText(3), "UTF-8")
      s"$k=$v"
    }.mkString("&")
  }

  def host(length: Int = numberBetween(1, 10)): String = {
    //Just some of them
    val root = item("com", "org", "net", "int", "gov", "mil", "au", "bb", "be", "ca", "cc", "fr",
      "us", "eu", "gg", "mo", "om", "tt", "academy", "adult", "app", "best", "camera", "builders",
      "club")
    var path = Range(0, length).map { i => randomWord }.mkString(".")
    //Remove unwanted characters
    path = path.toLowerCase.replaceAll("[^a-z.]", "")
    s"$root.$path"
  }

  def uniqHost(length: Int = numberBetween(1, 10)): String = {
    //Just some of them
    val root = item("com", "org", "net", "int", "gov", "mil", "au", "bb", "be", "ca", "cc", "fr",
      "us", "eu", "gg", "mo", "om", "tt", "academy", "adult", "app", "best", "camera", "builders",
      "club")
    var path = uniqStr + Range(0, length).map { i => randomWord }.mkString(".")
    //Remove unwanted characters
    path = path.toLowerCase.replaceAll("[^a-z.]", "")
    s"$root.$path"
  }

  def url = new URI(
    item("http", "https"), null, host(),
    item(80, 443, numberBetween(10, 65535)),
    "/" + (if (chance(10)) "" else path()),
    if (chance(20)) "" else query(),
    if (chance(20)) ""
    else {
      if (chance(50)) path() else query()
    }

  ).toString

  def html(deep: Integer = numberBetween(2, 5), wide: Integer = numberBetween(2, 5)) = {
    val res = _element()
    _html(deep, wide).foreach(e => res.appendChild(e))
    res.html()
  }

  private def _html(deep: Integer, wide: Integer): Seq[Element] = {
    if (deep == 0) return Seq[Element]()
    Range(0, wide).map { i =>
      val curE = _element()
      _html(deep - 1, wide).foreach(e => curE.appendChild(e))
      curE
    }
  }


  private def _element(nbAttributes: Int = numberBetween(0, 10)): Element = {
    val e = new Element(Tag.valueOf(tagName), "")
    Range(0, nbAttributes).foreach { i =>
      e.attr(attributeName, randomChars(2, 10))
    }
    if (chance(10)) e.appendText(randomText(5, 50))
    e
  }

  def tagName = {
    //Remove element that are removed by the html cleaning
    //script, iframe
    //From http://www.w3schools.com/tags/
    item("a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi",
      "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup",
      "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption",
      "figure", "font", "footer", "form", "frame", "frameset", "h1", "head", "header", "hr", "html", "i",
      "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta",
      "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress",
      "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "small", "source", "span", "strike", "strong",
      "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr",
      "track", "tt", "u", "ul", "var", "video", "wbr")
  }

  def attributeName = {
    item("alt", "disabled", "href", "id", "src", "style", "title", "value")
  }

  /** TODO **/
  def style = {
    "h1 { color: red } "
  }

  def selector = "#content div"

  /** From utils.DataFactory **/

  def chance(chance: Int) = df.chance(chance)

  def item[T](items: T*) = df.getItem(items.asJava)

  def item[T](items: Seq[T]) = df.getItem(items.asJava)

  def item[T](items: Seq[T], probability: Int) = df.getItem(items.asJava, probability)

  def item[T](items: Seq[T], probability: Int, defaultItem: T) = df.getItem(items.asJava, probability, defaultItem)

  def firstName = df.getFirstName

  def lastName = df.getLastName

  def fullName = df.getName

  def streetName = df.getStreetName

  def streetSuffix = df.getStreetSuffix

  def city = df.getCity

  def address = df.getAddress

  def getAddressLine2 = df.getAddressLine2

  def addressLine2(probability: Int) = df.getAddressLine2(probability)

  def addressLine2(probability: Int, defaultValue: String) = df.getAddressLine2(probability, defaultValue)


  def birthDate = df.getBirthDate

  def number = df.getNumber

  def numberUpTo(max: Int) = df.getNumberUpTo(max)

  def numberBetween(min: Int, max: Int) = df.getNumberBetween(min, max)

  def date(year: Int, month: Int, day: Int) = df.getDate(year, month, day)

  def date(baseDate: Date, minDaysFromDate: Int, maxDaysFromDate: Int) = df.getDate(baseDate, minDaysFromDate, maxDaysFromDate)

  def dateBetween(minDate: Date, maxDate: Date) = df.getDateBetween(minDate, maxDate)

  def randomText(minLength: Int, maxLength: Int) = df.getRandomText(minLength, maxLength)

  def randomText(length: Int) = df.getRandomText(length)

  def randomChar = df.getRandomChar

  def randomChars(length: Int) = df.getRandomChars(length)

  def randomChars(minLength: Int, maxLength: Int) = df.getRandomChars(minLength, maxLength)

  def randomWord = df.getRandomWord

  def randomWord(length: Int) = df.getRandomWord(length)

  def randomWord(length: Int, exactLength: Boolean) = df.getRandomWord(length, exactLength)

  def randomWord(minLength: Int, maxLength: Int) = df.getRandomWord(minLength, maxLength)

  def suffix(chance: Int) = df.getSuffix(chance)

  def prefix(chance: Int) = df.getPrefix(chance)

  def numberText(digits: Int) = df.getNumberText(digits)

  def businessName() = df.getBusinessName

  def email() = df.getEmailAddress

  def nameDataValues() = df.getNameDataValues

}


class ObjectFactory extends DataFactory {

  def pushPage = PushPage(uniqUrl, randomText(10), html(), style)

  def commentPush = CommentsController.CommentPush(selector, randomText(10), None)
  def signingInfo = SigningInfo(uniqEmail, "pass")

  def uniqId = Id(BSONObjectID.generate.stringify)

}




