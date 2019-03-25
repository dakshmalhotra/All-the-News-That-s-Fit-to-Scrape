/////////////////////////////////////////////// /* Imports */ //////////////////////////////////////////////////////////
let mongoose = require('mongoose');

/////////////////////////////////////////////// /* Initialize */ //////////////////////////////////////////////////////////
let Schema = mongoose.Schema; // Save a Reference to the Schema Constructor

/////////////////////////////////////////////// /* Model*/ //////////////////////////////////////////////////////////

let ArticleSchema = new Schema({ 

  headline: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
  },

  url: {
    type: String,
    required: true
  },

  imageURL: {
    type: String,
    required: true
  },

  slug: {
    type: String
  },

  
  note: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]

}); 


let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article; // Export the Article Model
