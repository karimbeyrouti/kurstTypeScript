class SVGObjectBase extends EventDispatcher {
    constructor() {
        super();
    }
    initElement(elementName) {
        this.element = this.createSVGElement(elementName);
    }
    createSVGElement(elementName) {
        return document.createElementNS('http://www.w3.org/2000/svg', elementName);
    }
    set id(val) {
        this.element.setAttribute('id', val);
    }
    get id() {
        return this.element.getAttribute('id');
    }
}
