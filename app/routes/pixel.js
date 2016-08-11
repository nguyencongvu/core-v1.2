var modelName = 'pixel'; //--edit here movie to user modelName = viewName
var routePath = '/pixels';  //--edit here -- routePath+'/:id'
var Model = require('../models/'+modelName);

var express = require('express');
var router = express.Router();


//-- GET all
router.route(routePath).get(function(req, res) {
    res.render(modelName+'/pixel',{});
});

//-- GET form create 
router.route(routePath+'/create').get(function(req, res) {
    res.render(modelName+'/create',{});
});

//-- POST
router.route(routePath).post(function(req, res) {
  
  var thisModel = new Model(req.body);

  // Set the beer properties that came from the POST data
  // movie.title = req.body.title;
  // movie.description = req.body.description;
  // movie.year = req.body.year;

  thisModel.save(function(err) {
    if (err) {
      return res.send(err);
    }

    //res.send({ message: 'Successfully added' });
    res.redirect(routePath);
  });
});

//-- GET form update
router.route(routePath+'/:id/update').get(function(req, res) {
    Model.findOne({ _id: req.params.id }, function(err, data) {
        res.render(modelName+'/update',{model:data});    
    });    
    
});

//-- PUT form update
router.route(routePath+'/:id').put(function(req,res){
    
    var id = req.params.id; 

    // neu req.body.email ton tai thi bao loi trung email 
    // Model.findOne({email: req.body.email}, function(err,data){
    //     if (data) {
    //        return res.send('Email exist!');  
    //     }
    // });

    Model.findOne({ _id: id }, function(err, data) {
        if (err) {
          return res.send(err);
        }

        for (prop in req.body) {
          data[prop] = req.body[prop];
        }

        // save the movie
        data.save(function(err) {
          if (err) {
            return res.send(err);
          }

          //res.json({ message: 'Successfully updated!' });
          res.render(modelName+'/view', {model:data});
        });
  });
});

//-- GET one 
router.route(routePath+'/:id').get(function(req, res) {
    Model.findOne({ _id: req.params.id}, function(err, data) {
        if (err) {
         return res.send(err);
     }

    if (req.param('json')=='true')
        res.json(data);
    else 
        res.render(modelName+'/view',{model:data});
  });
});

//-- DELETE 
router.route(routePath+'/:id').delete(function(req, res) {
    
    var id = req.params.id; 
    if (!hasRole(id, 'admin')){
        return res.send('Only admin can delete');
    }

    Model.remove({
        _id: req.params.id
    }, function(err, data) {
        if (err) {
          return res.send(err);
        }

        //res.json({ message: 'Successfully deleted' });
        res.redirect(routePath);
    });
});
/*------------------------------------------------------*/

//-- GET all
router.route(routePath+"/showpixel").get(function(req, res) {
    res.render('pixel');
});


//---------------- CUSTOM -------------------------

//--chua dung
function hasRole(userid, role){
    
    Model.findOne({ _id: userid, role: role}, function(err, data) {
        if (err) {
            return false;
        }

        if (data)
            return true;
        else 
            return false;

    });
}


module.exports = router; //middleware 
