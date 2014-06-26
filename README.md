SelfServer
==========

The SelfServer works with the SelfEngine https://github.com/aboynejames/selfengine 


Hosting a SelfServer
============

In the Cloud
--------------------

1. Upload the files (node.js hosting required)

2. npm install package.json (or install node modules individually)

3. run in root mode:  sudo bash

4. create a  settings.js file from the settings-sample.js  file 

	- add couchdb username, password
	- email provider (not active at present)
	- hosting URL of  1. selfengine URL  (other apps location comin soon)
	- third party authentication e.g. facebook, twitter  ID's and secrets (from a developer account with those services)

5.    node index.js   (or use  forever node module or equivilant)


On a SportsPi  (raspberry pi)
-------------------------------------------

1. Upload / transfer files to a raspberry pi

2. Ensure you have node.js installed (setup up guide    ) and Couchdb.

3.  npm install package.json (or install node modules individually)

4. create a  settings.js file from the settings-sample.js  file 

	- add couchdb username, password
	- email provider (not active at present)
	- hosting URL of  1. selfengine URL  (other apps location comin soon)
	- third party authentication e.g. facebook, twitter  ID's and secrets (from a developer account with those services)

5. Note server URL is  http:192.168.1.44:8881  (local version of selfengine has to have some local URL for socket.io)

6. Install node package forever or equivilant

7.  For start of server on pi boot write a /etc/init.d/  files  see example at http://

8. run in root mode   sudo bash

9. node index.js


Android OS
------------------

a work in progress
