'use strict';
/*
    This is the API server side in the Sonoff Mini project.

    Author: https://github.com/jxmot
    Repository: https://github.com/jxmot/sonoff_mini_diy-server_client
*/
// Run-Time Logging
const Log = require('simple-text-log');
const logopt = require('./runlogopt.js');
let logOut = null;
if(logopt.logenab === true) logOut = new Log(logopt);
// simple-text-log is small, about 14k. so even if 
// it's not used there's very little impact from it 
// being around.
// 
// pass this function around to the other modules
function _log(payload) {
    if(logopt.logenab === true) logOut.writeTS(payload);
    else console.log(payload);
};
// add this file's name to the output
const scriptName = require('path').basename(__filename);
function log(payload) {
    _log(`${scriptName} - ${payload}`);
};
// just an easy to find marker in the log file
log('*******************************************');
log('start');
/*
    Initialize and start the server...
*/
const clisrv = require('./clisrv.js')(_log);
clisrv.start();
