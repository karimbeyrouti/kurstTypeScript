import Rectangle from "../geom/Rectangle";
import ColorUtils from "../utils/ColorUtils";
class BitmapData {
    constructor(width, height, transparent = true, fillColor = null) {
        this._locked = false;
        this._transparent = transparent;
        this._imageCanvas = document.createElement("canvas");
        this._imageCanvas.width = width;
        this._imageCanvas.height = height;
        this._context = this._imageCanvas.getContext("2d");
        this._rect = new Rectangle(0, 0, width, height);
        if (fillColor != null)
            this.fillRect(this._rect, fillColor);
    }
    get height() {
        return this._rect.height;
    }
    set height(value) {
        if (this._rect.height == value)
            return;
        this._rect.height = value;
        if (this._locked)
            this._context.putImageData(this._imageData, 0, 0);
        this._imageCanvas.height = value;
        if (this._locked)
            this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
    }
    get rect() {
        return this._rect;
    }
    get transparent() {
        return this._transparent;
    }
    set transparent(value) {
        this._transparent = value;
    }
    get width() {
        return this._rect.width;
    }
    set width(value) {
        if (this._rect.width == value)
            return;
        this._rect.width = value;
        if (this._locked)
            this._context.putImageData(this._imageData, 0, 0);
        this._imageCanvas.width = value;
        if (this._locked)
            this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
    }
    clone() {
        var t = new BitmapData(this.width, this.height, this.transparent);
        t.draw(this);
        return t;
    }
    colorTransform(rect, colorTransform) {
        if (!this._locked)
            this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        var data = this._imageData.data;
        var i, j, index;
        for (i = 0; i < rect.width; ++i) {
            for (j = 0; j < rect.height; ++j) {
                index = (i + rect.x + (j + rect.y) * this.width) * 4;
                data[index] = data[index] * colorTransform.redMultiplier + colorTransform.redOffset;
                data[index + 1] = data[index + 1] * colorTransform.greenMultiplier + colorTransform.greenOffset;
                data[index + 2] = data[index + 2] * colorTransform.blueMultiplier + colorTransform.blueOffset;
                data[index + 3] = data[index + 3] * colorTransform.alphaMultiplier + colorTransform.alphaOffset;
            }
        }
        if (!this._locked) {
            this._context.putImageData(this._imageData, 0, 0);
            this._imageData = null;
        }
    }
    copyChannel(sourceBitmap, sourceRect, destPoint, sourceChannel, destChannel) {
        var imageData = sourceBitmap.imageData;
        if (!this._locked)
            this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        var sourceData = sourceBitmap.imageData.data;
        var destData = this._imageData.data;
        var sourceOffset = Math.round(Math.log(sourceChannel) / Math.log(2));
        var destOffset = Math.round(Math.log(destChannel) / Math.log(2));
        var i, j, sourceIndex, destIndex;
        for (i = 0; i < sourceRect.width; ++i) {
            for (j = 0; j < sourceRect.height; ++j) {
                sourceIndex = (i + sourceRect.x + (j + sourceRect.y) * sourceBitmap.width) * 4;
                destIndex = (i + destPoint.x + (j + destPoint.y) * this.width) * 4;
                destData[destIndex + destOffset] = sourceData[sourceIndex + sourceOffset];
            }
        }
        if (!this._locked) {
            this._context.putImageData(this._imageData, 0, 0);
            this._imageData = null;
        }
    }
    copyPixels(bmpd, sourceRect, destRect) {
        if (bmpd == undefined)
            return;
        if (this._locked) {
            if (this._imageData)
                this._context.putImageData(this._imageData, 0, 0);
            this._copyPixels(bmpd, sourceRect, destRect);
            if (this._imageData)
                this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        }
        else {
            this._copyPixels(bmpd, sourceRect, destRect);
        }
    }
    dispose() {
        this._context = null;
        this._imageCanvas = null;
        this._imageData = null;
        this._rect = null;
        this._transparent = null;
        this._locked = null;
    }
    draw(source, matrix, colorTransform, blendMode, clipRect, smoothing) {
        if (source == undefined)
            return;
        if (this._locked) {
            this._context.putImageData(this._imageData, 0, 0);
            this._draw(source, matrix, colorTransform, blendMode, clipRect, smoothing);
            this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        }
        else {
            this._draw(source, matrix, colorTransform, blendMode, clipRect, smoothing);
        }
    }
    fillRect(rect, color) {
        if (this._locked) {
            if (this._imageData)
                this._context.putImageData(this._imageData, 0, 0);
            this._fillRect(rect, color);
            if (this._imageData)
                this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        }
        else {
            this._fillRect(rect, color);
        }
    }
    getPixel(x, y) {
        var r;
        var g;
        var b;
        var a;
        if (!this._locked) {
            var pixelData = this._context.getImageData(x, y, 1, 1);
            r = pixelData.data[0];
            g = pixelData.data[1];
            b = pixelData.data[2];
            a = pixelData.data[3];
        }
        else {
            var index = (x + y * this._imageCanvas.width) * 4;
            r = this._imageData.data[index + 0];
            g = this._imageData.data[index + 1];
            b = this._imageData.data[index + 2];
            a = this._imageData.data[index + 3];
        }
        if (!a)
            return 0x0;
        return (r << 16) | (g << 8) | b;
    }
    getPixel32(x, y) {
        var r;
        var g;
        var b;
        var a;
        if (!this._locked) {
            var pixelData = this._context.getImageData(x, y, 1, 1);
            r = pixelData.data[0];
            g = pixelData.data[1];
            b = pixelData.data[2];
            a = pixelData.data[3];
        }
        else {
            var index = (x + y * this._imageCanvas.width) * 4;
            r = this._imageData.data[index + 0];
            g = this._imageData.data[index + 1];
            b = this._imageData.data[index + 2];
            a = this._imageData.data[index + 3];
        }
        return (a << 24) | (r << 16) | (g << 8) | b;
    }
    lock() {
        if (this._locked)
            return;
        this._locked = true;
        this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
    }
    setArray(rect, inputArray) {
        if (!this._locked)
            this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        var i, j, index, argb;
        for (i = 0; i < rect.width; ++i) {
            for (j = 0; j < rect.height; ++j) {
                argb = ColorUtils.float32ColorToARGB(inputArray[i + j * rect.width]);
                index = (i + rect.x + (j + rect.y) * this._imageCanvas.width) * 4;
                this._imageData.data[index + 0] = argb[1];
                this._imageData.data[index + 1] = argb[2];
                this._imageData.data[index + 2] = argb[3];
                this._imageData.data[index + 3] = argb[0];
            }
        }
        if (!this._locked) {
            this._context.putImageData(this._imageData, 0, 0);
            this._imageData = null;
        }
    }
    setPixel(x, y, color) {
        var argb = ColorUtils.float32ColorToARGB(color);
        if (!this._locked)
            this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        var index = (x + y * this._imageCanvas.width) * 4;
        this._imageData.data[index + 0] = argb[1];
        this._imageData.data[index + 1] = argb[2];
        this._imageData.data[index + 2] = argb[3];
        this._imageData.data[index + 3] = 255;
        if (!this._locked) {
            this._context.putImageData(this._imageData, 0, 0);
            this._imageData = null;
        }
    }
    setPixel32(x, y, color) {
        var argb = ColorUtils.float32ColorToARGB(color);
        if (!this._locked)
            this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        var index = (x + y * this._imageCanvas.width) * 4;
        this._imageData.data[index + 0] = argb[1];
        this._imageData.data[index + 1] = argb[2];
        this._imageData.data[index + 2] = argb[3];
        this._imageData.data[index + 3] = argb[0];
        if (!this._locked) {
            this._context.putImageData(this._imageData, 0, 0);
            this._imageData = null;
        }
    }
    setPixels(rect, inputByteArray) {
        if (!this._locked)
            this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        inputByteArray.position = 0;
        var i, j, index;
        for (i = 0; i < rect.width; ++i) {
            for (j = 0; j < rect.height; ++j) {
                index = (i + rect.x + (j + rect.y) * this._imageCanvas.width) * 4;
                this._imageData.data[index + 0] = inputByteArray.readUnsignedInt();
                this._imageData.data[index + 1] = inputByteArray.readUnsignedInt();
                this._imageData.data[index + 2] = inputByteArray.readUnsignedInt();
                this._imageData.data[index + 3] = inputByteArray.readUnsignedInt();
            }
        }
        if (!this._locked) {
            this._context.putImageData(this._imageData, 0, 0);
            this._imageData = null;
        }
    }
    unlock() {
        if (!this._locked)
            return;
        this._locked = false;
        this._context.putImageData(this._imageData, 0, 0);
        this._imageData = null;
    }
    _copyPixels(bmpd, sourceRect, destRect) {
        if (bmpd instanceof BitmapData) {
            this._context.drawImage(bmpd.canvas, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
        }
        else if (bmpd instanceof HTMLImageElement || bmpd instanceof HTMLCanvasElement || (bmpd['toDataURL'] != null)) {
            this._context.drawImage(bmpd, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
        }
    }
    _draw(source, matrix, colorTransform, blendMode, clipRect, smoothing) {
        if (source instanceof BitmapData) {
            this._context.save();
            if (matrix != null) {
                this._context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            }
            if (clipRect != null) {
                this._context.drawImage(source.canvas, clipRect.x, clipRect.y, clipRect.width, clipRect.height);
            }
            else {
                this._context.drawImage(source.canvas, 0, 0);
            }
            this._context.restore();
        }
        else if (source instanceof HTMLImageElement || source instanceof HTMLCanvasElement || (source['toDataURL'] != null)) {
            this._context.save();
            if (matrix != null) {
                this._context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            }
            if (clipRect != null) {
                this._context.drawImage(source, clipRect.x, clipRect.y, clipRect.width, clipRect.height);
            }
            else {
                this._context.drawImage(source, 0, 0);
            }
            this._context.restore();
        }
    }
    _fillRect(rect, color) {
        if (color == 0x0 && this._transparent) {
            this._context.clearRect(rect.x, rect.y, rect.width, rect.height);
        }
        else {
            var argb = ColorUtils.float32ColorToARGB(color);
            if (this._transparent) {
                this._context.fillStyle = 'rgba(' + argb[1] + ',' + argb[2] + ',' + argb[3] + ',' + argb[0] / 255 + ')';
            }
            else {
                this._context.fillStyle = 'rgba(' + argb[1] + ',' + argb[2] + ',' + argb[3] + ',1)';
            }
            this._context.fillRect(rect.x, rect.y, rect.width, rect.height);
        }
    }
    get imageData() {
        if (!this._locked)
            return this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        return this._imageData;
    }
    get canvas() {
        return this._imageCanvas;
    }
    get context() {
        return this._context;
    }
}
