//www.js runtime 
var app = require('../server'); //Require our app

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0"; //-- openshift
var port      = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT 
                || 5000; //8000 is for http and 8443 is for https

app.set('port', port);
app.set('ip',  ipaddress);

var server = app.listen(app.get('port'), app.get('ip'), function() {
    console.log('Express server listening on port ' + server.address().port);
});

//------------------------------------------------------------------------
// https://nodesource.com/blog/understanding-socketio/
//-- socket.io attached to server 
var io = require("socket.io")(server);

// socket 
io.on("connection", function (socket) {  
    var tweet = {user: "nodesource", text: "Hello, world!"};

    // to make things interesting, have it send every second
    var interval = setInterval(function () {
        socket.emit("tweet", tweet);
    }, 1000);

    socket.on("disconnect", function () {
        clearInterval(interval);
    });
});


