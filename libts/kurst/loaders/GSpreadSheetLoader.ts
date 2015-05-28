import EventDispatcher = require("../events/EventDispatcher");
import Event = require("../events/Event");
import JSONLoader = require("./JSONLoader");

class GSpreadSheetLoader extends EventDispatcher
{

	//--------------------------------------------------------------------------

	private jsLoader : JSONLoader;
	private jsonData : Object;
	private gSheetHead : Object[];
	private gSheetData : Object[];

	//------------------------------------------------------------------------

	public LOAD_SUCCESS : Event = new Event( 'GSpreadSheetLoader_loaded' );
	public LOAD_ERROR : Event = new Event( 'GSpreadSheetLoader_loadfailed' );

	//--------------------------------------------------------------------------

	constructor ()
	{

		super();

		this.jsLoader = new JSONLoader();
		this.jsLoader.addEventListener( this.jsLoader.LOAD_ERROR.type , ( event ) => this.jsonLoadError() );
		this.jsLoader.addEventListener( this.jsLoader.LOAD_SUCCESS.type , ( event ) => this.jsonLoaded() );

	}

	//--------------------------------------------------------------------------

	/*
	 * Load a Public Google Docs Spreadsheet
	 */
	public loadSpreadSheet ( id : string ) : void
	{
		this.jsLoader.loadJson( 'https://spreadsheets.google.com/feeds/list/' + id + '/od6/public/values?alt=json' );
	}

	/*
	 * get parsed Google Spreadsheet data
	 */
	public getData () : Object[]
	{
		return this.gSheetData;
	}

	/*
	 * get parsed Header for Google Spreadsheet
	 */
	public getHead () : Object[]
	{
		return this.gSheetHead;
	}

	/*
	 * get Raw JSON
	 */
	public getJSONString () : string
	{
		return this.jsLoader.getJSONString();
	}

	//--------------------------------------------------------------------------

	/*
	 * Parse the google docs Spreadsheet JSON
	 */
	private parseData ( data : Object ) : void
	{

		//--------------------------------------------------------------

		this.gSheetHead = [];
		this.gSheetData = [];

		//--------------------------------------------------------------

		var jsonRowData : Array<any> = data['feed']['entry'];
		/* Array */
		var firstObj = jsonRowData[0];
		/* Object */
		var dataPrefix = 'gsx$';
		/* string */
		var rowData;
		var colName;
		var row;

		// TABLE HEAD --------------------------------------------------

		for ( var rowDataKey in firstObj )
		{
			if ( rowDataKey.indexOf( dataPrefix ) != -1 )
			{
				this.gSheetHead.push( rowDataKey.slice( dataPrefix.length , rowDataKey.length ) );
			}
		}

		// TABLE DATA --------------------------------------------------

		for ( var c = 0 ; c < jsonRowData.length ; c++ )
		{
			rowData = jsonRowData[c];
			row = new Object();

			for ( var d = 0 ; d < this.gSheetHead.length ; d++ )
			{

				colName = this.gSheetHead[ d ];
				row[ colName ] = rowData[ dataPrefix + colName ].$t;

			}

			this.gSheetData.push( row );

		}

	}

	/*
	 * JSON loaded callback
	 */
	private jsonLoaded () : void
	{
		this.jsonData = this.jsLoader.getData();
		this.parseData( this.jsonData );
		this.dispatchEvent( this.LOAD_SUCCESS );
	}

	/*
	 * JSON load error callback
	 */
	private jsonLoadError () : void
	{
		this.dispatchEvent( this.LOAD_ERROR );
	}

}

export = GSpreadSheetLoader;