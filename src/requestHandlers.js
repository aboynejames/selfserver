/**
* Self Engine
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
* authom module listener
* @method authomevent
*
*/
function authomevent (fullpath, response, request, couchin, couchlive, authom) {
//console.log('authom hander reached'); 
//console.log(fullpath);	
	if (fullpath[1] == "auth")
	{
console.log('authom twitter etc');
		authom.listen(request, response);
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
	
		// remove the token log for logout id
		couchin.resthistory['aboynejames'] = '';
	
					correctpwd = {"logout":"success"};
					checkjson = JSON.stringify(correctpwd);
					response.setHeader("access-control-allow-origin", origin);
					response.writeHead(200, {"Content-Type": "application/json"});
					response.end(checkjson);
			
//console.log(couchin.resthistory);		
//	couchin.account['cookieset'] = fullpath[3];
/*	checkusercouch (response, fullpath); 

	function checkusercouch ( response, fullpath) {

				correctpwd = {"signin":"passed"};
		
			if(correctpwd)
				{
					checkjson = JSON.stringify(correctpwd);
					response.setHeader("access-control-allow-origin", origin);
					response.writeHead(200, {"Content-Type": "application/json"});
					response.end(checkjson);
				}
				else {
					correctpwd = {"signin":"wrong"};
					checkjson = JSON.stringify(correctpwd);
					response.setHeader("access-control-allow-origin", origin);
					response.writeHead(200, {"Content-Type": "application/json"});
					response.end(checkjson);
				
				}


	};  // sigincheck close
*/

}  // closes sigincheck


/**
*  provide list of swimmers in network
* @method swimmers
*
*/
function swimmers(fullpath, response, request, couchin, couchlive) {
console.log("Request handler for swimmers list was called");
console.log(fullpath);
//console.log(couchin.resthistory);
	// first need to check authorisation token for this individual
	var checkpassin = '';
	//fullpath[3] = 123412324;
	if( fullpath[4] === couchin.resthistory[fullpath[3]])
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
	couchlive.buildswimmers(fullpath, response, request, couchin, origin);
/*
		swimmersin = {"andy":"1234"};
		swimmersback = JSON.stringify(swimmersin);
		response.setHeader("access-control-allow-origin", origin);
		response.writeHead(200, {"Content-Type": "application/json"});
		response.end(swimmersback);  
*/	
	}
}

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
	if( fullpath[4] === couchin.resthistory[fullpath[2]])
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
		couchlive.buildswimdata(fullpath, response, request, couchin, couchlive, origin);
/*
		swimmersin = {"andy":"1234"};
		swimmersback = JSON.stringify(swimmersin);
		response.setHeader("access-control-allow-origin", origin);
		response.writeHead(200, {"Content-Type": "application/json"});
		response.end(swimmersback);  
*/	
	}
}

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
	if( fullpath[4] === couchin.resthistory[fullpath[2]])
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
		couchlive.buildracedata(fullpath, response, request, couchin, couchlive, origin);
	
	}
	
};


exports.start = start;
exports.authomevent = authomevent;
exports.logout = logout;
exports.swimmers = swimmers;
exports.swimdata = swimdata;
exports.racedata = racedata;