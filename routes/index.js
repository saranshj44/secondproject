const express = require('express');
const router = express.Router();
const passport=require('passport');
const localstrategy=require('passport-local');
const usermodel=require('./users');
const multer=require('multer');

passport.use(new localstrategy(usermodel.authenticate()));
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.post('/reg',function(req,res){
  var data =new  usermodel({
    name:req.body.name,
    email:req.body.email,
    username:req.body.username
  })
  usermodel.register(data,req.body.password)
  .then(function(createduser){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile');
    })
  })
});

router.post('/login',passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect:'/'
}),function(req,res){});

router.get('/profile',isloggedin,function(req,res){
  usermodel.findOne({username:req.session.passport.user})
  .then(function(founduser){
    res.render('profile',founduser);
  })
});

router.get('/logout',function(req,res){
  req.logOut();
  res.redirect('/');
})

function isloggedin(req,res,next)
{
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/');
  }
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+'-'+file.originalname)
  }
})
 
var upload = multer({ storage: storage });

router.post('/upload',upload.single('img'),function(req,res){
  usermodel.findOne({username:req.session.passport.user})
  .then(function(founduser){
    founduser.profileimg=`../images/upload/${req.file.filename}`;
    founduser.save(function(){
      res.redirect('/profile');
    });
  })
})

module.exports = router;
