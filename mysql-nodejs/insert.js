var mysql = require('mysql');

var con = mysql.createConnection({
  host: "192.168.123.2",
  user: "root",
  password: "redhat",
  database: "test"
});

con.connect(function(err) {
  if (err) throw err;
	//('12/12/2018'),('11/11/2018'),('10/29/2018'),('10/30/2018')
  //Select all customers and return the result object:
	var sql = "insert into test.test values "
//	var dates = new Date().toISOString().slice(0, 19).replace('T', ' ');
	var dates = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
	console.log(dates)
  con.query(sql+(dates), function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});
