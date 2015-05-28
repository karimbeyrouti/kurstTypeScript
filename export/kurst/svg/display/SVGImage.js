class SVGImage extends SVGDisplayObjectBase {
    constructor() {
        super();
        this.initElement('image');
    }
    set src(val) {
        this.element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', val);
    }
    get src() {
        return this.element.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
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
    get alpha() {
        return parseFloat(this.element.getAttribute('opacity'));
    }
    set alpha(val) {
        this.element.setAttribute('opacity', String(val));
    }
}
