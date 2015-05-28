
/// <reference path="../../libs/three.d.ts" />
/// <reference path="../../libs/google.maps.d.ts" />

// Needs a good clean up - but currently functional

import EventDispatcher 	from "../events/EventDispatcher"
import Event 			from "../events/Event"

class GSVPano extends EventDispatcher
{

	//--------------------------------------------------------------------------------------------------------------

	public useWebGL 		: boolean = true;

	//--------------------------------------------------------------------------------------------------------------

	private location 		: any;
	private _zoom 			: number = 3;
	private _panoId		 	: any;
	private _panoClient 	: google.maps.StreetViewService = new google.maps.StreetViewService();
	private _count 			: number = 0;
	private _total 			: number = 0;
	private _canvas 		:  Array<HTMLCanvasElement>;
	private _ctx  			: Array<CanvasRenderingContext2D> = new Array<CanvasRenderingContext2D>();
	private _wc 			: number = 0;
	private _hc 			: number = 0;
	private _panoWidth		: number;
	private _panoHeight		: number;
	private _loadProgress	: number = 0;

	//--------------------------------------------------------------------------------------------------------------

	private result 			: google.maps.StreetViewPanoramaData = null;
	private maxW 			: number = 1024;
	private maxH 			: number = 1024;
	private levelsW 	: Array<number> = [1, 2, 4, 7, 13, 26];
	private levelsH 	: Array<number> = [1, 1, 2, 4, 7, 13];
	private widths 		: Array<number> = [416, 832, 1664, 3328, 6656, 13312];
	private heights 	: Array<number> = [416, 416, 832, 1664, 3328, 6656];
	private maxTexSize 	: number;
	private gl 			: any = null;

	//--------------------------------------------------------------------------------------------------------------

	public ON_PANORAMA_LOADED 			: Event = new Event( 'ON_PANORAMA_LOADED' );
	public ON_PANORAMA_LOAD_PROGRESS 	: Event = new Event( 'ON_PANORAMA_LOAD_PROGRESS' );
	public ON_PANORAMA_LOAD_ERROR	 	: Event = new Event( 'ON_PANORAMA_LOAD_ERROR' );

	//--------------------------------------------------------------------------------------------------------------

	constructor()
	{

		super();

		try
		{
			var canvas : HTMLCanvasElement = <HTMLCanvasElement> document.createElement('canvas');
			this.gl = canvas.getContext('experimental-webgl');

			if (this.gl == null)
			{
				this.gl = canvas.getContext('webgl');
			}
		}
		catch (error)
		{
		}

		if (this.gl)
		{
			var maxTexSize : number = this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE);
			this.maxW = this.maxH 	= maxTexSize;
		}

