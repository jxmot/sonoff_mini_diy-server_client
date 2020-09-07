module.exports = {
    // use this port with the client -
    //      http://127.0.0.1:6464/.....
    // "mini" on a phone pad
    port: '6464',
    // the state with a timeout
    timedstate: 'off',
    // when the timeout expires this is 
    // next state
    nextstate: 'on',
    // set to 0 to disable timeout
    //      10800000 = 3 hours
    //       3600000 = 1 hour
    maxtime: 10800000,
    // enable/disable console output
    debug: false
};
