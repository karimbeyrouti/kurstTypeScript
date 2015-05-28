import EventDispatcher = require("../events/EventDispatcher");
import Event = require("../events/Event");

class JSONLoader extends EventDispatcher {

    //--------------------------------------------------------------------------

    private loader              : XMLHttpRequest;
    private jsonData            : Object;
    private jsonString          : string;

	//--------------------------------------------------------------------------

	public id                   : string;
	public loaded               : boolean = false;
    //--------------------------------------------------------------------------

    public LOAD_SUCCESS         : Event = new Event('JSonLoader_loaded');
    public LOAD_ERROR           : Event = new Event('JSonLoader_loaderror');

    //--------------------------------------------------------------------------

    constructor( )
    {
        super();
        this.loader                 = new XMLHttpRequest();
    }

    //--------------------------------------------------------------------------

	public load( ) : void
	{
		if ( this.loader )
		{
			this.loader.send();
		}
	}
    /*
     * Load a JSON data file
     */
    public loadJson( uri : string , load : boolean = true ) : void
    {

	    this.loaded = false;

        if ( ! this.loader )
            this.loader = new XMLHttpRequest();

        var controller : JSONLoader = this;

        this.loader.open( 'GET' , uri , true );
        this.loader.onload  = function ( event ) { controller.onLoadComplete( event ); }
        this.loader.onerror = function ( event ) { controller.onLoadError( event ); }
        this.loader.responseType = 'text';

	    if ( load )
	    {
            this.loader.send();
	    }

    }
    /*
     * Get JSON data
     */
    public getData() : Object
    {
        return this.jsonData;
    }
    /*
     * Get RAW JSON string
     */
    public getJSONString() : string
    {
        return this.jsonString;
    }

    //--------------------------------------------------------------------------

    /*
     * Data load completed
     */
    private onLoadComplete( event )
    {

	    this.loaded = true ;

        var xhr : XMLHttpRequest    = event['currentTarget'];

        try {

            this.jsonData               = JSON.parse( xhr.responseText );
            this.jsonString             = xhr.responseText;

            this.dispatchEvent( this.LOAD_SUCCESS );


        }
        catch ( e )
        {
            this.jsonString             = xhr.responseText;
            this.dispatchEvent( this.LOAD_ERROR );
        }

    }
    /*
     * Data load error
     */
    private onLoadError( event )
    {
        var xhr : XMLHttpRequest = event['currentTarget'];
            xhr.abort();
        this.dispatchEvent( this.LOAD_ERROR );
    }

}

export = JSONLoader;