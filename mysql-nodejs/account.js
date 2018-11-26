var mysql = require('mysql');
var moment = require('moment');
var diff = require('diff');
var cron = require('node-cron')
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: "true",
    auth: {
    }
});

var pool = mysql.createPool({
    connectionLimit : 15,
    host: "192.168.1.18",
});

pool.getConnection(function (err, connection) {
 if (err) {
                connection.release();
                callback(null, err);
                throw err;
          }
console.log("connected!")
cron.schedule("31 18 * * *", function() {
    var user_pid = []
    connection.query("SELECT * FROM tbl_users;", function (err, result, fields) {
        if (err) throw err;
        for (let i=0;i<result.length;i++){
            if (result[i].is_active_user === 0 ){
                user_pid.push(result[i].user_pid)
            }
        }
        if (user_pid.length !== 0){
        connection.query("Select * from tbl_users where user_pid in ("+user_pid+");", function (err,result,fields) {
            var  user_id = []
            var userinfo = []
            if (err) throw err
            for (let i=0;i<=result.length;i++){
            var date = moment(result[i].date_created)
            var today = moment(new Date()) 
            var diffDays =  date.diff(today, 'hours')
            if (diffDays<=48){
                user_id.push(result[i].user_pid)
                var userarray ={"user_pid":result[i].user_pid,"user_name":result[i].first_name,"user_email":result[i].email_address}
                userinfo.push(userarray)
            }else{
                console.log(diffDays+"hr left")
            }
            }
            if (user_id.length !== 0){
                connection.query("delete from tbl_users where user_pid in ("+user_id+")")
                sendMail(userinfo)
            }else{
                console.log("No User are going to delete")
            }
        })
        }else{
            console.log("no user are inactive")
        }
    })
    function sendMail(userinfo){
	   	let table_body = "";
	   	for(let i=0 ; i < userinfo.length ; i++){
	   			if(userinfo[i] !== "undefined"){
	   				table_body += "<tr><td>"+userinfo[i].userpid+"</td><td>"+userinfo[i].first_name+"</td><td>"+userinfo[i].email_address+"</td></tr>"
	   			}
	   	}	
	   	var mailOptions={
		        to : "bhavya@iface.io",
		        subject : "inactive user are going to be delete today",
				html: `<!DOCTYPE html>
						<html>
						<head>
						<style>
							#itemList {
								font-family: arial, sans-serif;
								border-collapse: collapse;
								width: 115%;
							}
							td, th {
								border: 1px solid #dddddd;
								text-align: left;
								padding: 8px;
							}
							tr:nth-child(even) {
								background-color: #dddddd;
							}	
						</style>
						</head>
						<body style="font-family: sans-serif;font-size:15px;">
						<DIV align=center>
						<div style="HEIGHT: 85px; MARGIN-LEFT: auto;line-height: 151px; WIDTH: 615px; BACKGROUND-COLOR: #8151515f; MARGIN-RIGHT: auto" align=center>
						<P align=center>
						<IMG border=0 hspace=0 alt="" align=baseline src="https://iface.io/assets/images/iface-logo6.png">
						</P>
						</div>
						</DIV>
						<DIV align=center>
						<TABLE style="MARGIN-LEFT: auto; WIDTH: 615px; MARGIN-RIGHT: auto" cellSpacing=0 cellPadding=0 align=center>
						<TBODY>
						<TR>
							<TD style="HEIGHT: 280px; TEXT-ALIGN: left; PADDING-TOP: 74px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px; WIDTH: 615px; BACKGROUND-COLOR: #fcfcfc" vAlign=top>
							<h2>User List</h2>
							<table id="itemList">
								<tr>
									<th>User Pid</th>
                                    <th>User Name</th>
                                    <th>User email</th>
								</tr>`+table_body+` 
							</table>
							<br>
							<a href = 'www.google.com'>View Details</a>
						</TD>
						</TR>
						<TR>
							<TD style="HEIGHT: 15px; TEXT-ALIGN: center; MARGIN-TOP: 25px; BACKGROUND-COLOR: #2a2a2a">
							<SPAN style="COLOR: #c3c3c3">
							<BR>
							<BR>© 2158 iface LLC All right reserved.</SPAN>
							<BR style="COLOR: #c3c3c3">
							<a style="COLOR: #637AD6;text-decoration:none;" href='https://iface.io'>iface.io
							<BR>
							<BR>
							<BR>
							</a>` 
		    }
		    console.log(mailOptions);
		    smtpTransport.sendMail(mailOptions, function(error, response){
		     if(error){
		            console.log(error);
		     }
			else{
		            console.log("Message sent: ");
		         }
			});
	   }
})
})
