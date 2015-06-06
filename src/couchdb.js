var http = require('http');

/**
* Self Server
*
*  couchdb operations
* @class couchdbSettings
*
* @package    Train Timer part of open sport project
* @copyright  Copyright (c) 2012 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
* @version    $Id$
*/
var coudchdbSettings = function(couchin) {
	this.account = {};
	this.couchdbname =  couchin.account['couchdbname'];
	this.couch =  couchin.account['couchuser'];
	this.couchpwd = couchin.account['couchpwd'];
	this.opts = {};
	this.datasourcesii = [];
	this.aggregateIDin = {}; 
};

/**
* couch api options settings
* @method setoptions
*/
coudchdbSettings.prototype.setoptions = function() {

	this.opts = {
		host: 'localhost',
		port: 5984,
		path: '/' + this.couchdbname ,
		auth: this.couch + ':' + this.couchpwd
	};

};

/**
* create a new couchdb
* @method createnewcouchdb
*/
coudchdbSettings.prototype.createnewcouchdb = function (couchlive, newnamecouch, callbackin) {
	
	var options = {
		hostname: 'localhost',
		port: 5984,
		path: '/' + newnamecouch,
		method: 'PUT',
		auth: this.couch + ':' + this.couchpwd
	};
	
	var req = http.request(options, function(res) {

		var resultback = '';
		
		res.setEncoding('utf8');
		res.on('data', function (chunk) {

			resultback += chunk;
		});
	
		res.on('end', function() {
			// first secure the personal data store on couchdb
			couchlive.secureCouchdatastore(newnamecouch);
			var  backdejson = JSON.parse(resultback);
			if(backdejson.ok == "true")
			{			

				couchlive.setWearableIDs(newnamecouch);
			}
			else
			{
				callbackin(resultback);				
			}
		});
		
	});

	req.on('error', function(e) {
//console.log('problem with request: ' + e.message);
	});

	// write data to request body
	req.end();

};


/**
* set list of Live IDs
* @method setID 
*
*/
coudchdbSettings.prototype.setID = function(masterid, idlist) {

	var idlistlive = [];
	this.idlistlive = idlist;

};

/**
* find out all the ID numbers for the signed ID account
* @method aggregateID
*
*/
coudchdbSettings.prototype.aggregateID = function(accountID, wearableid) {

	var setIDforms = {};
	setIDforms['bluetooth'] = wearableid[0].key;
	setIDforms['wearable'] = wearableid[0].value;	
	
	this.aggregateIDin[accountID] = setIDforms;  // connect this identity with their wearable ID's

};

/**
* returns the ID info. BT and wearable for the account live
* @method aggregateIDreturn
*
*/
coudchdbSettings.prototype.aggregateIDreturn = function(accountID) {

	var liveIDset = [];
	
	// hardwired for now
	var testdata1 = ["734081--2124474577","5613079--2124474577"];
	var testdata2 = ["499168--1413255847","4245186--1342236502","1830331-225205658"];
	
	// need to build array of BT id number(s) and wearable ID(s)
	if( typeof this.aggregateIDin[accountID]  != 'undefined')
	{
		liveIDset.push(this.aggregateIDin[accountID].bluetooth);
	}
	if(typeof this.aggregateIDin[accountID] != 'undefined')
	{
		//liveIDset.push(this.aggregateIDin[accountID].wearable[1]);
	}

	return liveIDset;
	
};

/**
* get a UUID from couchdb
* @method getUIDfromcouch
*/
coudchdbSettings.prototype.getUIDfromcouch = function(callbackin) {

	reudata = '';
		
	var opts = {
	host: 'localhost',
	port: 5984,
	path: '/_uuids',
	auth: this.couch + ':' + this.couchpwd
	};

	var requu = http.get(opts, function(resuu) {
		//return testreturn;	
		resuu.setEncoding('utf8');
		resuu.on('data', function(data) {

			var  uuidnew = data;	
			jsonuud =  JSON.parse(uuidnew);

				jsonuud["uuids"].forEach(function(udata){
				
				reudata = udata;	
				});						

			resuu.on('end', function() {
					callbackin(reudata);
			});
		
		});
	});

};  // getuuid close

