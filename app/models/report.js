var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var modelName = 'Report';  //-- Edit Movie to User...
//-- Edit attributes
var modelSchema = new Schema({
    type : { type:String, default: "VISIT"}, //-- VISIT or ORDER 
    client: {
        name: String, 
        phone: String, 
        address: String, 

        code: String, //-- ma khach hang, update sau
        clientType: String, //-- loai khach hang, update sau, khong dat trung!
    },
    contact: {
        name: String, 
        phone: String,
        email: String, 
    },
    location: {
        lat: String, 
        lng: String, 
    }, 
    area: {
        city: {type: String, default: "Ho Chi Minh"}, 
        district: String, //-- Quan huyen
    },
    photos: [
        {src: String}, //-- nhieu hinh 
    ],

    feedback: {
        comment: String, 
        rate: String, 
    }, 
    
    report: {
        comment: String, 
        rate: String, 
    }, 

    order: [
        {
            item: String, 
            quantity: Number,
            price: Number, 
            amount: Number, 
        },
        { total: Number },
    ], 
    care : [
        {
            comment: String, 
            createdAt: {type: Date, default: Date.Now},
            createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
        }
    ],

    shipping: String,

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