/**
* Self Engine
*
* Start node.js  Server
*
* @package    Train Timer part of open sport project
* @copyright  Copyright (c) 2012 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
* @version    $Id$
*/
var http = require("http");
var url = require("url");
var  sio = require('socket.io');
var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var settings = require("./settings");
var couchDB = require("./couchdb");
var session = require("sesh").session;
var authom = require("authom");


/**
* controls start of node.js server
* @method start
*
*/
function start(route, handle) {

	var couchin = {};
	var couchlive = {};
	couchin = new settings();
	couchlive = new couchDB(couchin);
	
	var app = http.createServer(onRequest).listen(8881);
		
	function onRequest(request, response) {
	
    var pathname = url.parse(request.url).pathname;
  
console.log("Request for " + pathname + " received.");
    route(handle, pathname, response, request, couchin, couchlive, authom);
  }
	
			// data for live two way socket data flow for real time display everywhere
		var io = sio.listen(app);	

	
	authom.createServer({
  service: "facebook",
  id: "764467730233961",
  secret: "be9fcf63ec6a096df981cdb2c35580c7",
  fields: ['name', 'picture']
})


authom.createServer({
  service: "twitter",
  id: "rf0ppl4rsx12MVq4XKMScQ",
  secret: "eM1UzOYreAoIB6QO3sPN7X7Rakbok7EkwU7WCKg"
})

	
authom.on("auth", function(request, response, datain) {
	
	session(request, response, function(request, response){
console.log();
console.log(datain);
console.log(request.session);
		
		if(datain.service == "twitter")
		{
			var idname = datain.data['screen_name'];
		request.session.data.user = datain.data['screen_name'];
		}
		else if (datain.service == "facebook")
		{
			var idname = datain.data['name'];
			request.session.data.user = datain.data['name'];
			
		}
		
    // now we can access request.session
		var setsession = 'req.session: \n' + JSON.stringify(request.session, 2, true) + 'twitter screenname ' + idname;

    // after the session middleware has executed, let's finish processing the request
    //res.writeHead(200, {'Content-Type': 'text/plain'});
    //res.write(setsession);
		var path = 'http://localhost/ll/selfengine/src/index.html?swimmer=' + idname;
    response.writeHead(302, {'Location': path});
		response.end();

  });
	
	
});

authom.on("error", function(request, response, datain){
  data = Buffer("An error occurred: " + JSON.stringify(datain))

  res.writeHead(500, {
    "Content-Type": "text/plain",
    "Content-Length": datain.length
  })

  response.end(datain)
})
	
		
		authom.listen(app);
		
} // closes start function 


exports.start = start;
