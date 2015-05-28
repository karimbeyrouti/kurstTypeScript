class GeoData {

	//--------------------------------------------

	public statusCode       : string;   // "OK",
	public statusMessage    : string;   // "",
	public ipAddress        : string;   //"81.97.40.44",
	public countryCode      : string;   // "GB",
	public countryName      : string;   //"UNITED KINGDOM",
	public regionName       : string;   //"ENGLAND",
	public cityName         : string;   //"STOKE-ON-TRENT",
	public zipCode          : string;   //"-",
	public latitude         : number;   // "53.0042",
	public longitude        : number;   //"-2.18538",
	public timeZone         : string;   // "+01:00"
	public dateString       : string;   // "+01:00"
	public date             : Date;     //

	//--------------------------------------------

	public init() : void
	{

		// date format: yyyymmdd;

		if( this.dateString.length === 8 )
		{
			var date    : string    = this.dateString;
			var y       : number    = parseInt( date.slice( 0 , 4 ) );
			var m       : number    = parseInt( date.slice( 4 , 6 ) );
			var d       : number    = parseInt( date.slice( 6 , 8 ) );

			this.date              = new Date();
			this.date.setFullYear( y , m - 1 , d );
		}

	}

}

export = GeoData;