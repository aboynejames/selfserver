var util = require("util");
var events = require("events");
var noble = require('noble');

function identitySelf() {
	events.EventEmitter.call(this);
	this.nobleBT(0);
	this.RSSholder = {};
}

/**
* inherits core emitter class within this class
* @method 
*/
util.inherits(identitySelf, events.EventEmitter);

/**
* a custom emitter 
* @method write
*/
identitySelf.prototype.checkIDs = function() {
//console.log('building in event emitter into a class');
//console.log(this.RSSholder);	
	var liveIDs = Object.keys(this.RSSholder);
	this.emit("IDdata", liveIDs);
};


/**
* a custom emitter 
* @method checkSplitIDs
*/
identitySelf.prototype.checkSplitIDs = function(typeEvent, timeEvent) {
console.log('building in event emitter into a class');
//console.log(this.RSSholder);	
	var datainstant = this.RSSholder
	var distanceOrder = [];
	var btIDlive = Object.keys(datainstant);
	btIDlive.forEach(function(iddistance) {
		distanceOrder.push([iddistance, datainstant[iddistance].slice(-1)[0]]);
		
	});
	distanceOrder.sort(function(a, b) {return a[1] - b[1]})
	// order the arrays distance lowest to highest
console.log('closest');
console.log(distanceOrder);	
console.log(distanceOrder.slice(-1)[0]);
	var extractID = distanceOrder.slice(-1)[0];
	var timeandidentity = {};
	timeandidentity[extractID[0]] = [typeEvent,timeEvent];	
	
	this.emit("dataIDsplit", timeandidentity);
};


/**
*  keeps record of identies "distance" and ID number
* @method write
*/
identitySelf.prototype.setID = function(timein, IDdatain) {
//console.log('holding all the data');	
	this.RSSholder  = IDdatain; 
//console.log(this.RSSholder);	
};

/**
*  clear all the history time ID "distance" data
* @method write
*/
identitySelf.prototype.resetIDdata = function() {
//console.log('reset the holder ');	
	this.RSSholder  = {}; 
//console.log(this.RSSholder);	
};


/**
* a custom emitter 
* @method nobleBT
*/
identitySelf.prototype.nobleBT = function() {

	//console.log(noble);
	noble.on('stateChange', function(state) {
	  if (state === 'poweredOn') {
	    noble.startScanning();
	  } else {
	    noble.stopScanning();
	  }
	});

	// keep object of sensortag ID. time, RSSI
	var logRSSI = {};
	var daterssiholder = [];
		
	noble.on('discover', function(peripheral) {
		
		// set emitter first time sensorID has been discover
		setInterval(function(){  //myTimer()

		var sensordate = new Date();
//console.log(sensordate);		
//console.log('signal strenght = distance');	
//console.log(peripheral.rssi);
//console.log('peripheral discovered (' + peripheral.uuid+ '):' + peripheral.advertisement.localName);	
		daterssiholder.push(sensordate.getTime());
		daterssiholder.push(peripheral.rssi);		
		
		logRSSI[peripheral.uuid] = daterssiholder;
//console.log(logRSSI);
		idsetup.setID(sensordate.getTime(), logRSSI);

		daterssiholder = [];
		//logRSSI = {};
//console.log(sensordate.getTime());			
//console.log(RSSholder[sensordate.getTime()]);		

		},250);
		
	});

};	

module.exports = identitySelf;
