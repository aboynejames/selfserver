/**
* Self Sever
*
* deals with site requests
* @class requestHandler
* @package    Self Engine opensource project
* @copyright  Copyright (c) 2012 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
* @version    $Id$
*/
var querystring = require("querystring");
var fs = require("fs");
var util = require('util');
var http = require('http');

/**
* loads up home HTML page
* @method start
*
*/
function start(fullpath, response) {

	var data  = '';

	fs.readFile('./index.html', function(err, data) {
		response.setHeader('Access-Control-Allow-Origin', '*');
		response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
		response.writeHead(200, {"Content-Type": "text/html"});
		response.end(data);
	});	
     
}

/**
* check token and account live
* @method livetokenaccount
*
*/
function livetokenaccount(liveaccount, livetoken, couchin, response,  request) {

	if(couchin.resthistory[liveaccount] != undefined && couchin.resthistory[liveaccount] != undefined )
	{
	
		if(  livetoken === couchin.resthistory[liveaccount].token)
		{
			var result = "passedenter";
			return result;
		
		}
	}
	else
	{
		var result = "nopass";
		return result;
		
	}
     
}

/**
* routes signout requests
* @method logout
*
*/
function logout (fullpath, response, request, couchin, couchlive) {

		// When dealing with CORS (Cross-Origin Resource Sharing)
		// requests, the client should pass-through its origin (the
		// requesting domain). We should either echo that or use *
		// if the origin was not passed.
		var origin = (request.headers.origin || "*");
		// Check to see if this is a security check by the browser to
		// test the availability of the API for the client. If the
		// method is OPTIONS, the browser is check to see to see what
		// HTTP methods (and properties) have been granted to the
		// client.
		if (request.method.toUpperCase() === "OPTIONS"){

			// Echo back the Origin (calling domain) so that the
			// client is granted access to make subsequent requests
			// to the API.
			response.writeHead(
				"204",
				"No Content",
				{
					"access-control-allow-origin": origin,
					"access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
					"access-control-allow-headers": "content-type, accept",
					"access-control-max-age": 10, // Seconds.
					"content-length": 0
				}
			);

			// End the response - we're not sending back any content.
			return( response.end() );
		}
	
		// remove the token log for logout id
		couchin.resthistory['aboynejames'] = '';
	
		correctpwd = {"logout":"success"};
		checkjson = JSON.stringify(correctpwd);
		response.setHeader("access-control-allow-origin", origin);
		response.writeHead(200, {"Content-Type": "application/json"});
		response.end(checkjson);

}  // closes sigincheck

/**
*  provide list training data for individual swimer
* @method swimdata
*
*/
function swimdata(fullpath, response, request, couchin, couchlive, authom) {
	// first need to check authorisation token for this individual
	var checkpassin = '';
	//fullpath[3] = 123412324;
	if( fullpath[4] === couchin.resthistory[fullpath[2]].token)
	{
		checkpassin = 1;
	}
	
	if(checkpassin == 1)
	{
		// When dealing with CORS (Cross-Origin Resource Sharing)
		// requests, the client should pass-through its origin (the
		// requesting domain). We should either echo that or use *
		// if the origin was not passed.
		var origin = (request.headers.origin || "*");
		// Check to see if this is a security check by the browser to
		// test the availability of the API for the client. If the
		// method is OPTIONS, the browser is check to see to see what
		// HTTP methods (and properties) have been granted to the
		// client.
		if (request.method.toUpperCase() === "OPTIONS"){
			// Echo back the Origin (calling domain) so that the
			// client is granted access to make subsequent requests
			// to the API.
			response.writeHead(
				"204",
				"No Content",
				{
					"access-control-allow-origin": origin,
					"access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
					"access-control-allow-headers": "content-type, accept",
					"access-control-max-age": 10, // Seconds.
					"content-length": 0
				}
			);

			// End the response - we're not sending back any content.
			return( response.end() );


		}
		// peform couchdb query to get swimmers + current data(need decide how set limit)
		couchlive.buildswimdata(fullpath, response, request, couchin, couchlive, origin);

	}
};

