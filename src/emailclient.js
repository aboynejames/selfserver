var nodemailer = require("nodemailer");

function EmailClient(settingsin) {
	
	this.smtpaccount =  settingsin.account['smtpemail'];
	this.smtppwd = settingsin.account['smtppassword'];

};

/**
*  send email sign up to traintimer
* @method sendWelcomemail		
*
*/
EmailClient.prototype.sendWelcomemail = function(inPeer) {
	
	var smtpTransport = nodemailer.createTransport("SMTP",{
	   service: "Gmail",
	   auth: {
	       user: this.smtpaccount,
	       pass: this.smtppwd
	   }
	});

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: 'Stopwatch<welcome@mepath.co.uk>', // sender address
	    to: inPeer.email, // list of receivers
	    subject: 'Stopwatch data identity', // Subject line
	    text: 'Welcome, ' +  inPeer.idlocalnew + '.  Stopwatch data has been recorded for you by a http://www.smartstopwatch.org timer.  Your Stopwatch ID is = ' + inPeer.idstopwatch + ' . This information can be added to www.mepath.co.uk to view your stopwatch times and a range of analysis.', // plaintext body
	    html: '<b>Welcome, ' +  inPeer.idlocalnew + '.  Stopwatch data has been recorded for you by a <a href="http://www.smartstopwatch.org">www.smartstopwatch.org</a> timer.  Your Stopwatch ID is = ' + inPeer.idstopwatch + ' . This ID number can be added to www.mepath.co.uk to view your stopwatch times and a range of analysis</b>' 
	};

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, info){
	    if(error){
		//console.log(error);
	    }else{
console.log('Message sent: ' + info);
		//process.exit(code=0);  
	    }
	});

};


/**
*  send email
* @method sendemail		
*
*/
EmailClient.prototype.sendemail = function(inPeer) {

	var smtpTransport = nodemailer.createTransport("SMTP",{
	   service: "Gmail",
	   auth: {
	       user: this.smtpaccount,
	       pass: this.smtppwd
	   }
	});



	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: 'stopwatch<data@mepath.co.uk>', // sender address
	    to: inPeer.email, // list of receivers
	    subject: 'New data', // Subject line
	    text: 'New data has been synced for your account.', // plaintext body
	    html: '<b>New data has been synced for your account.</b>' // html body
	};

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, info){
	    if(error){
		//console.log(error);
	    }else{
console.log('Message sent: ' + info);
		//process.exit(code=0);  
	    }
	});

};
module.exports = EmailClient;

	