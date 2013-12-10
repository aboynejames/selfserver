/**
* Self Engine
*
* Self Server control settings

* @class settings
*
* @package    Self engine open source project
* @copyright  Copyright (c) 2012 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
* @version    $Id$
*/
var settings = function() {
  this.account = {};
	this.account['couchdbname'] = 'selfserver';
	this.account['couchuser'] = '';
	this.account['couchpwd'] = '';
	this.account['cookieset'] = '';
		
	this.account['smtpemail'] = '';  // smtp email account
	this.account['smtppassword'] = '';	
};


module.exports = settings;