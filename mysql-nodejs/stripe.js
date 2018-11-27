var stripe = require('stripe')('id');
var moment = require('moment')
stripe.subscriptions.retrieve('userid', function(err, subscription) {
if(err){
         console.log(err);
}else{
    console.log(subscription.current_period_end)
    var date = moment(subscription.current_period_end*1000).format()
	console.log(date)
 }
});
