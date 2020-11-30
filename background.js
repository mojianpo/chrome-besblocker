console.log('start BES Blocker');
var _bes_typeMap = {
    "txt"   : "text/plain",
    "html"  : "text/html",
    "css"   : "text/css",
    "js"    : "text/javascript",
    "json"  : "text/json",
    "xml"   : "text/xml",
    "jpg"   : "image/jpeg",
    "gif"   : "image/gif",
    "png"   : "image/png",
    "webp"  : "image/webp"
}

function getBesBlockMap() {
    let data = localStorage.getItem("BesBlockerMap") || '';
    if(data){
        return JSON.parse(data) || []
    } else {
        return []
    } 
}

function setBesBlockMap(arr) {
    localStorage.setItem("BesBlockerMap", JSON.stringify(arr));
}

function getLocalFileUrl(url) {
    var arr = url.split('.');
    var type = arr[arr.length-1];
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, false);
    xhr.send(null);
    var content = xhr.responseText || xhr.responseXML;
    if (!content) {
        return false;
    }
    content = encodeURIComponent(
        type === 'js' ?content.replace(/[\u0080-\uffff]/g, function($0) {
            var str = $0.charCodeAt(0).toString(16);
            return "\\u" + '00000'.substr(0, 4 - str.length) + str;
        }) : content
    );
    return ("data:" + (_bes_typeMap[type] || _bes_typeMap.txt) + ";charset=utf-8," + content);
}

chrome.webRequest.onBeforeRequest.addListener(function (request) {
        var url = request.url;
        var items = getBesBlockMap();
        var flag = false;
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            if(item.checked){
                if(url === item.req && !/^file:\/\//.test(item.res)){
                    url = item.res
                    flag = true;
                }else {
                    var reg = new RegExp(item.req, 'gi');
                    if (typeof item.res === 'string' && reg.test(url)) {
                        if (!/^file:\/\//.test(item.res)) {
                            do {
                                url = url.replace(reg, item.res);
                            } while (reg.test(url))
                        } else {
                            do {
                                url = getLocalFileUrl(url.replace(reg, item.res));
                            } while (reg.test(url))
                        }
                        flag = true;
                    }
                   
               }
           }
        }
        
        if(flag && (url === '403' || url === '400' || url === '500')){
            return {redirectUrl: chrome.extension.getURL("403.html")};
        }
        return url === request.url ? {} : { redirectUrl: url };
    }, {
        urls: [
            "<all_urls>"
        ], 
        types: [
            "main_frame", 
            "sub_frame", 
            "stylesheet", 
            "script", 
            "image", 
            "object", 
            "xmlhttprequest", 
            "other"
        ]
    },
    ["blocking"]
);

console.log('end BES Blocker');

