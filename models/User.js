var mongoose=require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var daySchema=new Schema({
    startTime:{
        type:'String'
    },
    endTime:{
        type:'String'
    },
    medicine:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Medicine"
    }
});

var User=new Schema({
    //doctor or patient
    user_type:{
        type:'String'
    },
    firstName:{
        type:'String'
    },
    lastName:{
        type:'String'
    },
    schedule:[daySchema]
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", User);