/**
* logic to produce list of swimmers
* @method checkPersonaldataStore
*
*/
coudchdbSettings.prototype.checkPersonaldataStore = function(couchlive, identityin) {
	// see if a couchdb database exists
	function checkserial(couchlive, identityin, callbackcheck) { 
		couchlive.createnewcouchdb(couchlive, identityin, callbackcheck);

	}; 

	checkserial(couchlive, identityin, function(checkresponse) {

		var parsereponse = JSON.parse(checkresponse);		
		// if no couchdb then setone up.
		if(parsereponse.error == "file_exists")
		{
			// already setup	// check if bluetooth or wearable ID are present?			
			couchlive.setWearableIDs(identityin);
			
		}
		else if(parsereponse.ok == true)
		{
			// first time setup of database acccount on couch		
			couchlive.setdesgnDocuments(identityin); 
			// already setup	// check if bluetooth or wearable ID are present?
			setTimeout(function() {couchlive.setWearableIDs(identityin)},2000);
			// up a replication design document
			setTimeout(function() {couchlive.setdesignReplication(identityin)},6000);
		}
		else
		{
			// need to setup new couchdb personal data account			
			couchlive.createnewcouchdb(identityin);
			
		}
				
	});

	
};

/**
* the default couchdb query design documents created with a new signup
* @method setdesgnDocuments
*
*/
coudchdbSettings.prototype.setdesgnDocuments = function(accountID) {
	
	var firstdesigndoc = "_design/wearableid";
	var designdata = {};
	designdata.language = "javascript";
	var viewdesign = {};
	viewdesign.by_wearableid = {"map" : "function(doc) {if(doc.sensorid){emit(doc.sensorid, doc.sensortype);}}"};
	designdata.views = viewdesign;
	
	this.syncsave(designdata, firstdesigndoc, accountID);
	
	// design doc for training data
	var firstdesigndoc2 = "_design/sessiondata";
	var designdata2 = {};
	designdata.language = "javascript";
	var viewdesign2 = {};
	viewdesign2.by_sessiondata = {"map": "function(doc) {if(doc.swimmerid) { emit(doc.swimmerid, doc.session); }}"};
	designdata2.views = viewdesign2;
	
	this.syncsave(designdata2, firstdesigndoc2, accountID);

	// design doc for training data
	var firstdesigndoc3 = "_design/racesession";
	var designdata3 = {};
	designdata.language = "javascript";
	var viewdesign3 = {};
	viewdesign3.by_racesession = {"map": "function(doc) {if(doc.tooltemplate){emit(doc.lifedata.date, doc.lifedata);}}"};
	designdata3.views = viewdesign3;
	
	this.syncsave(designdata3, firstdesigndoc3, accountID);

};

/**
*  seperate set design doc for email status checks
* @method setdesignEmail
*
*/
coudchdbSettings.prototype.setdesignEmail = function(accountID) {

	var firstdesigndoc4 = "_design/emailstatus";
	var designdata4 = {};
	designdata4.language = "javascript";
	var viewdesign4 = {};
	viewdesign4.by_emailstatus = {"map" : "function(doc) {if (doc.idlocal){emit(doc.idlocal, [doc.email,doc.emailstatus, doc.username,doc.idpouch,doc._rev]);}}"};
	designdata4.views = viewdesign4;
	
	this.syncsave(designdata4, firstdesigndoc4, accountID);	
		
};	

/**
*  seperate set design doc for filters  replication
* @method setdesignReplication
*
*/
coudchdbSettings.prototype.setdesignReplication = function(accountID) {

	var firstdesigndoc5 = "_design/filterdata";
	var designdata5 = {};
	designdata5.language = "javascript";
	var viewdesign5 = {};
	viewdesign5 = {"myfilter": "function(doc, req) {if (doc.data == req.query.data) {return true;} else {return false;}}"};
	designdata5.filters = viewdesign5;
	
	this.syncsave(designdata5, firstdesigndoc5, accountID);	
		
};	

/**
*  secures the couchdb for admin access only
* @method secureCouchdatastore
*
*/
coudchdbSettings.prototype.secureCouchdatastore = function(accountID) {

	var securitysetting =  '{"admins":{"names":[], "roles":[]}, "readers":{"names":["admin"],"roles":["admin"]}}';
	
	var opts = {
	host: 'localhost',
	port: 5984,
	method: 'PUT',
	path: '/' + accountID + '/_security',
	auth: this.couch + ':' + this.couchpwd,
	headers: {}
	};
	
	// JSON encoding
	opts.headers['Content-Type'] = 'application/json';

	opts.headers['Content-Length'] = securitysetting.length;
	rec_data = '';
		
	var reqc = http.request(opts, function(responsec) {		
		responsec.on('data', function(chunk) {
			rec_data += chunk;
		
		});
						
		responsec.on('end', function() {

		});
	});
				
	reqc.on('error', function(e) {
//console.log("Got error: " + e.message);
	});
	// write the data
	if (opts.method == 'PUT') {
//console.log('start of write admin sec');
		reqc.write(securitysetting);
	}
	reqc.end();		
	
};	

