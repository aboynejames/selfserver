var util = require("util");
var events = require("events");
var noble = require('noble');

function identitySelf() {
	events.EventEmitter.call(this);
	this.nobleBT(0);
	this.RSSholder = {};
	this.excluded = ['9059af0b879c','9059af0b86e2','9059af0b8744','9059af0b869c'];	
};

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

	var liveIDs = Object.keys(this.RSSholder);
	this.emit("IDdata", liveIDs);
};


/**
* a custom emitter 
* @method checkSplitIDs
*/
identitySelf.prototype.checkSplitIDs = function(typeEvent, timeEvent) {
console.log('building in event emitter into a class');

	var datainstant = this.RSSholder
	var distanceOrder = [];
	var btIDlive = Object.keys(datainstant);
	btIDlive.forEach(function(iddistance) {
		distanceOrder.push([iddistance, datainstant[iddistance].slice(-1)[0]]);
		
	});
	// remove button bt sensor id
	var tidylist = [];
	//this.excluded  to FINISH
	distanceOrder.forEach(function(idlist) {
	
		if(idlist[0] == idsetup.excluded[0] || idlist[0] == idsetup.excluded[1] || idlist[0] == idsetup.excluded[2] )
		{
		}
		else
		{
			tidylist.push(idlist);
		}
	
	});	
		
	tidylist.sort(function(a, b) {return a[1] - b[1]})
	// order the arrays distance lowest to highest
	var extractID = tidylist.slice(-1)[0];
	var timeandidentity = {};
	timeandidentity[extractID[0]] = [typeEvent,timeEvent];	
	
	this.emit("dataIDsplit", timeandidentity);
};


/**
*  keeps record of identies "distance" and ID number
* @method write
*/
identitySelf.prototype.setID = function(timein, IDdatain) {
	
	this.RSSholder  = IDdatain; 
	
};

/**
*  clear all the history time ID "distance" data
* @method write
*/
identitySelf.prototype.resetIDdata = function() {

	this.RSSholder  = {}; 

};


/**
* a custom emitter 
* @method nobleBT
*/
identitySelf.prototype.nobleBT = function() {

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

			daterssiholder.push(sensordate.getTime());
			daterssiholder.push(peripheral.rssi);		
			
			logRSSI[peripheral.uuid] = daterssiholder;

			idsetup.setID(sensordate.getTime(), logRSSI);

			daterssiholder = [];
	

		},250);
		
	});

};	

module.exports = identitySelf;
