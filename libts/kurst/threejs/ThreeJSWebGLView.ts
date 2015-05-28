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

import EventDispatcher 			from "../events/EventDispatcher"
import Event 					from "../events/Event"
import OrbitControls			from "./OrbitControls"
import Detector					from "./Detector"
import TrackballControls		from "./TrackballControls"


class ThreeJSWebGLView extends EventDispatcher{

	//------------------------------------------------------------------------

	public renderer             : THREE.WebGLRenderer;
	public scene                : THREE.Scene;
	public camera               : THREE.PerspectiveCamera;
	public container            : HTMLElement;//
	public clearColor           : number = 0x000000;
	public trackControls        : TrackballControls;
	public trackControlEnabled  : boolean = false;
	public autoResize			: boolean;

	//------------------------------------------------------------------------

	private detector            : Detector;
	private renderFlag          : boolean = false;
	private _alpha				: boolean;
	private _clearAlpha			: number = 1;

	//------------------------------------------------------------------------

	public resizeEvent          : Event = new Event( 'resize' );
	private resizeEventTarget	: ( event ) => any;
	//------------------------------------------------------------------------

	constructor( container ? : HTMLElement , autoResize : boolean = false , alpha : boolean = false , clearAlpha : number = 1 )
	{
		super();

		this._alpha = alpha;
		this._clearAlpha = clearAlpha;

		this.autoResize = autoResize;
		this.container = container;
		this.initThreeJSWebGLView();
		this.resizeEventTarget = event => this.onWindowResize( event )
		window.addEventListener( 'resize', this.resizeEventTarget  , false );
	}

	//------------------------------------------------------------------------

	/**
	 *
	 */
	public dispose() : void
	{

		window.removeEventListener( 'resize', this.resizeEventTarget  , false );

		if ( this.container )
		{
			this.container.removeChild( <Node> this.renderer.domElement );
		}

		if ( this.trackControlEnabled )
		{
			this.trackControls.dispose();
			this.trackControls.removeEventListener('change', this.controlChange );
		}
		this.stopRender();
		this.scene = null;
		this.renderer = null;
		this.camera = null;
		this.trackControls = null;
	}
	/*
	 */
	public enableTrackBall( flag : boolean , container : HTMLElement = null ) : void
	{


		if ( flag )
		{
			container = ( container == null ) ? this.canvas : container;

			this.trackControls                       = new TrackballControls( this.camera , container );
			this.trackControls.rotateSpeed           = 1.0;
			this.trackControls.zoomSpeed             = 1.2;
			this.trackControls.panSpeed              = 0.8;
			this.trackControls.noZoom                = false;
			this.trackControls.noPan                 = true;
			this.trackControls.staticMoving          = false;
			this.trackControls.dynamicDampingFactor  = 0.1;
			this.trackControls.zoomSpeed             = 0.45;
			this.trackControls.addEventListener('change', this.controlChange );
		}

		this.trackControlEnabled = flag;
	}
	/*
	 */
	public render() : void
	{

		if ( this.trackControlEnabled )
			if ( this.trackControls )
				this.trackControls.update();

		this.renderer.render( this.scene, this.camera );

	}
	/*
	 */
	public startRender() : void
	{

		this.renderFlag = true;

		var updateFunc = () => {

			this.render();

			if( this.renderFlag )
				requestAnimationFrame( updateFunc );
		}

		requestAnimationFrame( updateFunc );

	}
	/*
	 */
	public stopRender() : void
	{
		this.renderFlag = false;
	}
	/**
	 *
	 * @returns {HTMLCanvasElement}
	 */
	public get canvas() : HTMLCanvasElement
	{
		return this.renderer.domElement;
	}
	/**
	 *
	 */
	public setSize( width : number , height : number ) : void
	{
		this.camera.aspect = width / height ;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( width, height );
		this.dispatchEvent( this.resizeEvent );
	}

	//------------------------------------------------------------------------

	/*
	 */
	private initThreeJSWebGLView() : void
	{
		this.detector = new Detector();
		//this.initContainer();
		this.initScene();
		this.initRenderer();
		this.initCamera();
	}
	/*
	 */
	private initScene() : void
	{
		this.scene                  = new THREE.Scene();
	}
	/*
	 */
	private initRenderer() : void
	{
		this.renderer               = new THREE.WebGLRenderer( { antialias: true, clearColor: this.clearColor, clearAlpha: this._clearAlpha , alpha: this._alpha } );
		//this.renderer.shadowMapEnabled = true;
		//this.renderer.shadowMapType = THREE.PCFShadowMap;

		this.renderer.sortObjects   = false;
		this.renderer.setSize( window.innerWidth, window.innerHeight );

		if ( this.container )
		{
			this.container.appendChild( <Node> this.renderer.domElement );
		}
	}
	/*
	 */
	private initCamera() : void
	{
		this.camera                 = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight  );
		this.camera.position.z      = 1000;
	}

	//------------------------------------------------------------------------

	/*
	 */
	private onWindowResize( event ) : void
	{

		if ( this.autoResize )
		{
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.dispatchEvent( this.resizeEvent );
		}
	}
	/*
	 */
	private controlChange() : void {}


}


export = ThreeJSWebGLView;