/**
* set the wearable IDs for the account after query to couchdb
* @method setWearableIDs
*
*/
coudchdbSettings.prototype.setWearableIDs = function(accountID) {
		
	getwearableIDcouchdb (this);

	function getwearableIDcouchdb (liveObject) {
		
		formstartingIDs = {};
		buildpathurl = '';

		buildpathurl = '/' + accountID + '/_design/wearableid/_view/by_wearableid';		
		var opts = {
			host: 'localhost',
			port: 5984,
			path: buildpathurl,
			auth: liveObject.couch + ':' + liveObject.couchpwd
		};

	var req = http.get(opts, function(resw) {
	var wearables = '';
				//return testreturn;	
			resw.setEncoding('utf8');
			resw.on('data', function(data) {
				wearables += data;	

			});
			resw.on('end', function() {
				// set the id live
				resultwearable = JSON.parse(wearables);

				if(resultwearable.rows.length > 0)
				{						
					liveObject.aggregateID(accountID,resultwearable.rows); 
				}
				else
				{
					// reutrn to client that an Bluetooth ID or wearable ID should be keyin or purchased  (default back to ??)
//console.log('no data id set up');						
				}
									
			});
		});
		
	};  // getSwimmer view from couchdb close
	 					
};
	
/**
* logic to produce list of swimmers
* @method buildswimmers
*
*/
coudchdbSettings.prototype.buildswimmers = function(firstpath, response, request, couchin, origin) {
	// query couch to get existing saved swimmers ids(could be in groups e.g. lane swimmers)	
	getSwimmerscouchdb ();


	function getSwimmerscouchdb () {
		
		formstartingswimmers = {};
		buildpathurl = '';
		
		// convert pathurl in couchdb path url string
		//http://localhost:5984/traintimer/_design/swimmerid/_view/by_swimmerid
		
		buildpathurl = '/' + couchin.account['couchdbname'] + '/_design/swimmerid/_view/by_swimmerid';		
		var opts = {
			host: 'localhost',
			port: 5984,
			path: buildpathurl,
			auth: couchin.account['couchuser'] + ':' + couchin.account['couchpwd']
		};

		var requu = http.get(opts, function(resw) {
		var swlivenew = '';
				//return testreturn;	
			resw.setEncoding('utf8');
			resw.on('data', function(data) {
				swlivenew += data;								
			});
			resw.on('end', function() {					
				resultjs = JSON.parse(swlivenew);
				response.setHeader("access-control-allow-origin", origin);
				response.writeHead(200, {"Content-Type": "application/json"});
				response.end();				
			});
		});
		
	}  // getSwimmer view from couchdb close
				
	function formswimmers(swname, swid) {
			
		var swimstarters = '<li class="liveswimmers"  id="' + swid + '"><a href="" id="testtrain" data-networkidentity="networkidentity">' + 'swimmer' + '</a></li>';
			
		return swimstarters;
	}

};

/**
* chain together a serial of function before a final collection of data
* @method serialflowController
*
*/
coudchdbSettings.prototype.serialflowController = function(item) {

	function controldataflow (dataid, callback) {  
		this.getSwimDatacouchdb(dataid, callback);
	} 	
	
	if(item) {
		controldataflow (item, function(resultback) { 
			dataholder.push(resultback);
			return this.serialflowController(datasources.shift());
		});
	    
		}
		else {
			return this.finalf();
		}
	
	series(datasources.shift());
	
};	

/**
* final function call once all data is collected
* @method finalf
*
*/
coudchdbSettings.prototype.finalf = function(item) {
		// prepare the order and html
		senddataback(dataholder);
};

/**
* call back function for series controller
* @method controldataflow 
*
*/
coudchdbSettings.prototype.controldataflow  = function(dataid, dsi, controldataflow, callback) {

	this.getSwimDatacouchdb (dataid, callback);
};

/**
* return swim training data to client
* @method senddataback 
*
*/
coudchdbSettings.prototype.senddataback  = function(alldata, couchin, fullpath, response, origin, couchlive) {

	// join all data into one array
	var alldatalist = alldata[0].concat(alldata[1]);
	
	// sort in time order, earliest first
	formstartingswimmers['attentionflow'] = '<ol id="previousattention" data-start-id="' + '121' + '" data-end-id="' + '122' + '" ></ol>';
	var sessiondataindex = {};
	// re arrange object for time with session ie time
	alldatalist.forEach(function(rowswimrs){	

		if( typeof rowswimrs != 'undefined')
		{
			if(rowswimrs['value'])
			{
				sessiondataindex[rowswimrs['value'].sessionid] = rowswimrs['value'];
			}
		}		
	});

	pertimedata = Object.keys(sessiondataindex);
	pertimedata = pertimedata.sort(function(a,b){return b-a});
	
	formstartingswimmers.idnumbers = this.aggregateIDreturn(couchin.resthistory[fullpath[2]].database);
	
	pertimedata.forEach(function(sessionorder){
			formstartingswimmers[sessionorder] = couchlive.formswimmers(formstartingswimmers.idnumbers[0], fullpath[2], sessiondataindex[sessionorder], response, origin, couchlive);
		
	});
	
	response.setHeader("access-control-allow-origin", origin);
	response.writeHead(200, {"Content-Type": "application/json"});
	response.end(JSON.stringify(formstartingswimmers));
	
};

