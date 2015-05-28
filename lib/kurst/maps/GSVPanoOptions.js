class GSVPanoOptions {
    constructor() {
        this._panoClient = new google.maps.StreetViewService();
        this._count = 0;
        this._total = 0;
        this._canvas = [];
        this._ctx = [];
        this._wc = 0;
        this._hc = 0;
        this.result = null;
        this.rotation = 0;
        this.copyright = '';
        this.onSizeChange = null;
        this.onPanoramaLoad = null;
    }
}
