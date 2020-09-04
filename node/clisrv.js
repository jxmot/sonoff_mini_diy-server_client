module.exports = (function()  {

    const http = require('http');
    const fs = require('fs');
    const url = require('url');
    const qstr = require('querystring');
    const mini = require('./minidiy.js');
    const mcfg = require('./clisrvcfg.js');

    clisrv = {
    };

    let server = {};
    //let mini = {};

    //clisrv.start = function(_mini) {
    clisrv.start = function() {

        //mini = _mini;

        server = http.createServer(handleRequest);
        // Starts our server.
        server.listen(mcfg.port, function() {
            console.log("Server is listening on PORT: " + mcfg.port);
        });
    };

    function handleRequest(req, res) {

        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
        };

        // Capturing the url the request is made to.
        var urlParts = url.parse(req.url, true);
        var urlQuery = urlParts.query;
        
        // When we visit different urls, the switch statement call on different functions.
        switch (urlParts.pathname) {
            case '/info':
                console.log('got info');
                mini.sendCmd('info', null, reply => {
                    res.writeHead(200, headers);
                    //res.end(JSON.stringify({data:'on'}));
                    res.end(reply);
                });
                break;

            case '/switch':
                console.log('got switch');
                mini.sendCmd('switch', urlQuery.state, reply => {
                    res.writeHead(200, headers);
                    //res.end(JSON.stringify({data:'on'}));
                    res.end(reply);
                });
                break;

        };
    };
    return clisrv;
})();
