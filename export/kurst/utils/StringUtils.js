class StringUtils {
    static strToXML(xmlString) {
        return (new DOMParser()).parseFromString(xmlString, "text/xml");
    }
    static occurrences(str, subString, allowOverlapping = false) {
        str += "";
        subString += "";
        if (subString.length <= 0)
            return str.length + 1;
        var n = 0;
        var pos = 0;
        var step = (allowOverlapping) ? (1) : (subString.length);
        while (true) {
            pos = str.indexOf(subString, pos);
            if (pos >= 0) {
                n++;
                pos += step;
            }
            else {
                break;
            }
        }
        return (n);
    }
    static isString(value) {
        return Object.prototype.toString.apply(value, []) === '[object String]';
    }
    static fromCharCodeArray(array) {
        return String.fromCharCode.apply(null, array);
    }
    static endsWith(string, value) {
        return string.substring(string.length - value.length, string.length) === value;
    }
    static startsWith(string, value) {
        return string.substr(0, value.length) === value;
    }
    static copyTo(source, sourceIndex, destination, destinationIndex, count) {
        for (var i = 0; i < count; i++) {
            destination[destinationIndex + i] = source.charCodeAt(sourceIndex + i);
        }
    }
    static repeat(value, count) {
        return Array(count + 1).join(value);
    }
    static stringEquals(val1, val2) {
        return val1 === val2;
    }
    static capitaliseFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    static capitaliseAllWords(str) {
        var a = str.split(' ');
        var l = a.length;
        var result = '';
        for (var c = 0; c < l; c++) {
            result += ' ' + StringUtils.capitaliseFirstLetter(a[c].toLowerCase());
        }
        return result;
    }
}
