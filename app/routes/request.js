var modelName = 'request'; //--edit here movie to user modelName = viewName
var routePath = '/requests';  //--edit here -- routePath+'/:id'
var Model = require('../models/'+modelName);
var User = require('../models/user');

var express = require('express');
var router = express.Router();

require('paginate-for-mongoose');

var moment = require('moment');
var geoJson = require('geojson');
var fs = require('fs');

var searchResults; 

/*-----------------ROLE MIDDLEWARE ------------------------*/
//--- dung de check req.path , check sub in main 
function inString(main, sub){
    if (main.toString().indexOf(sub.toString())>-1)
        return true; 
    else 
        return false;
}

function isCreatorOrAdmin(req, res, next){
    var b = false;
    if ( inString(req.user.role, "admin") )
        b = true;

    var id = req.params.id; 
    Model.findOne({ _id: id }, function(err, data) {
        
        var creator= data.createdBy || "" ;
        if (creator!="")
            if (inString(creator,req.user._id.toString()) )
                b = true; 
        
        req.isCreatorOrAdmin = b;
        console.log(req.isCreatorOrAdmin);
        // next();    
        

        if (b==true)
            next();
        else {
            req.flash('message','No permissions!');
            res.redirect(routePath); //tra ve reports list
        }

    }); // function more here  
}


//- do khong truyen duoc param vao route nen define
// var isCreatorOrAdmin = isCreatorOrHasRole('admin'); 


/*-----------------SEARCH MIDDLEWARE ------------------------*/
function searchMiddle(req, res, next){
    
    //-------- filter, search conditions defaults-----------
    var conditions = [];
    var options = []; 
    var sort;

    var searchValue = req.param('search') ; 
    var urlPath = req.path; 

    //-- neu khong phai la cac bao cao, json thi paging 
    if (    
            !searchValue &&
            !inString(urlPath,"requests/report") &&
            !inString(urlPath,"requests/excel") && 
            !inString(urlPath,"requests/json") &&
            !inString(urlPath,"requests/jsonmap")
        )
    { 
    
         //---- sort ----------
        sort = {createdAt: -1};  // {email:1, username:-1}

        //-------- paginate -----------
        options = {
            perPage: 8, // Number of items to display on each page.
            delta  : 2, // Number of page numbers to display before and after the current one.
            page   : req.param('page')
        };
    }

    //-- neu co search thi conditions 
    if (searchValue){
        var reg = new RegExp(searchValue, "i"); 
        conditions = { 
            $or: [ 
                { "type": reg },      //-- EDIT 
                { "client.name": reg },      //-- EDIT
                { "contact.name": reg },      //-- EDIT
                { "client.address": reg },      //-- EDIT
                { "area.district": reg }      //-- EDIT
            ], 
        };     
    }

    //-- report by Date ----------------------------
    var time = req.param('time') || 0;
    var from = req.param('from') || moment();
    var to = req.param('to') || moment();

    //-- neu la cac bao cao hoac json
    if (    
            inString(urlPath,"requests/report") || 
            inString(urlPath,"requests/excel") || 
            inString(urlPath,"requests/json") || 
            inString(urlPath,"requests/jsonmap")
        )
    {    
        var start = moment(from).startOf('day'); // dau ngay 
        var end = moment(to).endOf('day');        //cuoi ngay 

        conditions = { 
            createdAt: {  //-- edit HERE 
                $gte: start, 
                $lte: end
            }
        };

        //---- sort ----------
        sort = {createdAt: -1};  // {email:1, username:-1}

        //-------- change options for print excel-----------
        options = {
            perPage: 100, // Number of items to display on each page.
            delta  : 1, // Number of page numbers to display before and after the current one.
            page   : req.param('page')
        };  

    }

    
    //--- conditions and sort,  options 
    var user = req.user; 

    var query; 
    if (inString(user.role, 'admin'))
        query = Model.find(conditions)
            .populate('createdBy')
            .sort(sort); 
    else 
        query = Model.find(conditions)
            .find({createdBy: user._id})   //-- filter by id
            .populate('createdBy')
            .sort(sort); 

    query.paginate(options, function(err, cb) {
        
        // console.log(cb); 
        // cb = {
        //  options: options,               // paginate options
        //  results: [Document, ...],       // mongoose results
        //  current: 5,                     // current page number
        //  last: 12,                       // last page number
        //  prev: 4,                        // prev number or null
        //  next: 6,                        // next number or null
        //  pages: [ 2, 3, 4, 5, 6, 7, 8 ], // page numbers
        //  count: 125                      // document count
        //};

        if (err) {
          return res.send(err);
        }

        var data = cb.results; //-- pagination lay callback = result 

        var results = { //-- to view
            title: 'Request',  //-- EDIT
            user: req.user,
            pager: cb,
            search: searchValue,
            model: data,
            message: req.flash('message'),
            from: start, 
            to: end,
            time: time,           
        } 

        searchResults = results; //-- assign global
        //req.searchResults = results; //-- or assign to req.

        next(); //-- middleware next
    });    

}

/*-----------------ROUTE PATH ------------------------*/

router.get(routePath, searchMiddle, function(req,res) {
    res.render(modelName+'/list',searchResults);
});

router.get(routePath+'/cards', searchMiddle, function(req,res) {
    res.render(modelName+'/cards',searchResults);
});

router.get(routePath+"/table", searchMiddle, function(req, res) {
    res.render(modelName+'/table',searchResults); //view dang card
});

router.get(routePath+"/list", searchMiddle, function(req, res) {
    res.render(modelName+'/list',searchResults); //view dang card
});

