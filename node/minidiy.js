module.exports = (function()  {

    const http = require('http');
    const mcfg = require('./minicfg.js');

    minidiy = {
    };

    const miniCmdData = {
        deviceid: '',
        data: {}
    };

    minidiy.sendCmd = function(cmd, cdata, callback) {

        let args = {};
        let mdata = {};

        switch(cmd) {
            case 'info':
            case 'signal_strength':
                sendMiniCmd(cmd, JSON.stringify(miniCmdData), callback)
                break;

            case 'switch':
                args = {data:{switch:cdata}};
                mdata = Object.assign(miniCmdData, args);
                console.log('mdata = '+JSON.stringify(mdata));
                sendMiniCmd(cmd, JSON.stringify(mdata), callback)
                break;

            case 'startup':
                args = {data:{startup:cdata}};
                mdata = Object.assign(miniCmdData, args);
                console.log('mdata = '+JSON.stringify(mdata));
                sendMiniCmd(cmd, JSON.stringify(mdata), callback)
                break;

            default:
                callback(null);
                break;
        };
    };

    function sendMiniCmd(cmd, cdata, callback) {
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
                console.log('data = '+data);
                callback(data);
            });
        }
        );
        req.write(cdata);
        req.end();
    };
    return minidiy;
})();
