class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    add(v) {
        return new Point(this.x + v.x, this.y + v.y);
    }
    clone() {
        return new Point(this.x, this.y);
    }
    copyFrom(sourcePoint) {
    }
    equals(toCompare) {
        return (this.x == toCompare.x && this.y == toCompare.y);
    }
    normalize(thickness = 1) {
        if (this.length != 0) {
            var invLength = thickness / this.length;
            this.x *= invLength;
            this.y *= invLength;
            return;
        }
        throw "Cannot divide by zero length.";
    }
    offset(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    setTo(xa, ya) {
    }
    subtract(v) {
        return new Point(this.x - v.x, this.y - v.y);
    }
    toString() {
        return "[Point] (x=" + this.x + ", y=" + this.y + ")";
    }
    static distance(pt1, pt2) {
        var dx = pt2.x - pt1.x;
        var dy = pt2.y - pt1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    static interpolate(pt1, pt2, f) {
        return new Point(pt2.x + (pt1.x - pt2.x) * f, pt2.y + (pt1.y - pt2.y) * f);
    }
    static polar(len, angle) {
        return new Point(len * Math.cos(angle), len * Math.sin(angle));
    }
    distance(p) {
        var dx = this.x - p.x;
        var dy = this.y - p.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    angleBetween(point) {
        var dx = point.x - this.x;
        var dy = point.y - this.y;
        return Math.atan2(dx, dy);
    }
}
