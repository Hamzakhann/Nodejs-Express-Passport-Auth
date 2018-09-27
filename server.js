const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

//this MODULES container all our routes logic
const userAuth  = require('./routes/api/userAuth');
const profile  = require('./routes/api/profile');
const posts  = require('./routes/api/posts');

//Initialize axpress server 
const app = express();

//bodyParser middleware 
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json())

//this is database key which is in config/keys file with name mongoURI
const db = require('./config/keys').mongoURI

//Connect to mongosdb database by giving URI which returns a promise
mongoose.connect(db , { useNewUrlParser: true })
.then(() => console.log('Mongodb is conected'))
.catch((err) => console.log(err));

//passport middleware itis the initialization step of passport
app.use(passport.initialize())

//passport config as any jwt req comes i will send it to config folder
//where all logic defines 
//we import function from config/passport folder ana pass passport as a arg  below
require('./config/passport')(passport)

// app.get('/' , (req , res)=> res.json({name : 'hamza'}))
app.use('/api/users' , userAuth);
app.use('/api/profile' , profile);
// app.use('api/posts' , posts);


//save deployment port or local port in PORT variable
//this is standard to deploy api on heroku or other server
const PORT = process.env.PORT || 5000;


//this is for start the server
app.listen(PORT , () => console.log(`server is running on port ${PORT}`));