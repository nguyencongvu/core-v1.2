// -- localhost     
var dbName = 'teamshow'; //-- EDIT 
var connectionString = 'mongodb://127.0.0.1:27017/' + dbName;

//-- Openshift 
if (process.env.OPENSHIFT_MONGODB_DB_URL){
    dbName = "teamshow";
    connectionString = process.env.OPENSHIFT_MONGODB_DB_URL + dbName;
}

//-- mLab mongodb 
var mLab = false; //-- set true neu can test  
if (mLab==true) { 
    dbName = 'web01'; //--EDIT in config 
    connectionString = 'mongodb://admin:admin@ds023694.mlab.com:23694/'+ dbName;
} 

module.exports = {
    'connectionString': connectionString
}; 