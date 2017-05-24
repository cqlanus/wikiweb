# wikiweb
WikiWeb is a Google Chrome that allows you to visualize and analyze your Wikipedia browsing history.

## how to run
* In your Chrome browser, head to chrome://extensions/ and enable "Developer Mode"
* Click 'Load unpacked extension' and choose the ChromeExtension directory
* You should now see the WikiWeb toolbar icon
* Any changes to chromeExtension/js/background.js will require a reload of the extension in the browser
* We use Google OAuth to authenticate users, so this app requires you to log into Chrome to authenticate

## start developing
* fork the repo
* navigate to wikiweb directory
* install dependences
```
npm install
```

* create a build
```
webpack
```

* start a server
```
npm run start
```
* have at it!

## libraries used
The following libraries were used to build WikiWeb
* [React](https://facebook.github.io/react/) (UI)
* [D3.js](https://d3js.org/) (Data Visualizations)
* [Rosette API](https://www.rosette.com/) (NLP/Text Analysis)
* [Postgres](https://www.postgresql.org/) & [Sequelize](http://docs.sequelizejs.com/) (DB and ORM)
* [Node](https://nodejs.org/en/) & [Express](https://expressjs.com/) (Backend/Server)

## todo list
* improve front-end ui, responsiveness
* improve d3 interactivity
* create page suggestions using Rosette entity extraction / categorization
* write tests

## known bugs
* creating links sometimes assigns another user's node as a previous node

## creators
* [Chris Lanus](https://github.com/cqlanus)
* [Nick Lee](https://github.com/nicklee100)
* [Ellie Sterner](https://github.com/mestern)