/**
*  provide list training data for individual swimer
* @method swimdata
*
*/
function racedata(fullpath, response, request, couchin, couchlive, authom) {
	// first need to check authorisation token for this individual
	var checkpassin = '';
	if( fullpath[4] === couchin.resthistory[fullpath[2]].token)
	{
		checkpassin = 1;
	}
	
	if(checkpassin == 1)
	{
		// When dealing with CORS (Cross-Origin Resource Sharing)
		// requests, the client should pass-through its origin (the
		// requesting domain). We should either echo that or use *
		// if the origin was not passed.
		var origin = (request.headers.origin || "*");
		// Check to see if this is a security check by the browser to
		// test the availability of the API for the client. If the
		// method is OPTIONS, the browser is check to see to see what
		// HTTP methods (and properties) have been granted to the
		// client.
		if (request.method.toUpperCase() === "OPTIONS"){


			// Echo back the Origin (calling domain) so that the
			// client is granted access to make subsequent requests
			// to the API.
			response.writeHead(
				"204",
				"No Content",
				{
					"access-control-allow-origin": origin,
					"access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
					"access-control-allow-headers": "content-type, accept",
					"access-control-max-age": 10, // Seconds.
					"content-length": 0
				}
			);

			// End the response - we're not sending back any content.
			return( response.end() );


		}
		// peform couchdb query to get swimmers + current data(need decide how set limit)
		couchlive.buildracedata(fullpath, response, request, couchin, couchlive, origin);
	
	}
	
};


/**
*  provide list of knowledge words and relationships
* @method knowledgetemplate
*
*/
function knowledgetemplate(fullpath, response, request, couchin, couchlive, authom) {
	// first need to check authorisation token for this individual
	var checkpassin = '';
	
	if( fullpath[4] === couchin.resthistory[fullpath[2]].token)
	{
		checkpassin = 1;
	}
	
	if(checkpassin == 1)
	{
		// When dealing with CORS (Cross-Origin Resource Sharing)
		// requests, the client should pass-through its origin (the
		// requesting domain). We should either echo that or use *
		// if the origin was not passed.
		var origin = (request.headers.origin || "*");
//console.log(request.headers.origin);
//console.log("mepath appcache mssesup");

		// Check to see if this is a security check by the browser to
		// test the availability of the API for the client. If the
		// method is OPTIONS, the browser is check to see to see what
		// HTTP methods (and properties) have been granted to the
		// client.
		if (request.method.toUpperCase() === "OPTIONS"){


			// Echo back the Origin (calling domain) so that the
			// client is granted access to make subsequent requests
			// to the API.
			response.writeHead(
				"204",
				"No Content",
				{
					"access-control-allow-origin": origin,
					"access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
					"access-control-allow-headers": "content-type, accept",
					"access-control-max-age": 10, // Seconds.
					"content-length": 0
				}
			);

			// End the response - we're not sending back any content.
			return( response.end() );


		}
		// peform couchdb query to get swimmers + current data(need decide how set limit)
		couchlive.buildKnowledgeTemplate(fullpath, response, request, couchin, couchlive, origin);

	}
};

