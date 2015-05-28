import URLRequestMethod from "./URLRequestMethod";
class URLRequest {
    constructor(url = null) {
        this.method = URLRequestMethod.GET;
        this.async = true;
        this._url = url;
    }
    get url() {
        return this._url;
    }
    set url(value) {
        this._url = value;
    }
    dispose() {
        this.data = null;
        this._url = null;
    }
}
