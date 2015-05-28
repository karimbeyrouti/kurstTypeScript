/// <reference path="../../libs/three.d.ts" />
/// <reference path="../../libs/google.maps.d.ts" />
import Event from "../events/Event";
class GSVPano extends EventDispatcher {
    constructor() {
        super();
        this.useWebGL = true;
        this._zoom = 3;
        this._panoClient = new google.maps.StreetViewService();
        this._count = 0;
        this._total = 0;
        this._ctx = new Array();
        this._wc = 0;
        this._hc = 0;
        this._loadProgress = 0;
        this.result = null;
        this.maxW = 1024;
        this.maxH = 1024;
        this.levelsW = [1, 2, 4, 7, 13, 26];
        this.levelsH = [1, 1, 2, 4, 7, 13];
        this.widths = [416, 832, 1664, 3328, 6656, 13312];
        this.heights = [416, 416, 832, 1664, 3328, 6656];
        this.gl = null;
        this.ON_PANORAMA_LOADED = new Event('ON_PANORAMA_LOADED');
        this.ON_PANORAMA_LOAD_PROGRESS = new Event('ON_PANORAMA_LOAD_PROGRESS');
        this.ON_PANORAMA_LOAD_ERROR = new Event('ON_PANORAMA_LOAD_ERROR');
        try {
            var canvas = document.createElement('canvas');
            this.gl = canvas.getContext('experimental-webgl');
            if (this.gl == null) {
                this.gl = canvas.getContext('webgl');
            }
        }
        catch (error) {
        }
        if (this.gl) {
            var maxTexSize = this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE);
            this.maxW = this.maxH = maxTexSize;
        }
        this.maxTexSize = this.maxW;
        this.setZoom(this._zoom);
    }
    setProgress(p) {
        this._loadProgress = p;
        this.dispatchEvent(this.ON_PANORAMA_LOAD_PROGRESS);
    }
    throwError(message) {
        this.dispatchEvent(this.ON_PANORAMA_LOAD_ERROR);
    }
    adaptTextureToZoom() {
        var w = this.widths[this._zoom];
        var h = this.heights[this._zoom];
        this._panoWidth = w;
        this._panoHeight = h;
        this._wc = Math.ceil(w / this.maxW);
        this._hc = Math.ceil(h / this.maxH);
        this._canvas = new Array();
        this._ctx = new Array();
        ;
        var ptr = 0;
        for (var y = 0; y < this._hc; y++) {
            for (var x = 0; x < this._wc; x++) {
                var c = document.createElement('canvas');
                if (x < (this._wc - 1)) {
                    c.width = this.maxW;
                }
                else {
                    c.width = w - (this.maxW * x);
                }
                if (y < (this._hc - 1)) {
                    c.height = this.maxH;
                }
                else {
                    c.height = h - (this.maxH * y);
                }
                c['GSVPANO'] = { x: x, y: y };
                this._canvas.push(c);
                this._ctx.push(c.getContext('2d'));
                ptr++;
            }
        }
    }
    composeFromTile(x, y, texture) {
        x *= 512;
        y *= 512;
        var px = Math.floor(x / this.maxW);
        var py = Math.floor(y / this.maxH);
        x -= px * this.maxW;
        y -= py * this.maxH;
        this._ctx[py * this._wc + px].drawImage(texture, 0, 0, texture.width, texture.height, x, y, 512, 512);
        this.progress();
    }
    progress() {
        this._count++;
        var p = Math.round(this._count * 100 / this._total);
        this.setProgress(p);
        if (this._count === this._total) {
            this.dispatchEvent(this.ON_PANORAMA_LOADED);
        }
    }
    composePanorama() {
        this.setProgress(0);
        var w = this.levelsW[this._zoom];
        var h = this.levelsH[this._zoom];
        var url;
        var x;
        var y;
        this._count = 0;
        this._total = w * h;
        var self = this;
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                url = 'https://geo0.ggpht.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&panoid=' + this._panoId + '&output=tile&x=' + x + '&y=' + y + '&zoom=' + this._zoom + '&nbt&fover=2';
                (function (x, y) {
                    if (this.useWebGL) {
                        var texture = THREE.ImageUtils.loadTexture(url, null, function () {
                            self.composeFromTile(x, y, texture);
                        });
                    }
                    else {
                        var img = new Image();
                        img.addEventListener('load', function () {
                            self.composeFromTile(x, y, this);
                        });
                        img.crossOrigin = '';
                        img.src = url;
                    }
                })(x, y);
            }
        }
    }
    loadFromId(id) {
        this._loadProgress = 0;
        this._panoId = id;
        this.composePanorama();
    }
    get canvas() {
        return this._canvas[0];
    }
    get zoom() {
        return this._zoom;
    }
    get panoWidth() {
        return this._panoWidth;
    }
    get panoHeight() {
        return this._panoHeight;
    }
    get loadProgress() {
        return this._loadProgress;
    }
    load(location) {
        var self = this;
        var url = 'https://maps.google.com/cbk?output=json&hl=x-local&ll=' + location.lat() + ',' + location.lng() + '&cb_client=maps_sv&v=3';
        url = 'https://cbks0.google.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&output=polygon&it=1%3A1&rank=closest&ll=' + location.lat() + ',' + location.lng() + '&radius=350';
        var http_request = new XMLHttpRequest();
        http_request.open("GET", url, true);
        http_request.onreadystatechange = function () {
            if (http_request.readyState == 4 && http_request.status == 200) {
                var data = JSON.parse(http_request.responseText);
                self.loadPano(location, data.result[0].id);
            }
        };
        http_request.send(null);
    }
    loadPano(location, id) {
        var self = this;
        this._loadProgress = 0;
        this._panoClient.getPanoramaById(id, function (result, status) {
            if (status === google.maps.StreetViewStatus.OK) {
                self.result = result;
                var h = google.maps.geometry.spherical.computeHeading(location, result.location.latLng);
                this.rotation = (result.tiles.centerHeading - h) * Math.PI / 180.0;
                self._panoId = result.location.pano;
                self.location = location;
                self.composePanorama();
            }
            else {
                self.throwError('Could not retrieve panorama for the following reason: ' + status);
            }
        });
    }
    setZoom(z) {
        this._zoom = z;
        this.adaptTextureToZoom();
    }
}
