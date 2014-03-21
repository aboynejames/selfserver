var util = require('util');
var events = require("events");


function MasterWatch(IDclassin) {
	
	this.eventManager = IDclassin;
	events.EventEmitter.call(this);
	this.waitingID = [];
	/*
	 * I found this code on a few sites and am unsure of the original author.
	 * If you know please inform me so I can credit them here.
	 *
	 * 0 = start time
	 * 1 = end time
	 * 2 = state (stopped or counting)
	 * 3 = total elapsed time in ms
	 * 4 = timer (interval object)
	 * 5 = epoch (January 1, 1970)
	 * 6 = element (not used here, normally stores the DOM element to update with the time)
	 * 7 = split count
	 */
	this.t = [0, 0, 0, 0, 0, 0, 0, 0];
	this.setbasetime();
	this.buttoncounter = 0;


}

/**
* inherits core emitter class within this class
* @method 
*/
util.inherits(MasterWatch, events.EventEmitter);

/**
*  A press of a start button
* @method startbutton
*/
MasterWatch.prototype.startbutton = function(buttonID) {
	
	
	if(buttonID == '9059af0b879c')
	{
console.log('start button');
		this.t[this.t[2]] = (+new Date()).valueOf();
		this.t[7] = 0;
console.log(this.t);
		// need to allocate an id (UI order or from RSSI retrospective
		this.idliveorder = this.eventManager.checkSplitIDs('startpress', this.t);
				
		this.buttoncounter++;
	}
	else if(buttonID == '9059af0b86e2')
	{
console.log('other end');
		this.t[3] = (+new Date()).valueOf();
		this.t[7] = this.buttoncounter;
console.log(this.t);
		// calculate teh split time
		var splittime = this.t[3] - this.t[0];
console.log('split time calculated');
console.log(splittime);
		//this.idliveorder = this.eventManager.checkSplitIDs('secondpress', this.t);
	
		// use radio wireless to get ID automatically other end of the pool
		// create write message to serialport to  salve PI to pick  (for it to run ID pickup via BT)
		//this.emit("slavepiOut", splittime);
//		this.eventSerial.write("e2event", function(err, results) {
//console.log('err ' + err);
//console.log('results ' + results);
//			});
		this.waitingID.push(this.t);
		// create an event for server listener serial port to pickup and perform a write (witout blocking the IO looop)
		this.emit("contactSlave", splittime);
		// set time and pick up when it returns

		
		this.buttoncounter++;
		
	}
	else if(buttonID == '9059af0b8744')
	{
console.log('start end again');
		this.t[3] = (+new Date()).valueOf();
		this.t[7] = this.buttoncounter;
console.log(this.t);	
		// calculate teh split time
		var splittime = this.t[3] - this.t[0];
console.log('split time calculated');
console.log(splittime);
		this.idliveorder = this.eventManager.checkSplitIDs('startend', this.t);		
		this.buttoncounter++;
		
	}
console.log(this.buttoncounter);
};	
	
/**
*  base time value set
* @method setbasetime
*/
MasterWatch.prototype.setbasetime = function() {

	this.t[5] = new Date(1970, 1, 1, 0, 0, 0, 0).valueOf();

};	


/**
*  A button pressed on the time Event radio 
* @method radiobutton
*/
MasterWatch.prototype.radiobutton = function(radioIn) {
console.log('start radiobutton');	
console.log(radioIn);	
	var extractEvent =  JSON.parse(radioIn);
//console.log(extractEvent);	
	
	if(extractEvent[11] == "ST" )
	{
console.log('start emitter');
		this.t[this.t[2]] = (+new Date()).valueOf();
		this.t[7] = 0;
//console.log(this.t);
		// need to allocate an id (UI order or from RSSI retrospective
		this.idliveorder = this.eventManager.checkSplitIDs('startpress', this.t);
				
		this.buttoncounter++;		
	}
	else if (extractEvent[11] == "E1" )
	{
console.log('end 1');	
		this.t[3] = (+new Date()).valueOf();
		this.t[7] = this.buttoncounter;
//console.log(this.t);	
		// calculate teh split time
		var splittime = this.t[3] - this.t[0];
//console.log('split time calculated');
//console.log(splittime);
		this.idliveorder = this.eventManager.checkSplitIDs('startend', this.t);		
		this.buttoncounter++;		
	}
	else if (extractEvent[11] == "E2" )
	{
console.log('end 2');	
console.log('other end');
		this.t[3] = (+new Date()).valueOf();
		this.t[7] = this.buttoncounter;
//console.log(this.t);
		// calculate teh split time
		var splittime = this.t[3] - this.t[0];
//console.log('split time calculated');
//console.log(splittime);
		
		// create write message to serialport to  salve PI to pick  (for it to run ID pickup via BT)
		this.emit("slavepiOut", splittime);
		
		//this.idliveorder = this.eventManager.checkSplitIDs('secondpress', this.t);
		
		this.buttoncounter++;
			
	}
	

};	

/**
*  A returning ID from Slave 
* @method  returnIDslave
*/
MasterWatch.prototype.returnIDslave = function(returnID) {
console.log('return from slave');	
console.log(returnID);
	var extractSlaveEvent =  JSON.parse(returnID);
	
	var idotherEnd = Object.keys(extractSlaveEvent);//returnID[Object.keys(returnID)[0]];
console.log(idotherEnd);
	// extract first time in array and then remove TODO ie remove part
	var firstTime =	this.waitingID.slice(-1)[0];
console.log(firstTime);	
	// match up ID with time top of array
	var otherEndmatch = {};
	otherEndmatch[idotherEnd] = ["secondpress", firstTime];
console.log(otherEndmatch);		
	
	this.emit("salveIDtime", otherEndmatch);

};


module.exports = MasterWatch;
