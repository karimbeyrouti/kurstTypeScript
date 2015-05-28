import Random from  './Random'

class NumberUtils{

	static rnd : Random;
	public static psrnd : boolean = false;
	public static seed( seed : number , flag : boolean = true ) : void
	{
		NumberUtils.psrnd = flag;

		if ( NumberUtils.rnd)
		{
			NumberUtils.rnd.seed( seed );
		}
		else
		{
			NumberUtils.rnd = new Random( seed );
		}
	}
	/**
	 * Random integer
	 *
	 * @param min
	 * @param max
	 * @returns {number}
	 */
	static getRandomInt(min : number , max: number ) : number
	{
		return NumberUtils.psrnd ?
			Math.floor(NumberUtils.rnd.next() * (max - min + 1)) + min :
			Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * flipWeightedCoin
	 *
	 * @param percentage - 	weight percentage, if random value is less than coin will return true.
	 * 						A percentage of .5 will return true 50% of the time whereas a percentage value of 25% will
	 * 						only return tru 25% of the time.
	 * @returns {boolean}
	 */
	static flipWeightedCoin( percentage : number ) : boolean
	{
		return ( NumberUtils.random(0 , 1 ) <= percentage  );
	}

	/**
	 * Flip coins
	 *
	 * @returns {boolean}
	 */
	static flipCoin( ) : boolean
	{
		return ( NumberUtils.getRandomInt(0 , 2 ) <= 1 );
	}
	/**
	 * random number ( between min / max )
	 * @param low
	 * @param high
	 * @returns {any}
	 */
	static random(low : number = 0 , high : number = 1 ) : number
	{
		if ( low == 0 && high == 1 )
		{
			return NumberUtils.psrnd ?  NumberUtils.rnd.next() : Math.random();
		}

		if (low >= high)
		{
			return low;
		}
		var diff = high - low;

		return NumberUtils.psrnd ?
			(NumberUtils.rnd.next() * diff) + low :
			(Math.random() * diff) + low
	}

	/**
	 * constrain number
	 *
	 * @param v
	 * @param min
	 * @param max
	 * @returns {any}
	 */
	static constrain(v : number , min  : number  , max : number ) : number
	{
		if( v < min )
		{
			v = min;
		}
		else if( v > max )
		{
			v = max;
		}
		return v;
	}
	/**
	 * convert decimal value to Hex
	 * @param d
	 * @param padding
	 * @returns {string}
	 */
	static decimalToHex(d : number , padding : number ) : string
	{
		var hex : string    = d.toString(16).toUpperCase();
		padding             = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

		while (hex.length < padding)
		{
			hex = "0" + hex;
		}
		return hex;
	}
	/**
	 * convert rgb( 12, 213, 123 ) to hex
	 * @param rgb
	 * @returns {string}
	 */
	static rgbToHex ( rgb : string )  : string
	{
		var rgbRegex : RegExp = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
		var result, r, g, b, hex = "";

		if ( ( result = rgbRegex['exec']( rgb ) ) )
		{
			r       = NumberUtils.componentFromStr( result[ 1 ] , result[ 2 ] );
			g       = NumberUtils.componentFromStr( result[ 3 ] , result[ 4 ] );
			b       = NumberUtils.componentFromStr( result[ 5 ] , result[ 6 ] );
			hex     = "#" + ( 0x1000000 + ( r << 16 ) + ( g << 8 ) + b ).toString( 16 ).slice( 1 );
		}

		return hex;
	}
	/**
	 *
	 * @param numStr
	 * @param percent
	 * @returns {number}
	 */
	static componentFromStr ( numStr : string , percent : boolean = false ) : number
	{
		var num = Math.max( 0 , parseInt( numStr , 10 ) );
		return percent ? Math.floor( 255 * Math.min( 100 , num ) / 100 ) : Math.min( 255 , num );
	}
	/**
	 *
	 * @param degrees
	 * @returns {number}
	 */
	static degToRad( degrees : number ) : number
	{
		return degrees * (Math.PI / 180 )
	}
	/**
	 *
	 * @param rad
	 * @returns {number}
	 */
	static radToDeg( rad : number ) : number
	{
		return rad * (180/Math.PI );
	}


}

export = NumberUtils


