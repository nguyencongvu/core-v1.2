var modelName = 'user'; //--edit here movie to user modelName = viewName
var routePath = '/';  //--edit here -- routePath+'/:id'
var Model = require('../models/'+modelName);

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var configAuth = require('../config/auth'); // fb, twitter, google, mailer

var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

var express = require('express');
var router = express.Router();

// custom callback local-login
//------- SIGNUP -----------------------
passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        process.nextTick(function() { //-- co the dung async 
            Model.findOne( 
                { 
                    $or : [
                        { 'email' :  email }, 
                        { 'username' : email },
                    ] 
                }
                , function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    return done(null, false, req.flash('message', 'That email is already taken.'));
                } else {

                    // if there is no user with that email
                    // create the user
                    var newUser            = new Model();

                    newUser.email    = email;
                    //newUser.local.password = newUser.generateHash(password);
                    newUser.password = password;
                    newUser.role = 'user';
                    newUser.activated = false; //-- false va gui email activate

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });    

    });

}));


//--- lOGIN ----------------
passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) { 

        Model.findOne(
            { 
                $or : [
                    { 'email' :  email }, 
                    { 'username' : email },
                ] 
            }
            , function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('message', 'No user found.')); 
                if (!user.validPassword(password))
                    return done(null, false, req.flash('message', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                //-- check activated
                if (user && user.activated==false)
                    return done(null, false, req.flash('message', 'Account not activated yet. Pls check email for activation code')); 

                return done(null, user);
    
        });

    })
);


//---- facebook 
passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL, 
        // enableProof     : true, 
        // passReqToCallback: true
    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        console.log(profile);   

        // asynchronous
        process.nextTick(function() {

            Model.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                if (err)
                    return done(err);

                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    var newUser            = new Model();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.name  = profile.displayName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.email; // facebook can return multiple emails so we'll take the first

                    newUser.activated = true;

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

}));

//------------ google -------------------------

passport.use(new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
    },
    function(token, refreshToken, profile, done) {

        process.nextTick(function() {

            // try to find the user based on their google id
            Model.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new Model();
                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    newUser.activated = true;
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));

//-- passport config 
// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    Model.findById(id, function(err, user) {
        done(err, user);
    });
});


//------------ route auth controller ---------------
router.get('/auth/facebook', 
    passport.authenticate('facebook', { scope : 'email' })
);

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    })
);


router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect : '/profile',
        failureRedirect : '/'
}));

//------------ route  controller ---------------
router.get('/signup', function(req, res) {
    var results = {
        title: 'Signup',
        message: req.flash('message'), 
    };
    res.render('signup', results);
});

// post = process the signup form
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/login', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// route for showing the profile page
router.get('/profile', function(req, res) {
    res.render('profile', {
        user : req.user // get the user out of session and pass to template
    });
});

router.get('/login', function(req, res) {
    var results = {
        title: 'Login',
        message: req.flash('message'), 
        user: req.user
    };
    res.render('login', results);
});

router.post('/login',
    passport.authenticate('local-login', {
        successRedirect: '/profile',
        // successRedirect: '/reports',
        failureRedirect: '/login', 
        failureFlash : true // allow flash messages
    })

);

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

//-- reset password 
router.get("/passwordreset", function(req, res){
    res.render("passwordreset",{});
});

router.post('/passwordreset', function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
             });
        },
        function(token, done) {
            Model.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                  req.flash('message', 'No account with that email address exists.');
                  return res.redirect('/passwordreset');
                }

                user.resetPasswordToken = token; //-- phai co field trong db
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                  done(err, token, user);
                });
        });
    },
    function(token, user, done) {
        var transporter = nodemailer.createTransport({
            service: configAuth.mailer.service,
            auth: {
                user: configAuth.mailer.user,
                pass: configAuth.mailer.pass
            }
        });

        console.log('created');

        var mailOptions = {
            to: user.email,
            from: configAuth.mailer.from,
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        transporter.sendMail(mailOptions, function(err) {
            req.flash('message', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            done(err, 'done');
        });
    }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/passwordreset');
    });
});


router.get('/reset/:token', function(req, res) {
    Model.findOne({ 
        resetPasswordToken: req.params.token, 
        resetPasswordExpires: { $gt: Date.now() } 
    }, 
    function(err, user) {
        if (!user) {
            req.flash('message', 'Password reset token is invalid or has expired.');
            return res.redirect('/passwordreset');
        }
        res.render('reset', {token: req.params.token}); //-- action form phai co token
    });
});


router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
        Model.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
              req.flash('message', 'Password reset token is invalid or has expired.');
              return res.redirect('back');
            }

            console.log("Found user");  

            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
                done(err, user);
            });

        });
    },
    function(user, done) {
        var transporter = nodemailer.createTransport({
            service: configAuth.mailer.service,
            auth: {
                user: configAuth.mailer.user,
                pass: configAuth.mailer.pass
            }
        });

        var mailOptions = {
            to: user.email,
            from: configAuth.mailer.from,
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
              'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        transporter.sendMail(mailOptions, function(err) {
            req.flash('success', 'Success! Your password has been changed.');
            done(err);
        });
    }
    ], function(err) {
        res.redirect('/');
    });
});



module.exports = router; //middleware 
