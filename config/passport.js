//passport contains different strategy but we want jwt bcx we use jwt
const JwtStrategy = require('passport-jwt').Strategy;
//this is for extract the data from jwt-token
const ExtractJwt = require('passport-jwt').ExtractJwt;

//this is for validate user information
const mongoose = require('mongoose');
const User = mongoose.model('users');
//this is also for valodate token
const keys = require('./keys');

//this is the requirement of passport strategy we used 
const opts = {};

//extract and put data in options
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

//passport is parameter ehich is passed in server.js file
module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload , done) => {
    //jwt-payload contains user data
    User.findById(jwt_payload.id)
    .then(user => {
      if(user){
        return done(null , user)
      }
      return done(null , false)
    }).catch(err => console.log(err))
  }));
};  
