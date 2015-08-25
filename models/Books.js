var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({

  title: String,
  description: String,
  dateofpublication: String,
  publisher: String,
  pic: String,
  category: String,
  author: String,
  image: String,
  teamid: String,
  librarytype : String,
  transaction: String,
  copies: String
 });

BookSchema.methods.rdtransaction = function(data) {
  this.transaction -= 1;
  this.save(data);
};

BookSchema.methods.uptransaction = function(data) {
  this.transaction += 1;
  this.save(data);
};

mongoose.model('Book', BookSchema);
