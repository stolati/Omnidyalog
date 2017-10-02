

# Ubuntu

routing table (in root) : `iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080`
`sudo /sbin/iptables-save`

## mongodb

from (mongoDoc)[http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/]

- `sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10`
- `echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list`
- `sudo apt-get upgrade`
- `sudo apt-get install -y mongodb-org`
- `sudo service mongod start`

## Java

from (webupd8)[http://www.webupd8.org/2012/09/install-oracle-java-8-in-ubuntu-via-ppa.html]

- `sudo add-apt-repository ppa:webupd8team/java`
- `sudo apt-get update`
- `sudo apt-get install oracle-java8-installer`

## Node

- `curl -sL https://deb.nodesource.com/setup | sudo bash -`
- `sudo apt-get install nodejs`
- `sudo apt-get install build-essential`
- `sudo npm install --global bower gulp tsd`

## Jenkins

See [wiki of jenkins](https://wiki.jenkins-ci.org/display/JENKINS/Installing+Jenkins+on+Ubuntu)

- `wget -q -O - https://jenkins-ci.org/debian/jenkins-ci.org.key | sudo apt-key add -`
- `sudo sh -c 'echo deb http://pkg.jenkins-ci.org/debian binary/ > /etc/apt/sources.list.d/jenkins.list'`
- `sudo apt-get update`
- `sudo apt-get install jenkins`
- `sudo /etc/init.d/jenkins start`
- go to `http://${your_server_url}:8080/pluginManager/`
- Update the jenkins 
- go to `http://${your_server_url}:8080/pluginManager/available`
- install `github plugin`


# Mac

## mongodb
- `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
- `brew install mongodb`
- `ln -sfv /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgents`
- `launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist`


