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
    },
    //completed,incomplete
    status:{
        type:'String'
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
    email:{
        type:String,
    },
    schedule:[daySchema],
    aherence:{
        type:'String'
    },
    age:{
        type:'String'
    },
    marital_status:{
        type:'String'
    },
    gender:{
        type:'String'
    },
    location:{
        type:mongoose.Schema.Types.Mixed
    },
    avg_health_care_expense:{
        type:Number
    },
    health_insurance_company:{
        type:'String'
    }
});
// Age, marital status, gender, lat/long(location), avg health_care expense, health_insurance_company.
User.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", User);
