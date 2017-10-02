name := """WebComment"""

version := "1.0-SNAPSHOT"

//If build.sbt don't work, first load/launch the application with this line :
lazy val root = (project in file(".")).enablePlugins(PlayScala)
//And then use this one
//lazy val root = (project in file(".")).enablePlugins(PlayScala).dependsOn(playReactiveMongo)

scalaVersion := "2.11.6"

resolvers += "sorm Scala 2.11 fork" at "http://markusjura.github.io/sorm"
resolvers += "Scalaz Bintray Repo" at "http://dl.bintray.com/scalaz/releases"
resolvers += "Sonatype Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots/"
resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"


//lazy val playReactiveMongo = RootProject(uri("git://github.com/RadoBuransky/Play-ReactiveMongo.git#play240"))

libraryDependencies ++= Seq(
  "org.reactivemongo" %% "play2-reactivemongo" % "0.11.6.play24",
  //"org.reactivemongo" %% "play2-reactivemongo" % "0.11.1.play25", ???
  //"com.typesafe.play" %% "play-slick" % "1.0.0",
  //"com.typesafe.play" %% "play-slick-evolutions" % "1.0.0",
  "org.jsoup" % "jsoup" % "1.8.2",
  "org.fluttercode.datafactory" % "datafactory" % "0.8", //Generation of data for unittest
  "org.jasypt" % "jasypt" % "1.9.2", //Crypto for user login
  "net.sourceforge.htmlunit" % "htmlunit" % "2.17", //Html crawler
  specs2 % Test
//jdbc, cache, ws
)


//"org.reactivemongo" %% "play2-reactivemongo" % "0.11.0-SNAPSHOT",
//"org.reactivemongo"   %% "reactivemongo"  % "0.10.5.0.akka23",

// Play provides two styles of routers, one expects its actions to be injected, the
// other, legacy style, accesses its actions statically.
routesGenerator := InjectedRoutesGenerator

//Configuration for sbt-native-pakager docker version
fork in run := true

enablePlugins(DockerPlugin)

packageName in Docker := packageName.value

version in Docker := version.value

dockerExposedPorts := Seq(9000, 9443)



fork in run := true