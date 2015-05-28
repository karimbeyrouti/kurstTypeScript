/// <reference path="../../libs/three.d.ts" />
/// <reference path="../../libs/TouchEvent.d.ts" />
/// <reference path="../../libs/tweenlite.d.ts" />

/**
* @author qiao / https://github.com/qiao
* @author mrdoob / http://mrdoob.com
* @author alteredq / http://alteredqualia.com/
* @author WestLangley / http://github.com/WestLangley
* @author Karim Beyrouti / http://kurst.co.uk ( typescript conversion )
*/

import EventDispatcher 			from "../events/EventDispatcher"
import Event 					from "../events/Event"
import OrbitControlsState		from "./OrbitControlsState"
import OrbitControlsKeys		from "./OrbitControlsKeys"


class OrbitControls extends EventDispatcher {

	//--VARS PUBLIC----------------------------------------------------------------------

	public center                   : THREE.Vector3     = new THREE.Vector3();
	public userZoom                 : boolean           = true;
	public userZoomSpeed            : number            = 1.0;
	public userRotate               : boolean          	= true;
	public userRotateSpeed          : number            = 1.0;
	public userPan                  : boolean           = true;
	public userPanSpeed             : number            = 2.0;
	public autoRotate               : boolean           = false;

	public autoRotateSpeed          : number            = 2.0; // 30 seconds per round when fps is 60
	public minPolarAngle            : number            = 0; // radians
	public maxPolarAngle            : number            = Math.PI; // radians
	public minDistance              : number            = 0;
	public maxDistance              : number            = Infinity;
	public scale                    : number            = 1;//.65;

	//--VARS PRIVATE----------------------------------------------------------------------

    private isTouch                 : boolean               = false;
    private panTouchID              : number                = -1;
	private autoTrack               : boolean               = false;
	private trackObject             : THREE.Object3D;
	private trackPrev               : THREE.Vector3;//new THREE.Vector3(0,0,0);
	private tweenToPosition         : boolean              = false;
	private keys                    : OrbitControlsKeys = new OrbitControlsKeys();
	private EPS                     : number            = 0.000001;
	private PIXELS_PER_ROUND        : number            = 1800;
	private object                  : THREE.Object3D;
	private domElement              : any;
	private rotateStart             : THREE.Vector2     = new THREE.Vector2();
	private rotateEnd               : THREE.Vector2     = new THREE.Vector2();
	private rotateDelta             : THREE.Vector2     = new THREE.Vector2();
	private zoomStart               : THREE.Vector2     = new THREE.Vector2();
	private zoomEnd                 : THREE.Vector2     = new THREE.Vector2();
	private zoomDelta               : THREE.Vector2     = new THREE.Vector2();
	private phiDelta                : number            = 0;
	private thetaDelta              : number            = 0;

	private lastPosition            : THREE.Vector3     = new THREE.Vector3();
	private STATE                   : OrbitControlsState = new OrbitControlsState();
	private state                   : number ;
	private theta                   : number            = 0;
	private phi                     : number            = 0;

	public radius                   : number;

	//--VENTS----------------------------------------------------------------------

	public changeEvent              : Event = new Event ( 'change' );

	public TWEEN_TO_COMPLETE        : Event = new Event ( 'TweenComplete' );
	public DRAG_STOP                : Event = new Event ( 'DRAT_STOP' );
	public DRAG_START               : Event = new Event ( 'DRAG_START' );
	public ZOOM_CHANGE              : Event = new Event ( 'ZOOM_CHANGE' );

	//--VARS EVENTS----------------------------------------------------------------------

	private onMouseDownFnc          : Function;
	private onMouseWheelFnc         : Function;
	private onKeyDownFnc            : Function;
	private onMouseMoveFnc          : any;
	private onMouseUpFnc            : any;

	//------------------------------------------------------------------------------

