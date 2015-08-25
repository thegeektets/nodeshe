var mongoose = require('mongoose');

var BorrowedSchema = new mongoose.Schema({

     borrowdate: String,
     bookid: String,
     userid: String,
     bookname: String,
     username:String,
     teamid:String,
     usermail:String
   
 });

mongoose.model('Borrowed', BorrowedSchema);
