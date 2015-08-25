var mongoose = require('mongoose');

var ReviewSchema = new mongoose.Schema({
  comment: String,
  bookid: String,
  user: String
 });

mongoose.model('Review', ReviewSchema);