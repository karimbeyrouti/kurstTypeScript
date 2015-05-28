class Random
{
    private static r1 = 1234.5678;
    private static r2 = 5678.9101112;
    private static r3 = 9101112.13141516;

    private rcp : number = 1 / (Random.r1 + Random.r2 + Random.r3);

    private _a : number;
    private _b : number;
    private _c : number;
    private _d : number;
    private _e : number;
    private _f : number;

    constructor(seed)
    {
        this.seed( seed );
    }

    public seed( seed : number )
    {
        seed = Math.abs(seed|0);

        this._a = (Random.r1 + Random.r2 + seed) % Random.r1;
        this._b = (Random.r2 + Random.r3 + seed) % Random.r2;
        this._c = (Random.r3 + Random.r1 + seed) % Random.r3;
        this._d = 0;
        this._e = 0;
        this._f = 0;
    }

    public next() : number
    {
        this._a = (Random.r1 * this._a) % Random.r1;
        this._b = (Random.r2 * this._b) % Random.r2;
        this._c = (Random.r3 * this._c) % Random.r3;
        this._d = (Random.r1 * this._a + this._d) % Random.r1;
        this._e = (Random.r2 * this._b + this._e) % Random.r2;
        this._f = (Random.r3 * this._c + this._f) % Random.r3;

        return (this._d + this._e + this._f) * this.rcp;
    }

}

export = Random;