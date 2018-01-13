/////////////////////////////////////////////// /* Imports */ //////////////////////////////////////////////////////////
let path = require('path');
let axios = require('axios');
let cheerio = require('cheerio'); // Web Scrapper
let mongoose = require('mongoose'); // MongoDB ORM
let db = require("../models"); // Require all models


/////////////////////////////////////////////// /* Mongoose Configuration */ //////////////////////////////////////////////////////////
mongoose.Promise = Promise; // Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.connect("mongodb://localhost/webScrapper", { // Connect to the Mongo DB
  useMongoClient: true
});

let mongooseConnection = mongoose.connection;
mongooseConnection.on('error', console.error.bind(console, 'connection error:'));
mongooseConnection.once('open', function() {
  console.log(`Sucessfully Connected to Mongo DB !`);
});

/////////////////////////////////////////////// /* Exports */ //////////////////////////////////////////////////////////
module.exports = (app) => { // Export Module Containing Routes. Called from Server.js

  /////////////////////////////////////////////// /* Get Requests */ //////////////////////////////////////////////////////////
  app.get("/", (req, res) =>  res.render("index")); // Default Route

  app.get("/api/search", (req, res) => {
      axios.get("https://www.npr.org/sections/news/").then(response =>{
        console.log("Load Response");
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        let $ = cheerio.load(response.data);
        //
        // console.log(response.data);

        $("article").each((i, element) => {

          let articleObject = { // Store Scrapped Data into an Object
            headline: $(element).children('.item-info').children('.title').children('a').text(),
            summary: $(element).children('.item-info').children('.teaser').children('a').text(),
            url: $(element).children('.item-info').children('.title').children('a').attr('href'),
            imageURL: $(element).children('.item-image').children('.imagewrap').children('a').children('img').attr('src'),
            comments: null
          };

          // Store Objects in Mongo DB
          // Create a new Article using the `result` object built from scraping

          console.log("db is ========================= " + JSON.stringify(db));
          db.Article
            .create(articleObject)
            .then(function(dbArticle) {
              // If we were able to successfully scrape and save an Article, send a message to the client
              console.log("Data saved In DB");
              res.send("Scrape Complete");
            })
            .catch(function(err) {
              // If an error occurred, send it to the client
              res.json(err);
            });

        });
      });
  });

  /////////////////////////////////////////////// /* Post Requests */ //////////////////////////////////////////////////////////




}