/**
* builds a couchdb query for swim training data
* @method getSwimDatacouchdb 
*
*/
coudchdbSettings.prototype.getSwimDatacouchdb  = function(singleid, fullpath, couchin, callbackin) {
	
	formstartingswimmers = {};
	buildpathurl = '';
		
	buildpathurl = '/' + couchin.resthistory[fullpath[2]].database + '/_design/sessiondata/_view/by_sessiondata?key="' + singleid + '"';		
	var opts = {
		host: 'localhost',
		port: 5984,
		path: buildpathurl,
		auth: couchin.account['couchuser'] + ':' + couchin.account['couchpwd']
	};

	var requu = http.get(opts, function(resw) {
		var swlivenew = '';
			//return testreturn;	
			resw.setEncoding('utf8');
			resw.on('data', function(data) {
			swlivenew += data;									
		});
		
		resw.on('end', function() {						
			resultjs = JSON.parse(swlivenew);			
			callbackin(resultjs['rows']);
		
		});				
	});

};

/**
* save id of new id added to peerpair database along with source dbname
* @method savepeermatch
*
*/
coudchdbSettings.prototype.savepeermatch  = function(peermatchdata, UUIDin, databaseid) {
	// form object
	peermatch = {};
	peermatch.stopwatchid = peermatchdata.idlocal;
	peermatch.sourcedb = databaseid;
	// JSON the JS object	
	 data = JSON.stringify(peermatch);
	
	// need to call the couchdb function / class  pass on data and PUT				
	var opts = {
	host: 'localhost',
	port: 5984,
	method: 'PUT',
	path: '/peerpair/' + UUIDin,
	auth: this.couch + ':' + this.couchpwd,
	headers: {}
	};
	
	// JSON encoding
	opts.headers['Content-Type'] = 'application/json';

//console.log(data);
	opts.headers['Content-Length'] = data.length;
	rec_data = '';
		
	var reqc = http.request(opts, function(responsec) {		
		responsec.on('data', function(chunk) {
			rec_data += chunk;
		});
						
		responsec.on('end', function() {
//console.log('save peerpair response');			
//console.log(rec_data);
		});
	});
				
	reqc.on('error', function(e) {
//console.log("Got save error: " + e.message);
	});
	// write the data
	if (opts.method == 'PUT') {

		reqc.write(data);
	}
	reqc.end();	
	
	
};

/**
* match current peer to source data for replication
* @method matchpeers 
*
*/
coudchdbSettings.prototype.matchpeers  = function(peersensorid, fullpath, couchin, couchlive, livedatabase) {

	buildpathurl = '/peerpair/_design/peermatch/_view/by_peermatch?key="' + peersensorid + '"';		

	var opts = {
		host: 'localhost',
		port: 5984,
		path: buildpathurl,
		auth: couchin.account['couchuser'] + ':' + couchin.account['couchpwd']
	};

	var requu = http.get(opts, function(resw) {
		var swlivenew = '';
			//return testreturn;	
			resw.setEncoding('utf8');
			resw.on('data', function(data) {
			swlivenew += data;									
		});
		
		resw.on('end', function() {						
			resultmatch = JSON.parse(swlivenew);
				//set the desing document
				//couchlive.setdesignReplication(livedatabase);
				// set the id to couchdb link and activate replication
				couchlive.dataFilteredreplicate(resultmatch.rows[0].key, livedatabase, resultmatch.rows[0].value);			
		
			});				
	});

};

