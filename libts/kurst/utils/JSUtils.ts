/// <reference path="../../libs/chrome.d.ts" />
import Point from "../geom/Point"

class JSUtils{

	//--Mobile------------------------------------------------------------------------

	/*
	 * Check is running platform is android
	 */
	static isAndroid () : boolean
	{
		return navigator.userAgent.match(/Android/i) ? true : false;
	}
	/*
	 * Check is running platform is Blackberry
	 */
	static isBlackBerry() : boolean
	{
		return navigator.userAgent.match(/BlackBerry/i) ? true : false;
	}
	/*
	 * Check is running platform is IOS
	 */
	static isIOS() : boolean
	{
		return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
	}
	/*
	 * Check is running platform is Window Mobile
	 */
	static isWindowsMob() : boolean
	{
		return navigator.userAgent.match(/IEMobile/i) ? true : false;
	}
	/*
	 * Check is running platform is Mobile
	 */
	static isMobile() : boolean
	{
		return (JSUtils.isAndroid() || JSUtils.isBlackBerry() || JSUtils.isIOS() || JSUtils.isWindowsMob());
	}

	//--Selection------------------------------------------------------------------------
	//

	/*
	 * select an element by ID
	 */
	static getId(id : string ) : HTMLElement
	{
		return document.getElementById( id );
	}
	/*
	 * select a list of elements by class
	 */
	static getClass( className : string ) : NodeList
	{
		return document.getElementsByClassName( className );
	}
	/*
	 * get a list of elenement by classname
	 */
	static getElementsByClassNme( theClass : string ) : Node[]
	{

		var classElms   : Array<Node> = new Array<Node>();//[];
		var node        : Document = document;

		var i = 0

		if ( node.getElementsByClassName ) { // check if it's natively available

			var tempEls = node.getElementsByClassName(theClass);

			for ( i = 0 ; i < tempEls.length ; i++)
				classElms.push(tempEls[i]);


		}
		else // if a native implementation is not available, use a custom one
		{

			var getclass    : RegExp    = new RegExp('\\b'+theClass+'\\b');
			var elems       : NodeList  = node.getElementsByTagName('*');

			for ( i = 0; i < elems.length; i++)
			{

				var classes = elems[i]['className'];

				if ( getclass.test( classes ))
					classElms.push(elems[i]);

			}
		}

		return classElms;

	}
	/*
	 * get query parameters (
	 * @param qs: Query string
	 */
	static getQueryParams( qs ) : Object
	{

		qs = qs.split("+").join(" ");

		var params = {}, tokens,
			re = /[?&]?([^=]+)=([^&]*)/g;

		while (tokens = re.exec(qs))
		{
			params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
		}

		return params;

	}

	//--Desktop------------------------------------------------------------------------

	/*
	 * Check is running platform is Firefox
	 */
	static isFireFox() : boolean
	{
		return ( navigator.userAgent.search("Firefox") != -1 );
	}
	/*
	 * Check is running platform is Internet Explorer
	 */
	static isIE() : boolean
	{
		return ( navigator.appVersion.indexOf("MSIE") != -1 );
	}
	/*
	 * Get version of internet Explorer
	 */
	static getIEVersion() : number
	{
		if ( JSUtils.isIE() )
			return parseFloat( navigator.appVersion.split( "MSIE" )[1] );

		return -1;

	}
	/*
	 * Check if platform supports flash
	 */
	static isFlashEnabled() : boolean
	{

		if( JSUtils.isIE() ) {

			var version : number = JSUtils.getIEVersion();

			if ( version > 8 )
			{
				return ( window['ActiveXObject'] && ( new ActiveXObject("ShockwaveFlash.ShockwaveFlash") ) != false );
			}
			else
			{
				try
				{
					var aXObj = new ActiveXObject( 'ShockwaveFlash.ShockwaveFlash' );

					if ( aXObj )
						return true;

					return false;

				}
				catch ( ex )
				{
					return false;
				}
			}

			return false;

		}
		else
		{
			return ((typeof navigator.plugins != "undefined" && typeof navigator.plugins["Shockwave Flash"] == "object")  != false );
		}

	}
	/**
	 *
	 * @returns {boolean}
	 */
	static isChromeApp() : boolean
	{
		if ( !window.hasOwnProperty('chrome')) return false;;
		if ( !chrome ) return false;
		if (!chrome['system']) return false;
		return true
	}
	//--Window utils

	/**
	 *
	 * @returns {Point}
	 */
	static getPageOffset() : Point
	{
		var doc : HTMLElement = document.documentElement;
		var body : HTMLElement = document.body;
		//var left : number = (doc && doc.scrollLeft || body && body.scrollLeft || 0);
		//var top : number = (doc && doc.scrollTop  || body && body.scrollTop  || 0);

		return new Point((doc && doc.scrollLeft || body && body.scrollLeft || 0),(doc && doc.scrollTop  || body && body.scrollTop  || 0));

	}

}

export = JSUtils;
