import ColorUtils from "../utils/ColorUtils";
class ColorTransform {
    constructor(redMultiplier = 1, greenMultiplier = 1, blueMultiplier = 1, alphaMultiplier = 1, redOffset = 0, greenOffset = 0, blueOffset = 0, alphaOffset = 0) {
        this.redMultiplier = redMultiplier;
        this.greenMultiplier = greenMultiplier;
        this.blueMultiplier = blueMultiplier;
        this.alphaMultiplier = alphaMultiplier;
        this.redOffset = redOffset;
        this.greenOffset = greenOffset;
        this.blueOffset = blueOffset;
        this.alphaOffset = alphaOffset;
    }
    get color() {
        return ((this.redOffset << 16) | (this.greenOffset << 8) | this.blueOffset);
    }
    set color(value) {
        var argb = ColorUtils.float32ColorToARGB(value);
        this.redOffset = argb[1];
        this.greenOffset = argb[2];
        this.blueOffset = argb[3];
        this.redMultiplier = 0;
        this.greenMultiplier = 0;
        this.blueMultiplier = 0;
    }
    concat(second) {
        this.redMultiplier += second.redMultiplier;
        this.greenMultiplier += second.greenMultiplier;
        this.blueMultiplier += second.blueMultiplier;
        this.alphaMultiplier += second.alphaMultiplier;
    }
}
