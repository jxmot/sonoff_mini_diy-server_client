module.exports = (function() {

    const http = require('http');
    const mcfg = require('./minicfg.js');

    minidiy = {
        debug: false
    };

    const miniCmdData = {
        deviceid: '',
        data: {}
    };

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
        consolelog('cdata = '+cdata);

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
            let data = '';
            res.on('data', _data => {
                data += _data;
            });
        
            res.on('end', () => {
                consolelog('data = '+data);
                callback(data);
            });
        });
        req.write(cdata);
        req.end();
    };

    function consolelog(text) {
        if(minidiy.debug) {
            console.log(text);
        }
    };

    return minidiy;
})();
