var modelName = 'user'; //--edit here movie to user modelName = viewName
var routePath = '/users';  //--edit here -- routePath+'/:id'
var Model = require('../models/'+modelName);

var User = require('../models/user');
var config = require('../config/config');

var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

var express = require('express');
var router = express.Router();

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
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                  req.flash('message', 'No account with that email address exists.');
                  return res.redirect('/passwordreset');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                  done(err, token, user);
                });
        });
    },
    function(token, user, done) {
        var transporter = nodemailer.createTransport({
            service: CONFIG.mailer.service,
            auth: {
                user: CONFIG.mailer.user,
                pass: CONFIG.mailer.pass
            }
        });

        console.log('created');

        var mailOptions = {
            to: user.email,
            from: CONFIG.mailer.from,
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
    User.findOne({ 
        resetPasswordToken: req.params.token, 
        resetPasswordExpires: { $gt: Date.now() } 
    }, 
    function(err, user) {
        if (!user) {
            req.flash('message', 'Password reset token is invalid or has expired.');
            return res.redirect('/passwordreset');
        }
        res.render('reset', {token: req.params.token});
    });
});


router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
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
            service: CONFIG.mailer.service,
            auth: {
                user: CONFIG.mailer.user,
                pass: CONFIG.mailer.pass
            }
        });

        var mailOptions = {
            to: user.email,
            from: CONFIG.mailer.from,
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

module.exports = router;