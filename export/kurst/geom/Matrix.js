import Point from "../geom/Point";
import ArgumentError from "../errors/ArgumentError";
class Matrix {
    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }
    clone() {
        return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }
    concat(matrix) {
        var a1 = this.a * matrix.a + this.b * matrix.c;
        this.b = this.a * matrix.b + this.b * matrix.d;
        this.a = a1;
        var c1 = this.c * matrix.a + this.d * matrix.c;
        this.d = this.c * matrix.b + this.d * matrix.d;
        this.c = c1;
        var tx1 = this.tx * matrix.a + this.ty * matrix.c + matrix.tx;
        this.ty = this.tx * matrix.b + this.ty * matrix.d + matrix.ty;
        this.tx = tx1;
    }
    copyColumnFrom(column, vector3D) {
        if (column > 2) {
            throw "Column " + column + " out of bounds (2)";
        }
        else if (column == 0) {
            this.a = vector3D.x;
            this.c = vector3D.y;
        }
        else if (column == 1) {
            this.b = vector3D.x;
            this.d = vector3D.y;
        }
        else {
            this.tx = vector3D.x;
            this.ty = vector3D.y;
        }
    }
    copyColumnTo(column, vector3D) {
        if (column > 2) {
            throw new ArgumentError("ArgumentError, Column " + column + " out of bounds [0, ..., 2]");
        }
        else if (column == 0) {
            vector3D.x = this.a;
            vector3D.y = this.c;
            vector3D.z = 0;
        }
        else if (column == 1) {
            vector3D.x = this.b;
            vector3D.y = this.d;
            vector3D.z = 0;
        }
        else {
            vector3D.x = this.tx;
            vector3D.y = this.ty;
            vector3D.z = 1;
        }
    }
    copyFrom(sourceMatrix) {
        this.a = sourceMatrix.a;
        this.b = sourceMatrix.b;
        this.c = sourceMatrix.c;
        this.d = sourceMatrix.d;
        this.tx = sourceMatrix.tx;
        this.ty = sourceMatrix.ty;
    }
    copyRowFrom(row, vector3D) {
        if (row > 2) {
            throw new ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 2]");
        }
        else if (row == 0) {
            this.a = vector3D.x;
            this.c = vector3D.y;
        }
        else if (row == 1) {
            this.b = vector3D.x;
            this.d = vector3D.y;
        }
        else {
            this.tx = vector3D.x;
            this.ty = vector3D.y;
        }
    }
    copyRowTo(row, vector3D) {
        if (row > 2) {
            throw new ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 2]");
        }
        else if (row == 0) {
            vector3D.x = this.a;
            vector3D.y = this.b;
            vector3D.z = this.tx;
        }
        else if (row == 1) {
            vector3D.x = this.c;
            vector3D.y = this.d;
            vector3D.z = this.ty;
        }
        else {
            vector3D.setTo(0, 0, 1);
        }
    }
    createBox(scaleX, scaleY, rotation = 0, tx = 0, ty = 0) {
        this.a = scaleX;
        this.d = scaleY;
        this.b = rotation;
        this.tx = tx;
        this.ty = ty;
    }
    createGradientBox(width, height, rotation = 0, tx = 0, ty = 0) {
        this.a = width / 1638.4;
        this.d = height / 1638.4;
        if (rotation != 0.0) {
            var cos = Math.cos(rotation);
            var sin = Math.sin(rotation);
            this.b = sin * this.d;
            this.c = -sin * this.a;
            this.a *= cos;
            this.d *= cos;
        }
        else {
            this.b = this.c = 0;
        }
        this.tx = tx + width / 2;
        this.ty = ty + height / 2;
    }
    deltaTransformPoint(point) {
        return new Point(point.x * this.a + point.y * this.c, point.x * this.b + point.y * this.d);
    }
    identity() {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;
    }
    invert() {
        var norm = this.a * this.d - this.b * this.c;
        if (norm == 0) {
            this.a = this.b = this.c = this.d = 0;
            this.tx = -this.tx;
            this.ty = -this.ty;
        }
        else {
            norm = 1.0 / norm;
            var a1 = this.d * norm;
            this.d = this.a * norm;
            this.a = a1;
            this.b *= -norm;
            this.c *= -norm;
            var tx1 = -this.a * this.tx - this.c * this.ty;
            this.ty = -this.b * this.tx - this.d * this.ty;
            this.tx = tx1;
        }
    }
    multiply(matrix) {
        var result = new Matrix();
        result.a = this.a * matrix.a + this.b * matrix.c;
        result.b = this.a * matrix.b + this.b * matrix.d;
        result.c = this.c * matrix.a + this.d * matrix.c;
        result.d = this.c * matrix.b + this.d * matrix.d;
        result.tx = this.tx * matrix.a + this.ty * matrix.c + matrix.tx;
        result.ty = this.tx * matrix.b + this.ty * matrix.d + matrix.ty;
        return result;
    }
    rotate(angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var a1 = this.a * cos - this.b * sin;
        this.b = this.a * sin + this.b * cos;
        this.a = a1;
        var c1 = this.c * cos - this.d * sin;
        this.d = this.c * sin + this.d * cos;
        this.c = c1;
        var tx1 = this.tx * cos - this.ty * sin;
        this.ty = this.tx * sin + this.ty * cos;
        this.tx = tx1;
    }
    scale(sx, sy) {
        this.a *= sx;
        this.b *= sy;
        this.c *= sx;
        this.d *= sy;
        this.tx *= sx;
        this.ty *= sy;
    }
    setTo(a, b, c, d, tx, ty) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }
    toString() {
        return "[Matrix] (a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
    }
    transformPoint(point) {
        return new Point(point.x * this.a + point.y * this.c + this.tx, point.x * this.b + point.y * this.d + this.ty);
    }
    translate(dx, dy) {
        this.tx += dx;
        this.ty += dy;
    }
}