/**
* builds a couchdb view for knowledge
* @method getKnowledgeDatacouchdb 
*
*/
coudchdbSettings.prototype.getKnowledgeDatacouchdb = function(knowid, fullpath, couchin, callbackin) {
	
	var knowledgeholder = {};
	knowledgeholder.knowledgeword = '/swimknowledge/_design/knowledgeword/_view/by_knowledgeword';
	knowledgeholder.knowledgerelationship = '/swimknowledge/_design/knowledgestart/_view/by_knowledgestart';
	knowledgeholder.recordtemplate = '/swimknowledge/_design/recordtemplate/_view/by_recordtemplate';		
	
	formstartingknowledge = {};
	buildpathurl = '';
				
		var opts = {
			host: 'localhost',
			port: 5984,
			path: knowledgeholder[knowid],
			auth: couchin.account['couchuser'] + ':' + couchin.account['couchpwd']
		};

		var requu = http.get(opts, function(resw) {
			var swlivenew = '';
				//return testreturn;	
				resw.setEncoding('utf8');
				resw.on('data', function(data) {
				swlivenew += data;								
			});
			
			resw.on('end', function() {						
				resultjs = JSON.parse(swlivenew);			
				formstartingknowledge[knowid] = resultjs['rows'];
				callbackin(formstartingknowledge);
			
			});				
		});

};

/**
* return knowledge data to client
* @method sendKnowledgedataback 
*
*/
coudchdbSettings.prototype.sendKnowledgedataback  = function(alldata, couchin, fullpath, response, origin, couchlive) {
//console.log('send data back');
	var returnKnowledge = {};
//console.log(alldata);	
	//var alldatalist = alldata[0].concat(alldata[1]);
	// prepare the knowledge words for transfer back to client
	//alldatalist.forEach(function(knWords){		
	//		if(knWords)
	//		{
	//			returnKnowledge[knWords.key] = knWords.value;
	//		}	
	//	});
//console.log(returnKnowledge);

/*
	var alldatalist = alldata[0].concat(alldata[1]);
//console.log(alldatalist);		
		// sort in time order, earliest first
		formstartingswimmers['attentionflow'] = '<ol id="previousattention" data-start-id="' + '121' + '" data-end-id="' + '122' + '" ></ol>';
		var sessiondataindex = {};
		// re arrange object for time with session ie time
		alldatalist.forEach(function(rowswimrs){		
			if(rowswimrs['value'])
			{
				sessiondataindex[rowswimrs['value'].sessionid] = rowswimrs['value'];
			}	
		});

	pertimedata = Object.keys(sessiondataindex);
	pertimedata = pertimedata.sort(function(a,b){return b-a});
	
	pertimedata.forEach(function(sessionorder){
			formstartingswimmers[sessionorder] = couchlive.formswimmers(couchin.sensorid[fullpath[2]], fullpath[2], sessiondataindex[sessionorder], response, origin, couchlive);
		
	});
*/	
	response.setHeader("access-control-allow-origin", origin);
	response.writeHead(200, {"Content-Type": "application/json"});
	response.end(JSON.stringify(alldata));	
			
};

/**
*  prepare HTML for starting activity attention fix
* @method formswimmers
*
*/
coudchdbSettings.prototype.formswimmers  = function(swid, swimmername, swimdatain, response, origin, couchlive) {
	
	var markanddata = {};
	var displaytime = couchlive.timeformat(swimdatain.splittimes.slice(-1));
	var swimdataelement = '';
	
	swimdataelement += '<li class="attentionhistory" id="historyfix" data-date-id="' + swimdatain.sessionid + '" data-identity-id="' + swid + '">';
	swimdataelement += '<div id="activity" class="activity-id-' + swimdatain.sessionid + '" data-date-id="' + swimdatain.sessionid + '" data-identity-id="' + swid + '" data-activity-status-id="on">';
	swimdataelement += '<div class="socialdata"  id="' + swid + '" data-networkidentity="networkidentity" >' + swimmername + '</div>';

	swimdataelement += '<div class="activitydetail" >';	
	swimdataelement += '<div class="focuselement-h"  id="' + swimdatain.sessionid + '" >Training</div>';

	// first extra object key
	var swimcategories = Object.keys(swimdatain.swiminfo);
	swimcategories.forEach(function(swimcat) {
		if(swimcat != 'swimdate' ) {	
			swimdataelement += '<div id="' + swimdatain.sessionid + '"  class="focuselement-h" data-knowledgeword="' + swimdatain.swiminfo[swimcat] + '">' + swimdatain.swiminfo[swimcat] + '</div> ';
			
		}
		else 
		{
		}
	});	
	

	//swimdataelement += '<a id="analysis"  href=""  data-date-id="' + swimdatain.sessionid + '" data-identity-id="' + swid + '">Analysis</a>';
	swimdataelement += '<div id="datetime" >';
	swimdataelement += '<a id="' + swimdatain.sessionid + '"  href="" class="focuselement-date" data-knowledgeword="' + swimdatain.swiminfo['swimdate'] + '">' + swimdatain.swiminfo['swimdate'] + '</a>';
	swimdataelement += '</div>';
	swimdataelement += '</div>';
	swimdataelement += '<div class="timefocus-fix"><div id="endtime" class="timefocus" data-date-id="' + swimdatain.sessionid + '" data-identity-id="' + swid + '">' + displaytime + '</div>';
	swimdataelement += '</div>';
	
	swimdataelement += '<div id="feedback-" class="feedback-fix" data-date-id="' + swimdatain.sessionid + '" data-identity-id="' + swid + '" >Effort = </div>';
	swimdataelement += '<div id="action-" class="action-fix" data-date-id="' + swimdatain.sessionid + '" data-identity-id="' + swid + '">Future:</div>';
	//swimdataelement += '<div id="clear"></div>';
	swimdataelement += '</div>';

	swimdataelement += '<div class="visualisation-flow" id="anlaysisid-'+ swimdatain.sessionid + '" data-date-id="' + swimdatain.sessionid + '" data-identity-id="' + swid + '">';

	swimdataelement += '</div>';
	swimdataelement += '</li>';
	
	markanddata['attentionmarkup'] = swimdataelement;
	markanddata['knowledgechain'] = swimdatain.swiminfo;
	markanddata['splitdata'] = swimdatain.splittimes;

	return markanddata;
			
};