		this.maxTexSize = this.maxW;
		this.setZoom( this._zoom );

	}

	// Private

	/**
	 *
	 * @param p
	 */
	private setProgress (p : number ) : void
	{
		this._loadProgress = p;
		this.dispatchEvent( this.ON_PANORAMA_LOAD_PROGRESS );
	}
	/**
	 *
	 * @param message
	 */
	private throwError (message : string ) : void
	{
		this.dispatchEvent( this.ON_PANORAMA_LOAD_ERROR );
	}
	/**
	 *
	 */
	private adaptTextureToZoom () : void
	{

		var w : number = this.widths[this._zoom];
		var h : number = this.heights[this._zoom];

		this._panoWidth = w;
		this._panoHeight = h;

		this._wc = Math.ceil(w / this.maxW);
		this._hc = Math.ceil(h / this.maxH);

		this._canvas = new Array<HTMLCanvasElement>();
		this._ctx = new Array<CanvasRenderingContext2D>();;

		var ptr : number = 0;

		for (var y = 0; y < this._hc; y++)
		{
			for (var x = 0; x < this._wc; x++)
			{
				var c = document.createElement('canvas');
				if (x < (this._wc - 1))
				{
					c.width = this.maxW;
				}
				else
				{
					c.width = w - (this.maxW * x);
				}

				if (y < (this._hc - 1))
				{
					c.height = this.maxH;
				}
				else
				{
					c.height = h - (this.maxH * y);
				}

				c['GSVPANO'] = {x: x,y: y};
				this._canvas.push(c);
				this._ctx.push(c.getContext('2d'));
				ptr++;
			}
		}
	}
	/**
	 *
	 * @param x
	 * @param y
	 * @param texture
	 */
	private composeFromTile (x, y, texture) : void
	{
		x *= 512;
		y *= 512;
		var px = Math.floor(x / this.maxW);
		var py = Math.floor(y / this.maxH);

		x -= px * this.maxW;
		y -= py * this.maxH;

		this._ctx[py * this._wc + px].drawImage(texture, 0, 0, texture.width, texture.height, x, y, 512, 512);

		this.progress();

	}
	/**
	 *
	 */
	private progress () : void
	{

		this._count++;

		var p = Math.round(this._count * 100 / this._total);
		this.setProgress(p);

		if (this._count === this._total)
		{
			this.dispatchEvent( this.ON_PANORAMA_LOADED);
		}
	}
	/**
	 *
	 */
	private composePanorama () : void
	{

		this.setProgress(0);

		var w : number = this.levelsW[this._zoom];
		var h : number = this.levelsH[this._zoom];
		var url : string;
		var x: number;
		var y: number ;

		this._count = 0;
		this._total = w * h;

		var self = this;

		for (var y = 0; y < h; y++)
		{
			for (var x = 0; x < w; x++)
			{
				//url = 'https://cbks2.google.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&panoid=' + this._panoId + '&output=tile&zoom=' + this._zoom + '&x=' + x + '&y=' + y + '&' + Date.now();
				url = 'https://geo0.ggpht.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&panoid=' + this._panoId + '&output=tile&x=' + x + '&y=' + y + '&zoom=' + this._zoom + '&nbt&fover=2';

				(function(x, y)
				{
					if (this.useWebGL)
					{
						var texture : THREE.Texture = THREE.ImageUtils.loadTexture(url, null, function() {
							self.composeFromTile(x, y, texture);
						});
					}
					else
					{
						var img : HTMLImageElement = new Image();
							img.addEventListener('load', function() {
								self.composeFromTile(x, y, this);
							});
							img.crossOrigin = '';
							img.src = url;
					}
				})(x, y);

			}
		}

	}

	// Public

	/**
	 *
	 * @param id
	 */
	public loadFromId (id) : void
	{
		this._loadProgress = 0;
		this._panoId = id;
		this.composePanorama();
	}
	/**
	 *
	 * @returns {Array<HTMLCanvasElement>}
	 */
	public get canvas() : HTMLCanvasElement
	{
		return this._canvas[0];
	}
	/**
	 *
	 * @returns {number}
	 */
	public get zoom() : number
	{
		return this._zoom;
	}
	/**
	 *
	 * @returns {number}
	 */
	public get panoWidth() : number
	{
		return this._panoWidth;
	}
	/**
	 *
	 * @returns {number}
	 */
	public get panoHeight() : number
	{
		return this._panoHeight;
	}
	public get loadProgress() : number
	{
		return this._loadProgress;
	}
	/**
	 *
	 * @param location
	 */
	public load ( location : google.maps.LatLng ) : void
	{

		var self = this;

		var url : string = 'https://maps.google.com/cbk?output=json&hl=x-local&ll=' + location.lat() + ',' + location.lng() + '&cb_client=maps_sv&v=3';
			url = 'https://cbks0.google.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&output=polygon&it=1%3A1&rank=closest&ll=' + location.lat() + ',' + location.lng() + '&radius=350';

		var http_request = new XMLHttpRequest();
			http_request.open("GET", url, true);
			http_request.onreadystatechange = function()
			{
				if (http_request.readyState == 4 && http_request.status == 200)
				{
					var data = JSON.parse(http_request.responseText);
					self.loadPano(location, data.result[0].id);
				}
			};

		http_request.send(null);

	}
	/**
	 *
	 * @param location
	 * @param id
	 */
	public loadPano (location, id) : void
	{
		var self = this;
		this._loadProgress = 0;

		this._panoClient.getPanoramaById(id, function(result : google.maps.StreetViewPanoramaData , status : google.maps.StreetViewStatus )
		{
			if (status === google.maps.StreetViewStatus.OK)
			{
				self.result = result;

				//if (self.onPanoramaData)
				//	self.onPanoramaData(result);

				var h 				= google.maps.geometry.spherical.computeHeading(location, result.location.latLng);
				this.rotation 		= (result.tiles.centerHeading - h) * Math.PI / 180.0;
				//this.copyright 		= result.copyright;
				//self.copyright 		= result.copyright;
				self._panoId 		= result.location.pano;

				self.location = location;
				self.composePanorama();

			}
			else
			{
				//if (self.onNoPanoramaData)
				//	self.onNoPanoramaData(status);

				self.throwError('Could not retrieve panorama for the following reason: ' + status);
			}
		});

	}
	/**
	 *
	 * @param z
	 */
	public setZoom (z) : void
	{
		this._zoom = z;
		this.adaptTextureToZoom();
	}


}

export = GSVPano;

