class StringUtils{

    //--------------------------------------------------------------------------

	/**
	 * String to XML
	 * @param xmlString
	 * @returns {Document}
	 */
	static strToXML( xmlString : string ) : Document
	{
		return (new DOMParser()).parseFromString( xmlString , "text/xml"); //
	}
    /** Function count the occurrences of substring in a string;
     * @param {String} string   Required. The string;
     * @param {String} subString    Required. The string to search for;
     * @param {Boolean} allowOverlapping    Optional. Default: false;
     */
    static occurrences(str : string , subString : string , allowOverlapping : boolean = false ) : number
    {

        str         += "";
        subString   += "";

        if(subString.length<=0)
            return str.length+1;

        var n       : number    = 0;
        var pos     : number    = 0;
        var step    : number    = (allowOverlapping) ? (1) : (subString.length);

        while(true)
        {
            pos=str.indexOf(subString,pos);

            if(pos>=0)
            {
                n++;
                pos+=step;
            }
            else
            {
                break;
            }

        }
        return(n);
    }
	/**
	 *
	 * @param value
	 * @returns {boolean}
	 */
	public static isString(value: any): boolean
	{
		return Object.prototype.toString.apply(value, []) === '[object String]';
	}
	/**
	 *
	 * @param array
	 * @returns {string}
	 */
	public static fromCharCodeArray(array: number[]): string
	{
		return String.fromCharCode.apply(null, array);
	}
	/**
	 *  Test if string ends with
	 * @param string
	 * @param value
	 * @returns {boolean}
	 */
	public static endsWith(string: string, value: string): boolean
	{
		return string.substring(string.length - value.length, string.length) === value;
	}
	/**
	 * Test if string starts with
	 * @param string
	 * @param value
	 * @returns {boolean}
	 */
	public static startsWith(string: string, value: string): boolean
	{
		return string.substr(0, value.length) === value;
	}
	/**
	 *
	 * @param source
	 * @param sourceIndex
	 * @param destination
	 * @param destinationIndex
	 * @param count
	 */
	public static copyTo(source: string, sourceIndex: number, destination: number[], destinationIndex: number, count: number): void
	{
		for (var i = 0; i < count; i++)
		{
			destination[destinationIndex + i] = source.charCodeAt(sourceIndex + i);
		}
	}
	/**
	 * repeat value
	 * @param value
	 * @param count
	 * @returns {string}
	 */
	public static repeat(value: string, count: number) : string
	{
		return Array(count + 1).join(value);
	}
	/**
	 * Compare two strings
	 * @param val1
	 * @param val2
	 * @returns {boolean}
	 */
	public static stringEquals(val1: string, val2: string): boolean
	{
		return val1 === val2;
	}
	/**
	 * Capitalise first letter in string
	 * @param str
	 * @returns {string}
	 */
	public static capitaliseFirstLetter( str ) : string
	{
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	/**
	 * Catptalise all words
	 * @param str
	 * @returns {string}
	 */
	public static capitaliseAllWords( str : string ) : string
	{
		var a : Array<string> = str.split( ' ' );
		var l : number = a.length;
		var result : string = '';
		for ( var c : number = 0 ; c < l ; c ++ )
		{
			result += ' ' + StringUtils.capitaliseFirstLetter( a[c].toLowerCase() );

		}
		return result;
	}


}

export = StringUtils


