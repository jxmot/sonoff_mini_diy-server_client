'use strict';
/*
*/
module.exports = (function(_log)  {

    const http = require('http');
    const url = require('url');
    const qstr = require('querystring');

    const ccfg = require('./clisrvcfg.js');
    const mini = require('./minidiy.js')(_log, ccfg.debug);

    // set up run-time logging
    const scriptName = require('path').basename(__filename);
    function log(payload) {
        // local control over logging
        if(ccfg.debug) _log(`${scriptName} - ${payload}`);
    };

    let clisrv = {
    };

    let server = {};
    let timerid = {};
    let state = 'n/a';

    clisrv.start = function() {
        server = http.createServer(handleRequest);
        // Starts the server.
        server.listen(ccfg.port, function() {
            log(`Server is listening on PORT: ${ccfg.port}`);
        });
    };

    function secHMS(sec) {
        let sec_num = (typeof sec === 'string' ? sec_num = parseInt(sec) : sec);

        let hours   = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);
    
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}

        return hours+':'+minutes+':'+seconds;
    }

    function handleRequest(req, res) {

        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        };

        let urlParts = url.parse(req.url, true);
        let urlQuery = urlParts.query;
        
        // When we visit different urls, the switch statement 
        // call on different functions.
        log(`handleRequest(): new request - ${urlParts.pathname} ${JSON.stringify(urlParts.query)}`);
        switch (urlParts.pathname) {
            case '/info':
                mini.sendCmd('info', null, reply => {
                    res.writeHead(200, headers);
                    state = JSON.parse(reply).data.switch;
                    if((timerid === undefined) || (timerid === {})) {
                        log(`handleRequest(): ${urlParts.pathname} ERROR - timerid is undefined`);
                    } else {
                        // this is rare, but if the mini's state matches the 
                        // configured timed state then check to see if a timer 
                        // was started. if not then start one.
                        if((state === ccfg.timedstate) && 
                        ((timerid._idleTimeout === undefined) || (timerid._idleTimeout === -1)) && 
                        (ccfg.maxtime > 0)) {
                            log(`handleRequest(): timer restarted STATE = ${state}`);
                            timerid = setTimeout(() => {
                                mini.sendCmd('switch', ccfg.nextstate, dummy => {
                                    log(`handleRequest(): ret to STATE = ${ccfg.nextstate}`);
                                });
                            },ccfg.maxtime);
                        } else {
                            if(state === ccfg.timedstate) {
                                if(ccfg.maxtime > 0) {
                                    // get the seconds remaining until the timeout expires
                                    let remain = Math.ceil((timerid._idleStart + timerid._idleTimeout)/1000 - process.uptime());
                                    log(`handleRequest(): ${remain} remaining for STATE = ${state}`);
                                    let tmp = Object.assign(JSON.parse(reply), {trem:[remain,secHMS(remain)]});
                                    reply = JSON.stringify(tmp);
                                } else {
                                    // no timer, when the mini is in the "timed state" AND 
                                    // the timeout value is 0 then do almost nothing....
                                    log(`handleRequest(): info - permanent STATE = ${state}`);
                                }
                            }
                        }
                    }
                    log(`handleRequest(): mini reply = ${JSON.stringify(reply)}`);
                    res.end(reply);
                });
                break;

            case '/switch':
                state = urlQuery.state;
                if((urlQuery.state === ccfg.timedstate) && (ccfg.maxtime > 0)) {
                    // Start a timer for a configurable
                    // duration. When it expires turn the
                    // Mini back to the other state.
                    log(`handleRequest(): begin timed STATE = ${ccfg.timedstate}`);
                    timerid = setTimeout(() => {
                        mini.sendCmd('switch', ccfg.nextstate, dummy => {
                            log(`handleRequest(): return to STATE = ${ccfg.nextstate}`);
                        });
                    }, ccfg.maxtime);
                }
                if((timerid !== {}) && (urlQuery.state === ccfg.nextstate)) {
                    clearTimeout(timerid);
                    timerid = {};
                    log('handleRequest(): timed STATE cleared');
                }
                mini.sendCmd('switch', urlQuery.state, reply => {
                    res.writeHead(200, headers);
                    if(state === ccfg.timedstate) {
                        if(ccfg.maxtime > 0) {
                            // get the seconds remaining until the timeout expires
                            let remain = Math.ceil((timerid._idleStart + timerid._idleTimeout)/1000 - process.uptime());
                            log(`handleRequest(): ${remain} remaining for STATE = ${state}`);
                            let tmp = Object.assign(JSON.parse(reply), {trem:[remain,secHMS(remain)]});
                            reply = JSON.stringify(tmp);
                        } else {
                            // no timer, when the mini is in the "timed state" AND 
                            // the timeout value is 0 then do almost nothing....
                            log(`handleRequest(): switch - permanent STATE = ${state}`);
                            let tmp = Object.assign(JSON.parse(reply), {trem:[-1,'']});
                            reply = JSON.stringify(tmp);
                        }
                    }
                    log(`handleRequest(): mini reply = ${JSON.stringify(reply)}`);
                    res.end(reply);
                });
                break;
        };
    };
    return clisrv;
});
