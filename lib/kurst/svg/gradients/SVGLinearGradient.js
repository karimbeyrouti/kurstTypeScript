class SVGLinearGradient extends SVGGradientBase {
    constructor() {
        super();
        this.initElement('svg:linearGradient');
    }
    set x1(val) {
        this.element.setAttribute('x1', String(val));
    }
    get x1() {
        return this.element.getAttribute('x1');
    }
    set y1(val) {
        this.element.setAttribute('y1', String(val));
    }
    get y1() {
        return this.element.getAttribute('y1');
    }
    set x2(val) {
        this.element.setAttribute('x2', String(val));
    }
    get x2() {
        return this.element.getAttribute('x2');
    }
    set y2(val) {
        this.element.setAttribute('y2', String(val));
    }
    get y2() {
        return this.element.getAttribute('y2');
    }
}
