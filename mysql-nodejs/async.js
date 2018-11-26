

var async = require('async');

//This is your async worker function
//It takes the item first and the callback second
function addOne(number, callback) {
  //There's no true asynchronous code here, so use process.nextTick
  //to prove we've really got it right
  process.nextTick(function () {
    //the callback's first argument is an error, which must be null
    //for success, then the value you want to yield as a result
    callback(null, ++number);
  });
}

//The done function must take an error first
// and the results array second
function done(error, result) {
  console.log("map completed. Error: ", error, " result: ", result);
}

async.map([1,2,3,4,5], addOne, done);