/**
* format a digital number string to time format presentation
* @method timeformat
*/
coudchdbSettings.prototype.timeformat  = function(ms) {

	function leading0(number){ return number < 10 ? "0" : "";}


	var hundredths = ms;
	mins = parseInt((hundredths / 1000) / 60);
	secs = parseInt((hundredths / 1000) % 60);
	huns = parseInt(hundredths % 1000);
	
	output = leading0(mins) + mins + ":" + leading0(secs) + secs + "." + leading0(huns) + huns;
	
	return output;
};


/**
* find out the knowledge accociated
* @method knowledgeDomains
*
*/
coudchdbSettings.prototype.knowledgeDomains = function(knowledgein) {
	// hardwired for now	
	this.knowledgeDomain = {}; 
	this.knowledgeDomain['swimming'] = ["knowledgeword", "knowledgerelationship", "recordtemplate"];
	this.knowledgeDomain['skiing'] = ["knowledgeword", "knowledgerelationship", "recordtemplate"];

	return this.knowledgeDomain[knowledgein];
};


/**
* logic to produce swimdata for individual swimmer
* @method buildswimdata
*
*/
coudchdbSettings.prototype.buildswimdata = function(fullpath, response, request, couchin, couchlive, origin) {

	// how many id souces of data coming in?
	function keeplocal (userID) {
		this.datasourcesii = couchlive.aggregateIDreturn(userID);
		
		return this.datasourcesii;
	}
		
	var dataholder = [];	
	var datasources = keeplocal(couchin.resthistory[fullpath[2]].database);
	
	if(datasources.length == 0)
	{
	
		var nodataLive = {"swimdatalive":"empty"};
		response.setHeader("access-control-allow-origin", origin);
		response.writeHead(200, {"Content-Type": "application/json"});
		response.end(JSON.stringify(nodataLive));
			
	}
	else
	{
 
		function controldataflow (dataid, callback) {  
			couchlive.getSwimDatacouchdb(dataid, fullpath, couchin, callback);
		} 
		
		function finalf() { 
			// prepare the order and html
			couchlive.senddataback(dataholder, couchin, fullpath, response, origin, couchlive);
		}
		
		
		function series(item) {
			if(item) {
			
			controldataflow (item, function(resultback) { 
				dataholder.push(resultback);
				return series( datasources.shift());
			});
		    
			}
			else {
				return finalf();
			}
		}
		
		series( datasources.shift());
	}
};


