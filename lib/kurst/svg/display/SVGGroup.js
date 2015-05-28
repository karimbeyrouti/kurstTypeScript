class SVGGroup extends SVGDisplayObjectBase {
    constructor() {
        super();
        this.initElement('g');
    }
    append(obj) {
        if (!this.isChild(obj)) {
            this.children.push(obj);
            obj.parentSVGObject = this;
            this.element.appendChild(obj.element);
        }
        else {
            this.element.appendChild(obj.element);
        }
    }
}
