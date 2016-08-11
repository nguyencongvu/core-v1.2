var modelName = 'dash'; //--edit here movie to user modelName = viewName
var routePath = '/dash';  //--edit here -- routePath+'/:id'

var Report = require('../models/report');
var User = require('../models/user');

var express = require('express');
var router = express.Router();

require('paginate-for-mongoose');

var moment = require('moment');
var geoJson = require('geojson');
var fs = require('fs');


/*-----------------ROUTE PATH ------------------------*/

router.get(routePath, reportCount, orderSum, sumByUsers, function(req,res) {
    
    var reportCount = req.reportCount;
    var orderSum = req.orderSum;
    var sumByUsers = req.sumByUsers;

    var results = {
        user: req.user, 
        title: 'Dashboard', 
        reportCount : reportCount,
        orderSum : orderSum,
        sumByUsers: req.sumByUsers,
    }

    res.render(modelName+'/home',results);
});


/*------------------AGGREGATE-----------------------*/



router.get(routePath + "/analytic", reportCount, orderSum,  function(req,res){
    
    var a = req.reportCount;
    var b = req.orderSum;

    res.json(a,b);
    
});


/*------------------END ROUTE PATH-----------------------*/
var report;

//-- return req.reportCount
function reportCount(req,res,next){
    
    req.reportCount = 0;

    var options = [];
    var match = {};
    //-- if admin 
    if (req.isAdmin==true){
        match = {};  // -- 1==1? get all
        options = [
            // { $match : match}, 
            { $group: 
                { 
                    _id: null, 
                    count: { $sum: 1 } 
                },
            }
        ];
    }
    else{    
        match = { createdBy : req.user._id }; 
        options = [
            { $match : match}, 
            { $group: 
                { 
                    _id: null, 
                    count: { $sum: 1 } 
                },
            }
        ];
    }
    

    Report.aggregate(options, function(err, data){
        if (err)
            return next(err);

        req.reportCount = 0;
        if (data)
            req.reportCount = data[0].count || 0;

        next();
    });
    
}

//-- return req.reportCount
function orderSum(req,res,next){
    
    req.orderSum = 0;

    var options = [];
    var match = {};
    //-- if admin 
    if (req.isAdmin==true){
        match = {};  // -- 1==1? get all
        options = [
            // { $match : match}, //- no match
            { $unwind: '$order' },
            { $group: 
                { 
                    _id: null, 
                    total: { $sum: { $multiply: [ "$order.price", "$order.quantity" ] } },
                },
            }
        ];
    }
    else{    
        match = { createdBy : req.user._id }; 
        options = [
            { $match : match}, 
            { $unwind: '$order' },
            { $group: 
                { 
                    _id: null, 
                    total: { $sum: { $multiply: [ "$order.price", "$order.quantity" ] } },
                },
            }
        ];
    }
    

    Report.aggregate(options, function(err, data){
        if (err)
            return next(err);
        
        console.log(data);

        req.orderSum = 0;
        if (data.length>0)
            req.orderSum = data[0].total || 0;

        next();
    });
    
}

function getOptions(){
    var opt=[];

    return opt;
}

//-- return req.reportCount
function sumByUsers(req,res,next){
    
    var options = [];
    var match = {};
    //-- if admin 
    if (req.isAdmin==true){
        match = {};  // -- 1==1? get all
        options = [
            // { $match : match}, //- no match
            { $unwind: '$order' },
            { $group: 
                { 
                    _id: '$createdBy', 
                    total: { $sum: { $multiply: [ "$order.price", "$order.quantity" ] } },
                },
            },

        ];
    }
    else{    
        match = { createdBy : req.user._id }; 
        options = [
            { $match : match}, 
            { $unwind: '$order' },
            { $group: 
                { 
                    _id: '$createdBy', 
                    total: { $sum: { $multiply: [ "$order.price", "$order.quantity" ] } },
                },
            }
        ];
    }
    

    Report.aggregate(options, function(err, data){
        if (err)
            return next(err);

        console.log(data);
        //-- path: _id la fieldname cua group by, khong dung  createdBy !
        User.populate(data, {path: "_id" }, function(err,result){
            
            req.sumByUsers = [];
            if (result)
                req.sumByUsers = result || [];
            console.log(result);
            next();
        });
        
    });
    
}

module.exports = router; //middleware 