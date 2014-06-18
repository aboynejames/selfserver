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
  console.log("Request handler 'start' was called.");

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
console.log("Request handler for swimdata called FIRST");	
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
//console.log("Request handler for RACEdata called");
//console.log(fullpath);
//console.log(couchin.resthistory);
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
		couchlive.buildracedata(fullpath, response, request, couchin, couchlive, origin);
	
	}
	
};


/**
*  provide list of knowledge words and relationships
* @method knowledgetemplate
*
*/
function knowledgetemplate(fullpath, response, request, couchin, couchlive, authom) {
console.log("Request handler for KnowledgeTemplates");	
	// first need to check authorisation token for this individual
	var checkpassin = '';
console.log(fullpath[4]);
console.log(couchin.resthistory[fullpath[2]].token);	
	
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
/*
		swimmersin = {"andy":"1234"};
		swimmersback = JSON.stringify(swimmersin);
		response.setHeader("access-control-allow-origin", origin);
		response.writeHead(200, {"Content-Type": "application/json"});
		response.end(swimmersback);  
*/	
	}
};

/**
* controls the syncing of data from local pouchdb to online couchdb
* @method swimdatasave
*
*/
function swimdatasave(fullpath, response, request, couchin, couchlive) {
console.log("saves data back from communication mixer and selfengine");
	var checkpassin = '';
	var livedatabase = couchin.resthistory[fullpath[2]].database;

	if( fullpath[4] === couchin.resthistory[fullpath[2]].token && couchin.resthistory[fullpath[2]] != undefined )
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

		if(request.method == 'POST'){
			var syncdatain = '';
			var cleandata = '';
			request.on('data', function(chunk) {
				syncdatain += chunk;
			
			});	
		
			request.on('end', function() {
				cleandata =  JSON.parse(syncdatain);
			// next make a PUT call to couchdb API
console.log(cleandata);
				// first need to see what type of save  data, id settings etc. and route appropriately
				if(cleandata.bluetoothid)
				{
					function syncUIDcall(livedatabase, callback) {  
						couchlive.getUIDfromcouch(callback);
							
					}  

					syncUIDcall(livedatabase, function(responseuid) {  
console.log(' bt id save');
						//cleandata = {"split":"1334.34"};
						couchlive.syncsave(cleandata, responseuid, livedatabase);
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
				else if(cleandata.swimmerid)
				{
					if(cleandata['name'] ) {		
console.log(' a name save');
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
					else
					{
console.log(' standard save to couchdb');				
						function syncUIDcall(livedatabase, callback) {  
							couchlive.getUIDfromcouch(callback);
							
						}  

						syncUIDcall(livedatabase, function(responseuid) {  
							couchlive.syncsave(cleandata, responseuid, livedatabase);
							syncresponse = {"save":"passed"};
							checksync = JSON.stringify(syncresponse);
							response.setHeader("access-control-allow-origin", origin);
							response.writeHead(200, {"Content-Type": "application/json"});
							response.end(checksync);

						});
						
					}  // closes else	
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
			});
		}
	}	
};

exports.start = start;
//exports.authomevent = authomevent;
exports.logout = logout;
exports.swimdata = swimdata;
exports.racedata = racedata;
exports.knowledgetemplate = knowledgetemplate;
exports.swimdatasave = swimdatasave;