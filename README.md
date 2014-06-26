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

See https://github.com/aboynejames/sportspi


Android OS
------------------

a work in progress
