var mongoose=require('mongoose');
//var mongoosePaginate = require('mongoose-paginate');
var bcrypt   = require('bcrypt-nodejs');

var Schema=mongoose.Schema;

var modelName = 'User';  //-- Edit Movie to User...
//-- Edit attributes
var modelSchema = new Schema({
    
    name    : String,
    username     : String,
    email        : String,
    password     : String,
    role         : String,
    source         : String,

    //-- email activator 
    activated: Boolean,
    activateToken: String, 
    activateExpires: Date,
    resetPasswordToken: String, 
    resetPasswordExpires: Date,
    
    phone: String,
    birthday: Date,
    gender: String, 
    address: String,
    
    createdAt: Date,
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    updatedAt: Date,
    updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
 
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    
});

//modelSchema.plugin(mongoosePaginate);

// methods ======================
// generating a hash
modelSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// // checking if password is valid
modelSchema.methods.validPassword = function(password) {
    //khong hash password
    // if (password==this.password)
    //     return true; 
    // else 
    //     return false;

    return bcrypt.compareSync(password, this.password);
};


//-- chua dung 
modelSchema.pre('save', function(next) {
    if (true) {
        next()
    } else {
        next(new Error('No can do, sir!'));
    }
}); 


module.exports = mongoose.model(modelName, modelSchema);