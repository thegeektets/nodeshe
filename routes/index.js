var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var User = mongoose.model('User');
var Team = mongoose.model('Team');
var Book = mongoose.model('Book');


var Comment = mongoose.model('Comment');
var passport = require('passport');


router.get('/librarybooks/:teamid',function(req,res){
 Book.find({'teamid': req.params.teamid},function(err, posts){
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
  book.copies = req.body.copies;
  book.transaction = req.body.copies;
  book.teamid = req.body.teamid;
  
  book.save(function(err){
    if(err){ return next(err); }

       res.json(post);
  });
});

router.get('/profiles/:user',function(req,res){
 User.find({'_id': req.params.user},function(err, posts){
    if(err){return next(err);}
    res.json(posts);
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
router.get('/team/:name',function(req,res){
 Team.findOne({'admin': req.params.name},function(err, posts){
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
