var modelName = 'page'; //--edit here movie to user modelName = viewName
var routePath = '/pages';  //--edit here -- routePath+'/:id'

var express = require('express');
var router = express.Router();


router.get('/game', function(req, res) {
    var user = {
        username: 'guest',
        name: 'Guest'
    };
    var result;
    if (req.user)
        results = {
        title: 'Play game',
        message: '', 
        user: req.user
        };
    else 
        results = {
        title: 'Play game', 
        message: '', 
        user: user
        };
    
    res.render('teamshow', results);
});


//route to home page
router.get('/', function(req, res) {
    var results = {
        title: 'Home',
        message: '', 
        user: req.user
    };
    res.render('page/parallax', results);
});


//-- TEST -----------

router.get(routePath, function(req, res){
    var data = {};
    res.render(modelName+'/parallax',data);
});


router.get(routePath+"/home", function(req, res){
    var data = {};
    res.render(modelName+'/home',data);
});

router.get(routePath+"/landing", function(req, res){
    var data = {};
    res.render(modelName+'/landingpage',data);
});

router.get(routePath+"/signup", function(req, res){
    var data = {};
    res.render(modelName+'/landingsignup',data);
});


module.exports = router; //middleware 
