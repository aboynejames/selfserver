/**
* Self Server
*
* Handles file serves
*
* @property handle
* @type {Object}
* @package    Self Engine open source project
* @copyright  Copyright (c) 2013 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
* @version    v0.2.1
*/
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var util = require('util');

var handle = {};
handle["/"] = requestHandlers.start;
//handle["/signinmepath"] = requestHandlers.signincheckmepath;
//handle["/auth"] = requestHandlers.authomevent;
handle["/logout"] = requestHandlers.logout;
handle["/swimdata"] = requestHandlers.swimdata;
handle["/checkdata"] = requestHandlers.checkdata;	
handle["/racedata"] = requestHandlers.racedata;	
handle["/knowledgetemplate"] = requestHandlers.knowledgetemplate;
handle["/swimdatasave"] = requestHandlers.swimdatasave;

server.start(router.route, handle);
	