/**
* logic to produce swimdata for individual swimmer
* @method buildracedata
*
*/
coudchdbSettings.prototype.buildracedata = function(fullpath, response, request, couchin, couchlive, origin) {
	
	function keeplocal (userID) {

		this.datasourcesii = [1];	
		return this.datasourcesii;		
	}
	
	// how many id souces of data coming in?
	var dataholderb = [];	
	datasourcesb = [1];  //keeplocal(couchin.resthistory[fullpath[2]].database);//couchin.group[fullpath[2]];  //couchin.sensorid[fullpath[2]]; //[ '734081--2124474577', '5613079--2124474577' ];//couchin.sensorid[fullpath[2]];
	
	if(datasourcesb.length == 1)
	{
		
		function controldataflowb (dataidb, callbackb) {
			
			//getSwimDatacouchdbb (dataidb, callbackb);				
			setTimeout(function() {getSwimDatacouchdbb (dataidb, callbackb);},1000);			
		} 
		
		function finalfb() { 
			// prepare the order and html
			//senddatabackb(dataholderb);
			setTimeout(function() {senddatabackb(dataholderb);},600);


		}
		
		
		function seriesb(itemb) {
		
			if(itemb) {
			
			controldataflowb (itemb, function(resultbackb) { 
				dataholderb.push(resultbackb);
				return seriesb(datasourcesb.shift());
			});
		    
			}
			else {
				return finalfb();
			}
		};
		seriesb(datasourcesb.shift());
	
		function getSwimDatacouchdbb (singleidb, callbackinb) {

			formstartingswimmersb = {};
			buildpathurlb = '';
				
			buildpathurlb = '/' + couchin.resthistory[fullpath[2]].database + '/_design/racesession/_view/by_racesession'; //?key="' + singleidb + '"';	
			
			var opts = {
				host: 'localhost',
				port: 5984,
				path: buildpathurlb,
				auth: couchin.account['couchuser'] + ':' + couchin.account['couchpwd']
			};

			var requub = http.get(opts, function(reswb) {
				var swlivenewb = '';
					//return testreturn;	
					reswb.setEncoding('utf8');
					reswb.on('data', function(datab) {
						swlivenewb += datab;	
							
				});
				
				reswb.on('end', function() {						
					resultjsb = JSON.parse(swlivenewb);			
					callbackinb(resultjsb['rows']);
				
				});				
			});

		}			
					
		function  senddatabackb (alldatab) {
			competitiondataindex = {};
			competitiondata = {};

			if(alldatab[0].length == 0)
			{
	
				var noracedataLive = {"swimracedatalive":"empty"};
				response.setHeader("access-control-allow-origin", origin);
				response.writeHead(200, {"Content-Type": "application/json"});
				response.end(JSON.stringify(noracedataLive));
			}
			else
			{
				alldatab[0].forEach(function(rowswimrsc){
		
					if(rowswimrsc)
					{			
						competitiondata['time'] = rowswimrsc.value.time;
						competitiondata['splittimes'] = rowswimrsc.value.splittimes;
						competitiondata['compKnowledge'] = rowswimrsc.value.knowledgewords;
						competitiondataindex[rowswimrsc.key] = competitiondata;
						//competitiondata['compKnowledge'] = rowswimrsc[0]['value'].swiminfo;
						//competitiondata ['competitionData'] = rowswimrsc[0]['value'].splittimes;
						//competitiondataindex[rowswimrsc[0]['value'].sessionid] = competitiondata;
						competitiondata = {};
					}	
				});
							
				response.setHeader("access-control-allow-origin", origin);
				response.writeHead(200, {"Content-Type": "application/json"});
				response.end(JSON.stringify(competitiondataindex));
			}
		}  // getSwimmer view from couchdb close
	
		
	}		
};

/**
* logic to domian knowledge
* @method buildKnowledgeTemplate
*
*/
coudchdbSettings.prototype.buildKnowledgeTemplate = function(fullpath, response, request, couchin, couchlive, origin) {
//console.log("couchdb knowledge template data");
	
	// knowledge sources coming in?
	function keeplocal (kID) {
		this.datasourcesk = couchlive.knowledgeDomains("swimming");

		return this.datasourcesk;
	}
		
	var dataholder = [];	
	var datasourceskin = keeplocal(fullpath[2]);
	
	if(!datasourceskin)
	{
		var nodataLive = {"swimknowledgedatalive":"empty"};
			
		response.setHeader("access-control-allow-origin", origin);
		response.writeHead(200, {"Content-Type": "application/json"});
		response.end(JSON.stringify(nodataLive));
	}
	else
	{
		function controldataflow (dataid, callback) {  
			couchlive.getKnowledgeDatacouchdb(dataid, fullpath, couchin, callback);
		} 
		
		function finalf() { 	
			// prepare the order and html
			couchlive.sendKnowledgedataback(dataholder, couchin, fullpath, response, origin, couchlive);
		}
		
		
		function series(item) {

			if(item) {
			
			controldataflow (item, function(resultback) { 
				dataholder.push(resultback);
				return series(datasourceskin.shift());
			});
		    
			}
			else {
				return finalf();
			}
		}
		
		series(datasourceskin.shift());
	}
};

