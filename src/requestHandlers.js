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
var sio = require('socket.io');
var settings = require("./settings");

/**
* authom module listener
* @method authomevent
*
*/
function authomevent (fullpath, response, request, couchin, couchlive, authom) {
console.log('authom hander reached'); 
console.log(fullpath);	
	if (fullpath[1] == "auth")
	{
		console.log('authom twitter etc');
		authom.listen(request, response);
	}

}

/**
* process sign in requests
* @method signincheckmepath
*
*/
function signincheckmepath (fullpath, response, request, couchin, couchlive) {

	

}  // closes sigincheck



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

console.log(origin);
console.log(request.method.toUpperCase());
		// Check to see if this is a security check by the browser to
		// test the availability of the API for the client. If the
		// method is OPTIONS, the browser is check to see to see what
		// HTTP methods (and properties) have been granted to the
		// client.
		if (request.method.toUpperCase() === "OPTIONS"){
console.log(request.method.toUpperCase());

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


		// -------------------------------------------------- //
		// -------------------------------------------------- //


		// If we've gotten this far then the incoming request is for
		// our API. For this demo, we'll simply be grabbing the
		// request body and echoing it back to the client.


		// Create a variable to hold our incoming body. It may be
		// sent in chunks, so we'll need to build it up and then
		// use it once the request has been closed.
		var requestBodyBuffer = [];

		// Now, bind do the data chunks of the request. Since we are
		// in an event-loop (JavaScript), we can be confident that
		// none of these events have fired yet (??I think??).
		request.on(
			"data",
			function( chunk ){

				// Build up our buffer. This chunk of data has
				// already been decoded and turned into a string.
				requestBodyBuffer.push( chunk );

			}
		);


		// Once all of the request data has been posted to the
		// server, the request triggers an End event. At this point,
		// we'll know that our body buffer is full.
		request.on(
			"end",
			function(){

				// Flatten our body buffer to get the request content.
				var requestBody = requestBodyBuffer.join( "" );

				// Create a response body to echo back the incoming
				// request.
				var responseBody = (
					"Thank You For The Cross-Domain AJAX Request:\n\n" +
					"Method: " + request.method + "\n\n" +
					requestBody
				);

				// Send the headers back. Notice that even though we
				// had our OPTIONS request at the top, we still need
				// echo back the ORIGIN in order for the request to
				// be processed on the client.
				response.writeHead(
					"200",
					"OK",
					{
						"access-control-allow-origin": origin,
						"content-type": "text/plain",
						"content-length": responseBody.length
					}
				);

				// Close out the response.
				return( response.end( responseBody ) );

			}
		);

} // closes signoutcheck
	
	
/**
* logic to produce list of swimmers
* @method buildswimmers
*
*/
function buildswimmers(firstpath, response, request, couchin) {

	
	}



/**
* loads broadcast file HTML
* @method viewswimtimes
*
*/
function viewswimtimes(fullpath, response) {
      
} // closes function


/**
* controls the syncing of data from local pouchdb to online couchdb
* @method pouchsync
*
*/
function pouchsync(fullpath, response, request, couchin, couchlive) {
			
}  // closes pouchsync

/**
* controls sign up of backup service registration
* @method startbackup
*
*/
function startbackup(fullpath, response, request, couchin, couchlive) {

	
}		


exports.signincheckmepath =  signincheckmepath;
exports.pouchsync = pouchsync;	
exports.startbackup = startbackup;	
exports.authomevent = authomevent;
exports.logout = logout;