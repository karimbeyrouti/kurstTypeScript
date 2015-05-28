import Point from "../geom/Point";
class JSUtils {
    static isAndroid() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    }
    static isBlackBerry() {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    }
    static isIOS() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    }
    static isWindowsMob() {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    }
    static isMobile() {
        return (JSUtils.isAndroid() || JSUtils.isBlackBerry() || JSUtils.isIOS() || JSUtils.isWindowsMob());
    }
    static getId(id) {
        return document.getElementById(id);
    }
    static getClass(className) {
        return document.getElementsByClassName(className);
    }
    static getElementsByClassNme(theClass) {
        var classElms = new Array();
        var node = document;
        var i = 0;
        if (node.getElementsByClassName) {
            var tempEls = node.getElementsByClassName(theClass);
            for (i = 0; i < tempEls.length; i++)
                classElms.push(tempEls[i]);
        }
        else {
            var getclass = new RegExp('\\b' + theClass + '\\b');
            var elems = node.getElementsByTagName('*');
            for (i = 0; i < elems.length; i++) {
                var classes = elems[i]['className'];
                if (getclass.test(classes))
                    classElms.push(elems[i]);
            }
        }
        return classElms;
    }
    static getQueryParams(qs) {
        qs = qs.split("+").join(" ");
        var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
        return params;
    }
    static isFireFox() {
        return (navigator.userAgent.search("Firefox") != -1);
    }
    static isIE() {
        return (navigator.appVersion.indexOf("MSIE") != -1);
    }
    static getIEVersion() {
        if (JSUtils.isIE())
            return parseFloat(navigator.appVersion.split("MSIE")[1]);
        return -1;
    }
    static isFlashEnabled() {
        if (JSUtils.isIE()) {
            var version = JSUtils.getIEVersion();
            if (version > 8) {
                return (window['ActiveXObject'] && (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) != false);
            }
            else {
                try {
                    var aXObj = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    if (aXObj)
                        return true;
                    return false;
                }
                catch (ex) {
                    return false;
                }
            }
            return false;
        }
        else {
            return ((typeof navigator.plugins != "undefined" && typeof navigator.plugins["Shockwave Flash"] == "object") != false);
        }
    }
    static isChromeApp() {
        if (!window.hasOwnProperty('chrome'))
            return false;
        ;
        if (!chrome)
            return false;
        if (!chrome['system'])
            return false;
        return true;
    }
    static getPageOffset() {
        var doc = document.documentElement;
        var body = document.body;
        return new Point((doc && doc.scrollLeft || body && body.scrollLeft || 0), (doc && doc.scrollTop || body && body.scrollTop || 0));
    }
}
