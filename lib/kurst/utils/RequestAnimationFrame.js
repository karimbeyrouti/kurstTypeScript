class RequestAnimationFrame {
    constructor(callback, callbackContext) {
        this._active = false;
        this._argsArray = new Array();
        this.setCallback(callback, callbackContext);
        this._rafUpdateFunction = () => {
            if (this._active) {
                this._tick();
            }
        };
        this._argsArray.push(this._dt);
    }
    setCallback(callback, callbackContext) {
        this._callback = callback;
        this._callbackContext = callbackContext;
    }
    start() {
        if (this._active) {
            return;
        }
        this._prevTime = Date.now();
        this._active = true;
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(this._rafUpdateFunction);
        }
        else {
            if (window['mozRequestAnimationFrame']) {
                window.requestAnimationFrame = window['mozRequestAnimationFrame'];
            }
            else if (window['webkitRequestAnimationFrame']) {
                window.requestAnimationFrame = window['webkitRequestAnimationFrame'];
            }
            else if (window['oRequestAnimationFrame']) {
                window.requestAnimationFrame = window['oRequestAnimationFrame'];
            }
        }
    }
    stop() {
        this._active = false;
    }
    get active() {
        return this._active;
    }
    _tick() {
        this._currentTime = Date.now();
        this._dt = this._currentTime - this._prevTime;
        this._argsArray[0] = this._dt;
        this._callback.apply(this._callbackContext, this._argsArray);
        window.requestAnimationFrame(this._rafUpdateFunction);
        this._prevTime = this._currentTime;
    }
}
