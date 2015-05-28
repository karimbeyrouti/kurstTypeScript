/**
* Notes:
**
*      var canvas  : HTMLCanvasElement         = <HTMLCanvasElement>document.createElement("canvas");
*      var context : any                       = this.createCanvas().getContext("experimental-webgl");
*      var gl      : WebGLRenderingContext     = <WebGLRenderingContext> context;
*      canvas.getContext('webgl');
*/
/**
* @author Karim Beyrouti / http://kurst.co.uk
*/
import Event from "../events/Event";
import Detector from "./Detector";
import TrackballControls from "./TrackballControls";
class ThreeJSWebGLView extends EventDispatcher {
    constructor(container, autoResize = false, alpha = false, clearAlpha = 1) {
        super();
        this.clearColor = 0x000000;
        this.trackControlEnabled = false;
        this.renderFlag = false;
        this._clearAlpha = 1;
        this.resizeEvent = new Event('resize');
        this._alpha = alpha;
        this._clearAlpha = clearAlpha;
        this.autoResize = autoResize;
        this.container = container;
        this.initThreeJSWebGLView();
        this.resizeEventTarget = event => this.onWindowResize(event);
        window.addEventListener('resize', this.resizeEventTarget, false);
    }
    dispose() {
        window.removeEventListener('resize', this.resizeEventTarget, false);
        if (this.container) {
            this.container.removeChild(this.renderer.domElement);
        }
        if (this.trackControlEnabled) {
            this.trackControls.dispose();
            this.trackControls.removeEventListener('change', this.controlChange);
        }
        this.stopRender();
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.trackControls = null;
    }
    enableTrackBall(flag, container = null) {
        if (flag) {
            container = (container == null) ? this.canvas : container;
            this.trackControls = new TrackballControls(this.camera, container);
            this.trackControls.rotateSpeed = 1.0;
            this.trackControls.zoomSpeed = 1.2;
            this.trackControls.panSpeed = 0.8;
            this.trackControls.noZoom = false;
            this.trackControls.noPan = true;
            this.trackControls.staticMoving = false;
            this.trackControls.dynamicDampingFactor = 0.1;
            this.trackControls.zoomSpeed = 0.45;
            this.trackControls.addEventListener('change', this.controlChange);
        }
        this.trackControlEnabled = flag;
    }
    render() {
        if (this.trackControlEnabled)
            if (this.trackControls)
                this.trackControls.update();
        this.renderer.render(this.scene, this.camera);
    }
    startRender() {
        this.renderFlag = true;
        var updateFunc = () => {
            this.render();
            if (this.renderFlag)
                requestAnimationFrame(updateFunc);
        };
        requestAnimationFrame(updateFunc);
    }
    stopRender() {
        this.renderFlag = false;
    }
    get canvas() {
        return this.renderer.domElement;
    }
    setSize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.dispatchEvent(this.resizeEvent);
    }
    initThreeJSWebGLView() {
        this.detector = new Detector();
        this.initScene();
        this.initRenderer();
        this.initCamera();
    }
    initScene() {
        this.scene = new THREE.Scene();
    }
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, clearColor: this.clearColor, clearAlpha: this._clearAlpha, alpha: this._alpha });
        this.renderer.sortObjects = false;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if (this.container) {
            this.container.appendChild(this.renderer.domElement);
        }
    }
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
        this.camera.position.z = 1000;
    }
    onWindowResize(event) {
        if (this.autoResize) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.dispatchEvent(this.resizeEvent);
        }
    }
    controlChange() { }
}
