var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find({})
  .then((users) => {
    res.json(users)
  }, (err) => next(err))
  .catch((err)=> next(err));
});

router.post('/signup', (req,res,next) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-type', 'application/json');
      res.json({err: err});
    }
    else{
      if(req.body.firstname)
        user.firstname = req.body.firstname;
      if(req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user)=> {
        if(err) {
          res.statusCode = 500;
          res.setHeader('Content-type', 'application/json');
          res.json({err: err}); 
          return; 
        }
        passport.authenticate('local')(req,res,() => {
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          res.json({success: true, status: 'Registration Successfull'});
       });
      });
    }
  });
});

router.post('/login', passport.authenticate('local'),(req,res) =>{
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.json({success: true, token: token, status: 'You are authenticated!'});   
});

router.post('/logout', (req,res) =>{
  req.logOut();
  res.status(200).json({
    status: 'Bye!'
  })
});

module.exports = router;