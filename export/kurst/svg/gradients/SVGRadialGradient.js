class SVGLinearGradient extends SVGGradientBase {
    constructor() {
        super();
        this.initElement('svg:radialGradient');
    }
    set cx(val) {
        this.element.setAttribute('cx', String(val));
    }
    get cx() {
        return this.element.getAttribute('cx');
    }
    set cy(val) {
        this.element.setAttribute('cy', String(val));
    }
    get cy() {
        return this.element.getAttribute('cy');
    }
    set fx(val) {
        this.element.setAttribute('fx', String(val));
    }
    get fx() {
        return this.element.getAttribute('fx');
    }
    set fy(val) {
        this.element.setAttribute('fy', String(val));
    }
    get fy() {
        return this.element.getAttribute('fy');
    }
    set r(val) {
        this.element.setAttribute('r', String(val));
    }
    get r() {
        return this.element.getAttribute('r');
    }
}