router.get(routePath+"/report", searchMiddle, function(req, res) {
    res.render(modelName+'/report',searchResults); 
});

router.get(routePath+"/excel", searchMiddle, function(req, res) {
    res.setHeader("Content-type","application/csv;charset=UTF-8");
    res.setHeader("Content-Disposition","attachment; filename=export.xls");

    res.render(modelName+'/csv',searchResults); 
});

router.get(routePath+"/json", searchMiddle, function(req, res) {
    Model.find({}, function(err, data) {
        if (err) {
          return res.send(err);
        }
        res.json(data);
    });
});

router.get(routePath+"/map", searchMiddle, function(req, res) {
    res.render(modelName+'/map',searchResults); 
});

router.get(routePath+"/jsonmap", searchMiddle, function(req,res){

    var model = searchResults.model; //get from middleware

    //format lai res thanh chuan geoJson 
    var data = [];
    model.forEach(function(row, index, arr){
        var geoRow = 
            { 
                tencongty: row.client.name, 
                ten: row.createdBy.username, 
                khachhang: row.client.name, 
                salesman: row.createdBy.username, 
                note: row.feedback.comment, 
                ngay: row.createdAt,
                lat: parseFloat(row.location.lat) || 10.1, 
                lng: parseFloat(row.location.lng) || 107.1
            };

        data.push(geoRow);
    });

    // data = [
    //       { name: 'Location A', category: 'Store', street: 'Market', lat: 39.984, lng: -75.343 },
    //       { name: 'Location B', category: 'House', street: 'Broad', lat: 39.284, lng: -75.833 },
    //       { name: 'Location C', category: 'Office', street: 'South', lat: 39.123, lng: -74.534 }
    // ];

    var thisGeoJson = geoJson.parse(data, {Point: ['lat','lng']} );

    console.log("GEO:" + thisGeoJson);
    res.json(thisGeoJson);
});


router.get(routePath+'/create', function(req, res) {
    var results = { //-- to view
            title: 'Create ' + modelName,
            user: req.user,
        } 
    res.render(modelName+'/create',results);
});


//-- POST
router.post(routePath, function(req, res) {
  
    var thisModel = new Model(req.body);

      // Set the beer properties that came from the POST data
      // movie.title = req.body.title;
      // movie.description = req.body.description;
      // movie.year = req.body.year;

    thisModel.save(function(err) {
        if (err) {
            return res.send(err);
        }

        req.flash('message', 'Created!'); 
        //res.send({ message: 'Successfully added' });
        res.redirect(routePath);
    });
});

//-- GET formUpdate
router.get(routePath+'/:id/update', function(req, res) {
    
    Model.findOne({ _id: req.params.id }, function(err, data) {
        var results = { //-- to view
            title: 'Update ' + modelName,
            user: req.user,
            model: data 
        }     
        res.render(modelName+'/update',results);    
    });    
    
});

//-- GET formUpdateOrder
router.get(routePath+'/:id/order', function(req, res) {
    
    Model.findOne({ _id: req.params.id }, function(err, data) {
        var results = { //-- to view
            title: 'Order',
            user: req.user,
            model: data 
        }     
        res.render(modelName+'/order',results);    
    });    
    
});

//-- PUT formUpdate 
router.put(routePath+'/:id', isCreatorOrAdmin, function(req,res){
    
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

        // save the data
        data.save(function(err) {
            if (err) {
                return res.send(err);
            }
            req.flash('message', 'Updated!'); 
            var results = { //-- to view
                title: 'Update ' + modelName,
                message: req.flash('message'),
                user: req.user,
                model: data
            } 

            //res.json({ message: 'Successfully updated!' });
            res.render(modelName+'/view', results);
        });
  });
});


//-- PUT care return JSON 
router.put(routePath+'/:id/care', isCreatorOrAdmin, function(req,res){
    
    var id = req.params.id; 

    Model.findOne({ _id: id }, function(err, data) {
        if (err) {
          return res.send(err);
        }

        var reqCare = 
            {
                comment: req.body.comment, 
                createdAt: req.body.createdAt, 
                createdBy: req.body.createdBy
            }
        ; 

        // for (prop in req.body) {
        //   data[prop] = req.body[prop];
        // }

        // push 
        console.log(reqCare);
        data.care.push(reqCare);

        // save the data
        data.save(function(err) {
            if (err) {
                return res.send(err);
            }
            req.flash('message', 'Care added!'); 
            var results = { //-- to view
                title: 'Update ' + modelName,
                message: req.flash('message'),
                user: req.user,
                model: data.care
            } 

            //-- return 
            res.json({results:results});
        });
        
        
    });
});

//-- GET one detail
router.get(routePath+'/:id', isCreatorOrAdmin, function(req, res) {
    
    Model.findOne({ _id: req.params.id})
        .populate('createdBy')
        .exec(function(err, data) {

        if (err) {
         return res.send(err);
        }

        var results = { //-- to view
                title: 'View ' + modelName,
                user: req.user,
                message: req.flash('message'),
                model: data
            } 

        if (req.param('json')=='true')
            res.json(data);
        else 
            res.render(modelName+'/view',results);
    });
});

//-- DELETE dung MethodOverride _method = DELETE
router.delete(routePath+'/:id', isCreatorOrAdmin, function(req, res) {
    
    Model.remove({_id: req.params.id}, function(err, data) {
        if (err) {
          return res.send(err);
        }
        
        //res.json({ message: 'Successfully deleted' });
        req.flash('message', 'Deleted!'); 
        res.redirect(routePath);  
    }); 
    
});


/*------------------END ROUTE PATH-----------------------*/


module.exports = router; //middleware   