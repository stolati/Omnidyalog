# What is that thing ?
WebComment is a website that is able to grab webpage and allow you to put comments/annotations on them.
The goal is to share thoses comments to friends or keep them to you as a recources/snapshots.

One of its future goal is to do a browser plugins which will insert public comments.
Mainly on webpages not allowing comments (not here or not allowed)


## Installation (on a dev env)

 - install `node v0.12.4`
 - install `java 8`
 - install `mongodb v3.0`  
 - `sudo npm install gulp tsd bower --global`
 - `cd app/assets ; npm install`
 - `cd app/assets ; bower install`
 - `cd app/assets ; tsd install`
 - `cd app/assets ; gulp clean compile` #compilation of js resources
 - `./activator run`
 - `./activator run -Dhttps.port=9443`
 - Now you can go to `localhost:9000/ng2` cheers

You might want to do a `sudo ln -s <place_of_node>/node /usr/bin/node` for gulp to run

## Deployment

### setup
- install 'docker'
  - `brew install docker`
- install 'docker machine'
  - `brew install docker-machine`
- intall 'boot2docker'
  - `brew install boot2docker`
- install 'virtualbox'
  - `brew-cask install virtualbox`
  - `boot2docker init ; boot2docker up`
  - follow the command results instructions.
### build docker image
run activator with docker:publishLocal to generate the local docker file.
### deploy
```bash
export AWS_ACCESS_KEY_ID=<Secret>
export AWS_SECRET_ACCESS_KEY=<Super_Top_Secret>
export AWS_VPC_ID=vpc-8752d5e2
```
```bash
docker-machine -D create \
    --driver amazonec2 \
    --amazonec2-access-key $AWS_ACCESS_KEY_ID \
    --amazonec2-secret-key $AWS_SECRET_ACCESS_KEY \
    --amazonec2-vpc-id $AWS_VPC_ID \
    --amazonec2-zone b \
    test-instance1
```

### TODOS

- All thoses margin added, should be cleaned and use proper bootstrap managment
- Having map files for app-bundle.js


next actions :
1. ~~Having user + date on page + comment with unittest~~
2. ~~get the page a la kimono~~
3. Adding security to showing pages ?? what that mean ?
4. ng2 for login
5. ng2 improved for page showing
5. md5 pages search (preparing for the plugin), + page unicity
6. make server works
7. having a https certificate
8. favourites pages server side
9. pages with my comments on it server side
10. favourites pages client side
11. page with my comments on it client side
12. most commented pages on server side
13. most commented pages on client side
14. chrome plugin
XX. Update on page since last seen



- TODO make a unittest test for the link url (with others URL)

- Have a database migration politic (mongodb migration scripts + check with java objects ?)
-- We can also have a database global version

- Have the css separated by ng2 a la webcomponent
- having a AWS proper server
- - With jenkins automatic update
- - With https certificate

- Have a security on grabbed html page (no script, no iframe, etc ...), there are tools for that
- - black list ? or white list ? or both ?
- User handling (crud + user action on elements)
- Having CSS images url righly set
- filter hidden elements
- Having that on a page live (so we can prepare the comment for blicked comment site)

- mimic https://www.kimonolabs.com/ to have better page grabbing

- We have to do custom javascript for page
- Can we test if the page is private
- Can we test if the page is angularjs ? Changed during time ?

- to keep user infos : http://samy.pl/evercookie/ ?
or https://stackoverflow.com/questions/15966812/user-recognition-without-cookies-or-local-storage

- Have the default to https (make only https ?)

- Have private comments (with allowed people, or people having access to it)
- Have public comments (don't forget to keep page creator)
- So have a way to choose the page (if only public => public, if only private => private)
- have a way to find the right page (because sometimes the url is too much informations and the same page is available wihtout all thoses parameters)

- Example of blockef commented video : https://www.youtube.com/watch?v=pjPOSKnOftA

- Create a chrome plugin :
- - No limit on upload pages (direct acces the server)
- - connection
- -

- Send hash instead of the actual url when browsing (only put the url when creating the page)

- using the new routes of ng2

- use https://github.com/apiaryio/api-blueprint/blob/master/API%20Blueprint%20Specification.md#def-model-section to generate typescript and unittest helper


### Test URL

This one works perfectly
`http://experiments.hertzen.com/jsfeedback/examples/dusky/index.html`

Some css get stranges
`http://html2canvas.hertzen.com/examples.html`

Complex page getting very weird
`http://stackoverflow.com/`

htts example, got header messy
`https://www.google.com/#q=mick+is+the+best`

This one leave the hg-hide non-used (you should have an account)
`https://fr.mythermomix.fr/vorwerkWebapp/#/recipe/8830291821174?singleRecipe=true`

### Ideas
- Alert me when page change
- share/save page without change (like a score result, a information page)
- reddit style of handling spam
- blackout some text (for anonymous purposes)
- yellow some text, like marker or something
- draw (is it feasible ? wantable ?)
- comment inside page vs comment at end of page
- comment on uncommentable pages (like uncommentable youtube video or blog post), keeping the layout
- plugin that load comment on visited page
- real-time comment showing (with a websocket)
- comment history (with a slider)
- get images :
-- test url
-- try to get with server (if there are public)
-- compare md5, or if 404 : ask the client to upload it
-- ready to serve
- handle webcomponents (which is very different from others webpages)

- Maybe we can put comment on a page without grabbing it (with iframes ?)

- get inspired by kimono
- connect twitter/facebook/google

- For now we don't check emails, but we can be more intelligent : http://www.emailverifierapp.com/email-verification-pricing/s
- reddit data grabbing, with their api (user can log with reddit users ?, how to put )


name : 
Je pensais a des déclinaisons du commentaire comme un expression :
- opinion
- advice
- reaction
