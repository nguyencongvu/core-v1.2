var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var modelName = 'Pixel';  //-- Edit Movie to User...
//-- Edit attributes
var modelSchema = new Schema({
    username: {
        type: String,
        unique: true
    },    
    email: {
        type: String,
        unique: true,
        index: true
    },    
    password: String, 
    gender: String, 
    address: String,
    role: String
});

modelSchema.pre('save', function(next) {
    if (true) {
        next()
    } else {
        next(new Error('No can do, sir!'));
    }
}); 



module.exports = mongoose.model(modelName, modelSchema);