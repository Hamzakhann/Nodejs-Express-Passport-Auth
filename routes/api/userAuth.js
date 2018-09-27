const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');
//Initialize Router in router variable
const router  = express.Router();

//Load Input validation which is in validation folder
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Load user Model which I have made with user Schema in models folder
const User = require('../../models/User');


//@route POST api/users/register
//@desc   Register a user
//@access PUBLIC
router.post('/register' , (req , res) => {
  //call a func and check for validation
  //errors is an object with errors
  const {errors  , isValid} = validateRegisterInput(req.body)
  
  //check if it returns false it means errors occurs
  if(!isValid){
    return res.status(400).json(errors);
  }


  //This is to check the user is already in database by its email
  //findOne is for finding document with any field provided
   //in Mongoose u can use both Promise as well as callback
  User.findOne({email : req.body.email})
  .then((user) => {
    if(user){
      return res.status(400).json({email : 'email already exist'})
    }else {
      //here we are using gravatar library to pickup image from email
      const avatar = gravatar.url(req.body.email , {
        s:'200',
        r:'pg',
        d:'mm'
      });
      //extract data from request 
      const newUser = new User({
        name : req.body.name,
        email : req.body.email,
        avatar : avatar,
        password : req.body.password
      });
      //this makes password hash this is important to notice
      bcrypt.genSalt(10 , (err , salt) => {
        bcrypt.hash(newUser.password , salt , (err , hash)=> {
          if(err) throw  err
          newUser.password = hash;
          //save our user to database
          newUser.save()
          .then(user => {
            res.json(user)
            
          })
          .catch(err => console.log(err))
        })
      })
    }
  })
});



//@route POST api/users/login
//@desc   Login  a user
//@access PUBLIC
router.post('/login' , (req , res) =>{
  const {errors  , isValid} = validateLoginInput(req.body)

  if(!isValid){
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user by email in database
  User.findOne({email:email}).then((user)=>{
    //check for user
    if(!user){
      errors.email = 'User not found';
      return res.status(404).json(errors)
    }

    //Check for password remeber user type simple password and in database      we have hashed password
    bcrypt.compare(password , user.password)
    .then((isMatch) =>{
      if(isMatch){
        //user matched now create jwt

        //this payload contains some user info for the jwt token this will be hashed 
        const payload = {id :  user.id , name : user.name , avatar : user.avatar}

        //Sign Token : means generating token
        jwt.sign(payload, 
          keys.secretOrKey,
          {expiresIn : 3600},
          (err , token)=>{
            res.json({
              success : true,
              token : 'Bearer ' + token
            });
          });
      }else{
        errors.password = 'password is incorrect';
        return res.status(404).json(errors)
      }
    })
  });
});

//@route GET api/users/current
//@desc   Check user is authenticated
//@access PRIVATE

router.get('/current' , 
//this is all for private routes and logic defined in config/passport
passport.authenticate('jwt' , {session : false}),
(req , res) =>{
  res.json({
    id : req.user.id,
    name  :req.user.name,
    email : req.user.email
  })
});

module.exports = router;