var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
  name: String,
  admin: String
 });

mongoose.model('Team', TeamSchema);