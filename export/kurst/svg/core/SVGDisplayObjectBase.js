import Point from "../../geom/Point";
class SVGDisplayObjectBase extends SVGObjectBase {
    constructor() {
        super();
        this.children = new Array();
        this.registration = new Point();
        this._x = 0;
        this._y = 0;
        this._rotation = 0;
        this._scaleX = 1;
        this._scaleY = 1;
    }
    updateTransform() {
        this.element.setAttribute("transform", "translate(" + this._x + "," + this._y + ")" + " rotate(" + this._rotation + "," + this.registration.x + ", " + this.registration.y + ")" + " scale(" + this._scaleX + "," + this._scaleY + ")");
    }
    draw() {
    }
    fill(colour) {
        if (this.element) {
            this.element.setAttribute('fill', colour);
        }
    }
    remove() {
        if (this.element.parentNode) {
            var n;
            var l = this.parentSVGObject.children.length;
            for (var c = 0; c < l; c++) {
                n = this.parentSVGObject.children[c];
                if (n == this) {
                    this.parentSVGObject.children.splice(c, 1);
                }
            }
            this.parentSVGObject = null;
            this.element.parentNode.removeChild(this.element);
        }
    }
    isChild(obj) {
        var l = this.children.length;
        var o;
        for (var c = 0; c < l; c++) {
            o = this.children[c];
            if (o === obj) {
                return true;
            }
        }
        return false;
    }
    set color(val) {
        this.fill(val);
    }
    get color() {
        return this.element.getAttribute('fill');
    }
    set gradient(grad) {
        if (this.element) {
            this.fill('url(#' + grad.id + ')');
        }
    }
    get parentNode() {
        return this.element.parentNode;
    }
    get fillOpacity() {
        return parseFloat(this.element.getAttribute('fill-opacity'));
    }
    set fillOpacity(val) {
        this.element.setAttribute('fill-opacity', String(val));
    }
    get strokeOpacity() {
        return parseFloat(this.element.getAttribute('stroke-opacity'));
    }
    set strokeOpacity(val) {
        this.element.setAttribute('stroke-opacity', String(val));
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
    set x(val) {
        this._x = val;
        this.updateTransform();
    }
    get x() {
        return this._x;
    }
    set y(val) {
        this._y = val;
        this.updateTransform();
    }
    get y() {
        return this._y;
    }
    set scaleX(val) {
        this._scaleX = val;
        this.updateTransform();
    }
    get scaleX() {
        return this._scaleX;
    }
    set scaleY(val) {
        this._scaleY = val;
        this.updateTransform();
    }
    get scaleY() {
        return this._scaleY;
    }
    set rotation(val) {
        this._rotation = val;
        this.updateTransform();
    }
    get rotation() {
        return this._rotation;
    }
    get width() {
        return this.element.getBoundingClientRect().width;
    }
    get height() {
        return this.element.getBoundingClientRect().height;
    }
    set filter(filter) {
        if (this.element) {
            this.element.setAttribute('filter', 'url(#' + filter.id + ')');
        }
    }
}
