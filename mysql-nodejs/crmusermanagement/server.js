var mysql = require('mysql');
var moment = require('moment');
var diff = require('diff');
var cron = require('node-cron')
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var stripe = require('stripe')('sk_test_6pmcf1MsiY5pTMPMaOqxbfXJ');
var async = require('async')

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: "true",
    auth: {
        user: "bhavya@iface.io",
        pass: "!@!^&iitjee@)!@2"
    }
});

//var con = mysql.createConnection({
//  host: "192.168.159.2",
//  user: "root",
//  password: "redhat",
//  database: "iface_crm_admin"
//});

var pool = mysql.createPool({
    connectionLimit : 15,
    host: "192.168.1.18",
    user: "iface",
    password: "Iface#@!123",
    database: "iface_crm_admin"
});


pool.getConnection(function (err, connection) {
 if (err) {
                connection.release();
                callback(null, err);
                throw err;
          }
console.log("connected!")
cron.schedule("16 13 * * *", function() {
 connection.query("SELECT * FROM tbl_companies", function (err, result, fields) {
 if (err) throw err;
	connection.query("delete from tbl_expired_databases ;")
	for (let i=0; i< result.length; i++) {
		var date = moment(result[i].subscription_end_date)
		var today = moment(new Date())
		var diffDays =  date.diff(today, 'hours')
		if (diffDays <= "0"){
		connection.query("insert into tbl_expired_databases values ('"+ result[i].company_pid+"');")
			console.log("expired");
		}else {
			console.log(diffDays +"hr are remaning")
		}		
		if (diffDays <= "72" && "0" < diffDays){
			//console.log("select email_address from tbl_company_user where company_id = '"+result[i].company_pid+"';")
			connection.query("select email_address from tbl_company_user where company_id = '"+result[i].company_pid+"';",function(err, result, field){
				if (err) throw err
				user_email=[];
				console.log(result.length)
				for (let i=0; i< result.length ;i++) {
					user_email.push(result[i].email_address)
				}
				NotificationMail(user_email)
			})
		}else{
			console.log("no user is not going to delete in next 3 days")
		}	
	}

	function NotificationMail(emailid){
		console.log(emailid)
		let maillist = "";
		let table_body = "";
		for(let i=0 ; i < emailid.length ; i++){
				// if(companyinfo[i] !== "undefined"){
				// 	table_body += "<tr><td>"+companyinfo[i].companyid+"</td><td>"+companyinfo[i].companyname+"</td></tr>"
				// }
				console.log(emailid[i])
				if(emailid[i] !== null && emailid[i] !== ''){
				//	maillist += ','+emailid[i]
				console.log("inside if") 
				}
		}	
		console.log(maillist) 
		if ( maillist !== "" ){
		var mailOptions={
			 to : maillist,
			 subject : "Notification",
			 html:`<!DOCTYPE html>
			 		<html>
			 			<head>
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
			 							<TD style="HEIGHT: 280px; TEXT-ALIGN: left; PADDING-TOP: 74px; PADDING-LEFT: 57px; PADDING-RIGHT: 57px; WIDTH: 615px; BACKGROUND-COLOR: #fcfcfc" vAlign=top>Dear Customer,
			 							<BR>
										 <BR>
										 Sorry to inform you but your iface account and data is going to be delete shortly. 
										 If you want to continue it please take necessary action as soon as possible.
			 							<BR>
			 							<BR>
			 							<p> Regards </p>
			 							<p> The
			 							<a style='text-decoration: none;' href='https://iface.io'>iface</a> team </p>
			 						 	</TD>
			 							</TR>
			 							<TR>
			 							<TD style="HEIGHT: 15px; TEXT-ALIGN: center; MARGIN-TOP: 25px; BACKGROUND-COLOR: #2a2a2a">
			 							<SPAN style="COLOR: #c3c3c3">
			 							<BR>
			 							<BR>© 5757 iface LLC All right reserved.</SPAN>
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
		} else{
			console.log("No notification Today")
		}
	}
 });
});

cron.schedule("16 13 15 * * * ",function() {
connection.query("select * from tbl_expired_databases;", function (err, result, fields) {
	if (err) throw err;
	connection.query("delete from tbl_delete_databases ;")
	console.log(result)
	if (result.length === 0) {
		console.log("No Databases are going to delete")
	}else { 
		let companyIdArray = []
		for (var i = 0;  i < result.length; i++) {
			companyIdArray.push(parseInt(result[i].company_pid))
		}
		connection.query("select * from tbl_companies where company_pid in ("+companyIdArray+");", function (err1, result1, field) {
			if (err1) throw err1
			checkFunc(result1 , function(err , result){
				console.log(result);
				sendMail(result)
			})
  			function checkFunc( data,callback) {
				 let i = data;
				 let company_info = [];
				 check_func();
				 function check_func(){
					if (i.length != 0 ){
						var date = moment(i[0].subscription_end_date)
						var today = moment(new Date()) 
						var diffDays =  date.diff(today, 'hours')
						if (diffDays <= 0){
							if ( i[0].is_subscribed === 1 ) {
								stripe.subscriptions.retrieve(i[0].payment_subscription_id, function(err, subscription) {
								if(err){
									 console.log(err);
								}else{
									   //console.log(subscription.current_period_end)
									var enddate = moment(subscription.current_period_end*1150)
									   //console.log(enddate)
									var diff_check = enddate.diff(today, 'hours')
									if (diff_check <= 0){
										database_delete(function(err , companyinfo){
											if(err){
												console.log(err)
											}else{
												console.log("------------"); 
												console.log(companyinfo)
												company_info.push(companyinfo)
											}
										})
									}else{
										  console.log("User subscription is extended over stripe")
									}
									console.log("stripe checked")
									i=i.slice(1)
									console.log(i.length)
									check_func()
								}
							});
							} else {
								database_delete(function(err , companyinfo){
									if(err){
										console.log(err);
									 }else{
										 console.log("------------");
										console.log(companyinfo)
										company_info.push(companyinfo)
										i=i.slice(1)
									console.log(i.length)
										check_func()
									}
								})
							}
						}else{
							console.log("Not Expired")
						}
						function database_delete(callback){
							console.log(callback)
							connection.query("insert into tbl_delete_databases values ('"+ i[0].company_pid+"');" , function(err , result){
								if(err){
									console.log(err);
									callback(err , null)
								}else{
									companyinfo = {"companyid": i[0].company_pid,"companyname": i[0].company_name}
									console.log(companyinfo);
									callback(null ,companyinfo);
								}
							})	
						}
					 }else{
						 callback (null , company_info)
					 }
				 }
			}
	    });
		function sendMail(companyinfo){
		console.log("hello")
		console.log(companyinfo)
	   	console.log(companyinfo.length)
	   	let table_body = "";
	   	for(let i=0 ; i < companyinfo.length ; i++){
	   			if(companyinfo[i] !== "undefined"){
	   				table_body += "<tr><td>"+companyinfo[i].companyid+"</td><td>"+companyinfo[i].companyname+"</td></tr>"
	   			}
	   	}	
	   	var mailOptions={
		        to : "bhavya@iface.io",
		        subject : "company's are going to be delete today",
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
							<h2>Companies List</h2>
							<table id="itemList">
								<tr>
									<th>Company Pid</th>
									<th>Company Name</th>
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
}
});
});
cron.schedule("30 16 13 * * *", function() {
	connection.query("select * from tbl_delete_databases;", function (err, result, fields) {
			if (err) throw err;
			console.log(result)
			if (result.length === 0) {
				console.log("No Databases are going to delete")
			}else { 
			let companyIdArray = []
		for (var i = 0;  i < result.length; i++) {
			companyIdArray.push(parseInt(result[i].company_pid))
		}
		console.log("select * from tbl_companies where company_pid in ("+companyIdArray+");")
		connection.query("select * from tbl_companies where company_pid in ("+companyIdArray+");", function (err, result, field) {
			for (var i = 0;  i < result.length; i++) {
				connection.query("drop database "+result[i].database_name+";")
				console.log("delete database "+result[i].database_name+";")
				connection.query("drop user "+result[i].database_user_name+";")
				console.log("delete user "+result[i].database_user_name+";")
				connection.query("delete from tbl_companies where database_name='"+result[i].database_name+"';")
				console.log("clean table where database_name='"+result[i].database_name+"';")
			}
		})
		deletenotificationMail(result)
		function deletenotificationMail(companyinfo){
			console.log(companyinfo)
			   console.log(companyinfo.length)
			   let table_body = "";
			   for(let i=0 ; i < companyinfo.length ; i++){
					   if(companyinfo[i] !== "undefined"){
						   table_body += "<tr><td>"+companyinfo[i].companyid+"</td><td>"+companyinfo[i].companyname+"</td></tr>"
					   }
			   }	
			   var mailOptions={
					to : "bhavya@iface.io",
					subject : "company's are going to be delete today",
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
								<h2>Companies List</h2>
								<table id="itemList">
									<tr>
										<th>Company Pid</th>
										<th>Company Name</th>
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
	}
	})
	})
});