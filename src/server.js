/**
* Self Engine
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

//console.log(stopwatchlive);
	// serial port listener for touchpad mode  (will be WIFI)
	// open the serial port. Change the name to the name of your port, just like in Processing and Arduino:
	var serialData = {};	// object to hold what goes out to the client   ubuntu /dev/ttyACM0   pi    /dev/ttyAMA0		
	var myPort = new SerialPort("/dev/ttyAMA0", {
	// look for return and newline at the end of each data packet:
		parser: serialport.parsers.readline("\r\n")
	});	
	
	stopwatchlive = new MasterStopwatch(idsetup);
		

	SensorTag.discover(function(sensorTag) {
	//console.log('main app discover');	
	//console.log(sensorTag._peripheral.uuid); 
	//console.log(sensorTag._peripheral._noble._peripherals[sensorTag._peripheral.uuid].rssi);
	  
		sensorTag.on('disconnect', function()  {
	//console.log('disconnected!');
		process.exit(0);
		});
	  
	  
		async.series([
		function(callback) {
console.log('connect');
			sensorTag.connect(callback);
		},
		function(callback) {
console.log('discoverServicesAndCharacteristics');
			sensorTag.discoverServicesAndCharacteristics(callback);
		},
		function(callback) {
console.log('readDeviceName');
			sensorTag.readDeviceName(function(deviceName) {
console.log('\tdevice name = ' + deviceName);
				callback();
			});
		},
		function(callback) {
console.log('readSystemId');
			sensorTag.readSystemId(function(systemId) {
console.log('\tsystem id = ' + systemId);
				callback();
			});
		},
		function(callback) {
console.log('readSimpleRead');
			sensorTag.on('simpleKeyChange', function(left, right, pressedby) {

	//console.log('left: ' + left);
	//console.log('right: ' + right);
				if(left || right)
				{
console.log('pressed by');			
console.log(pressedby);				
					stopwatchlive.startbutton(pressedby);
				}

				if (left && right) {
					sensorTag.notifySimpleKey(callback);

				}
			});

			sensorTag.notifySimpleKey(function() {

			});
		}
	    ]);

	});



		
	var app = http.createServer(onRequest).listen(8881);
		
	function onRequest(request, response) {
	
		var pathname = url.parse(request.url).pathname;
  
//console.log("Request for " + pathname + " received.");
		route(handle, pathname, response, request, couchin, couchlive, authom);
	}
	
	// data for live two way socket data flow for real time display everywhere
	var io = sio.listen(app);	

	
	authom.createServer({
		service: "facebook",
		id: couchin.social['facebookid'],
		secret: couchin.social['facebooksecret'],
		fields: ['name', 'picture']
	})

	authom.createServer({		
	  service: "twitter",
	  id: couchin.social['twitterid'],
	  secret: couchin.social['twittersecret']
	})
		
	authom.on("auth", function(request, response, datain) {

		if(datain.service == "twitter")
		{
			var idname = datain.data['screen_name'];
			var idtoken = datain['token'];

			couchlive.aggregateID(idname);	
			// keep trake of user id & token & expiry time (not added yet)
			//restlog[idname] = idtoken;
			couchin.resthistory[idname] = idtoken;
			
		}
		else if (datain.service == "facebook")
		{
			var idname = datain.data['name'];
			var idtoken = datain.data['']
		}
		


		// after the session middleware has executed, let's finish processing the request
		//res.writeHead(200, {'Content-Type': 'text/plain'});
		//res.write(setsession);
		var path = 'http://localhost/ll/selfengine/src/index.html?swimmer=' + idname + '&token=' + idtoken;
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

	myPort.open(function () {
console.log('open');
		//myPort.on('data', function(data) {
//console.log('data received: ' + data);
//		});
		
		
console.log('first boot salve write message');
                        myPort.write("starte2out\r\n", function(err, results) {
console.log('err ' + err);
console.log('results ' + results);
                        });

		
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
	
	
	io.sockets.on('connection', function (socket, server) {

		socket.on('swimmerclientstart', function(stdata){
			socket.emit('startnews', 'localpi');
			setTimeout(function() {idsetup.checkIDs()},4000);

			idsetup.on("IDdata", function(datainstant) {
console.log('Received starting ids: "' + datainstant + '"');
				socket.emit('startSwimmers', datainstant);
			});

		});
		
		socket.on('checkSplitID', function(stdata){
console.log('identity split event socket');			
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
console.log('Received instant data: "' +  JSON.stringify(datainstant) + '"');			
			//this.emit("startTimingevent", this.t);
			// pass on to the communication mixer 
			socket.emit('startEventout', JSON.stringify(datainstant));
			
		});
		
		stopwatchlive.on("salveIDtime", function(Sdatainstant) {
console.log('slave ID and time back from other end of pool: "' +  JSON.stringify(Sdatainstant) + '"');			
			//this.emit("startTimingevent", this.t);
			// pass on to the communication mixer 
			socket.emit('startEventout', JSON.stringify(Sdatainstant));
			
		});
		
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
		
		socket.on('contextMixer', function(datacontext){
//console.log(util.inspect(data));
//console.log('context mixer in');								
//console.log(datacontext);
			socket.broadcast.emit('contextEventdisplay', datacontext);	
		});

		
	});
		
} // closes start function 


exports.start = start;