	constructor ( object : THREE.Object3D , domElement ? ) {

		super();

		this.domElement     = ( domElement !== undefined ) ? domElement : document;

		this.state          = this.STATE.NONE;
		this.object         = object;

		this.onMouseMoveFnc   = ( event ) => { this.onMouseMove( event );}
		this.onMouseUpFnc     = ( event ) => { this.onMouseUp( event );}

		this.onMouseDownFnc   = ( event ) => { this.onMouseDown( event );}
		this.onMouseWheelFnc  = ( event ) => { this.onMouseWheel( event );}
		this.onKeyDownFnc     = ( event ) => { this.onKeyDown( event );}

		this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
		this.domElement.addEventListener( 'mousedown', this.onMouseDownFnc, false );
		this.domElement.addEventListener( 'touchstart', this.onMouseDownFnc, false );
		//this.domElement.addEventListener( 'mousewheel', this.onMouseWheelFnc, false );
		this.domElement.addEventListener( 'DOMMouseScroll', this.onMouseWheelFnc, false ); // firefox
		this.domElement.addEventListener( 'keydown', this.onKeyDownFnc, false );

	}

	//------------------------------------------------------------------------------

	public isUserDragging() : boolean
	{
		return ( this.state === this.STATE.ROTATE );
	}
	/*
	 */
	public track( flag : boolean , object : THREE.Object3D ) : void
	{
		this.autoTrack      = flag;
		this.trackObject    = object;
	}
	/*
	 */
	public tweenTo( theta : number , phi : number , time : number = 5 ) : void
	{
		this.update();

		if (  this.state !== this.STATE.ROTATE){

			if ( theta + Math.abs(this.theta ) >= Math.PI * 2 )
				theta -= Math.PI * 2;

			if ( phi + Math.abs(this.phi ) >= Math.PI * 2 )
				phi -= Math.PI * 2;

			this.tweenToPosition    = true;

			var tweenProps : Object = {

				theta:theta,
				phi:phi,
				onComplete:(event)=>this.tweenToComplete(event),
				ease:"Quad.easeInOut"

			}

			TweenLite.killTweensOf( this );
			TweenLite.to( this , time , tweenProps );

		}

	}
	/*
	 */
	public rotateLeft ( angle )
	{

		if ( angle === undefined )
			angle = this.getAutoRotationAngle();


		this.thetaDelta -= angle;

	}
	/*
	 */
	public rotateRight ( angle )
	{

		if ( angle === undefined )
			angle = this.getAutoRotationAngle();

		this.thetaDelta += angle;

	}
	/*
	 */
	public rotateUp ( angle )
	{

		if ( angle === undefined )
			angle = this.getAutoRotationAngle();

		this.phiDelta -= angle;

	}
	/*
	 */
	public rotateDown ( angle )
	{
		if ( angle === undefined )
			angle = this.getAutoRotationAngle();

		this.phiDelta += angle;

	}
	/*
	 */
	public zoomIn ( zoomScale ? )
	{
		if ( zoomScale === undefined )
			zoomScale = this.getZoomScale();

		this.scale /= zoomScale;

	}
	/*
	 */
	public zoomOut ( zoomScale ? )
	{
		if ( zoomScale === undefined )
			zoomScale = this.getZoomScale();

		this.scale *= zoomScale;

	}
	/*
	 */
	public pan ( distance : THREE.Vector3 )
	{
		distance.transformDirection( this.object.matrix );
		distance.multiplyScalar( this.userPanSpeed );

		this.object.position.add( distance );
		this.center.add( distance );
	}
	/*
	 */
	public update ()
	{

		var position        = this.object.position;
		var offset          = position.clone().sub( this.center );
		this.radius         = offset.length() * this.scale;
		this.radius         = Math.max( this.minDistance, Math.min( this.maxDistance, this.radius ) );// restrict radius to be between desired limits

		if( this.phi > Math.PI * 2 ) this.phi -= Math.PI * 2;
		if( this.theta > Math.PI * 2 ) this.theta -= Math.PI * 2;

		if ( ! this.tweenToPosition ) {

			this.theta      = Math.atan2( offset.x, offset.z );// angle from z-axis around y-axis
			this.phi        = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );// angle from y-axis

			if ( this.autoRotate )
				this.rotateLeft( this.getAutoRotationAngle() );

			if ( this.autoTrack && ( this.state === this.STATE.NONE) ) {

				if ( this.trackPrev === undefined )
					this.trackPrev = new THREE.Vector3( this.trackObject.rotation.x , this.trackObject.rotation.y , this.trackObject.rotation.z);

				this.theta += this.trackObject.rotation.y - this.trackPrev.y;
				this.trackPrev.x = this.trackObject.rotation.x;
				this.trackPrev.y = this.trackObject.rotation.y;
				this.trackPrev.z = this.trackObject.rotation.z;

			}
			else
			{
				this.theta       += this.thetaDelta;
				this.phi         += this.phiDelta;
			}

			this.phi    = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle , this.phi ) );// restrict phi to be between desired limits
			this.phi    = Math.max( this.EPS, Math.min( Math.PI - this.EPS , this.phi ) );// restrict phi to be betwee EPS and PI-EPS

		}

		if ( ( this.radius !== undefined ) && ( offset !== undefined ) )
		{

			this.phi    = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, this.phi ) );// restrict phi to be between desired limits
			this.phi    = Math.max( this.EPS, Math.min( Math.PI - this.EPS, this.phi ) );// restrict phi to be betwee EPS and PI-EPS

			offset.x    = this.radius * Math.sin( this.phi ) * Math.sin( this.theta );
			offset.y    = this.radius * Math.cos( this.phi );
			offset.z    = this.radius * Math.sin( this.phi ) * Math.cos( this.theta );

			position.copy( this.center ).add( offset );

			this.object.lookAt( this.center );

			this.thetaDelta = 0;
			this.phiDelta   = 0;
			this.scale      = 1;

			if ( this.lastPosition.distanceTo( this.object.position ) > 0 )
			{
				this.dispatchEvent( this.changeEvent );
				this.lastPosition.copy( this.object.position );
			}
		}
	}

	//--PRIVATE----------------------------------------------------------------------

	/*
	 */
	public getAutoRotationAngle()
	{
		return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;
	}
	/*
	 */
	private getZoomScale()
	{
		return Math.pow( 0.95, this.userZoomSpeed );
	}
	/*
	 */
	private initTrack() : void
	{
		 if ( this.trackPrev === undefined && this.trackObject !== undefined )
			this.trackPrev = new THREE.Vector3( this.trackObject.rotation.x , this.trackObject.rotation.y , this.trackObject.rotation.z);
	}
	/*
	 */
	private updateTrack() : void
	{

		if ( this.autoTrack && this.trackObject !== undefined )
		{
			this.initTrack();
			this.trackPrev.x = this.trackObject.rotation.x;
			this.trackPrev.y = this.trackObject.rotation.y;
			this.trackPrev.z = this.trackObject.rotation.z;

		}

	}

	//--EVENTS----------------------------------------------------------------------

	/*
	 */
	private tweenToComplete( event )
	{

		if ( this.autoTrack )
			 this.updateTrack();

		this.tweenToPosition    = false;
		this.dispatchEvent( this.TWEEN_TO_COMPLETE);

	}
	/*
	 */
	private onMouseDown( event ) {

        if ( this.state != this.STATE.NONE )
        {
            return;
        }

		if ( this.tweenToPosition)
		{
			this.tweenToPosition    = false;
			TweenLite.killTweensOf( this );
			this.dispatchEvent( this.TWEEN_TO_COMPLETE);
		}

		event.preventDefault();

		if ( !this.userRotate ) return;

		if ( event.button === 0 )
		{

			this.state = this.STATE.ROTATE;
			this.rotateStart.set( event.clientX, event.clientY );
			//this.rotateStart.set( event.clientX, event.clientY );

		}
		else if ( event.button === 1 )
		{
			this.state = this.STATE.ZOOM;
			this.zoomStart.set( event.clientX, event.clientY );
			//this.zoomStart.set( event.clientX, event.clientY );
		}
		else if ( event.button === 2 )
		{
			if ( ! this.userPan ) return;
			this.state = this.STATE.PAN;
		}
		else
		{

			if ( event instanceof TouchEvent )
			{
                this.isTouch = true;
                this.panTouchID = event.targetTouches[0].identifier;
				var t : TouchEvent = <TouchEvent> event;
				this.rotateStart.set( t.changedTouches[0].clientX, t.changedTouches[0].clientY );
				this.state = this.STATE.ROTATE;
			}

		}

		this.dispatchEvent( this.DRAG_START );

		document.addEventListener( 'mousemove', this.onMouseMoveFnc, false );
		document.addEventListener( 'touchmove', this.onMouseMoveFnc, false );
		document.addEventListener( 'mouseup', this.onMouseUpFnc, false );
		document.addEventListener( 'touchend', this.onMouseUpFnc, false );

	}
	/*
	 */
	private onMouseMove( event )
	{
		event.preventDefault();

		if ( this.state === this.STATE.ROTATE )
		{

			if ( event instanceof TouchEvent )
			{
				var t : TouchEvent = <TouchEvent> event;
				this.rotateEnd.set( t.changedTouches[0].clientX, t.changedTouches[0].clientY );
			}
			else
			{
				this.rotateEnd.set( event.clientX, event.clientY);
			}

			this.rotateDelta.subVectors( this.rotateEnd, this.rotateStart );
			this.rotateLeft( 2 * Math.PI * this.rotateDelta.x / this.PIXELS_PER_ROUND * this.userRotateSpeed );
			this.rotateUp( 2 * Math.PI * this.rotateDelta.y / this.PIXELS_PER_ROUND * this.userRotateSpeed );

			this.rotateStart.copy( this.rotateEnd );
		}
		else if ( this.state === this.STATE.ZOOM )
		{

			this.zoomEnd.set( event.clientX, event.clientY );
			this.zoomDelta.subVectors( this.zoomEnd, this.zoomStart );

			if ( this.zoomDelta.y > 0 )
			{
				this.zoomIn();
			}
			else
			{
				this.zoomOut();
			}

			this.zoomStart.copy( this.zoomEnd );

		}
		else if ( this.state === this.STATE.PAN )
		{

			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			this.pan( new THREE.Vector3( - movementX, movementY, 0 ) );

		}

	}
	/*
	 */
	private onMouseUp( event )
	{

		if ( ! this.userRotate ) return;

        if ( event instanceof TouchEvent )
        {
            if ( this.panTouchID != event.changedTouches[0].identifier )
            {
                return;
            }

        }
		if ( this.autoTrack )
			this.updateTrack();

		this.dispatchEvent( this.DRAG_STOP );

		document.removeEventListener( 'mouseup', this.onMouseUpFnc, false );
		document.removeEventListener( 'touchend', this.onMouseUpFnc, false );

		document.removeEventListener( 'mousemove', this.onMouseMoveFnc, false );
		document.removeEventListener( 'touchmove', this.onMouseMoveFnc, false );



		this.state = this.STATE.NONE;

	}
	/*
	 */
	private onMouseWheel( event ) {

		if ( ! this.userZoom ) return;

		var delta = 0;

		if ( event.wheelDelta ) // WebKit / Opera / Explorer 9
		{
			delta = event.wheelDelta;
		}
		else if ( event.detail ) // Firefox
		{
			delta = - event.detail;
		}

		if ( delta > 0 )
		{
			this.zoomOut();
		}
		else
		{
			this.zoomIn();
		}

		this.dispatchEvent( this.ZOOM_CHANGE );

	}
	/*
	 */
	private onKeyDown( event )
	{

		if ( ! this.userPan ) return;

		switch ( event.keyCode )
		{

			case this.keys.UP:
				this.pan( new THREE.Vector3( 0, 1, 0 ) );
				break;
			case this.keys.BOTTOM:
				this.pan( new THREE.Vector3( 0, - 1, 0 ) );
				break;
			case this.keys.LEFT:
				this.pan( new THREE.Vector3( - 1, 0, 0 ) );
				break;
			case this.keys.RIGHT:
				this.pan( new THREE.Vector3( 1, 0, 0 ) );
				break;
		}

	}

}

export = OrbitControls;