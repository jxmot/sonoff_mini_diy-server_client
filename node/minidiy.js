'use strict';
/*
    Send a Command to the Sonoff Mini

    Author: https://github.com/jxmot
    Repository: https://github.com/jxmot/sonoff_mini_diy-server_client
*/
module.exports = (function(_log, _debug = true) {

    const http = require('http');
    const mcfg = require('./minicfg.js');

    let minidiy = {
        debug: _debug
    };

    // set up run-time logging
    const scriptName = require('path').basename(__filename);
    function log(payload) {
        if(minidiy.debug) _log(`${scriptName} - ${payload}`);
    };

    const miniCmdData = {
        deviceid: '',
        data: {}
    };

    /*
        Send a command to the Mini

        See - http://developers.sonoff.tech/basicr3-rfr3-mini-http-api.html
    */
    minidiy.sendCmd = function(cmd, cdata, callback) {

        switch(cmd) {
            case 'info':
            case 'signal_strength':
                sendMiniCmd(cmd, miniCmdData, callback)
                break;

            case 'switch':
                sendMiniCmd(cmd, {data:{switch:cdata}}, callback)
                break;

            case 'startup':
                sendMiniCmd(cmd, {data:{startup:cdata}}, callback)
                break;

            default:
                callback(null);
                break;
        };
    };

    // http://developers.sonoff.tech/basicr3-rfr3-mini-http-api.html
    function sendMiniCmd(cmd, args, callback) {

        let mdata = Object.assign(miniCmdData, args);
        let cdata = JSON.stringify(mdata);
        log(`sendMiniCmd(): cmd = ${cmd}`);

        let req = http.request(
        {
            host: mcfg.ip,
            port: mcfg.port,
            path: mcfg.basepath + cmd,
            method: 'POST',
            headers: {
                'Content-Length': Buffer.byteLength(cdata),
                'Content-Type': 'application/json,charset=utf-8',
            },
        },
        res => {
            log(`sendMiniCmd(): cmd = ${cmd} statusCode = ${res.statusCode}`);

            let data = '';
            res.on('data', _data => {
                data += _data;
            });
        
            res.on('end', () => {
                log('data = '+data);
                callback(data);
            });
        });
        req.on('error', console.error);
        req.write(cdata);
        req.end();
    };

    return minidiy;
});
