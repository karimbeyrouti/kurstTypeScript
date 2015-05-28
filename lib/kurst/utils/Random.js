class Random {
    constructor(seed) {
        this.rcp = 1 / (Random.r1 + Random.r2 + Random.r3);
        this.seed(seed);
    }
    seed(seed) {
        seed = Math.abs(seed | 0);
        this._a = (Random.r1 + Random.r2 + seed) % Random.r1;
        this._b = (Random.r2 + Random.r3 + seed) % Random.r2;
        this._c = (Random.r3 + Random.r1 + seed) % Random.r3;
        this._d = 0;
        this._e = 0;
        this._f = 0;
    }
    next() {
        this._a = (Random.r1 * this._a) % Random.r1;
        this._b = (Random.r2 * this._b) % Random.r2;
        this._c = (Random.r3 * this._c) % Random.r3;
        this._d = (Random.r1 * this._a + this._d) % Random.r1;
        this._e = (Random.r2 * this._b + this._e) % Random.r2;
        this._f = (Random.r3 * this._c + this._f) % Random.r3;
        return (this._d + this._e + this._f) * this.rcp;
    }
}
Random.r1 = 1234.5678;
Random.r2 = 5678.9101112;
Random.r3 = 9101112.13141516;
