const schedule = require("node-schedule");
let User = require("../models/User");
let moment = require("moment");
let nanoid =require("nanoid");
var nodemailer=require("nodemailer");
var notTakenTemplate=require("../templates/notTakenTemplate");

let pass=`3b'HL*S2`;
var transporter = nodemailer.createTransport({
  service: 'gmail',
    auth: {
        user: 'clientemail347@gmail.com',
        pass: pass,
    }
});
let sendMail=(userEmail,mailBody)=>{
  let mailOptions=notTakenTemplate(userEmail,mailBody);
  transporter.sendMail(mailOptions, (error, info)=>{
    if (error) {
      console.log(error);
    }
});
};

let cornJobs = {};

let setJober = () => {
  User.find({ user_type: "patient" })
    .then((users) => {
      for (let i = 0; i < users.length; ++i) {
        let schedule = users[i].schedule;
        cornJobs[users[i]._id] = [];
        for (let j = 0; j < schedule.length; ++j) {
          cornJobs[users[i]].push(null);
        }
      }
      setScheduler(timeDelay);
    })
    .catch((err) => {
      console.log(err);
    });
};

let setScheduler = (timeDelay) => {
  User.find({ user_type: "patient" })
    .then((users) => {
      for (let i = 0; i < users.length; ++i) {
        let schedule = users[i].schedule;
        for (let j = 0; j < schedule.length; ++j) {
          if (schedule[j].status != "completed" && !cornJobs[users[j]._id][j]) {
            //not taken the dose
            let stTime = schedule[j].startTime;
            let enTime = schedule[j].endTime;
            let cur = moment();
            let en = moment(enTime);

            if (cur > enTime) {
              let x = nanoid();
              const job = schedule.scheduleJob(x, "*/5 * * * *", () => {
                sendMail(users[i].email,{
                  medicineName:schedule[j].medicineName,
                  timing:`${moment(stTime).format('hh:mm:ss')}--${moment(enTime).format('hh:mm:ss')}`
                });
              });

              cornJobs[users[j]._id][j] = x;
            }
          } else if(schedule[j].status == "completed") {
            //taken the dose
            if (cornJobs[users[j]._id][j]) {
              var my_job = schedule.scheduledJobs[cornJobs[users[j]._id][j]];
              my_job.cancel();
              cornJobs[users[j]._id][j] = null;
            }
          }
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};


const job = (timeDelay) => {
  schedule.scheduleJob("59 23 * * *", () => {
    for (let i = 0; i < users.length; ++i) {
      let schedule = users[i].schedule;
      for (let j = 0; j < schedule.length; ++j) {
        schedule[j].status='pending';
      }
  
      User.findById(user[j]._id).then((usr)=>{
        usr.schedule=schedule;
        usr.save().then((resp)=>{
  
        })
        .catch((err)=>{
          throw(err);
        });
      })
      .catch((err)=>{
        console.log(err);
      });
    }
  });

    setTimeout(() => {
        setJober();
    },1000)
};

module.exports={job};