import SVGGradientStop from "./../gradients/SVGGradientStop";
class SVGGradientBase extends SVGObjectBase {
    constructor() {
        super();
        this.stops = new Array();
    }
    appendStop(stop) {
        this.element.appendChild(stop.element);
    }
    addStop(offset, color, opacity) {
        this.stops.push(new SVGGradientStop(this, offset, color, opacity));
        return this.stops[this.stops.length - 1];
    }
    getStops() {
        return this.stops;
    }
    getStop(id) {
        if (id < this.stops.length) {
            return this.stops[id];
        }
    }
    set alpha(val) {
        for (var c = 0; c < this.stops.length; c++) {
            this.stops[c].alpha = val;
        }
    }
    set spreadMethod(val) {
        this.element.setAttribute('spreadMethod', String(val));
    }
    get spreadMethod() {
        return this.element.getAttribute('spreadMethod');
    }
}