/**
* builds a couchdb query for list of email identity synced
* @method getEmailIDcouchdb 
*
*/
coudchdbSettings.prototype.getEmailIDcouchdb  = function(singleid, fullpath, response, origin, couchin, couchlive, emaillive) {
		
	buildpathurl = '/' + couchin.resthistory[fullpath[2]].database + '/_design/emailstatus/_view/by_emailstatus';	

	var opts = {
		host: 'localhost',
		port: 5984,
		path: buildpathurl,
		auth: couchin.account['couchuser'] + ':' + couchin.account['couchpwd']
	};

	var requu = http.get(opts, function(resw) {
		var swlivenew = '';
			//return testreturn;	
			resw.setEncoding('utf8');
			resw.on('data', function(data) {
				swlivenew += data;									
			});
		
		resw.on('end', function() {						
			resultemailid = JSON.parse(swlivenew);
			// need to illerate through and send out an email
			resultemailid.rows.forEach(function(stwemailid){
	
				if(stwemailid.value[1] == 0)
				{
					// send welcome email
					var testwelcome = {};
					testwelcome.idlocalnew = stwemailid.value[2];
					testwelcome.email = stwemailid.value[0];
					testwelcome.idstopwatch = stwemailid.key;	
					testwelcome.dbname = couchin.resthistory[fullpath[2]].database;		
					emaillive.sendWelcomemail(testwelcome);
					// update couchdb inform this email address has been sent
					var updateIDdoc = {};
					updateIDdoc.emailstatus = 1;
					updateIDdoc.username = stwemailid.value[2];
					updateIDdoc.idlocal = stwemailid.key;
					updateIDdoc.email = stwemailid.value[0];
					updateIDdoc.idpouch = stwemailid.value[3];	
					//updateIDdoc.startdate = stwemailid.value[2];
					updateIDdoc._rev = stwemailid.value[4];
					couchlive.syncsave(updateIDdoc, stwemailid.id, couchin.resthistory[fullpath[2]].database);	
					
				}
				else
				{
					// an email already sent.
				}
	
			});
			//  send response back that emails have been sent out.
			checkdatasponse = {"check":"newemailids"};
			checksync = JSON.stringify(checkdatasponse);
			response.setHeader("access-control-allow-origin", origin);
			response.writeHead(200, {"Content-Type": "application/json"});
			response.end(checksync);
		
		});				
	});

};

/**
* make put  ie save to couchdb
* @method syncsave
*/
coudchdbSettings.prototype.syncsave = function (datatosaveswim, UUIDin, databaseid) {
console.log('start of couch save');	
	// need to call the couchdb function / class  pass on data and PUT				
	var opts = {
	host: 'localhost',
	port: 5984,
	method: 'PUT',
	path: '/' + databaseid + '/' + UUIDin,
	auth: this.couch + ':' + this.couchpwd,
	headers: {}
	};
	
	// JSON encoding
	opts.headers['Content-Type'] = 'application/json';

	data = JSON.stringify(datatosaveswim);
//console.log(data);
	opts.headers['Content-Length'] = data.length;
	rec_data = '';
		
	var reqc = http.request(opts, function(responsec) {		
		responsec.on('data', function(chunk) {
			rec_data += chunk;
		});
						
		responsec.on('end', function() {
//console.log('save response');			
//console.log(rec_data);
		});
	});
				
	reqc.on('error', function(e) {
//console.log("Got save error: " + e.message);
	});
	// write the data
	if (opts.method == 'PUT') {

		reqc.write(data);
	}
	reqc.end();		

};

/**
* filtered replication
* @method dataFilteredreplicate
*/
coudchdbSettings.prototype.dataFilteredreplicate = function (dataID, dbtargetID, databasesource) {
	
	var buildtarget = 'http://' + this.couch + ':' + this.couchpwd + '@127.0.0.1:5984/' + dbtargetID;
	// filtered replication call				
	var postData = JSON.stringify({
	//"_id":"by_data",	
	"source": databasesource,
	"target":buildtarget,	
	"create_target": true,
	"continuous": true,
	"filter":"filterdata/myfilter",
	"query_params":{"swimmerid":dataID}
	});

	var opts = {
		hostname:'localhost',
		port: 5984,
		path:'/_replicate',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': postData.length},
		auth: this.couch + ':' + this.couchpwd,
	};

	var rep_data = '';
	
	var reqc = http.request(opts, function(responsec) {
//console.log('STATUS: ' + responsec.statusCode);
//console.log('HEADERS: ' + JSON.stringify(responsec.headers));		
		responsec.on('data', function(repmessage) {
//console.log('reply from replication  l l');
				rep_data += repmessage;
//console.log(rep_data);
		});
						
		responsec.on('end', function() {
//console.log('end ofreplication  l l');			
//console.log(rep_data);
		});
	});
				
	reqc.on('error', function(e) {
//console.log("Got error: " + e.message);
	});

	// write data to request body
	reqc.write(postData);
	reqc.end();		
//console.log('end of filtering');
	
};

module.exports = coudchdbSettings;