/**
* controls the syncing of data from local pouchdb to online couchdb
* @method swimdatasave
*
*/
function swimdatasave(fullpath, response, request, couchin, couchlive, authom, emaillive) {

	var checkpassin = '';
	var livedatabase = '';

	// check token and db are live if not tell user to re signing
	var secpassed = livetokenaccount(fullpath[2], fullpath[4], couchin, response, request);
	
	if(secpassed == "passedenter")
	{
		livedatabase = couchin.resthistory[fullpath[2]].database;
                // When dealing with CORS (Cross-Origin Resource Sharing)
                // requests, the client should pass-through its origin (the
                // requesting domain). We should either echo that or use *
                // if the origin was not passed.
                var origin = (request.headers.origin || "*");
                // Check to see if this is a security check by the browser to
                // test the availability of the API for the client. If the
                // method is OPTIONS, the browser is check to see to see what
                // HTTP methods (and properties) have been granted to the
                // client.
                if (request.method.toUpperCase() === "OPTIONS"){
                        // Echo back the Origin (calling domain) so that the
                        // client is granted access to make subsequent requests
                        // to the API.
                        response.writeHead(
                                "204",
                                "No Content",
                                {
                                        "access-control-allow-origin": origin,
                                        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                                        "access-control-allow-headers": "content-type, accept",
                                        "access-control-max-age": 10, // Seconds.
                                        "content-length": 0
                                }
                        );
                        // End the response - we're not sending back any content.
                        return( response.end() );
                }

		if(request.method == 'POST'){
			var syncdatain = '';
			var cleandata = '';
			request.on('data', function(chunk) {
				syncdatain += chunk;
			
			});	
		
			request.on('end', function() {
			cleandata =  JSON.parse(syncdatain);
			// next make a PUT call to couchdb API

				// first need to see what type of save  data, id settings etc. and route appropriately
				if(cleandata.sensorid)
				{
					
					function syncUIDcall(livedatabase, callback) {  
						couchlive.getUIDfromcouch(callback);
							
					}  

					syncUIDcall(livedatabase, function(responseuid) {  

						couchlive.syncsave(cleandata, responseuid, livedatabase);
						// activate sync replication for this pairing
						// first query centralized pariing db and pass on two part of info to filter function
						couchlive.matchpeers(cleandata.sensorid, fullpath, couchin, couchlive, livedatabase); 
						
						// set the id live
						setTimeout(function() {couchlive.setWearableIDs(livedatabase)}, 600);

						syncresponse = {"save":"passedbt"};
						checksync = JSON.stringify(syncresponse);
						response.setHeader("access-control-allow-origin", origin);
						response.writeHead(200, {"Content-Type": "application/json"});
						response.end(checksync);

					});
				}
				// record data manually entered
				else if(cleandata.lifedata)
				{
				
					function syncUIDcall(livedatabase, callback) {  
						couchlive.getUIDfromcouch(callback);
							
					}  

					syncUIDcall(livedatabase, function(responseuid) {  

						//cleandata = {"split":"1334.34"};
						couchlive.syncsave(cleandata, responseuid, livedatabase);
						syncresponse = {"save":"passedrecord"};
						checksync = JSON.stringify(syncresponse);
						response.setHeader("access-control-allow-origin", origin);
						response.writeHead(200, {"Content-Type": "application/json"});
						response.end(checksync);

					});
				}
				// save identity added
				else if(cleandata.networkidentity)
				{
					
					function syncUIDcall(livedatabase, callback) {  
						couchlive.getUIDfromcouch(callback);
							
					}  

					syncUIDcall(livedatabase, function(responseuid) {  
						//cleandata = {"split":"1334.34"};
						couchlive.syncsave(cleandata, responseuid, livedatabase);
						syncresponse = {"save":"passednetworkid"};
						checksync = JSON.stringify(syncresponse);
						response.setHeader("access-control-allow-origin", origin);
						response.writeHead(200, {"Content-Type": "application/json"});
						response.end(checksync);

					});
				}				
				//  need to look at ID tag for data coming in, if matches this account  OK save else need to look up ID of tag and match to an account. If not account log centrally for now (or ask for email for that ID)
				else if(cleandata.name)
				{

					if(cleandata['name'] ) {		

						function syncUIDcall(livedatabase, callback) {  
							couchlive.getUIDfromcouch(callback);
							
						}  
					
						syncUIDcall(livedatabase, function(responseuid) {  

							couchlive.syncsave(cleandata, responseuid, livedatabase);
							
							syncresponse = {"sync":"passed"};
							checksync = JSON.stringify(syncresponse);
							response.setHeader("access-control-allow-origin", origin);
							response.writeHead(200, {"Content-Type": "application/json"});
							response.end(checksync);
						});
					}
				}
				else if(cleandata.sensorengine)
				{
					if(cleandata.sensorengine ) {		

						function syncUIDcall(livedatabase, callback) {  
							couchlive.getUIDfromcouch(callback);
							
						}  
					
						syncUIDcall(livedatabase, function(responseuid) {  

							couchlive.syncsave(cleandata, responseuid, livedatabase);
							
							syncresponse = {"sync":"passedsensor"};
							checksync = JSON.stringify(syncresponse);
							response.setHeader("access-control-allow-origin", origin);
							response.writeHead(200, {"Content-Type": "application/json"});
							response.end(checksync);
						});
					}
					else
					{
					// 
						syncresponse = {"sync":"passed"};
						checksync = JSON.stringify(syncresponse);
						response.setHeader("access-control-allow-origin", origin);
						response.writeHead(200, {"Content-Type": "application/json"});
						response.end(checksync);
					
					}
				}
				else if(cleandata.peernetwork)
				{
					// neet to notify peer network that new data is availabe
					peernoticelist = {};
					//peernoticelist = cleandata.peernetwork;
					peernoticelist.email = "james@aboynejames.co.uk";
					emaillive.sendemail(peernoticelist);
						
					syncresponsee = {"sync":"passed"};
					checksynce = JSON.stringify(syncresponsee);
					response.setHeader("access-control-allow-origin", origin);
					response.writeHead(200, {"Content-Type": "application/json"});
					response.end(checksynce);	
					
				}					
				else if (cleandata.session)
				{
					if(cleandata.session) {	
			
						function syncUIDcall(livedatabase, callback) {  
							couchlive.getUIDfromcouch(callback);
							
						}  

						syncUIDcall(livedatabase, function(responseuid) { 
							
							couchlive.syncsave(cleandata, responseuid, livedatabase);
							
							//notify by email new data has be replicated to their account
												// neet to notify peer network that new data is availabe
							peernoticelist = {};
							//peernoticelist = cleandata.peernetwork;
								// convert swimmer localid ie stopwatch id to an email address
							var matchidtoemail = 'aboynejames@gmail.com';	
							peernoticelist.email = matchidtoemail;//"james@aboynejames.co.uk";
							emaillive.sendemail(peernoticelist);
							
							// this should be move to when couch has confirmed the save
							syncresponse = {"save":"passed"};
							checksync = JSON.stringify(syncresponse);
							response.setHeader("access-control-allow-origin", origin);
							response.writeHead(200, {"Content-Type": "application/json"});
							response.end(checksync);

						});
					}
					
				}  // closes else if	
				else if (cleandata.commid)
				{
					if(cleandata.commid) {	
				
						function syncUIDcall(livedatabase, callback) {  
							couchlive.getUIDfromcouch(callback);
							
						}  

						syncUIDcall(livedatabase, function(responseuid) {  
							couchlive.syncsave(cleandata, responseuid, livedatabase);
							
							
							syncresponse = {"save":"setcommunication"};
							checksync = JSON.stringify(syncresponse);
							response.setHeader("access-control-allow-origin", origin);
							response.writeHead(200, {"Content-Type": "application/json"});
							response.end(checksync);

						});
						
					}
					
				}  // closes else if					
				else if (cleandata.idlocal)
				{
					if(cleandata.idlocal) {	
			
						function syncUIDcall(livedatabase, callback) {  
							couchlive.getUIDfromcouch(callback);
							
						}  

						syncUIDcall(livedatabase, function(responseuid) {  
							couchlive.syncsave(cleandata, responseuid, livedatabase);
							
							syncresponse = {"save":"emailIDpassed"};
							checksync = JSON.stringify(syncresponse);
							response.setHeader("access-control-allow-origin", origin);
							response.writeHead(200, {"Content-Type": "application/json"});
							response.end(checksync);

						});
						
						// save to centralized peermatch database 
						function syncUIDcallpeer(livedatabase, callback) {  
							couchlive.getUIDfromcouch(callback);
							
						}  

						syncUIDcallpeer(livedatabase, function(responseuid) {  

							couchlive.savepeermatch(cleandata, responseuid, livedatabase);					
						
						});							
					}
					
				}  // closes else if				
				else if (cleandata.idlocalnew)
				{
					if(cleandata.idlocalnew) {	


						// neet to notify peer network that new data is available and grant temporary access for 24 hrs
						peernoticelist = {};
						//peernoticelist = cleandata.peernetwork;
						peernoticelist.email = "james@aboynejames.co.uk";
						
						
						function syncUIDcall(livedatabase, callback) {  
							couchlive.getUIDfromcouch(callback);
							
						}  

						syncUIDcall(livedatabase, function(responseuid) {  
							couchlive.syncsave(cleandata, responseuid, livedatabase);
							syncresponse = {"save":"emailIDpassed"};
							checksync = JSON.stringify(syncresponse);
							response.setHeader("access-control-allow-origin", origin);
							response.writeHead(200, {"Content-Type": "application/json"});
							response.end(checksync);

						});
					}
					
				}  // closes else if				

			});
		}
	}	
	else
	{
		// When dealing with CORS (Cross-Origin Resource Sharing)
                // requests, the client should pass-through its origin (the
                // requesting domain). We should either echo that or use *
                // if the origin was not passed.
                var origin = (request.headers.origin || "*");
                // Check to see if this is a security check by the browser to
                // test the availability of the API for the client. If the
                // method is OPTIONS, the browser is check to see to see what
                // HTTP methods (and properties) have been granted to the
                // client.
               if (request.method.toUpperCase() === "OPTIONS"){
                        // Echo back the Origin (calling domain) so that the
                        // client is granted access to make subsequent requests
                        // to the API.
                        response.writeHead(
                                "401",
                                "No Content",
                                {
                                        "access-control-allow-origin": origin,
                                        //"access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                                        "access-control-allow-headers": "content-type, accept",
                                        "access-control-max-age": 10, // Seconds.
                                        "content-length": 0
                                }
                        );
                        // End the response - we're not sending back any content.
                        return( response.end() );
		       
		       
		// put return message to login to account or tell token in now out of date
			//syncresponse = {"access":"fail"};
			//checksync = JSON.stringify(syncresponse);
			//response.setHeader("access-control-allow-origin", origin);
			//response.writeHead(204, {"Content-Type": "application/json"});
			//response.end(checksync);			       
                }		
		
		
	}
};

