sudo npm install gulp tsd bower --global
cd app/assets ; npm install ; cd ../..
cd app/assets ; bower install ; cd ../..
cd app/assets ; tsd install ; cd ../..
cd app/assets ; gulp ts:all ; cd ../..

brew install docker
brew install docker-machine
brew install boot2docker
brew-cask install virtualbox
boot2docker init ; boot2docker up
