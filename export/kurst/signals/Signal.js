// <reference path="SignalBinding.ts" />
import SignalBinding from "./SignalBinding";
class Signal {
    constructor() {
        this._bindings = new Array();
        this._prevParams = null;
        this.memorize = false;
        this._shouldPropagate = true;
        this.active = true;
    }
    validateListener(listener, fnName) {
        if (typeof listener !== 'function') {
            throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
        }
    }
    _registerListener(listener, isOnce, listenerContext, priority) {
        var prevIndex = this._indexOfListener(listener, listenerContext);
        var binding;
        if (prevIndex !== -1) {
            binding = this._bindings[prevIndex];
            if (binding.isOnce() !== isOnce) {
                throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
            }
        }
        else {
            binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);
            this._addBinding(binding);
        }
        if (this.memorize && this._prevParams) {
            binding.execute(this._prevParams);
        }
        return binding;
    }
    _addBinding(binding) {
        //simplified insertion sort
        var n = this._bindings.length;
        do {
            --n;
        } while (this._bindings[n] && binding.priority <= this._bindings[n].priority);
        this._bindings.splice(n + 1, 0, binding);
    }
    _indexOfListener(listener, context) {
        var n = this._bindings.length;
        var cur;
        while (n--) {
            cur = this._bindings[n];
            if (cur.getListener() === listener && cur.context === context) {
                return n;
            }
        }
        return -1;
    }
    has(listener, context = null) {
        return this._indexOfListener(listener, context) !== -1;
    }
    add(listener, listenerContext = null, priority = 0) {
        this.validateListener(listener, 'add');
        return this._registerListener(listener, false, listenerContext, priority);
    }
    addOnce(listener, listenerContext = null, priority = 0) {
        this.validateListener(listener, 'addOnce');
        return this._registerListener(listener, true, listenerContext, priority);
    }
    remove(listener, context = null) {
        this.validateListener(listener, 'remove');
        var i = this._indexOfListener(listener, context);
        if (i !== -1) {
            this._bindings[i]._destroy();
            this._bindings.splice(i, 1);
        }
        return listener;
    }
    removeAll() {
        var n = this._bindings.length;
        while (n--) {
            this._bindings[n]._destroy();
        }
        this._bindings.length = 0;
    }
    getNumListeners() {
        return this._bindings.length;
    }
    halt() {
        this._shouldPropagate = false;
    }
    dispatch(...paramsArr) {
        if (!this.active) {
            return;
        }
        var n = this._bindings.length;
        var bindings;
        if (this.memorize) {
            this._prevParams = paramsArr;
        }
        if (!n) {
            return;
        }
        bindings = this._bindings.slice(0);
        this._shouldPropagate = true;
        do {
            n--;
        } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
    }
    forget() {
        this._prevParams = null;
    }
    dispose() {
        this.removeAll();
        delete this._bindings;
        delete this._prevParams;
    }
    toString() {
        return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';
    }
}
Signal.VERSION = '1.0.0';
