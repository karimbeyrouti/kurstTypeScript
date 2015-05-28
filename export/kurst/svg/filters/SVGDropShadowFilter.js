class SVGDropShadowFilter extends SVGFilterBase {
    constructor() {
        super();
        this._blurX = 0;
        this._blurY = 0;
        this.feOffset = this.createSVGElement('feOffset');
        this.feOffset.setAttribute('dx', '2');
        this.feOffset.setAttribute('dy', '3');
        this.feBlur = this.createSVGElement('feGaussianBlur');
        this.feBlur.setAttribute('in', 'SourceAlpha');
        this.feBlur.setAttribute('stdDeviation', '3');
        this.cte = this.createSVGElement('feComponentTransfer');
        var fa = this.createSVGElement('feFuncA');
        fa.setAttribute('type', 'linear');
        fa.setAttribute('slope', '0.65');
        this.cte.appendChild(fa);
        var mrgn = this.createSVGElement('feMergeNode');
        var mrgnB = this.createSVGElement('feMergeNode');
        mrgnB.setAttribute('in', 'SourceGraphic');
        var mrg = this.createSVGElement('feMerge');
        mrg.appendChild(mrgn);
        mrg.appendChild(mrgnB);
        this.appendFilter(this.feBlur);
        this.appendFilter(this.feOffset);
        this.appendFilter(this.cte);
        this.appendFilter(mrg);
    }
    get blurX() {
        return this._blurX;
    }
    set blurX(val) {
        this._blurX = val;
    }
    get blurY() {
        return this._blurY;
    }
    set blurY(val) {
        this._blurY = val;
    }
}
