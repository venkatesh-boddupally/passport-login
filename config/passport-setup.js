const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/users-model');

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  })
})

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // check if user exists
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
              // already have the user
              done(null, currentUser)
              
            }else{
              console.log(profile)
              // if not create user
              new User({
                googleId: profile.id,
                username: profile.displayName,
                thumbnail: null
                }).save().then((newUser) => {
                    console.log('new user created: ', newUser);
                    done(null, newUser)
                });
              } 
        })
    })
);