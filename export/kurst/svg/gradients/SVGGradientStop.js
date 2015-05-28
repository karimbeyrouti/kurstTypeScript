class SVGGradientStop extends SVGObjectBase {
    constructor(gradient, offset, color, opacity) {
        super();
        this.initElement('svg:stop');
        if (gradient) {
            this.gradient_ref = gradient;
            this.gradient_ref.appendStop(this);
        }
        this.setData(offset, color, opacity);
    }
    setData(offset, color, opacity) {
        if (offset) {
            this.element.setAttribute('offset', offset);
        }
        if (color) {
            this.element.setAttribute('stop-color', color);
        }
        if (opacity) {
            this.element.setAttribute('stop-opacity', String(opacity));
        }
    }
    set alpha(val) {
        this.element.setAttribute('stop-opacity', String(val));
    }
    get alpha() {
        return parseFloat(this.element.getAttribute('stop-opacity'));
    }
    set color(val) {
        this.element.setAttribute('stop-color', val);
    }
    get color() {
        return this.element.getAttribute('stop-color');
    }
    set offset(val) {
        this.element.setAttribute('offset', val);
    }
    get offset() {
        return this.element.getAttribute('offset');
    }
}
