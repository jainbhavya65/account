var date1 = new Date();
var date2 = new Date("09/11/2018");
var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24 )); //gives day difference 
//one_day means 1000*60*60*24
//one_hour means 1000*60*60
//one_minute means 1000*60
//one_second means 1000
console.log(diffDays)
