var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true},
  email:{type: String, lowercase: true, unique: true},
  summary:String,
  fullname:String,
  gender:String,
  phone:String,
  invitedby:String,
  invitekey:String,
  usertype:String,
  team:String,
  hash: String,
  salt: String
});

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};



UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {

  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    team: this.team,
    exp:   Math.floor(new Date().getTime()/1000) + 7*24*60*60,
  }, 'SECRET');
};

mongoose.model('User', UserSchema);