import Point from "../../geom/Point";
class SVGPolygon extends SVGDisplayObjectBase {
    constructor() {
        super();
        this.points = new Array();
        this.initElement('polygon');
    }
    set stroke(val) {
        this.element.setAttribute('stroke', String(val));
    }
    get stroke() {
        return this.element.getAttribute('stroke');
    }
    set strokewidth(val) {
        this.element.setAttribute('stroke-width', String(val));
    }
    get strokewidth() {
        return parseFloat(this.element.getAttribute('stroke-width'));
    }
    set width(val) {
        this.element.setAttribute('width', String(val));
    }
    get width() {
        return this.element.getAttribute('width');
    }
    set height(val) {
        this.element.setAttribute('height', String(val));
    }
    get height() {
        return this.element.getAttribute('height');
    }
    addPoint(x, y) {
        this.points.push(new Point(x, y));
        this.updatePoly();
    }
    updatePoly() {
        var pString = '';
        var l = this.points.length;
        var p;
        for (var c = 0; c < l; c++) {
            p = this.points[c];
            pString += p.x + ',' + p.y + ' ';
        }
        this.element.setAttribute('points', pString);
    }
}
