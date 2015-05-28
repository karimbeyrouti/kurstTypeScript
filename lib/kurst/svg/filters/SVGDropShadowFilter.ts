import SVGFilterBase            = require("./../core/SVGFilterBase");

class SVGDropShadowFilter extends SVGFilterBase
{

	//---------------------------------------------------------------------------------------------------------

	private feBlend : SVGFEBlendElement;
	private feBlur	: SVGFEGaussianBlurElement;
	private feOffset : SVGFEOffsetElement;

	private cte : SVGFEComponentTransferElement;
	private _blurX : number = 0;
	private _blurY : number = 0;
	//---------------------------------------------------------------------------------------------------------

	constructor ()
	{
		super();

		this.feOffset = <SVGFEOffsetElement> this.createSVGElement( 'feOffset' );
		this.feOffset.setAttribute( 'dx' , '2');
		this.feOffset.setAttribute( 'dy' , '3');

		this.feBlur = <SVGFEGaussianBlurElement> this.createSVGElement( 'feGaussianBlur' );
		this.feBlur.setAttribute( 'in' , 'SourceAlpha');
		this.feBlur.setAttribute( 'stdDeviation' , '3');

		this.cte = <SVGFEComponentTransferElement> this.createSVGElement( 'feComponentTransfer' );

		var fa : SVGElement = <SVGElement> this.createSVGElement( 'feFuncA' );
			fa.setAttribute( 'type' , 'linear' );
			fa.setAttribute( 'slope' , '0.65' );
		this.cte.appendChild( fa );

		var mrgn 	: SVGElement = <SVGElement> this.createSVGElement( 'feMergeNode' );
		var mrgnB 	: SVGElement = <SVGElement> this.createSVGElement( 'feMergeNode' );
			mrgnB.setAttribute( 'in' , 'SourceGraphic' );

		var mrg 	: SVGElement = <SVGElement> this.createSVGElement( 'feMerge' );
			mrg.appendChild( mrgn );
			mrg.appendChild( mrgnB );

		this.appendFilter( this.feBlur );
		this.appendFilter( this.feOffset );
		this.appendFilter( this.cte );
		this.appendFilter( mrg );

	}

	//---------------------------------------------------------------------------------------------------------


	/**
	 *
	 */
	public get blurX () : number
	{
		return  this._blurX;
	}
	public set blurX ( val : number )
	{
		this._blurX = val;
	}
	/**
	 *
	 */
	public get blurY () : number
	{
		return  this._blurY;
	}
	public set blurY ( val : number )
	{
		this._blurY = val;
	}
}

export = SVGDropShadowFilter;
