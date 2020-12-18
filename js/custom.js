function injectCustomJs(jsPath) {
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function() {
        // 放在页面不好看，执行完后移除掉
        this.parentNode.removeChild(this);
    };
    if (document.head) {
        document.head.appendChild(temp);
    } else {
        document.body.appendChild(temp);
    }
}


setTimeout(() => {
    injectCustomJs()
}, 1000)