var stripe = require('stripe')('sk_test_6pmcf1MsiY5pTMPMaOqxbfXJ');
var moment = require('moment')
stripe.subscriptions.retrieve('sub_DSTdR5uB8Q0Ltq', function(err, subscription) {
if(err){
         console.log(err);
}else{
    console.log(subscription.current_period_end)
    var date = moment(subscription.current_period_end*1000).format()
	console.log(date)
 }
});
