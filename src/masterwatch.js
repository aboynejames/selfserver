var util = require('util');
var events = require("events");


function MasterWatch(IDclassin) {
	
	this.eventManager = IDclassin;
	events.EventEmitter.call(this);
	
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
		this.idliveorder = this.eventManager.checkSplitIDs('secondpress', this.t);
		
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
*  A press of a stop  button
* @method stopbutton
*/
MasterWatch.prototype.stopbutton = function() {

	

};	


module.exports = MasterWatch;
