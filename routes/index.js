var express = require('express');
var nodemailer = require('nodemailer');
var mandrillTransport = require('nodemailer-mandrill-transport');
var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "arkshedd@gmail.com",
            pass: "ark@shed"
        }
    });






var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var User = mongoose.model('User');
var Team = mongoose.model('Team');
var Book = mongoose.model('Book');
var Review = mongoose.model('Review');
var Borrowed = mongoose.model('Borrowed');




var Comment = mongoose.model('Comment');
var passport = require('passport');
var crypto = require('crypto');

router.post('/borrowbook', function(req, res, next) {
  var borrowed = new Borrowed();
 
  borrowed.borrowdate = req.body.borrowdate;
  borrowed.bookid  = req.body.bookid;
  borrowed.userid = req.body.userid;
  borrowed.bookname = req.body.bookname;
  borrowed.username = req.body.username;
  borrowed.teamid = req.body.teamid;
  borrowed.usermail = req.body.usermail;
 
  
  borrowed.save(function(err){
    if(err){ return next(err); }

       res.json(post);
  });
});

router.get('/borrowedlist',function(req,res){

 Borrowed.find(function(err, posts){
    if(err){return next(err);}
    res.json(posts);
  });

});

router.get('/myborrowedlist/:userid',function(req,res){

 Borrowed.find({'userid':req.params.userid},function(err, posts){
    if(err){return next(err);}
    res.json(posts);
  });

});

router.put('/updateborrowed/:bookid/:userid', function(req, res, next) {
     var borrowed = new Borrowed();

     borrowed.returndate = req.body.returndate;
     
    
    Borrowed.update({bookid:req.params.bookid,userid:req.params.userid}, req.body, {},function (err, post) {
      if (err) return next(err);
        res.json(post);
     });

});


router.post('/reviewbook', function(req, res, next) {
  var review = new Review();
 console.log(req.body);
  review.user = req.body.user;
  review.bookid = req.body.bookid;
  review.comment = req.body.comment;
 
  
  review.save(function(err){
    if(err){ return next(err); }

       res.json(post);
  });
});
router.get('/reviews/:bookid',function(req,res){
 Review.find({'bookid': req.params.bookid},function(err, posts){
    if(err){return next(err);}
    res.json(posts);
  });
});


router.put('/updatetransaction/:bookid', function(req, res, next) {
     var book = new Book();

     book.transaction = req.body.transaction;
     
    
    Book.update({_id:req.params.bookid}, req.body, {},function (err, post) {
      if (err) return next(err);
        res.json(post);
     });

});





 
router.get('/librarybooks/:teamid',function(req,res){
 Book.find({'teamid': req.params.teamid},function(err, posts){
    if(err){return next(err);}
    res.json(posts);
  });
});

router.get('/book/:bookid',function(req,res){
 Book.findOne({'_id': req.params.bookid},function(err, posts){
    if(err){return next(err);}
    res.json(posts);
  });
});
router.post('/addbook', function(req, res, next) {
  var book = new Book();

  book.title = req.body.title;
  book.author = req.body.author;
  book.publisher = req.body.publisher;
  book.dateofpublication = req.body.dateofpublication;
  book.image = req.body.image;
  book.pic = req.body.pic;
  book.description = req.body.description;
  book.category = req.body.category;
  book.librarytype = req.body.librarytype;
  book.copies = (req.body.copies);
  book.transaction =(req.body.copies);
  book.teamid = req.body.teamid;
  
  book.save(function(err){
    if(err){ return next(err); }

       res.json(post);
  });
});

router.get('/people/:invited',function(req,res){
 User.find({'invitedby': req.params.invited},function(err, posts){
    if(err){return next(err);}
    res.json(posts);
  });
});

router.get('/getadmin/:invited',function(req,res){
 User.find({'_id': req.params.invited},function(err, posts){
    if(err){return next(err);}
    res.json(posts);
  });
});

router.get('/profiles/:user',function(req,res){
 User.find({'_id': req.params.user},function(err, posts){
    if(err){return next(err);}
    res.json(posts);
  });
});

router.put('/updatesummary/:userid', function(req, res, next) {
     var user = new User();

     user.summary = req.body.summary;
     
    
    User.update({'_id':req.params.userid}, req.body, {},function (err, post) {
      if (err) return next(err);
        res.json(post);
     });

});
router.put('/updatebasic/:userid', function(req, res, next) {
     var user = new User();

     user.fullname = req.body.fullname;
     user.gender = req.body.gender;
   
    User.update({_id:req.params.userid}, req.body, {},function (err, post) {
      if (err) return next(err);
        res.json(post);
     });

});
router.put('/updatecontact/:userid', function(req, res, next) {
     var user = new User();

     user.phone = req.body.phone;
     user.email = req.body.email;
   
    User.update({_id:req.params.userid}, req.body, {},function (err, post) {
      if (err) return next(err);
        res.json(post);
     });

});

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;
  user.email = req.body.email;
  user.team = req.body.team;
  
  user.usertype = "admin";

  user.setPassword(req.body.password);

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});
router.post('/registerinvite/:invitekey', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

User.findOne({invitekey:req.params.invitekey}, function(err, user) {
  if (!user)
    return next(new Error('Could not load Document'));
  else {
    // do your updates here
  user.username = req.body.username;
  user.invitekey = req.body.invitekey;
   
  user.salt = crypto.randomBytes(16).toString('hex');

  user.hash = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64).toString('hex');


  user.save(function(err) {
      if (err)
        return next(err);
      else
        res.json(post)
    });
  }
});

});
router.post('/newinvite', function(req, res, next){
   if(!req.body.email ){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.email = req.body.email;
  user.team = req.body.team;
  user.invitedby = req.body.invitedby;
  user.invitekey = req.body.invitekey;
  user.link = req.body.link;
  user.usertype = "normal";

var mail = {
        from: "SHED WEB APP <noreply@shed.com>",
        to: req.body.email,
        subject: "Join us at SHED",
        html: "<span>Hello,</span><br />you have been invited by "+req.body.invitename+" to join "+req.body.team+" team on SHED an application for managing and sharing books.Click here to <a href='"+req.body.link+"'>Register</a> or copy and paste this url to your browser "+req.body.link
    
    }

 smtpTransport.sendMail(mail, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
    });

 user.save(function (err){
    if(err){ return next(err); }

    return  res.json(post);
  });

  
});
router.get('/team/:name',function(req,res){
 Team.findOne({'name': req.params.name},function(err, posts){
    if(err){return next(err);}
    res.json(posts);
  });
});


router.post('/team', function(req, res, next){
  if(!req.body.username || !req.body.team){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var team = new Team();

  team.admin = req.body.username;
  team.name = req.body.team;

  team.save(function (err){
    if(err){ return next(err); }

    return  res.json(post);
  });
});


router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){

      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shed' });
});

router.get('/templates/:templateid' ,function(req,res,next){
res.render('templates/' + req.params.templateid);
});



module.exports = router;
