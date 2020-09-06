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

        let args = {};

        switch(cmd) {
            case 'info':
            case 'signal_strength':
                sendMiniCmd(cmd, miniCmdData, callback)
                break;

            case 'switch':
                args = {data:{switch:cdata}};
                sendMiniCmd(cmd, args, callback)
                break;

            case 'startup':
                args = {data:{startup:cdata}};
                sendMiniCmd(cmd, args, callback)
                break;

            default:
                callback(null);
                break;
        };
    };

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
