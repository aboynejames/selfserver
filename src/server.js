/**
* Self Server
*
* Start node.js  Server
*
* @package    Train Timer part of open sport project
* @copyright  Copyright (c) 2012 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
* @version    $Id$
*/
var http = require("http");
var url = require("url");
var  sio = require('socket.io');
var fs = require('fs');
var util = require('util');
//var EventEmitter = require('events').EventEmitter;
var settings = require("./settings");
var couchDB = require("./couchdb");
var authom = require("authom");
var serialport = require("serialport");	// include the serialport library
var SerialPort = serialport.SerialPort;	// make a local instance of serial
//var dgram = require('dgram');
//var buf= require('buffer');
var identititySelf = require("./identitysensortag");
var async = require('async');
var SensorTag = require('./sensortagindex');
var MasterStopwatch = require("./masterwatch");

/**
* controls start of node.js server
* @method start
*
*/
function start(route, handle) {

	var couchin = {};
	var couchlive = {};

	couchin = new settings();
	couchlive = new couchDB(couchin);
	idsetup = new identititySelf();		
	stopwatchlive = new MasterStopwatch(idsetup);	

//console.log(stopwatchlive);
	// serial port listener for touchpad mode  (will be WIFI)
	// open the serial port. Change the name to the name of your port, just like in Processing and Arduino:
	var serialData = {};	// object to hold what goes out to the client   ubuntu /dev/ttyACM0   pi    /dev/ttyAMA0		
/*	var myPort = new SerialPort("/dev/ttyAMA0", {
	// look for return and newline at the end of each data packet:
		parser: serialport.parsers.readline("\r\n")
	});	
*/	


	var app = http.createServer(onRequest).listen(8881);
		
	function onRequest(request, response) {
	
		var pathname = url.parse(request.url).pathname;
  
//console.log("Request for " + pathname + " received.");
		route(handle, pathname, response, request, couchin, couchlive, authom);
	}
	
	// data for live two way socket data flow for real time display everywhere
	var io = sio.listen(app);
	
/*
	myPort.open(function () {
//console.log('open');
		myPort.on('data', function(data) {
//console.log('data received: ' + data);
		});
		
		
//console.log('first boot salve write message');
 //                       myPort.write("starte2out\r\n", function(err, results) {
//console.log('err ' + err);
//console.log('results ' + results);
//                      });

		
		// event listener to trigger a write to serial port for other slave pi to pickup
		stopwatchlive.on("slavepiOut", function(timeOtherend) {
console.log('call to salve event started  server location');			
			myPort.write("e2out\r\n", function(err, results) {
console.log('err ' + err);
console.log('results ' + results);
			});
		});

	
		// event listener to trigger a write to serial port from BT button
		stopwatchlive.on("contactSlave", function(timeOtherend) {
console.log('call slave via bluetooth button press event');			
			myPort.write("BTe2out\r\n", function(err, results) {
console.log('err ' + err);
console.log('results ' + results);
			});
		});
		
	});
*/	
	
	io.sockets.on('connection', function (socket, server) {

		socket.on('swimmerclientstart', function(stdata){
			socket.emit('startnews', 'localpi');
			setTimeout(function() {idsetup.checkIDs()},12000);

			idsetup.on("IDdata", function(datainstant) {
//console.log('Received starting ids: "' + datainstant + '"');
				socket.emit('startSwimmers', datainstant);
			});

		});
		
		socket.on('checkSplitID', function(stdata){
//console.log('identity split event socket');			
			idsetup.checkSplitIDs();

		});
		
		
		// time event listener (start  2ndend startend, and other intermediate points with time)
/*		stopwatchlive.on("startTimingevent", function(timeEvent) {
console.log('Timing event start: "' + JSON.stringify(timeEvent) + '"');
			
			// pass on to the communication mixer 
			socket.emit('startTimingout', 'starteventOUT');
			
		});
*/		
		idsetup.on("dataIDsplit", function(datainstant) {
//console.log('Received instant data: "' +  JSON.stringify(datainstant) + '"');			
			//this.emit("startTimingevent", this.t);
			// pass on to the communication mixer 
			socket.emit('startEventout', JSON.stringify(datainstant));
			
		});
		
		stopwatchlive.on("salveIDtime", function(Sdatainstant) {
//console.log('slave ID and time back from other end of pool: "' +  JSON.stringify(Sdatainstant) + '"');			
			//this.emit("startTimingevent", this.t);
			// pass on to the communication mixer 
			socket.emit('startEventout', JSON.stringify(Sdatainstant));
			
		});
/*		
		// serial usb port listener
		myPort.on('data', function (data) {
			// set the value property of scores to the serial string:
			serialData.value = data;
			// for debugging, you should see this in Terminal:
console.log('masterpi radio log');			
console.log(data);
			// control master Server clock
			//stopwatchlive.radiobutton(data);
			stopwatchlive.returnIDslave(data);
			// send a serial event to the web client with the data:
			//socket.emit('stopwatchEvent', serialData);
		});  
*/		
		socket.on('contextMixer', function(datacontext){
//console.log(util.inspect(data));
//console.log('context mixer in');								
//console.log(datacontext);
			socket.broadcast.emit('contextEventdisplay', datacontext);	
		});

		
	});
/*
// for offline by passing of third party login for TESTING
			couchlive.checkPersonaldataStore(couchlive, "aboynejames" + "7766872");

			var setupIDdatabase = {};
			setupIDdatabase.token = "7766872-4Hmh0YN2VuP6DTdlWUS3iLsHqx7TigypYTEolCADdM";
			setupIDdatabase.database = "aboynejames" + "7766872";
			couchin.resthistory['aboynejames'] = setupIDdatabase;
*/
	
	/*
	* Authorisation sign in / identity storage setup
	*
	*/
	authom.createServer({
		service: "facebook",
		id: couchin.social['facebookid'],
		secret: couchin.social['facebooksecret'],
		fields: ['name', 'picture']
	})

	authom.createServer({
		service: "facebook",
		name: "facebook2",
		id: couchin.social['facebookid'],
		secret: couchin.social['facebooksecret'],
		fields: ['name', 'picture']
	})
	
	authom.createServer({		
	  service: "twitter",
	  name: "twitter",
	  id: couchin.social['twitterid'],
	  secret: couchin.social['twittersecret']
	})

	authom.createServer({		
	  service: "twitter",
	  name: "twitter2",		
	  id: couchin.social['twitterid'],
	  secret: couchin.social['twittersecret']
	})
	
	authom.createServer({		
	  service: "twitter",
	  name: "twitter3",		
	  id: couchin.social['twitterid'],
	  secret: couchin.social['twittersecret']
	})
	
	authom.on("auth", function(request, response, datain) {
//console.log(datain);
		if(datain.service == "twitter")
		{
			// has a couchdb personal data store be setup for this identity? if not create one
			couchlive.checkPersonaldataStore(couchlive, datain.data.screen_name + datain.id);
			
			var idname = datain.data['screen_name'];
			var idtoken = datain['token'];

			//couchlive.aggregateID(datain.data.screen_name + datain.id);	
			// keep trake of user id & token & expiry time (not added yet)
			var setupIDdatabase = {};
			setupIDdatabase.token = idtoken;
			setupIDdatabase.database = datain.data.screen_name + datain.id;
			couchin.resthistory[idname] = setupIDdatabase;
			
			var returnurl =  couchin.account.baseurl;
			
		}
		else if(datain.service == "twitter2")
		{
			// has a couchdb personal data store be setup for this identity? if not create one
			couchlive.checkPersonaldataStore(couchlive, datain.data.screen_name + datain.id);
			
			var idname = datain.data['screen_name'];
			var idtoken = datain['token'];

			var setupIDdatabase = {};
			setupIDdatabase.token = idtoken;
			setupIDdatabase.database = datain.data.screen_name + datain.id;
			couchin.resthistory[idname] = setupIDdatabase;

			var returnurl =  couchin.account.basestopwatch;
			
		}
		else if(datain.service == "twitter3")
		{
			// has a couchdb personal data store be setup for this identity? if not create one
			couchlive.checkPersonaldataStore(couchlive, datain.data.screen_name + datain.id);
			
			var idname = datain.data['screen_name'];
			var idtoken = datain['token'];

			var setupIDdatabase = {};
			setupIDdatabase.token = idtoken;
			setupIDdatabase.database = 'swimknowledge';//screen_name + datain.id;
			couchin.resthistory[idname] = setupIDdatabase;

			var returnurl = couchin.account.baseknowledge;
			
		}

		else if (datain.service == "facebook")
		{
console.log(datain);
			var infbname = datain.data.name.replace(/\s+/g, '').toLowerCase(); ;//data['name'];
			
			couchlive.checkPersonaldataStore(couchlive, infbname + datain.id);
			
			var idname = infbname;
			// create a token string
			hashCode = function(str){
				var hash = 0;
				if (str.length === 0) return hash;
					for (i = 0; i < str.length; i++) {
						char = str.charCodeAt(i);
						hash = ((hash<<5)-hash)+char;
						hash = hash & hash; // Convert to 32bit integer
					}
console.log('hash');
console.log(hash);					
					return hash;
				};			
			var idtoken = hashCode(datain.id) + 'k';

			var setupIDdatabase = {};
			setupIDdatabase.token = idtoken;
			setupIDdatabase.database = infbname + datain.id;//screen_name + datain.id;
			couchin.resthistory[idname] = setupIDdatabase;

			var returnurl =  couchin.account.baseurl;
						
		}
		else if (datain.service == "facebook2")
		{
console.log(datain);
			var infbname = datain.data.name.replace(/\s+/g, '').toLowerCase(); ;//data['name'];
			
			couchlive.checkPersonaldataStore(couchlive, infbname + datain.id);
			
			var idname = infbname;
			// create a token string
			hashCode = function(str){
				var hash = 0;
				if (str.length === 0) return hash;
					for (i = 0; i < str.length; i++) {
						char = str.charCodeAt(i);
						hash = ((hash<<5)-hash)+char;
						hash = hash & hash; // Convert to 32bit integer
					}
console.log('hash');
console.log(hash);					
					return hash;
				};			
			var idtoken = hashCode(datain.id) + 'k';

			var setupIDdatabase = {};
			setupIDdatabase.token = idtoken;
			setupIDdatabase.database = infbname + datain.id;//screen_name + datain.id;
			couchin.resthistory[idname] = setupIDdatabase;

			var returnurl = couchin.account.basestopwatch;
						
		}
		

		// after the session middleware has executed, let's finish processing the request
		//res.writeHead(200, {'Content-Type': 'text/plain'});
		//res.write(setsession);
		var path = returnurl + idname + '&token=' + idtoken + '&fbn=' + datain.data.name;
console.log(path);		
		response.writeHead(302, {'Location': path});
		response.end();
	
	});

	authom.on("error", function(request, response, datain){
		data = Buffer("An error occurred: " + JSON.stringify(datain))

		request.writeHead(500, {
			"Content-Type": "text/plain",
			"Content-Length": datain.length
		})

	response.end(datain)
	});
	
		
	authom.listen(app);
		
} // closes start function 


exports.start = start;
