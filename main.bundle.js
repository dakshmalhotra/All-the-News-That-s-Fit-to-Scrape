'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Templating Engine

// import cheerio from 'cheerio'; // Web Scrapper
// import mongoose from 'mongoose'; // MongoDB ORM
// import db from "./models"; // Require all models

/////////////////////////////////////////////// /* Set Up Variables*/ //////////////////////////////////////////////////////////

// Post Body Request
var PORT = process.env.PORT || 8080;
var app = (0, _express2.default)();

app.use(logger("dev")); // Use morgan logger for logging requests
app.use(_bodyParser2.default.urlencoded({ extended: false })); // Use body-parser for handling form submissions
app.use(_express2.default.static("public")); // Serve static content for the app from the "public" directory in the application directory.

app.engine("handlebars", (0, _expressHandlebars2.default)({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./controllers/webScrapperController.js")(app);


app.listen(PORT, function () {
    console.log('App listening on PORT ' + PORT);
});
