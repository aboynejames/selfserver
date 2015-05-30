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
		this.t[this.t[2]] = (+new Date()).valueOf();
		this.t[7] = 0;
		// need to allocate an id (UI order or from RSSI retrospective
		this.idliveorder = this.eventManager.checkSplitIDs('startpress', this.t);
				
		this.buttoncounter++;
	}
	else if(buttonID == '9059af0b86e2')
	{
		this.t[3] = (+new Date()).valueOf();
		this.t[7] = this.buttoncounter;
		// calculate teh split time
		var splittime = this.t[3] - this.t[0];
	
		// use radio wireless to get ID automatically other end of the pool
		// create write message to serialport to  salve PI to pick  (for it to run ID pickup via BT)
		this.waitingID.push(this.t);
		// create an event for server listener serial port to pickup and perform a write (witout blocking the IO looop)
		this.emit("contactSlave", splittime);
		// set time and pick up when it returns

		
		this.buttoncounter++;
		
	}
	else if(buttonID == '9059af0b8744')
	{
		this.t[3] = (+new Date()).valueOf();
		this.t[7] = this.buttoncounter;

		// calculate teh split time
		var splittime = this.t[3] - this.t[0];

		this.idliveorder = this.eventManager.checkSplitIDs('startend', this.t);		
		this.buttoncounter++;
		
	}

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

	var extractEvent =  JSON.parse(radioIn);
	
	if(extractEvent[11] == "ST" )
	{

		this.t[this.t[2]] = (+new Date()).valueOf();
		this.t[7] = 0;

		// need to allocate an id (UI order or from RSSI retrospective
		this.idliveorder = this.eventManager.checkSplitIDs('startpress', this.t);
				
		this.buttoncounter++;		
	}
	else if (extractEvent[11] == "E1" )
	{
	
		this.t[3] = (+new Date()).valueOf();
		this.t[7] = this.buttoncounter;
	
		// calculate teh split time
		var splittime = this.t[3] - this.t[0];

		this.idliveorder = this.eventManager.checkSplitIDs('startend', this.t);		
		this.buttoncounter++;		
	}
	else if (extractEvent[11] == "E2" )
	{

		this.t[3] = (+new Date()).valueOf();
		this.t[7] = this.buttoncounter;

		// calculate teh split time
		var splittime = this.t[3] - this.t[0];
		
		// create write message to serialport to  salve PI to pick  (for it to run ID pickup via BT)
		this.emit("slavepiOut", splittime);
		this.buttoncounter++;
			
	}
	
};	

/**
*  A returning ID from Slave 
* @method  returnIDslave
*/
MasterWatch.prototype.returnIDslave = function(returnID) {

	var extractSlaveEvent =  JSON.parse(returnID);
	
	var idotherEnd = Object.keys(extractSlaveEvent);//returnID[Object.keys(returnID)[0]];

	// extract first time in array and then remove TODO ie remove part
	var firstTime =	this.waitingID.slice(-1)[0];

	// match up ID with time top of array
	var otherEndmatch = {};
	otherEndmatch[idotherEnd] = ["secondpress", firstTime];	
	
	this.emit("salveIDtime", otherEndmatch);

};


module.exports = MasterWatch;
