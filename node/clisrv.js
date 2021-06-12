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

    function handleRequest(req, res) {

        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        };

        let urlParts = url.parse(req.url, true);
        let urlQuery = urlParts.query;
        
        // When we visit different urls, the switch statement 
        // call on different functions.
        log(`handleRequest(): ${urlParts.pathname} ${JSON.stringify(urlParts.query)}`);
        switch (urlParts.pathname) {
            case '/info':
                mini.sendCmd('info', null, reply => {
                    res.writeHead(200, headers);
                    res.end(reply);
                    log(`handleRequest(): mini reply = ${JSON.stringify(reply)}`);
                    state = JSON.parse(reply).data.switch;
                    if((state === 'off') && 
                       ((timerid._idleTimeout === undefined) || (timerid._idleTimeout === -1)) && 
                       (ccfg.maxtime > 0)) {
                        log(`handleRequest(): timer started STATE = ${state}`);
                        timerid = setTimeout(() => {
                            mini.sendCmd('switch', ccfg.nextstate, dummy => {
                                log(`handleRequest(): ret to STATE = ${ccfg.nextstate}`);
                            });
                        },ccfg.maxtime);
                    }
                });
                break;

            case '/switch':
                state = urlQuery.state;
                if((urlQuery.state === ccfg.timedstate) && (ccfg.maxtime > 0)) {
                    // Start a timer for a configurable
                    // duration. When it expires turn the
                    // Mini back to ON.
                    log(`handleRequest(): timed STATE = ${ccfg.timedstate}`);
                    timerid = setTimeout(() => {
                        mini.sendCmd('switch', ccfg.nextstate, dummy => {
                            log(`handleRequest(): ret to STATE = ${ccfg.nextstate}`);
                        });
                    }, ccfg.maxtime);
                }
                if((timerid !== {}) && (urlQuery.state === ccfg.nextstate)) {
                    clearTimeout(timerid);
                    timerid = undefined;
                    log('timed STATE cleared');
                }
                mini.sendCmd('switch', urlQuery.state, reply => {
                    res.writeHead(200, headers);
                    res.end(reply);
                });
                break;

        };
    };

    return clisrv;
});
