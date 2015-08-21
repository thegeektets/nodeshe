var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({

  title: String,
  description: String,
  dateofpublication: String,
  pic: String,
  category: String,
  author: String,
  image: String,
  teamid: String,
  transaction: String,
  librarytype : String,
  transaction: String,
  copies: String
 });

mongoose.model('Book', BookSchema);
