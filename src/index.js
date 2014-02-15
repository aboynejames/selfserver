/**
* Self Engine
*
* Handles file serves
*
* @property handle
* @type {Object}
* @package    Self Engine open source project
* @copyright  Copyright (c) 2013 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
* @version    $Id$
*/
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var util = require('util');

var handle = {};
handle["/"] = requestHandlers.start;
//handle["/signinmepath"] = requestHandlers.signincheckmepath;
handle["/auth"] = requestHandlers.authomevent;
handle["/logout"] = requestHandlers.logout;
handle["/swimmers"] = requestHandlers.swimmers;
handle["/swimdata"] = requestHandlers.swimdata;
handle["/racedata"] = requestHandlers.racedata;	

//console.log(util.inspect(router));	

server.start(router.route, handle);