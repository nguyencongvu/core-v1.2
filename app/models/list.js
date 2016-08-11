var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var modelName = 'List';  //-- Edit Movie to User...
//-- Edit attributes
var modelSchema = new Schema({
    
    type: String,
    value: String, 
    text: String,

    createdAt: Date,
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    updatedAt: Date,
    updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    
});


//-- chua dung 
modelSchema.pre('save', function(next) {
    if (true) {
        next()
    } else {
        next(new Error('No can do, sir!'));
    }
}); 


module.exports = mongoose.model(modelName, modelSchema);