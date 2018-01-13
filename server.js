//////////////////////////////////////////////// /* Imports */ //////////////////////////////////////////////////////////
import express from 'express'; // Express Server
import bodyParser from 'body-parser'; // Post Body Request
import request from 'request'; // Http Requests
import exphbs from 'express-handlebars'; // Templating Engine

// import cheerio from 'cheerio'; // Web Scrapper
// import mongoose from 'mongoose'; // MongoDB ORM
// import db from "./models"; // Require all models

/////////////////////////////////////////////// /* Set Up Variables*/ //////////////////////////////////////////////////////////

let PORT = process.env.PORT || 8080; // Set Default Port for Express and Heroku
let app = express(); // Initialize Express

/////////////////////////////////////////////// /* Configure middleware */ //////////////////////////////////////////////////////////

app.use(logger("dev")); // Use morgan logger for logging requests
app.use(bodyParser.urlencoded({ extended: false })); // Use body-parser for handling form submissions
app.use(express.static("public")); // Serve static content for the app from the "public" directory in the application directory.

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

/////////////////////////////////////////////// /* Configure Routes */ //////////////////////////////////////////////////////////
require("./controllers/webScrapperController.js")(app);

/////////////////////////////////////////////// /* Execution */ //////////////////////////////////////////////////////////

app.listen(PORT, ()=>{
    console.log(`App listening on PORT ${PORT}`);
})