/**
*  check if email id or data notification should be sent
* @method checkdata
*
*/
function checkdata(fullpath, response, request, couchin, couchlive, authom, emaillive) {

	var checkpassin = '';
	var livedatabase = '';

	// check token and db are live if not tell user to re signing
	var secpassed = livetokenaccount(fullpath[2], fullpath[4], couchin, response, request);

	if(secpassed == "passedenter")
	{
		livedatabase = couchin.resthistory[fullpath[2]].database;
		// set design doc for email status
		couchlive.setdesignEmail(livedatabase);
                // When dealing with CORS (Cross-Origin Resource Sharing)
                // requests, the client should pass-through its origin (the
                // requesting domain). We should either echo that or use *
                // if the origin was not passed.
                var origin = (request.headers.origin || "*");
                // Check to see if this is a security check by the browser to
                // test the availability of the API for the client. If the
                // method is OPTIONS, the browser is check to see to see what
                // HTTP methods (and properties) have been granted to the
                // client.
                if (request.method.toUpperCase() === "OPTIONS"){
                        // Echo back the Origin (calling domain) so that the
                        // client is granted access to make subsequent requests
                        // to the API.
                        response.writeHead(
                                "204",
                                "No Content",
                                {
                                        "access-control-allow-origin": origin,
                                        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                                        "access-control-allow-headers": "content-type, accept",
                                        "access-control-max-age": 10, // Seconds.
                                        "content-length": 0
                                }
                        );
	
                        // End the response - we're not sending back any content.
                        return( response.end() );
                }

		if(request.method == 'POST'){
			var syncdatain = '';
			var cleandata = '';
			request.on('data', function(chunk) {
				syncdatain += chunk;
			
			});	
		
			request.on('end', function() {
				cleandata =  JSON.parse(syncdatain);
			
				// next make a PUT call to couchdb API
				// first need to see what type of save  data, id settings etc. and route appropriately
				if(cleandata == "checkemail")
				{	
					// query couchdb for email/data status
					couchlive.getEmailIDcouchdb(cleandata, fullpath,  response, origin, couchin,  couchlive, emaillive);	
					
				}					
			});
		}	
	}		
};

exports.start = start;
exports.logout = logout;
exports.swimdata = swimdata;
exports.racedata = racedata;
exports.knowledgetemplate = knowledgetemplate;
exports.swimdatasave = swimdatasave;
exports.checkdata = checkdata;