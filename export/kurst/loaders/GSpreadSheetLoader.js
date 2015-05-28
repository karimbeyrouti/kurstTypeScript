import Event from "../events/Event";
import JSONLoader from "./JSONLoader";
class GSpreadSheetLoader extends EventDispatcher {
    constructor() {
        super();
        this.LOAD_SUCCESS = new Event('GSpreadSheetLoader_loaded');
        this.LOAD_ERROR = new Event('GSpreadSheetLoader_loadfailed');
        this.jsLoader = new JSONLoader();
        this.jsLoader.addEventListener(this.jsLoader.LOAD_ERROR.type, (event) => this.jsonLoadError());
        this.jsLoader.addEventListener(this.jsLoader.LOAD_SUCCESS.type, (event) => this.jsonLoaded());
    }
    loadSpreadSheet(id) {
        this.jsLoader.loadJson('https://spreadsheets.google.com/feeds/list/' + id + '/od6/public/values?alt=json');
    }
    getData() {
        return this.gSheetData;
    }
    getHead() {
        return this.gSheetHead;
    }
    getJSONString() {
        return this.jsLoader.getJSONString();
    }
    parseData(data) {
        //--------------------------------------------------------------
        this.gSheetHead = [];
        this.gSheetData = [];
        var jsonRowData = data['feed']['entry'];
        var firstObj = jsonRowData[0];
        var dataPrefix = 'gsx$';
        var rowData;
        var colName;
        var row;
        for (var rowDataKey in firstObj) {
            if (rowDataKey.indexOf(dataPrefix) != -1) {
                this.gSheetHead.push(rowDataKey.slice(dataPrefix.length, rowDataKey.length));
            }
        }
        for (var c = 0; c < jsonRowData.length; c++) {
            rowData = jsonRowData[c];
            row = new Object();
            for (var d = 0; d < this.gSheetHead.length; d++) {
                colName = this.gSheetHead[d];
                row[colName] = rowData[dataPrefix + colName].$t;
            }
            this.gSheetData.push(row);
        }
    }
    jsonLoaded() {
        this.jsonData = this.jsLoader.getData();
        this.parseData(this.jsonData);
        this.dispatchEvent(this.LOAD_SUCCESS);
    }
    jsonLoadError() {
        this.dispatchEvent(this.LOAD_ERROR);
    }
}
