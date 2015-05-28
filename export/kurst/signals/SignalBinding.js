// <reference path="Signal.ts" />
class SignalBinding {
    constructor(signal, listener, isOnce, listenerContext, priority = 0) {
        this.active = true;
        this.params = null;
        this._listener = listener;
        this._isOnce = isOnce;
        this.context = listenerContext;
        this._signal = signal;
        this.priority = priority || 0;
    }
    execute(paramsArr) {
        var handlerReturn;
        var params;
        if (this.active && !!this._listener) {
            params = this.params ? this.params.concat(paramsArr) : paramsArr;
            handlerReturn = this._listener.apply(this.context, params);
            if (this._isOnce) {
                this.detach();
            }
        }
        return handlerReturn;
    }
    detach() {
        return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
    }
    isBound() {
        return (!!this._signal && !!this._listener);
    }
    isOnce() {
        return this._isOnce;
    }
    getListener() {
        return this._listener;
    }
    getSignal() {
        return this._signal;
    }
    _destroy() {
        delete this._signal;
        delete this._listener;
        delete this.context;
    }
    toString() {
        return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']';
    }
}
