/// <reference path="../../libs/three.d.ts" />
/// <reference path="../../libs/TouchEvent.d.ts" />
/// <reference path="../../libs/tweenlite.d.ts" />
import Event from "../events/Event";
import OrbitControlsState from "./OrbitControlsState";
import OrbitControlsKeys from "./OrbitControlsKeys";
class OrbitControls extends EventDispatcher {
    constructor(object, domElement) {
        super();
        this.center = new THREE.Vector3();
        this.userZoom = true;
        this.userZoomSpeed = 1.0;
        this.userRotate = true;
        this.userRotateSpeed = 1.0;
        this.userPan = true;
        this.userPanSpeed = 2.0;
        this.autoRotate = false;
        this.autoRotateSpeed = 2.0;
        this.minPolarAngle = 0;
        this.maxPolarAngle = Math.PI;
        this.minDistance = 0;
        this.maxDistance = Infinity;
        this.scale = 1;
        this.isTouch = false;
        this.panTouchID = -1;
        this.autoTrack = false;
        this.tweenToPosition = false;
        this.keys = new OrbitControlsKeys();
        this.EPS = 0.000001;
        this.PIXELS_PER_ROUND = 1800;
        this.rotateStart = new THREE.Vector2();
        this.rotateEnd = new THREE.Vector2();
        this.rotateDelta = new THREE.Vector2();
        this.zoomStart = new THREE.Vector2();
        this.zoomEnd = new THREE.Vector2();
        this.zoomDelta = new THREE.Vector2();
        this.phiDelta = 0;
        this.thetaDelta = 0;
        this.lastPosition = new THREE.Vector3();
        this.STATE = new OrbitControlsState();
        this.theta = 0;
        this.phi = 0;
        this.changeEvent = new Event('change');
        this.TWEEN_TO_COMPLETE = new Event('TweenComplete');
        this.DRAG_STOP = new Event('DRAT_STOP');
        this.DRAG_START = new Event('DRAG_START');
        this.ZOOM_CHANGE = new Event('ZOOM_CHANGE');
        this.domElement = (domElement !== undefined) ? domElement : document;
        this.state = this.STATE.NONE;
        this.object = object;
        this.onMouseMoveFnc = (event) => { this.onMouseMove(event); };
        this.onMouseUpFnc = (event) => { this.onMouseUp(event); };
        this.onMouseDownFnc = (event) => { this.onMouseDown(event); };
        this.onMouseWheelFnc = (event) => { this.onMouseWheel(event); };
        this.onKeyDownFnc = (event) => { this.onKeyDown(event); };
        this.domElement.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);
        this.domElement.addEventListener('mousedown', this.onMouseDownFnc, false);
        this.domElement.addEventListener('touchstart', this.onMouseDownFnc, false);
        this.domElement.addEventListener('DOMMouseScroll', this.onMouseWheelFnc, false);
        this.domElement.addEventListener('keydown', this.onKeyDownFnc, false);
    }
    isUserDragging() {
        return (this.state === this.STATE.ROTATE);
    }
    track(flag, object) {
        this.autoTrack = flag;
        this.trackObject = object;
    }
    tweenTo(theta, phi, time = 5) {
        this.update();
        if (this.state !== this.STATE.ROTATE) {
            if (theta + Math.abs(this.theta) >= Math.PI * 2)
                theta -= Math.PI * 2;
            if (phi + Math.abs(this.phi) >= Math.PI * 2)
                phi -= Math.PI * 2;
            this.tweenToPosition = true;
            var tweenProps = {
                theta: theta,
                phi: phi,
                onComplete: (event) => this.tweenToComplete(event),
                ease: "Quad.easeInOut"
            };
            TweenLite.killTweensOf(this);
            TweenLite.to(this, time, tweenProps);
        }
    }
    rotateLeft(angle) {
        if (angle === undefined)
            angle = this.getAutoRotationAngle();
        this.thetaDelta -= angle;
    }
    rotateRight(angle) {
        if (angle === undefined)
            angle = this.getAutoRotationAngle();
        this.thetaDelta += angle;
    }
    rotateUp(angle) {
        if (angle === undefined)
            angle = this.getAutoRotationAngle();
        this.phiDelta -= angle;
    }
    rotateDown(angle) {
        if (angle === undefined)
            angle = this.getAutoRotationAngle();
        this.phiDelta += angle;
    }
    zoomIn(zoomScale) {
        if (zoomScale === undefined)
            zoomScale = this.getZoomScale();
        this.scale /= zoomScale;
    }
    zoomOut(zoomScale) {
        if (zoomScale === undefined)
            zoomScale = this.getZoomScale();
        this.scale *= zoomScale;
    }
    pan(distance) {
        distance.transformDirection(this.object.matrix);
        distance.multiplyScalar(this.userPanSpeed);
        this.object.position.add(distance);
        this.center.add(distance);
    }
    update() {
        var position = this.object.position;
        var offset = position.clone().sub(this.center);
        this.radius = offset.length() * this.scale;
        this.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.radius));
        if (this.phi > Math.PI * 2)
            this.phi -= Math.PI * 2;
        if (this.theta > Math.PI * 2)
            this.theta -= Math.PI * 2;
        if (!this.tweenToPosition) {
            this.theta = Math.atan2(offset.x, offset.z);
            this.phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y);
            if (this.autoRotate)
                this.rotateLeft(this.getAutoRotationAngle());
            if (this.autoTrack && (this.state === this.STATE.NONE)) {
                if (this.trackPrev === undefined)
                    this.trackPrev = new THREE.Vector3(this.trackObject.rotation.x, this.trackObject.rotation.y, this.trackObject.rotation.z);
                this.theta += this.trackObject.rotation.y - this.trackPrev.y;
                this.trackPrev.x = this.trackObject.rotation.x;
                this.trackPrev.y = this.trackObject.rotation.y;
                this.trackPrev.z = this.trackObject.rotation.z;
            }
            else {
                this.theta += this.thetaDelta;
                this.phi += this.phiDelta;
            }
            this.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.phi));
            this.phi = Math.max(this.EPS, Math.min(Math.PI - this.EPS, this.phi));
        }
        if ((this.radius !== undefined) && (offset !== undefined)) {
            this.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.phi));
            this.phi = Math.max(this.EPS, Math.min(Math.PI - this.EPS, this.phi));
            offset.x = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
            offset.y = this.radius * Math.cos(this.phi);
            offset.z = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
            position.copy(this.center).add(offset);
            this.object.lookAt(this.center);
            this.thetaDelta = 0;
            this.phiDelta = 0;
            this.scale = 1;
            if (this.lastPosition.distanceTo(this.object.position) > 0) {
                this.dispatchEvent(this.changeEvent);
                this.lastPosition.copy(this.object.position);
            }
        }
    }
    getAutoRotationAngle() {
        return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;
    }
    getZoomScale() {
        return Math.pow(0.95, this.userZoomSpeed);
    }
    initTrack() {
        if (this.trackPrev === undefined && this.trackObject !== undefined)
            this.trackPrev = new THREE.Vector3(this.trackObject.rotation.x, this.trackObject.rotation.y, this.trackObject.rotation.z);
    }
    updateTrack() {
        if (this.autoTrack && this.trackObject !== undefined) {
            this.initTrack();
            this.trackPrev.x = this.trackObject.rotation.x;
            this.trackPrev.y = this.trackObject.rotation.y;
            this.trackPrev.z = this.trackObject.rotation.z;
        }
    }
    tweenToComplete(event) {
        if (this.autoTrack)
            this.updateTrack();
        this.tweenToPosition = false;
        this.dispatchEvent(this.TWEEN_TO_COMPLETE);
    }
    onMouseDown(event) {
        if (this.state != this.STATE.NONE) {
            return;
        }
        if (this.tweenToPosition) {
            this.tweenToPosition = false;
            TweenLite.killTweensOf(this);
            this.dispatchEvent(this.TWEEN_TO_COMPLETE);
        }
        event.preventDefault();
        if (!this.userRotate)
            return;
        if (event.button === 0) {
            this.state = this.STATE.ROTATE;
            this.rotateStart.set(event.clientX, event.clientY);
        }
        else if (event.button === 1) {
            this.state = this.STATE.ZOOM;
            this.zoomStart.set(event.clientX, event.clientY);
        }
        else if (event.button === 2) {
            if (!this.userPan)
                return;
            this.state = this.STATE.PAN;
        }
        else {
            if (event instanceof TouchEvent) {
                this.isTouch = true;
                this.panTouchID = event.targetTouches[0].identifier;
                var t = event;
                this.rotateStart.set(t.changedTouches[0].clientX, t.changedTouches[0].clientY);
                this.state = this.STATE.ROTATE;
            }
        }
        this.dispatchEvent(this.DRAG_START);
        document.addEventListener('mousemove', this.onMouseMoveFnc, false);
        document.addEventListener('touchmove', this.onMouseMoveFnc, false);
        document.addEventListener('mouseup', this.onMouseUpFnc, false);
        document.addEventListener('touchend', this.onMouseUpFnc, false);
    }
    onMouseMove(event) {
        event.preventDefault();
        if (this.state === this.STATE.ROTATE) {
            if (event instanceof TouchEvent) {
                var t = event;
                this.rotateEnd.set(t.changedTouches[0].clientX, t.changedTouches[0].clientY);
            }
            else {
                this.rotateEnd.set(event.clientX, event.clientY);
            }
            this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
            this.rotateLeft(2 * Math.PI * this.rotateDelta.x / this.PIXELS_PER_ROUND * this.userRotateSpeed);
            this.rotateUp(2 * Math.PI * this.rotateDelta.y / this.PIXELS_PER_ROUND * this.userRotateSpeed);
            this.rotateStart.copy(this.rotateEnd);
        }
        else if (this.state === this.STATE.ZOOM) {
            this.zoomEnd.set(event.clientX, event.clientY);
            this.zoomDelta.subVectors(this.zoomEnd, this.zoomStart);
            if (this.zoomDelta.y > 0) {
                this.zoomIn();
            }
            else {
                this.zoomOut();
            }
            this.zoomStart.copy(this.zoomEnd);
        }
        else if (this.state === this.STATE.PAN) {
            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
            this.pan(new THREE.Vector3(-movementX, movementY, 0));
        }
    }
    onMouseUp(event) {
        if (!this.userRotate)
            return;
        if (event instanceof TouchEvent) {
            if (this.panTouchID != event.changedTouches[0].identifier) {
                return;
            }
        }
        if (this.autoTrack)
            this.updateTrack();
        this.dispatchEvent(this.DRAG_STOP);
        document.removeEventListener('mouseup', this.onMouseUpFnc, false);
        document.removeEventListener('touchend', this.onMouseUpFnc, false);
        document.removeEventListener('mousemove', this.onMouseMoveFnc, false);
        document.removeEventListener('touchmove', this.onMouseMoveFnc, false);
        this.state = this.STATE.NONE;
    }
    onMouseWheel(event) {
        if (!this.userZoom)
            return;
        var delta = 0;
        if (event.wheelDelta) {
            delta = event.wheelDelta;
        }
        else if (event.detail) {
            delta = -event.detail;
        }
        if (delta > 0) {
            this.zoomOut();
        }
        else {
            this.zoomIn();
        }
        this.dispatchEvent(this.ZOOM_CHANGE);
    }
    onKeyDown(event) {
        if (!this.userPan)
            return;
        switch (event.keyCode) {
            case this.keys.UP:
                this.pan(new THREE.Vector3(0, 1, 0));
                break;
            case this.keys.BOTTOM:
                this.pan(new THREE.Vector3(0, -1, 0));
                break;
            case this.keys.LEFT:
                this.pan(new THREE.Vector3(-1, 0, 0));
                break;
            case this.keys.RIGHT:
                this.pan(new THREE.Vector3(1, 0, 0));
                break;
        }
    }
}
