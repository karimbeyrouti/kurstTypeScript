import Event from "../events/Event";
import JSONLoader from "./JSONLoader";
import GeoData from "./data/GeoData";
class IPGeoCoder extends EventDispatcher {
    constructor(apikey) {
        super();
        this.useProxy = true;
        this.proxy = 'data/proxy.php';
        this.proxyParam = 'url';
        this.LOAD_SUCCESS = new Event('IPGeoCoder_loaded');
        this.LOAD_ERROR = new Event('IPGeoCoder_loadfailed');
        this.apikey = apikey;
        this.jsonLoader = new JSONLoader();
        this.jsonLoader.addEventListener(this.jsonLoader.LOAD_ERROR.type, (event) => this.jsonLoadFail());
        this.jsonLoader.addEventListener(this.jsonLoader.LOAD_SUCCESS.type, (event) => this.jsonLoaded());
    }
    locateIP(ip) {
        var uri = 'http://api.ipinfodb.com/v3/ip-city/?key=' + this.apikey + '&ip=' + ip + '&format=json';
        if (this.useProxy) {
            uri = this.proxy + '?' + this.proxyParam + '=' + encodeURIComponent(uri);
        }
        this.jsonLoader.loadJson(uri);
    }
    enableProxy(flag, uri, param) {
        this.useProxy = flag;
        this.proxy = uri;
        this.proxyParam = param;
    }
    getLocationData() {
        return this.data;
    }
    jsonLoaded() {
        var json = this.jsonLoader.getData();
        this.data = new GeoData();
        this.data.statusCode = json['statusCode'];
        this.data.statusMessage = json['statusMessage'];
        this.data.ipAddress = json['ipAddress'];
        this.data.countryCode = json['countryCode'];
        this.data.countryName = json['countryName'];
        this.data.regionName = json['regionName'];
        this.data.cityName = json['cityName'];
        this.data.zipCode = json['zipCode'];
        this.data.latitude = parseFloat(json['latitude']);
        this.data.longitude = parseFloat(json['longitude']);
        this.data.timeZone = json['timeZone'];
        this.dispatchEvent(this.LOAD_SUCCESS);
    }
    jsonLoadFail() {
        this.dispatchEvent(this.LOAD_ERROR);
    }
}
