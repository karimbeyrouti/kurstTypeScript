class GSVPanoOptions
{
	public _location : any;
	public _zoom : any;
	public _panoId : any;
	public _panoClient = new google.maps.StreetViewService();
	public _count : number = 0;
	public _total : number = 0;
	public _canvas :  any= [];
	public _ctx  : any = [];
	public _wc : number = 0;
	public _hc : number = 0;
	public _panoWidth: number
	public _panoHeight: number
	public result : any = null;
	public rotation : any = 0;
	public copyright : string = '';
	public onSizeChange : any = null;
	public onPanoramaLoad : any = null;
}