	for (let i = 0; i < result1.length; i++) {
        		var today = moment(new Date())
						if ( result1[i].is_subscribed === 1 ) {
							stripe.subscriptions.retrieve(result1[i].payment_subscription_id, function(err, subscription) {
								if(err){
         							console.log(err);
								}else{
   									console.log(subscription.current_period_end)
   					 				var enddate = moment(subscription.current_period_end*1000)
       						 		console.log(enddate)
					  				var diff_check = enddate.diff(today, 'hours')
					  				if (diff_check <= 0){
					 					database_delete()
					  				}else{
					  					console.log("User subscription is extended over stripe")
					  					console.log(i)
					  					console.log(result1.length - 1)
					  					if ( i === result1.length - 1) {
					  						mailcall();
					  					}
					  				}
					 			console.log("stripe checked")
					 			}
							});
						} else {
							database_delete()
        			}
        		function database_delete(){
                	connection.query("insert into tbl_delete_database values ('"+ result1[i].company_pid+"');" , function(err , result){
                		if(err){
                			console.log(err);
                		}else{
                			companyinfo.push({"companyid": result1[i].company_pid,"companyname": result1[i].company_name})
                		    console.log(companyinfo);
                		}
                	})	
                	console.log(i)
                	console.log(result1.length - 1)
                	if ( i === result1.length - 1){
                		mailcall();
                	}
				}	
				
			}	
			function mailcall(){
				console.log("mail")
            	sendMail(companyinfo)
        	}
