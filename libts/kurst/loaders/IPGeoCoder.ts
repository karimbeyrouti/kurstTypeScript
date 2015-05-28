import EventDispatcher 	from "../events/EventDispatcher"
import Event 			from "../events/Event"
import JSONLoader 		from "./JSONLoader"
import GeoData 			from "./data/GeoData"

class IPGeoCoder extends EventDispatcher
{

	//------------------------------------------------------------------------

	public useProxy : boolean = true;
	public proxy 	: string = 'data/proxy.php';

	//------------------------------------------------------------------------

	private apikey 		: string;
	private jsonLoader 	: JSONLoader;
	private proxyParam 	: string = 'url';
	private data 		: GeoData;

	//------------------------------------------------------------------------

	public LOAD_SUCCESS : Event = new Event( 'IPGeoCoder_loaded' );
	public LOAD_ERROR 	: Event = new Event( 'IPGeoCoder_loadfailed' );

	//------------------------------------------------------------------------

	constructor ( apikey : string )
	{

		super();

		this.apikey = apikey;
		this.jsonLoader = new JSONLoader();

		this.jsonLoader.addEventListener( this.jsonLoader.LOAD_ERROR.type , ( event ) => this.jsonLoadFail() );
		this.jsonLoader.addEventListener( this.jsonLoader.LOAD_SUCCESS.type , ( event ) => this.jsonLoaded() );

	}

	//------------------------------------------------------------------------

	/*
	 */
	public locateIP ( ip : string ) : void
	{

		var uri : string = 'http://api.ipinfodb.com/v3/ip-city/?key=' + this.apikey + '&ip=' + ip + '&format=json';

		if ( this.useProxy )
		{
			uri = this.proxy + '?' + this.proxyParam + '=' + encodeURIComponent( uri );
		}

		this.jsonLoader.loadJson( uri );
	}

	/*
	 */
	public enableProxy ( flag : boolean , uri : string , param : string ) : void
	{
		this.useProxy = flag;
		this.proxy = uri;
		this.proxyParam = param;
	}

	/*
	 */
	public getLocationData () : GeoData
	{
		return this.data;
	}

	//------------------------------------------------------------------------

	/*
	 */
	private jsonLoaded () : void
	{

		var json : Object = this.jsonLoader.getData();

		this.data 				= new GeoData();
		this.data.statusCode 	= json['statusCode'];
		this.data.statusMessage = json['statusMessage'];
		this.data.ipAddress 	= json['ipAddress'];
		this.data.countryCode 	= json['countryCode'];
		this.data.countryName 	= json['countryName'];
		this.data.regionName 	= json['regionName'];
		this.data.cityName 		= json['cityName'];
		this.data.zipCode 		= json['zipCode'];
		this.data.latitude 		= parseFloat( json['latitude'] );
		this.data.longitude 	= parseFloat( json['longitude'] );
		this.data.timeZone 		= json['timeZone'];

		this.dispatchEvent( this.LOAD_SUCCESS );
	}

	/*
	 */
	private jsonLoadFail () : void
	{
		this.dispatchEvent( this.LOAD_ERROR );
	}

}
 export  = IPGeoCoder;