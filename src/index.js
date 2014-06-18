/**
* Self Server
*
* Handles file serves
*
* @property handle
* @type {Object}
* @package    Self Engine open source project
* @copyright  Copyright (c) 2013 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
* @version    v0.1.1
*/
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var util = require('util');
var identititySelf = require("./identitysensortag");
var async = require('async');
var SensorTag = require('./sensortagindex');
var MasterStopwatch = require("./masterwatch");

var handle = {};
handle["/"] = requestHandlers.start;
//handle["/signinmepath"] = requestHandlers.signincheckmepath;
//handle["/auth"] = requestHandlers.authomevent;
handle["/logout"] = requestHandlers.logout;
handle["/swimdata"] = requestHandlers.swimdata;
handle["/racedata"] = requestHandlers.racedata;	
handle["/knowledgetemplate"] = requestHandlers.knowledgetemplate;
handle["/swimdatasave"] = requestHandlers.swimdatasave;
//console.log(util.inspect(router));	

server.start(router.route, handle);
	

/*	
// put whole setup in a  series setup
btButtonslist = ["9059af0b879c","9059af0b8744","9059af0b86e2","9059af0b869c"];
		
		
		function controldataflow (dataid, callbackser) {  
			//couchlive.getKnowledgeDatacouchdb(dataid, fullpath, couchin, callback);
			// put whole sensortag setup code here
//console.log('call to the sensortag class');
//console.log(dataid);	

//setTimeout(function() {
//	  }, 9000);
			
SensorTag.discover(function(sensorTag) {
//console.log('main app discover');	
//console.log(sensorTag._peripheral.uuid); 
//console.log(sensorTag._peripheral._noble._peripherals[sensorTag._peripheral.uuid].rssi);
  
	sensorTag.on('disconnect', function()  {
//console.log('disconnected!');
	//process.exit(0);
	});
  


	async.series([

	function(callback) {
//console.log('connect');
//console.log(callback);		
//console.log('async start');	
		sensorTag.connect(callback);
	},
	function(callback) {
console.log('discoverServicesAndCharacteristics');
console.log(sensorTag._peripheral.uuid);
		sensorTag.discoverServicesAndCharacteristics(callback);
	}
		,
	function(callback) {
//console.log('readDeviceName');
		sensorTag.readDeviceName(function(deviceName) {
//console.log('\tdevice name = ' + deviceName);
			callback();
		});
	},
	function(callback) {
//console.log('readSystemId');
		sensorTag.readSystemId(function(systemId) {
//console.log('\tsystem id = ' + systemId);
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
//console.log('pressed by');			
//console.log(pressedby);				
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
    
callbackser();

}, dataid);


		}; 
		
		function finalf() { 
//console.log('Done all data back from couchdb DATA');
//console.log(dataholder);		
			// prepare the order and html
			//couchlive.sendKnowledgedataback(dataholder, couchin, fullpath, response, origin, couchlive);
			// do  nothing or emit that all of the buttons are alive and well (could test communciation???)
			server.start(router.route, handle);
		}
		
		function series(item) {
//console.log(item);
			if(item) {
//console.log(util.inspect(result));
			
			controldataflow (item, function(resultback) { 
				//dataholder.push(resultback);
//console.log(dataholder);
				setTimeout(function() {
				return series(btButtonslist.shift());
				}, 10000);	
			});
		    
			}
			else {
				return finalf();
			}
		};
		
		series(btButtonslist.shift());	
*/	
