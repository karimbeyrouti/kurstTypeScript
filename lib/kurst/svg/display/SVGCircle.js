class SVGCircle extends SVGDisplayObjectBase {
    constructor() {
        super();
        this.initElement('circle');
    }
    set r(val) {
        this.element.setAttribute('r', String(val));
    }
    get r() {
        return parseFloat(this.element.getAttribute('r'));
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
    set cy(val) {
        this.element.setAttribute('cy', String(val));
    }
    get cy() {
        return parseFloat(this.element.getAttribute('cy'));
    }
    set cx(val) {
        this.element.setAttribute('cx', String(val));
    }
    get cx() {
        return parseFloat(this.element.getAttribute('cx'));
    }
}
