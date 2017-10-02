package utils

import org.specs2.mutable._

class ExtendedSpecification extends Specification with play.api.http.Status {

  val df = new ObjectFactory()

  def uclient = new UnauthenticatedClient
  def eclient = new EmailConnectedClient(df)

  def shouldThrow(code: () => Unit) = {
    var hasException = false
    try{
      code.apply()
    } catch {
      case e: Throwable => hasException = true
    }

    hasException must_== true
  }

  def shouldStatusCode(waitedStatusCode: Int)(code: () => Unit) = {
    var statusCode = play.api.http.Status.OK //The only one not throwing exception
    try{
      code.apply()
    } catch{
      case e: StatusException => statusCode = e.getStatusCode
    }
    statusCode must_== waitedStatusCode
  }


}
