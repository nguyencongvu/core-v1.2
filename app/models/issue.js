var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var modelName = 'Issue';  //-- Edit Movie to User...
//-- Edit attributes
var modelSchema = new Schema({
    type : { type:String, default: "ISSUE"}, //-- VISIT or ORDER 
    client: {
        name: String, 
        phone: String, 
        address: String, 

        code: String, //-- ma khach hang, update sau
        clientType: String, //-- loai khach hang, update sau, khong dat trung!
    },
    issue: {
        type: String, 
        reason: String, 
        description: String, 
        fix: String, //-- cac cach khac phuc 
        time: String,  //-- thoi gian khac phuc
    },

    createdAt: {type: Date, default: Date.Now},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    updatedAt: {type: Date, default: Date.Now},
    updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    
});


//-- dung de tinh toan  
modelSchema.pre('save', function(next) {
    var self = this;
    
    self.order.amount = self.order.price * self.order.quantity;
    next();
}); 


module.exports = mongoose.model(modelName, modelSchema);