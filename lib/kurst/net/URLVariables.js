class URLVariables {
    constructor(source = null) {
        this._variables = new Object();
        if (source !== null) {
            this.decode(source);
        }
    }
    decode(source) {
        source = source.split("+").join(" ");
        var tokens, re = /[?&]?([^=]+)=([^&]*)/g;
        while (tokens = re.exec(source)) {
            this._variables[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
    }
    toString() {
        return '';
    }
    get variables() {
        return this._variables;
    }
    get formData() {
        var fd = new FormData();
        for (var s in this._variables) {
            fd.append(s, this._variables[s]);
        }
        return fd;
    }
    set variables(obj) {
        this._variables = obj;
    }
}
