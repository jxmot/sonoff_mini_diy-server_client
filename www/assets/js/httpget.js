/*
    Send a GET request and invoke a 
    callback function when completed.
    Pass the server's response as an 
    object to the callback function.
*/
function httpGet(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var _resp = {};
            var resp = this.responseText;
            resp = resp.replace(/[\n\r]/g, '');
            consolelog('httpGet - ' + resp);
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
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
};

