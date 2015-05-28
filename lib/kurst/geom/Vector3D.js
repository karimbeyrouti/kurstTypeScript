class Vector3D {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    get length() {
        return Math.sqrt(this.lengthSquared);
    }
    get lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    add(a) {
        return new Vector3D(this.x + a.x, this.y + a.y, this.z + a.z, this.w + a.w);
    }
    static angleBetween(a, b) {
        return Math.acos(a.dotProduct(b) / (a.length * b.length));
    }
    clone() {
        return new Vector3D(this.x, this.y, this.z, this.w);
    }
    copyFrom(src) {
        this.x = src.x;
        this.y = src.y;
        this.z = src.z;
        this.w = src.w;
    }
    crossProduct(a) {
        return new Vector3D(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x, 1);
    }
    decrementBy(a) {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
    }
    static distance(pt1, pt2) {
        var x = (pt1.x - pt2.x);
        var y = (pt1.y - pt2.y);
        var z = (pt1.z - pt2.z);
        return Math.sqrt(x * x + y * y + z * z);
    }
    dotProduct(a) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    }
    equals(toCompare, allFour = false) {
        return (this.x == toCompare.x && this.y == toCompare.y && this.z == toCompare.z && (!allFour || this.w == toCompare.w));
    }
    incrementBy(a) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
    }
    nearEquals(toCompare, tolerance, allFour = true) {
        return ((Math.abs(this.x - toCompare.x) < tolerance) && (Math.abs(this.y - toCompare.y) < tolerance) && (Math.abs(this.z - toCompare.z) < tolerance) && (!allFour || Math.abs(this.w - toCompare.w) < tolerance));
    }
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    }
    normalize(thickness = 1) {
        if (this.length != 0) {
            var invLength = thickness / this.length;
            this.x *= invLength;
            this.y *= invLength;
            this.z *= invLength;
            return;
        }
    }
    project() {
        this.x /= this.w;
        this.y /= this.w;
        this.z /= this.w;
    }
    scaleBy(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
    }
    setTo(xa, ya, za) {
        this.x = xa;
        this.y = ya;
        this.z = za;
    }
    subtract(a) {
        return new Vector3D(this.x - a.x, this.y - a.y, this.z - a.z);
    }
    toString() {
        return "[Vector3D] (x:" + this.x + " ,y:" + this.y + ", z" + this.z + ", w:" + this.w + ")";
    }
}
Vector3D.X_AXIS = new Vector3D(1, 0, 0);
Vector3D.Y_AXIS = new Vector3D(0, 1, 0);
Vector3D.Z_AXIS = new Vector3D(0, 0, 1);
