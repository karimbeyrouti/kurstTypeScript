class SVGRectangle extends SVGDisplayObjectBase {
    constructor() {
        super();
        this.initElement('rect');
    }
    set widthp(val) {
        this._widthP = val;
        this.width = String(val) + '%';
    }
    get widthp() {
        return this._widthP;
    }
    set heightp(val) {
        this._heightP = val;
        this.height = String(val) + '%';
    }
    get heightp() {
        return this._heightP;
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
    set ry(val) {
        this.element.setAttribute('ry', String(val));
    }
    get ry() {
        return parseFloat(this.element.getAttribute('ry'));
    }
    set rx(val) {
        this.element.setAttribute('rx', String(val));
    }
    get rx() {
        return parseFloat(this.element.getAttribute('rx'));
    }
}
