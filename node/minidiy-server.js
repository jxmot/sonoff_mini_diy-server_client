'use strict';
/*
    https://github.com/jxmot/sonoff_mini_diy-server_client

    This is the API server side in the Sonoff Mini project.
*/
// Run-Time Logging
const Log = require('simple-text-log');
const logOut = new Log(require('./runlogopt.js'));

var logoutin = true;
// pass this function around to the other modules
function _log(payload) {
    if(logoutin === true) logOut.writeTS(payload);
    else console.log(payload);
};
// add this file's name to the output
const scriptName = require('path').basename(__filename);
function log(payload) {
    _log(`${scriptName} - ${payload}`);
};

log('*******************************************');
log('start');

/*
    Initialize and start the server...
*/
const clisrv = require('./clisrv.js')(_log);
clisrv.start();
