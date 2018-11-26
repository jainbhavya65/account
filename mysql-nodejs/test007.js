var output = '';
var array = ['h','e','l','l','o'];

// This is an example of an async function, like an AJAX call

var fetchData = function () {
 return new Promise(function (resolve, reject) {
	 resolve();
  });
};

/* 
  Inside the loop below, we execute an async function and create
  a string from each letter in the callback.

   - Expected output: hello
   - Actual output: undefinedundefinedundefinedundefined
*/
for (var i = 0; i < array.length; i++) {
  fetchData(array[i]).then(function () {
	  output += array[i]
	  console.log(output)
  });
}
