import Event            from "../../events/Event"
import EventDispatcher  from "../../events/EventDispatcher"
import SVGGradientBase	from "./SVGGradientBase"
import Point            from "../../geom/Point"

class SVGObjectBase extends EventDispatcher
{

	//---------------------------------------------------------------------------------------------------------

	public element 			: SVGElement;

	//---------------------------------------------------------------------------------------------------------

	constructor ()
	{
		super();
	}

	//---------------------------------------------------------------------------------------------------------

	/**
	 * @param elementName
	 */
	public initElement ( elementName : string ) : void
	{
		this.element = this.createSVGElement( elementName );
	}
	/**
	 * @param elementName
	 * @returns {Selection}
	 */
	public createSVGElement ( elementName : string ) : SVGElement
	{
		return <SVGElement> document.createElementNS( 'http://www.w3.org/2000/svg' , elementName );
	}


	//---------------------------------------------------------------------------------------------------------

	/**
	 *
	 * @param val
	 */
	public set id ( val : string )
	{
		this.element.setAttribute( 'id' , val );
	}
	public get id () : string
	{
		return this.element.getAttribute( 'id' );
	}

	//---------------------------------------------------------------------------------------------------------

}

export = SVGObjectBase;
