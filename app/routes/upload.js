//- http://blog.e-zest.net/how-to-handle-file-upload-with-node-and-express-4-0/

var express = require('express');
var router = express.Router();
var util = require("util");
var fs = require("fs"); 
var sys = require("sys"); 

var multer  = require('multer');
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, req.user.username +'_' + Date.now() + ".jpg");
    }
});
var upload = multer({ storage : storage}).single('myFile');

router.post("/upload", function(req, res){
    upload(req, res, function (err) {
        if (err) {
          // An error occurred when uploading
          return false;
        }
        // Everything went fine
        return res.json(req.file.filename); //rea filename ve client 
    });
    
});


module.exports = router;