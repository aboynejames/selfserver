/**
* Self Server
*
* routes to request

* @method router
*
* @package    Self Engine opensource  project
* @copyright  Copyright (c) 2012 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
* @version    $Id$
*/

var util = require('util');

/**
* @method route
*/
function route(handle, pathname, response, request, couchin, couchlive, authom, emaillive) {

	var firstpath=pathname.split("/"); 
	var pathlive = '/'+firstpath[1];

	if (typeof handle[pathlive] === 'function') {
		handle[pathlive](firstpath, response, request, couchin, couchlive, authom, emaillive);
	}
	else 
	{
		response.writeHead(404, {"Content-Type": "text/html"});
		response.write("404 Not found");
		response.end();
	}
}


exports.route = route;