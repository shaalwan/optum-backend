var mongoose=require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var Medicine=new Schema({
     medicineName:{
         type:'String'
     },
     medicinePatent:{
         type:'String'
     },
     medicineInfo:{
         type:'String'
     }
},{
    timestamps:true
});

module.exports = mongoose.model("Medicine", Medicine);