import Event from "../../events/Event";
import IOErrorEvent from "../../events/IOErrorEvent";
import URLLoader from "../../net/URLLoader";
import URLLoaderDataFormat from "../../net/URLLoaderDataFormat";
import URLRequest from "../../net/URLRequest";
import SVGGroup from "../display/SVGGroup";
import SVGRectangle from "../display/SVGRectangle";
import SVGCircle from "../display/SVGCircle";
import SVGPolygon from "../display/SVGPolygon";
import SVGPath from "../display/SVGPath";
import SVGText from "../display/SVGText";
class SVGLoader extends EventDispatcher {
    constructor() {
        super();
        this.children = new Array();
        this.loader = new URLLoader();
        this.loader.dataFormat = URLLoaderDataFormat.TEXT;
        this.loader.addEventListener(Event.COMPLETE, (e) => this.onLoaded(e));
        this.loader.addEventListener(IOErrorEvent.IO_ERROR, (e) => this.onIOError(e));
        this.element = new SVGGroup();
    }
    load(uri) {
        this.loader.load(new URLRequest(uri));
        this._url = uri;
    }
    get url() {
        return this._url;
    }
    onIOError(e) {
        this.dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR));
    }
    onLoaded(e) {
        var parser = new DOMParser();
        var XMLdoc = parser.parseFromString(this.loader.data, "text/xml");
        this.parseSVGHtmlElement(XMLdoc.documentElement.childNodes);
        this.dispatchEvent(new Event(Event.COMPLETE));
    }
    parseSVGHtmlElement(nodeList, parentGroup) {
        var length = nodeList.length;
        var svgObject;
        var parent = (parentGroup == null) ? this.element : parentGroup;
        var isNestedGroup = !(parentGroup == null);
        var addToElements = false;
        for (var c = 0; c < length; c++) {
            var node = nodeList.item(c).cloneNode(true);
            addToElements = false;
            switch (node.nodeName) {
                case 'g':
                    svgObject = new SVGGroup();
                    if (node.childNodes.length > 0)
                        this.parseSVGHtmlElement(node.childNodes, svgObject);
                    svgObject.element = node;
                    parent.append(svgObject);
                    addToElements = !isNestedGroup;
                    break;
                case 'rect':
                    svgObject = new SVGRectangle();
                    svgObject.element = node;
                    parent.append(svgObject);
                    addToElements = true;
                    break;
                case 'circle':
                    svgObject = new SVGCircle();
                    svgObject.element = node;
                    parent.append(svgObject);
                    addToElements = true;
                    break;
                case 'polygon':
                    svgObject = new SVGPolygon();
                    svgObject.element = node;
                    parent.append(svgObject);
                    addToElements = true;
                    break;
                case 'path':
                    svgObject = new SVGPath();
                    svgObject.element = node;
                    parent.append(svgObject);
                    addToElements = true;
                    break;
                case 'text':
                    svgObject = new SVGText();
                    svgObject.element = node;
                    parent.append(svgObject);
                    addToElements = true;
                    break;
                case '#text':
                    addToElements = false;
                    break;
                default:
                    addToElements = false;
                    parent.element.appendChild(node);
                    break;
            }
            if (addToElements && !isNestedGroup) {
                this.children.push(svgObject);
            }
        }
    }
}
