var express = require('express');  
var compression = require('compression');
var morgan   = require('morgan'); //-- log 
var bodyParser = require('body-parser');
var methodOverride = require('method-override'); //--to USE PUT, DELETE in FORM

var flash    = require('connect-flash');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
//var fontawesome = require('font-awesome');

var db = require('./app/config/database');
var mongoose = require('mongoose'); //db client 
mongoose.connect(db.connectionString);

var passport = require('passport');

var app = express();  

app.locals.moment = require('moment'); // dung datetime o client 
//app.locals.easyautocomplete = require('easy-autocomplete');

app.use(compression());
app.use(express.static(__dirname + '/app/public')); //static load css, js
app.use(express.static(__dirname + '/app/public/link')); //static load css, js
app.use('/uploads',express.static(__dirname + '/uploads')); //static img
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.use(morgan('dev')); // log every request to the console
//app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/*+json' }))

app.use(bodyParser.urlencoded({
    extended: true,
    limit: 100000000 //-- upload large file 
}));

app.use(methodOverride('_method')); // POST having ?_method=DELETE
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(favicon(__dirname + '/app/public/img/favicon.png'));

//-- jade template engine
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');


/*-----------------PASSPORT----------------------------------*/
// Configuring Passport
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

//-- middleware  
var authChecker = function(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (
        req.isAuthenticated() 
        || req.path==='/auth'   //-- tranh redirect many times
        || req.path==='/login'  //-- tranh redirect many times
        || req.path==='/signup' //-- tranh redirect many times
        || req.path==='/passwordreset' //-- tranh redirect many times
        
    ){
        
        if (req.user.role.indexOf('admin')>-1)
            req.isAdmin = true; 
        else 
            req.isAdmin = false;
        console.log(req.isAdmin);
        return next();
    }
    else{ 
        // if they aren't redirect them to the home page
        req.flash('message',"Please login");
        res.redirect('/login');

    }
}  


/*---------------NO AUTH ROUTES------------------------------------*/
var myroute;

myroute = require('./app/routes/page'); 
app.use('/', myroute);    

myroute = require('./app/routes/upload'); 
app.use('/', myroute);    

myroute = require('./app/routes/passport'); 
app.use('/', myroute);    

myroute = require('./app/routes/pixel'); 
app.use('/', myroute);    


/*---------------AUTH ROUTES------------------------------------*/

//-- using ath before routes 
app.use(authChecker); //--> de before route ap dung

myroute = require('./app/routes/dash'); 
app.use('/', myroute);     

//-- User 
myroute = require('./app/routes/user'); 
app.use('/',myroute);     

//--Lists
myroute = require('./app/routes/list'); 
app.use('/',myroute);    

//--Reports
myroute = require('./app/routes/report'); 
app.use('/',myroute);     

myroute = require('./app/routes/request');
app.use('/',myroute);    

myroute = require('./app/routes/issue'); 
app.use('/',myroute);    

//--- END ROUTES

module.exports = app;
