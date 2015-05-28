class SVGText extends SVGDisplayObjectBase {
    constructor() {
        super();
        this.initElement('text');
        this.element.setAttribute("pointer-events", "all");
    }
    set font(val) {
        this.element.setAttribute('font-family', val);
    }
    get font() {
        return this.element.getAttribute('font-family');
    }
    set fontsize(val) {
        this.element.setAttribute('font-size', val);
    }
    get fontsize() {
        return this.element.getAttribute('font-size');
    }
    set text(val) {
        this.element.textContent = val;
    }
    get text() {
        return this.element.textContent;
    }
}
