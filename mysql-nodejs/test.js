cron.schedule("*/2 * * * ",function() {
connection.query("select * from tbl_expired_databases;", function (err, result, fields) {
if (err) throw err;
if (result.length == "0") {
	console.log("No Databases are going to delete")
}
else { 
	console.log(hello)
for (let j=0; j< result.lenght; j++) { 
connection.query("select * from tbl_companies where company_pid='"+result[i].company_pid+"'", function (err1, result1, field) {
	console.log(result1)
      var date1 = moment(result1[i].subscription_end_date)
      var today1 = moment(new Date())
//      var diffDays = parseInt((result[i].date - today) / (1000 * 60 * 60  ))
        if (result1[i].is_trial == "1"){
        var diffDays1 =  date.diff(today, 'hours')
                if (diffDays1 < "0"){
                connection.query("insert into tbl_delete_database values ('"+ result1[i].company_pid+"');")
                        console.log("expired");               
	}	
        else {
                console.log(diffDays1 +"hr are remaning")
           }
	}
       });

      }

}
});
connection.on('error', function (err) {
                connection.release();
                callback(null, err);
                throw err;
});
});
