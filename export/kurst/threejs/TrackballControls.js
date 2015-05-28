/*
* @author Eberhard Graether / http://egraether.com/
* @author Karim Beyrouti / http://kurst.co.uk ( typescript conversion )
*/
import Event from "../events/Event";
import TrackballControlsState from "./TrackballControlsState";
import TrackballControlsScreen from "./TrackballControlsScreen";
class TrackballControls extends EventDispatcher {
    constructor(object, domElement) {
        super();
        this.enabled = true;
        this.rotateSpeed = 1.0;
        this.zoomSpeed = 1.2;
        this.panSpeed = 0.3;
        this.wheelSpeed = 0.005;
        this.noRotate = false;
        this.noZoom = false;
        this.noPan = false;
        this.staticMoving = false;
        this.dynamicDampingFactor = 0.2;
        this.minDistance = 0;
        this.maxDistance = Infinity;
        this.STATE = new TrackballControlsState();
        this.screen = new TrackballControlsScreen();
        this._touchZoomDistanceStart = 0;
        this._touchZoomDistanceEnd = 0;
        this.changeEvent = new Event('change');
        this.object = object;
        this.domElement = (domElement !== undefined) ? domElement : document;
        this.radius = (this.screen.width + this.screen.height) / 4;
        this.target = new THREE.Vector3();
        this.lastPosition = new THREE.Vector3();
        this._state = this.STATE.NONE;
        this._prevState = this.STATE.NONE;
        this._eye = new THREE.Vector3(),
            this._rotateStart = new THREE.Vector3(),
            this._rotateEnd = new THREE.Vector3(),
            this._zoomStart = new THREE.Vector2(),
            this._zoomEnd = new THREE.Vector2(),
            this._panStart = new THREE.Vector2();
        this._panEnd = new THREE.Vector2();
        this.target0 = this.target.clone();
        this.position0 = this.object.position.clone();
        this.up0 = this.object.up.clone();
        this.keys = new Array(65, 83, 68);
        this.mousewheelFnc = (event) => { this.mousewheel(event); };
        this.mousedownFnc = (event) => { this.mousedown(event); };
        this.mouseupFnc = (event) => { this.mouseup(event); };
        this.mousemoveFnc = (event) => { this.mousemove(event); };
        this.DOMMouseScrollFnc = (event) => { this.mousewheel(event); };
        this.touchstartFnc = (event) => { this.touchstart(event); };
        this.touchendFnc = (event) => { this.touchend(event); };
        this.touchmoveFnc = (event) => { this.touchmove(event); };
        this.keydownFnc = (event) => { this.keydown(event); };
        this.keyupFnc = (event) => { this.keyup(event); };
        this.domElement.addEventListener('mousedown', this.mousedownFnc, false);
        this.domElement.addEventListener('mousewheel', this.mousewheelFnc, false);
        this.domElement.addEventListener('DOMMouseScroll', this.DOMMouseScrollFnc, false);
        this.domElement.addEventListener('touchstart', this.touchstartFnc, false);
        this.domElement.addEventListener('touchend', this.touchendFnc, false);
        this.domElement.addEventListener('touchmove', this.touchmoveFnc, false);
        this.handleResize();
    }
    update() {
        this._eye.subVectors(this.object.position, this.target);
        if (!this.noRotate)
            this.rotateCamera();
        if (!this.noZoom)
            this.zoomCamera();
        if (!this.noPan)
            this.panCamera();
        this.object.position.addVectors(this.target, this._eye);
        this.checkDistances();
        this.object.lookAt(this.target);
        if (this.lastPosition.distanceToSquared(this.object.position) > 0) {
            this.dispatchEvent(this.changeEvent);
            this.lastPosition.copy(this.object.position);
        }
    }
    reset() {
        this._state = this.STATE.NONE;
        this._prevState = this.STATE.NONE;
        this.target.copy(this.target0);
        this.object.position.copy(this.position0);
        this.object.up.copy(this.up0);
        this._eye.subVectors(this.object.position, this.target);
        this.object.lookAt(this.target);
        this.dispatchEvent(this.changeEvent);
        this.lastPosition.copy(this.object.position);
    }
    dispose() {
        this.domElement.removeEventListener('contextmenu', function (event) { event.preventDefault(); }, false);
        this.domElement.removeEventListener('mousedown', this.mousedownFnc, false);
        this.domElement.removeEventListener('mousewheel', this.mousewheelFnc, false);
        this.domElement.removeEventListener('DOMMouseScroll', this.DOMMouseScrollFnc, false);
        this.domElement.removeEventListener('touchstart', this.touchstartFnc, false);
        this.domElement.removeEventListener('touchend', this.touchendFnc, false);
        this.domElement.removeEventListener('touchmove', this.touchmoveFnc, false);
        this.object = null;
        this.screen = null;
    }
    handleEvent(event) {
        if (typeof this[event.type] == 'function')
            this[event.type](event);
    }
    getMouseOnScreen(clientX, clientY) {
        return new THREE.Vector2((clientX - this.screen.offsetLeft) / this.radius * 0.5, (clientY - this.screen.offsetTop) / this.radius * 0.5);
    }
    getMouseProjectionOnBall(clientX, clientY) {
        var mouseOnBall = new THREE.Vector3((clientX - this.screen.width * 0.5 - this.screen.offsetLeft) / this.radius, (this.screen.height * 0.5 + this.screen.offsetTop - clientY) / this.radius, 0.0);
        var length = mouseOnBall.length();
        if (length > 1.0) {
            mouseOnBall.normalize();
        }
        else {
            mouseOnBall.z = Math.sqrt(1.0 - length * length);
        }
        this._eye.copy(this.object.position).sub(this.target);
        var projection = this.object.up.clone().setLength(mouseOnBall.y);
        projection.add(this.object.up.clone().cross(this._eye).setLength(mouseOnBall.x));
        projection.add(this._eye.setLength(mouseOnBall.z));
        return projection;
    }
    rotateCamera() {
        var angle = Math.acos(this._rotateStart.dot(this._rotateEnd) / this._rotateStart.length() / this._rotateEnd.length());
        if (angle) {
            var axis = (new THREE.Vector3()).crossVectors(this._rotateStart, this._rotateEnd).normalize();
            var quaternion = new THREE.Quaternion();
            angle *= this.rotateSpeed;
            quaternion.setFromAxisAngle(axis, -angle);
            this._eye.applyQuaternion(quaternion);
            this.object.up.applyQuaternion(quaternion);
            this._rotateEnd.applyQuaternion(quaternion);
            if (this.staticMoving) {
                this._rotateStart.copy(this._rotateEnd);
            }
            else {
                quaternion.setFromAxisAngle(axis, angle * (this.dynamicDampingFactor - 1.0));
                this._rotateStart.applyQuaternion(quaternion);
            }
        }
    }
    zoomCamera() {
        if (this._state === this.STATE.TOUCH_ZOOM) {
            var factor = this._touchZoomDistanceStart / this._touchZoomDistanceEnd;
            this._touchZoomDistanceStart = this._touchZoomDistanceEnd;
            this._eye.multiplyScalar(factor);
        }
        else {
            var factor = 1.0 + (this._zoomEnd.y - this._zoomStart.y) * this.zoomSpeed;
            if (factor !== 1.0 && factor > 0.0) {
                this._eye.multiplyScalar(factor);
                if (this.staticMoving) {
                    this._zoomStart.copy(this._zoomEnd);
                }
                else {
                    this._zoomStart.y += (this._zoomEnd.y - this._zoomStart.y) * this.dynamicDampingFactor;
                }
            }
        }
    }
    panCamera() {
        var mouseChange = this._panEnd.clone().sub(this._panStart);
        if (mouseChange.lengthSq()) {
            mouseChange.multiplyScalar(this._eye.length() * this.panSpeed);
            var pan = this._eye.clone().cross(this.object.up).setLength(mouseChange.x);
            pan.add(this.object.up.clone().setLength(mouseChange.y));
            this.object.position.add(pan);
            this.target.add(pan);
            if (this.staticMoving) {
                this._panStart = this._panEnd;
            }
            else {
                this._panStart.add(mouseChange.subVectors(this._panEnd, this._panStart).multiplyScalar(this.dynamicDampingFactor));
            }
        }
    }
    checkDistances() {
        if (!this.noZoom || !this.noPan) {
            if (this.object.position.lengthSq() > this.maxDistance * this.maxDistance)
                this.object.position.setLength(this.maxDistance);
            if (this._eye.lengthSq() < this.minDistance * this.minDistance)
                this.object.position.addVectors(this.target, this._eye.setLength(this.minDistance));
        }
    }
    handleResize() {
        this.screen.width = window.innerWidth;
        this.screen.height = window.innerHeight;
        this.screen.offsetLeft = 0;
        this.screen.offsetTop = 0;
        this.radius = (this.screen.width + this.screen.height) / 4;
    }
    keydown(event) {
        if (this.enabled === false)
            return;
        this._prevState = this._state;
        if (this._state !== this.STATE.NONE) {
            return;
        }
        else if (event.keyCode === this.keys[this.STATE.ROTATE] && !this.noRotate) {
            this._state = this.STATE.ROTATE;
        }
        else if (event.keyCode === this.keys[this.STATE.ZOOM] && !this.noZoom) {
            this._state = this.STATE.ZOOM;
        }
        else if (event.keyCode === this.keys[this.STATE.PAN] && !this.noPan) {
            this._state = this.STATE.PAN;
        }
    }
    keyup(event) {
        if (this.enabled === false)
            return;
        this._state = this._prevState;
    }
    mousedown(event) {
        if (this.enabled === false)
            return;
        event.preventDefault();
        event.stopPropagation();
        if (this._state === this.STATE.NONE) {
            this._state = event.button;
        }
        if (this._state === this.STATE.ROTATE && !this.noRotate) {
            this._rotateStart = this._rotateEnd = this.getMouseProjectionOnBall(event.clientX, event.clientY);
        }
        else if (this._state === this.STATE.ZOOM && !this.noZoom) {
            this._zoomStart = this._zoomEnd = this.getMouseOnScreen(event.clientX, event.clientY);
        }
        else if (this._state === this.STATE.PAN && !this.noPan) {
            this._panStart = this._panEnd = this.getMouseOnScreen(event.clientX, event.clientY);
        }
        this.domElement.addEventListener('mousemove', this.mousemoveFnc, false);
        this.domElement.addEventListener('mouseup', this.mouseupFnc, false);
    }
    mousemove(event) {
        if (this.enabled === false)
            return;
        event.preventDefault();
        event.stopPropagation();
        if (this._state === this.STATE.ROTATE && !this.noRotate) {
            this._rotateEnd = this.getMouseProjectionOnBall(event.clientX, event.clientY);
        }
        else if (this._state === this.STATE.ZOOM && !this.noZoom) {
            this._zoomEnd = this.getMouseOnScreen(event.clientX, event.clientY);
        }
        else if (this._state === this.STATE.PAN && !this.noPan) {
            this._panEnd = this.getMouseOnScreen(event.clientX, event.clientY);
        }
    }
    mouseup(event) {
        if (this.enabled === false)
            return;
        event.preventDefault();
        event.stopPropagation();
        this._state = this.STATE.NONE;
        this.domElement.removeEventListener('mousemove', this.mousemoveFnc);
        this.domElement.removeEventListener('mouseup', this.mouseupFnc);
    }
    mousewheel(event) {
        if (this.enabled === false)
            return;
        event.preventDefault();
        event.stopPropagation();
        var delta = 0;
        if (event.wheelDelta) {
            delta = event.wheelDelta / 2;
        }
        else if (event.detail) {
            delta = -event.detail / 3;
        }
        this._zoomStart.y += (1 / delta) * this.wheelSpeed;
    }
    touchstart(event) {
        if (this.enabled === false)
            return;
        switch (event.touches.length) {
            case 1:
                this._state = this.STATE.TOUCH_ROTATE;
                this._rotateStart = this._rotateEnd = this.getMouseProjectionOnBall(event.touches[0].pageX, event.touches[0].pageY);
                break;
            case 2:
                this._state = this.STATE.TOUCH_ZOOM;
                var dx = event.touches[0].pageX - event.touches[1].pageX;
                var dy = event.touches[0].pageY - event.touches[1].pageY;
                this._touchZoomDistanceEnd = this._touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);
                break;
            case 3:
                this._state = this.STATE.TOUCH_PAN;
                this._panStart = this._panEnd = this.getMouseOnScreen(event.touches[0].pageX, event.touches[0].pageY);
                break;
            default:
                this._state = this.STATE.NONE;
        }
    }
    touchmove(event) {
        if (this.enabled === false)
            return;
        event.preventDefault();
        event.stopPropagation();
        switch (event.touches.length) {
            case 1:
                this._rotateEnd = this.getMouseProjectionOnBall(event.touches[0].pageX, event.touches[0].pageY);
                break;
            case 2:
                var dx = event.touches[0].pageX - event.touches[1].pageX;
                var dy = event.touches[0].pageY - event.touches[1].pageY;
                this._touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);
                break;
            case 3:
                this._panEnd = this.getMouseOnScreen(event.touches[0].pageX, event.touches[0].pageY);
                break;
            default:
                this._state = this.STATE.NONE;
        }
    }
    touchend(event) {
        if (this.enabled === false)
            return;
        switch (event.touches.length) {
            case 1:
                this._rotateStart = this._rotateEnd = this.getMouseProjectionOnBall(event.touches[0].pageX, event.touches[0].pageY);
                break;
            case 2:
                this._touchZoomDistanceStart = this._touchZoomDistanceEnd = 0;
                break;
            case 3:
                this._panStart = this._panEnd = this.getMouseOnScreen(event.touches[0].pageX, event.touches[0].pageY);
                break;
        }
        this._state = this.STATE.NONE;
    }
}
