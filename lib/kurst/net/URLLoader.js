import Event from "../events/Event";
import IOErrorEvent from "../events/IOErrorEvent";
import ProgressEvent from "../events/ProgressEvent";
import HTTPStatusEvent from "../events/HTTPStatusEvent";
import URLLoaderDataFormat from "./URLLoaderDataFormat";
import URLRequestMethod from "./URLRequestMethod";
import URLVariables from "./URLVariables";
class URLLoader extends EventDispatcher {
    constructor() {
        super();
        this._bytesLoaded = 0;
        this._bytesTotal = 0;
        this._dataFormat = URLLoaderDataFormat.TEXT;
        this._loadError = false;
    }
    get url() {
        return this._request ? this._request.url : '';
    }
    get data() {
        return this._data;
    }
    set data(d) {
        this._data = d;
    }
    set dataFormat(format) {
        this._dataFormat = format;
    }
    get dataFormat() {
        return this._dataFormat;
    }
    get bytesLoaded() {
        return this._bytesLoaded;
    }
    get bytesTotal() {
        return this._bytesTotal;
    }
    load(request) {
        this._request = request;
        this.initXHR();
        if (request.method === URLRequestMethod.POST)
            this.postRequest(request);
        else
            this.getRequest(request);
    }
    close() {
        this._XHR.abort();
        this.disposeXHR();
    }
    dispose() {
        if (this._XHR)
            this._XHR.abort();
        this.disposeXHR();
        this._data = null;
        this._dataFormat = null;
        this._bytesLoaded = null;
        this._bytesTotal = null;
    }
    setResponseType(xhr, responseType) {
        switch (responseType) {
            case URLLoaderDataFormat.ARRAY_BUFFER:
            case URLLoaderDataFormat.BLOB:
            case URLLoaderDataFormat.TEXT:
                xhr.responseType = responseType;
                break;
            case URLLoaderDataFormat.VARIABLES:
                xhr.responseType = URLLoaderDataFormat.TEXT;
                break;
            case URLLoaderDataFormat.BINARY:
                xhr.responseType = '';
                break;
            default:
        }
    }
    getRequest(request) {
        try {
            this._XHR.open(request.method, request.url, request.async);
            this.setResponseType(this._XHR, this._dataFormat);
            this._XHR.send();
        }
        catch (e) {
            this.handleXmlHttpRequestException(e);
        }
    }
    postRequest(request) {
        this._loadError = false;
        this._XHR.open(request.method, request.url, request.async);
        if (request.data != null) {
            if (request.data instanceof URLVariables) {
                var urlVars = request.data;
                try {
                    this._XHR.responseType = 'text';
                    this._XHR.send(urlVars.formData);
                }
                catch (e) {
                    this.handleXmlHttpRequestException(e);
                }
            }
            else {
                this.setResponseType(this._XHR, this._dataFormat);
                if (request.data)
                    this._XHR.send(request.data);
                else
                    this._XHR.send();
            }
        }
        else {
            this._XHR.send();
        }
    }
    handleXmlHttpRequestException(error) {
        switch (error.code) {
            case 101:
                break;
        }
    }
    initXHR() {
        if (!this._XHR) {
            this._XHR = new XMLHttpRequest();
            this._XHR.onloadstart = (event) => this.onLoadStart(event);
            this._XHR.onprogress = (event) => this.onProgress(event);
            this._XHR.onabort = (event) => this.onAbort(event);
            this._XHR.onerror = (event) => this.onLoadError(event);
            this._XHR.onload = (event) => this.onLoadComplete(event);
            this._XHR.ontimeout = (event) => this.onTimeOut(event);
            this._XHR.onloadend = (event) => this.onLoadEnd(event);
            this._XHR.onreadystatechange = (event) => this.onReadyStateChange(event);
        }
    }
    disposeXHR() {
        if (this._XHR !== null) {
            this._XHR.onloadstart = null;
            this._XHR.onprogress = null;
            this._XHR.onabort = null;
            this._XHR.onerror = null;
            this._XHR.onload = null;
            this._XHR.ontimeout = null;
            this._XHR.onloadend = null;
            this._XHR = null;
        }
    }
    decodeURLVariables(source) {
        var result = new Object();
        source = source.split("+").join(" ");
        var tokens, re = /[?&]?([^=]+)=([^&]*)/g;
        while (tokens = re.exec(source))
            result[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        return result;
    }
    onReadyStateChange(event) {
        if (this._XHR.readyState == 4) {
            if (this._XHR.status == 404) {
                this._loadError = true;
                if (!this._loadErrorEvent)
                    this._loadErrorEvent = new IOErrorEvent(IOErrorEvent.IO_ERROR);
                this.dispatchEvent(this._loadErrorEvent);
            }
            this.dispatchEvent(new HTTPStatusEvent(HTTPStatusEvent.HTTP_STATUS, this._XHR.status));
        }
    }
    onLoadEnd(event) {
        if (this._loadError === true)
            return;
    }
    onTimeOut(event) {
    }
    onAbort(event) {
    }
    onProgress(event) {
        if (!this._progressEvent)
            this._progressEvent = new ProgressEvent(ProgressEvent.PROGRESS);
        this._progressEvent.bytesTotal = event.total;
        this._progressEvent.bytesLoaded = event.loaded;
        this.dispatchEvent(this._progressEvent);
    }
    onLoadStart(event) {
        if (!this._loadStartEvent)
            this._loadStartEvent = new Event(Event.OPEN);
        this.dispatchEvent(this._loadStartEvent);
    }
    onLoadComplete(event) {
        if (this._loadError === true)
            return;
        switch (this._dataFormat) {
            case URLLoaderDataFormat.TEXT:
                this._data = this._XHR.responseText;
                break;
            case URLLoaderDataFormat.VARIABLES:
                this._data = this.decodeURLVariables(this._XHR.responseText);
                break;
            case URLLoaderDataFormat.BLOB:
            case URLLoaderDataFormat.ARRAY_BUFFER:
            case URLLoaderDataFormat.BINARY:
                this._data = this._XHR.response;
                break;
            default:
                this._data = this._XHR.responseText;
                break;
        }
        if (!this._loadCompleteEvent)
            this._loadCompleteEvent = new Event(Event.COMPLETE);
        this.dispatchEvent(this._loadCompleteEvent);
    }
    onLoadError(event) {
        this._loadError = true;
        if (!this._loadErrorEvent)
            this._loadErrorEvent = new IOErrorEvent(IOErrorEvent.IO_ERROR);
        this.dispatchEvent(this._loadErrorEvent);
    }
}
