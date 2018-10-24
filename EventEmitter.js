class EventEmitter {
    constructor() {
        this._listeners = {};
        this.on = this.addListener;
        this.once = this.addListenerOnce;
        this.off = this.removeListener;
    }

    addListener(type, fn, context) {
        return this._addListener(type, fn, context, false);
    }

    addListenerOnce(type, fn, context) {
        return this._addListener(type, fn, context, true);
    }

    removeListener(type, fn, context) {
        if(this._hasListener(type)) {
            for(;;) {
                const index = this._indexOfListener(type, fn, context);
                if(index < 0) {
                    break;
                }
                this._listeners[type].splice(index, 1);
            }
            if(!this._listeners[type].length) {
                delete this._listeners[type];
            }
        }
        return this;
    }

    removeAllListeners(type) {
        if(arguments.length) {
            delete this._listeners[type];
        } else {
            this._listeners = {}
        }
        return this;
    }

    emit(type, ...args) {
        if(this._hasListeners(type)) {
            const listeners = this._listeners[type];
            let i = 0;
            while (i < listeners.length) {
                const listener = listeners[i];
                listener.fn.apply(listener.context, args);
                if(listener.once) {
                    listeners.splice(i, 1);
                    continue;
                }
                ++i;
            }
            if(!listeners.length) {
                delete this._listeners[type];
            }
        }
        return this;
    }

    _addListener(type, fn, context, once) {
        if(typeof fn !== 'function') {
            throw new TypeError('fn must be a function');
        }
        context = context || this;
        if(!this._hasListeners(type)) {
            this._listeners[type] = [];
        }
        const listener = {
            fn, context, once
        };
        this._listeners[type].push(listener);
        return this;
    }

    _indexOfListener(type, fn, context) {
        context = context || this;
        const listeners = this._listeners[type];
        const length = listeners.length;
        for(let i = 0; i < length; i++) {
            let listener = listeners[i];
            if(listener.fn === fn && listener.context === context) {
                return i;
            }
        }
        return -1;
    }

    _hasListeners(type) {
        return this._listeners.hasOwnProperty(type);
    }
}