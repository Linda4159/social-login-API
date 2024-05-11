require("dotenv").config()
const passport = require("passport")
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const facebookStrategy = require('passport-facebook').Strategy;


// used to serialize the user for the session
passport.serializeUser(function (user, done) {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function (user, done) {
      done(null, user);
});

// GOOGLE STRATEGY
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_APP_CLIENT_ID,
  clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
  callbackURL: "http://localhost:4400/google/callback",
  passReqToCallback: true
}, (request, accessToken, refreshToken, profile, done) => {
  console.log(profile)
  done(null, profile)
}));


// FACEBOOK STRATEGY
passport.use(new facebookStrategy({

  // pull in our app id and secret from our auth.js file
  clientID        : process.env.FACEBOOK_CLIENT_ID,
  clientSecret    : process.env.FACEBOOK_SECRET_ID,
  callbackURL     : "http://localhost:4400/facebook/callback",
  profileFields: ['id', 'displayName', 'gender', 'picture.type(large)','email']

},// facebook will send back the token and profile
async function(token, refreshToken, profile, done) {

  console.log(profile)
  return done(null,profile)
}));