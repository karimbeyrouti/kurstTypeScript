class SVGBlurFilter extends SVGFilterBase {
    constructor() {
        super();
        this._blurX = 0;
        this._blurY = 0;
        this.feGaussianBlur = this.createSVGElement('feGaussianBlur');
        this.feGaussianBlur.setStdDeviation(this._blurX, this._blurY);
        this.appendFilter(this.feGaussianBlur);
    }
    get blurX() {
        return this._blurX;
    }
    set blurX(val) {
        this._blurX = val;
        this.feGaussianBlur.setStdDeviation(this._blurX, this._blurY);
    }
    get blurY() {
        return this._blurY;
    }
    set blurY(val) {
        this._blurY = val;
        this.feGaussianBlur.setStdDeviation(this._blurX, this._blurY);
    }
}
