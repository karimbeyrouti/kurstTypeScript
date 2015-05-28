/**
* A Rectangle object is an area defined by its position, as indicated by its
* top-left corner point(<i>x</i>, <i>y</i>) and by its width and its height.
*
*
* <p>The <code>x</code>, <code>y</code>, <code>width</code>, and
* <code>height</code> properties of the Rectangle class are independent of
* each other; changing the value of one property has no effect on the others.
* However, the <code>right</code> and <code>bottom</code> properties are
* integrally related to those four properties. For example, if you change the
* value of the <code>right</code> property, the value of the
* <code>width</code> property changes; if you change the <code>bottom</code>
* property, the value of the <code>height</code> property changes. </p>
*
* <p>The following methods and properties use Rectangle objects:</p>
*
* <ul>
*   <li>The <code>applyFilter()</code>, <code>colorTransform()</code>,
* <code>copyChannel()</code>, <code>copyPixels()</code>, <code>draw()</code>,
* <code>fillRect()</code>, <code>generateFilterRect()</code>,
* <code>getColorBoundsRect()</code>, <code>getPixels()</code>,
* <code>merge()</code>, <code>paletteMap()</code>,
* <code>pixelDisolve()</code>, <code>setPixels()</code>, and
* <code>threshold()</code> methods, and the <code>rect</code> property of the
* BitmapData class</li>
*   <li>The <code>getBounds()</code> and <code>getRect()</code> methods, and
* the <code>scrollRect</code> and <code>scale9Grid</code> properties of the
* DisplayObject class</li>
*   <li>The <code>getCharBoundaries()</code> method of the TextField
* class</li>
*   <li>The <code>pixelBounds</code> property of the Transform class</li>
*   <li>The <code>bounds</code> parameter for the <code>startDrag()</code>
* method of the Sprite class</li>
*   <li>The <code>printArea</code> parameter of the <code>addPage()</code>
* method of the PrintJob class</li>
* </ul>
*
* <p>You can use the <code>new Rectangle()</code> constructor to create a
* Rectangle object.</p>
*
* <p><b>Note:</b> The Rectangle class does not define a rectangular Shape
* display object. To draw a rectangular Shape object onscreen, use the
* <code>drawRect()</code> method of the Graphics class.</p>
*/
import Point from "./Point";
import NumberUtils from "../utils/NumberUtils";
class Rectangle {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    get bottom() {
        return this.y + this.height;
    }
    get bottomRight() {
        if (this._bottomRight == null)
            this._bottomRight = new Point();
        this._bottomRight.x = this.x + this.width;
        this._bottomRight.y = this.y + this.height;
        return this._bottomRight;
    }
    get left() {
        return this.x;
    }
    get right() {
        return this.x + this.width;
    }
    get size() {
        if (this._size == null)
            this._size = new Point();
        this._size.x = this.width;
        this._size.y = this.height;
        return this._size;
    }
    get top() {
        return this.y;
    }
    get topLeft() {
        if (this._topLeft == null)
            this._topLeft = new Point();
        this._topLeft.x = this.x;
        this._topLeft.y = this.y;
        return this._topLeft;
    }
    clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }
    contains(x, y) {
        return (this.x <= x && this.x + this.width >= x && this.y <= y && this.y + this.height >= y);
    }
    containsPoint(point) {
        return (this.x <= point.x && this.x + this.width >= point.x && this.y <= point.y && this.y + this.height >= point.y);
    }
    containsRect(rect) {
        return (this.x <= rect.x && this.x + this.width >= rect.x + rect.width && this.y <= rect.y && this.y + this.height >= rect.y + rect.height);
    }
    copyFrom(sourceRect) {
    }
    equals(toCompare) {
        return (this.x == toCompare.x && this.y == toCompare.y && this.width == toCompare.width && this.height == toCompare.height);
    }
    inflate(dx, dy) {
        this.x -= dx / 2;
        this.y -= dy / 2;
        this.width += dx / 2;
        this.height += dy / 2;
    }
    inflatePoint(point) {
        this.x -= point.x / 2;
        this.y -= point.y / 2;
        this.width += point.x / 2;
        this.height += point.y / 2;
    }
    intersection(toIntersect) {
        if (this.intersects(toIntersect)) {
            var i = new Rectangle();
            if (this.x > toIntersect.x) {
                i.x = this.x;
                i.width = toIntersect.x - this.x + toIntersect.width;
                if (i.width > this.width)
                    i.width = this.width;
            }
            else {
                i.x = toIntersect.x;
                i.width = this.x - toIntersect.x + this.width;
                if (i.width > toIntersect.width)
                    i.width = toIntersect.width;
            }
            if (this.y > toIntersect.y) {
                i.y = this.y;
                i.height = toIntersect.y - this.y + toIntersect.height;
                if (i.height > this.height)
                    i.height = this.height;
            }
            else {
                i.y = toIntersect.y;
                i.height = this.y - toIntersect.y + this.height;
                if (i.height > toIntersect.height)
                    i.height = toIntersect.height;
            }
            return i;
        }
        return new Rectangle();
    }
    intersects(toIntersect) {
        return (this.x + this.width > toIntersect.x && this.x < toIntersect.x + toIntersect.width && this.y + this.height > toIntersect.y && this.y < toIntersect.y + toIntersect.height);
    }
    isEmpty() {
        return (this.x == 0 && this.y == 0 && this.width == 0 && this.height == 0);
    }
    offset(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    offsetPoint(point) {
        this.x += point.x;
        this.y += point.y;
    }
    setEmpty() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }
    setTo(xa, ya, widtha, heighta) {
        this.x = xa;
        this.y = ya;
        this.width = widtha;
        this.height = heighta;
    }
    toString() {
        return "[Rectangle] (x=" + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + ")";
    }
    union(toUnion) {
        var u = new Rectangle();
        if (this.x < toUnion.x) {
            u.x = this.x;
            u.width = toUnion.x - this.x + toUnion.width;
            if (u.width < this.width)
                u.width = this.width;
        }
        else {
            u.x = toUnion.x;
            u.width = this.x - toUnion.x + this.width;
            if (u.width < toUnion.width)
                u.width = toUnion.width;
        }
        if (this.y < toUnion.y) {
            u.y = this.y;
            u.height = toUnion.y - this.y + toUnion.height;
            if (u.height < this.height)
                u.height = this.height;
        }
        else {
            u.y = toUnion.y;
            u.height = this.y - toUnion.y + this.height;
            if (u.height < toUnion.height)
                u.height = toUnion.height;
        }
        return u;
    }
    getRandomPointInRect() {
        var p = new Point();
        p.x = NumberUtils.random(this.x, this.x + this.width);
        p.y = NumberUtils.random(this.y, this.y + this.height);
        return p;
    }
}
