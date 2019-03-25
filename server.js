let express = require('express'); // Express Server
let bodyParser = require('body-parser'); // Post Body Request
let exphbs = require('express-handlebars'); // Templating Engine
var db = require("./models"); // Require all models



let PORT = process.env.PORT || 8080; // Set Default Port for Express and Heroku
let app = express(); // Initialize Express


app.use(bodyParser.urlencoded({ extended: false })); // Use body-parser for handling form submissions
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static content for the app from the "public" directory in the application directory.

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./controllers/webScrapperController.js")(app);


app.listen(PORT, ()=>{
    console.log(`App listening on PORT ${PORT}`);
})
