/*
    Send a GET request with arguments(optional) and
    invoke a callback function when completed.
*/
function _get(func, args, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var _resp = {};
            var resp = this.responseText;
            resp = resp.replace(/[\n\r]/g, '');
            consolelog('_get - ' + resp);
            if(resp.match(/^\{/g)) 
                _resp = JSON.parse(resp);
            else {
                _resp.error = true;
                // https://httpstatuses.com/
                _resp.ret   = 500;
                _resp.msg   = resp;
            }
            callback(_resp);
        }
    };

    if((args === undefined) || (args === null) || (args === '')) {
        xmlhttp.open('GET', `${func}`, true);
    } else {
        xmlhttp.open('GET', `${func}${args}`, true);
    }
    xmlhttp.send();
};

function getDeviceInfo(callback) {
    _get('http://'+cfg.ip+':'+cfg.port+'/info', null,
    function(resp) {
        callback(resp);
    });
};

function setMiniON(callback) {
    _get('http://'+cfg.ip+':'+cfg.port+'/switch', '?state=on',
    function(resp) {
        callback(resp);
    });
};

function setMiniOFF(callback) {
    _get('http://'+cfg.ip+':'+cfg.port+'/switch', '?state=off',
    function(resp) {
        callback(resp);
    });
};

function getWiFiSignal(callback) {
    getDeviceInfo(callback)
};


