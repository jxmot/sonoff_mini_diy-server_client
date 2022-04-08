'use strict';
/*
    Cient Side Configuration

    Author: https://github.com/jxmot
    Repository: https://github.com/jxmot/sonoff_mini_diy-server_client
*/
module.exports = {
    // use this port with the client -
    //      http://127.0.0.1:6464/.....
    // "mini" on a phone pad
    port: '6464',
    // the state with a timeout (must be 
    // set to something if maxtime == 0)
    timedstate: 'off',
    // when the timeout expires this is 
    // next state (usually the opposite 
    // of timedstate)
    nextstate: 'on',
    // set to 0 to disable timeout
    //      36000000 = 10 hours
    //      28800000 = 8 hours 
    //      10800000 = 3 hours
    //       3600000 = 1 hour
    maxtime: 10800000,
    // enable/disable logging output
    debug: true
};
