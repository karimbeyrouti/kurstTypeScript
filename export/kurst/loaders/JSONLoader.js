import Event from "../events/Event";
class JSONLoader extends EventDispatcher {
    constructor() {
        super();
        this.loaded = false;
        this.LOAD_SUCCESS = new Event('JSonLoader_loaded');
        this.LOAD_ERROR = new Event('JSonLoader_loaderror');
        this.loader = new XMLHttpRequest();
    }
    load() {
        if (this.loader) {
            this.loader.send();
        }
    }
    loadJson(uri, load = true) {
        this.loaded = false;
        if (!this.loader)
            this.loader = new XMLHttpRequest();
        var controller = this;
        this.loader.open('GET', uri, true);
        this.loader.onload = function (event) { controller.onLoadComplete(event); };
        this.loader.onerror = function (event) { controller.onLoadError(event); };
        this.loader.responseType = 'text';
        if (load) {
            this.loader.send();
        }
    }
    getData() {
        return this.jsonData;
    }
    getJSONString() {
        return this.jsonString;
    }
    onLoadComplete(event) {
        this.loaded = true;
        var xhr = event['currentTarget'];
        try {
            this.jsonData = JSON.parse(xhr.responseText);
            this.jsonString = xhr.responseText;
            this.dispatchEvent(this.LOAD_SUCCESS);
        }
        catch (e) {
            this.jsonString = xhr.responseText;
            this.dispatchEvent(this.LOAD_ERROR);
        }
    }
    onLoadError(event) {
        var xhr = event['currentTarget'];
        xhr.abort();
        this.dispatchEvent(this.LOAD_ERROR);
    }
}
