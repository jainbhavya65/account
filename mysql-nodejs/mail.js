var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "bhavya@iface.io",
        pass: "!@!^&iitjee@)!@2"
    }
});
    var mailOptions={
        to : "anand@iface.io",
        subject : "test",
        text : "nasheleis_trial"
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
     }else{
            console.log("Message sent: ");
         }
});
