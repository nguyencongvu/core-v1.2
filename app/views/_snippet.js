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
        
        console.log(data);
        //-- path: _id la fieldname cua group by, khong dung  createdBy !
        User.populate(data, {path: "_id" }, function(err,result){
            req.sumByUsers = result;
            console.log(result);
            next();
        });
        
    });
    
}



$('.district').selectize({
                delimiter: ',',
                persist: false,
                maxItems: 1
                valueField: 'text', //- list
                labelField: 'text',
                searchField: 'text',
                options: [],
                create: false,
                load: function(query, callback) {
                    if (!query.length) return callback();
                    var link =  '/admin/lists/jsontype?type=HCM&search=';
                    $.ajax({
                        url: link + encodeURIComponent(query),
                        type: 'GET',
                        error: function() {
                            callback();
                        },
                        success: function(res) {
                            console.log(res);
                            callback(res);
                        }
                    });
                }
            });