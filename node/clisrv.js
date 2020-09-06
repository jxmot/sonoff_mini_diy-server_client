module.exports = (function()  {

    const http = require('http');
    const fs = require('fs');
    const url = require('url');
    const qstr = require('querystring');

    const ccfg = require('./clisrvcfg.js');
    const mini = require('./minidiy.js');
    mini.debug = ccfg.debug;

    clisrv = {
    };

    let server = {};
    let timerid = {};
    let state = 'n/a';

    clisrv.start = function() {
        server = http.createServer(handleRequest);
        // Starts the server.
        server.listen(ccfg.port, function() {
            consolelog("Server is listening on PORT: " + ccfg.port);
        });
    };

    function handleRequest(req, res) {

        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        };

        // Capturing the url the request is made to.
        var urlParts = url.parse(req.url, true);
        var urlQuery = urlParts.query;
        
        // When we visit different urls, the switch statement 
        // call on different functions.
        switch (urlParts.pathname) {
            case '/info':
                consolelog('got info');
                mini.sendCmd('info', null, reply => {
                    res.writeHead(200, headers);
                    res.end(reply);
                    state = JSON.parse(reply).data.switch;
                    if((state === 'off') && 
                       ((timerid._idleTimeout === undefined) || (timerid._idleTimeout === -1)) && 
                       (ccfg.maxtime > 0)) {
                        consolelog('STATE timer started - '+state);
                        timerid = setTimeout(() => {
                            mini.sendCmd('switch', ccfg.nextstate, dummy => {
                                consolelog('ret to STATE = '+ccfg.nextstate);
                            });
                        },ccfg.maxtime);
                    }
                });
                break;

            case '/switch':
                consolelog('got switch');
                state = urlQuery.state;
                if((urlQuery.state === ccfg.timedstate) && (ccfg.maxtime > 0)) {
                    // Start a timer for a configurable
                    // duration. When it expires turn the
                    // Mini back to ON.
                    consolelog('timed STATE = '+ccfg.timedstate);
                    timerid = setTimeout(() => {
                        mini.sendCmd('switch', ccfg.nextstate, dummy => {
                            consolelog('ret to STATE = '+ccfg.nextstate);
                        });
                    }, ccfg.maxtime);
                }
                if((timerid !== {}) && (urlQuery.state === ccfg.nextstate)) {
                    clearTimeout(timerid);
                    timerid = undefined;
                    consolelog('timed STATE cleared');
                }
                mini.sendCmd('switch', urlQuery.state, reply => {
                    res.writeHead(200, headers);
                    res.end(reply);
                });
                break;

        };
    };

    function consolelog(text) {
        if(ccfg.debug) {
            console.log(text);
        }
    };

    return clisrv;
})();
