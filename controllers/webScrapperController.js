let axios = require('axios'); // HTTP Request
let cheerio = require('cheerio'); // Web Scrapper
let mongoose = require('mongoose'); // MongoDB ORM
let db = require("../models"); // Require all models

mongoose.Promise = Promise; // Set mongoose to leverage Built in JavaScript ES6 Promises
mongoose.connect("mongodb://heroku_n498q09l:nqhsgor6hvbhfudh35mk0npfo0@ds147267.mlab.com:47267/heroku_n498q09l", { // Connect to the Mongo DB
  useMongoClient: true
});


let mongooseConnection = mongoose.connection;

mongooseConnection.on('error', console.error.bind(console, 'connection error:'));
mongooseConnection.once('open', function() {
  console.log(`Sucessfully Connected to Mongo DB !`); // If Connection is successful, Console.log(Message)
});

module.exports = (app) => { // Export Module Containing Routes. Called from Server.js

  app.get("/", (req, res) => res.render("index"));

  app.get("/api/search", (req, res) => {

    axios.get("https://www.npr.org/sections/news/").then(response => {

      let $ = cheerio.load(response.data);

      let handlebarsObject = {
        data: []
      }; 
      $("article").each((i, element) => { // Use Cheerio to Search for all Article HTML Tags
        let lowResImageLink = $(element).children('.item-image').children('.imagewrap').children('a').children('img').attr('src');

        if (lowResImageLink) {

          let imageLength = lowResImageLink.length;
          let highResImage = lowResImageLink.substr(0, imageLength - 11) + "800-c100.jpg";

          handlebarsObject.data.push({ // Store Scrapped Data into handlebarsObject
            headline: $(element).children('.item-info').children('.title').children('a').text(),
            summary: $(element).children('.item-info').children('.teaser').children('a').text(),
            url: $(element).children('.item-info').children('.title').children('a').attr('href'),
            imageURL: highResImage,
            slug: $(element).children('.item-info').children('.slug-wrap').children('.slug').children('a').text(),
            comments: null
          }); // Store HTML Data as an Object within an Object
        } // End of If Else
      }); // End of Article Serch

      res.render("index", handlebarsObject);
    });
  });

  // Saved Article Route
  app.get("/api/savedArticles", (req, res) => {
    db.Articles.find({}). // Find all Saved Articles
    then(function(dbArticle) {
      res.json(dbArticle);
    }).catch(function(err) {
      res.json(err);
    });
  }); // Default Route

  app.post("/api/add", (req, res) => { // Add Article Route


    let articleObject = req.body;

    db.Articles. // Save the Article to the Database
    findOne({url: articleObject.url}). // Look for an Existing Article with the Same URL
    then(function(response) {

      if (response === null) { // Only Create Article if it has not been Created
        db.Articles.create(articleObject).then((response) => console.log(" ")).catch(err => res.json(err));
      } // End if

      res.send("Article Saved");
    }).catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

  }); // End Post Route

  // Delete Article Route
  app.post("/api/deleteArticle", (req, res) => {
    sessionArticle = req.body;

    db.Articles.findByIdAndRemove(sessionArticle["_id"]). // Look for the Article and Remove from DB
    then(response => {
      if (response) {
        res.send("Sucessfully Deleted");
      }
    });
  }); // End deleteArticle Route

  app.post("/api/deleteComment", (req, res) => {
    let comment = req.body;
    db.Notes.findByIdAndRemove(comment["_id"]). // Look for the Comment and Remove from DB
    then(response => {
      if (response) {
        res.send("Sucessfully Deleted");
      }
    });
  }); // End deleteArticle Route

  app.post("/api/createNotes", (req, res) => {

    sessionArticle = req.body;

    db.Notes.create(sessionArticle.body).then(function(dbNote) {

      return db.Articles.findOneAndUpdate({
        _id: sessionArticle.articleID.articleID
      }, {
        $push: {
          note: dbNote._id
        }
      });
    }).then(function(dbArticle) {
      res.json(dbArticle);
    }).catch(function(err) {
      res.json(err);
    });
  }); // End deleteArticle Route

  app.post("/api/populateNote", function(req, res) {


    db.Articles.findOne({_id: req.body.articleID}).populate("Note"). // Associate Notes with the Article ID
    then((response) => {

      if (response.note.length == 1) { // Note Has 1 Comment

        db.Notes.findOne({'_id': response.note}).then((comment) => {
          comment = [comment];
          console.log("Sending Back One Comment");
          res.json(comment); // Send Comment back to the Client
        });

      } else { // Note Has 0 or more than 1 Comments

        console.log("2")
        db.Notes.find({
          '_id': {
            "$in": response.note
          }
        }).then((comments) => {
          // console.log("Sending Back Multiple Comments");
          res.json(comments); // Send Comments back to the Client
        });
      }
    }).catch(function(err) {
      res.json(err);
    });
  }); 

} 