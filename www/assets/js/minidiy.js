function getDeviceInfo(callback) {
    httpGet('http://'+cfg.ip+':'+cfg.port+'/info',
    function(resp) {
        callback(resp);
    });
};

function setMiniON(callback) {
    httpGet('http://'+cfg.ip+':'+cfg.port+'/switch?state=on',
    function(resp) {
        callback(resp);
    });
};

function setMiniOFF(callback) {
    httpGet('http://'+cfg.ip+':'+cfg.port+'/switch?state=off',
    function(resp) {
        callback(resp);
    });
};

function getWiFiSignal(callback) {
    getDeviceInfo(callback)
};


