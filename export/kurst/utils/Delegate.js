class Delegate {
    constructor(func = null) {
        this._func = func;
    }
    static create(obj, func) {
        var f = function () {
            return func.apply(obj, arguments);
        };
        return f;
    }
    createDelegate(obj) {
        return Delegate.create(obj, this._func);
    }
}
