import Random from './Random';
class NumberUtils {
    static seed(seed, flag = true) {
        NumberUtils.psrnd = flag;
        if (NumberUtils.rnd) {
            NumberUtils.rnd.seed(seed);
        }
        else {
            NumberUtils.rnd = new Random(seed);
        }
    }
    static getRandomInt(min, max) {
        return NumberUtils.psrnd ?
            Math.floor(NumberUtils.rnd.next() * (max - min + 1)) + min :
            Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static flipWeightedCoin(percentage) {
        return (NumberUtils.random(0, 1) <= percentage);
    }
    static flipCoin() {
        return (NumberUtils.getRandomInt(0, 2) <= 1);
    }
    static random(low = 0, high = 1) {
        if (low == 0 && high == 1) {
            return NumberUtils.psrnd ? NumberUtils.rnd.next() : Math.random();
        }
        if (low >= high) {
            return low;
        }
        var diff = high - low;
        return NumberUtils.psrnd ?
            (NumberUtils.rnd.next() * diff) + low :
            (Math.random() * diff) + low;
    }
    static constrain(v, min, max) {
        if (v < min) {
            v = min;
        }
        else if (v > max) {
            v = max;
        }
        return v;
    }
    static decimalToHex(d, padding) {
        var hex = d.toString(16).toUpperCase();
        padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
        while (hex.length < padding) {
            hex = "0" + hex;
        }
        return hex;
    }
    static rgbToHex(rgb) {
        var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
        var result, r, g, b, hex = "";
        if ((result = rgbRegex['exec'](rgb))) {
            r = NumberUtils.componentFromStr(result[1], result[2]);
            g = NumberUtils.componentFromStr(result[3], result[4]);
            b = NumberUtils.componentFromStr(result[5], result[6]);
            hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
        return hex;
    }
    static componentFromStr(numStr, percent = false) {
        var num = Math.max(0, parseInt(numStr, 10));
        return percent ? Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
    }
    static degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }
    static radToDeg(rad) {
        return rad * (180 / Math.PI);
    }
}
NumberUtils.psrnd = false;
