/*
    Sonoff Mini Commands - Calls the Node server API 
    with a GET request that triggers Mini API calls.

    Author: https://github.com/jxmot
    Repository: https://github.com/jxmot/sonoff_mini_diy-server_client
*/
const miniURL = 'http://'+cfg.ip+':'+cfg.port;

function miniCmd(func, callback) {
    httpGet(miniURL+func,
        function(resp) {
            callback(resp);
        }
    );
};

function getDeviceInfo(callback) {
    miniCmd('/info', callback);
};

function setMiniON(callback) {
    miniCmd('/switch?state=on', callback);
};

function setMiniOFF(callback) {
    miniCmd('/switch?state=off', callback);
};

function getWiFiSignal(callback) {
    getDeviceInfo(callback);
};


