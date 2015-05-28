import Event = require("./Event");

/**
 * Base class for dispatching events
 *
 * @class EventDispatcher
 *
 */
class EventDispatcher
{
	private listeners:Array<Array<ListenerVO>> = new Array<Array<ListenerVO>>();
	private _target:any;

	constructor(target:any = null)
	{
		this._target = target || this;
	}

	/**
	 * Add an event listener
	 * @method addEventListener
	 * @param {String} Name of event to add a listener for
	 * @param {Function} Callback function
	 */
	public addEventListener(type:string, listener:Function , scope:Object = null )
	{
		if (this.listeners[ type ] === undefined)
			this.listeners[ type ] = new Array<ListenerVO>();

		if (this.getEventListenerIndex(type, listener) === -1)
		{
			var lv : ListenerVO = new ListenerVO();
			lv.listener 	= listener;
			lv.scope 		= scope;
			lv.type 		= type;
			this.listeners[ type ].push(lv);
		}
	}

	/**
	 * Remove an event listener
	 * @method removeEventListener
	 * @param {String} Name of event to remove a listener for
	 * @param {Function} Callback function
	 */
	public removeEventListener(type:string, listener:Function , scope:Object = null)
	{
		var index:number = this.getEventListenerIndex(type, listener , scope );

		if (index !== -1)
		{
			this.listeners[ type ].splice(index, 1);
		}
	}

	/**
	 * Dispatch an event
	 * @method dispatchEvent
	 * @param {Event} Event to dispatch
	 */
	public dispatchEvent(event:Event)
	{
		var listenerArray:Array<ListenerVO> = this.listeners[ event.type ];

		if (listenerArray !== undefined) {
			var l:number = listenerArray.length;

			event.target = this._target;

			var lv : ListenerVO;
			for (var i:number = 0; i < l; i++)
			{
				lv = listenerArray[i];

				if ( lv )
				{
					if ( lv.scope )
					{
						lv.listener.apply(lv.scope , [event]);
					}
					else
					{
						lv.listener(event);
					}
				}
			}
		}
	}

	/**
	 * get Event Listener Index in array. Returns -1 if no listener is added
	 * @method getEventListenerIndex
	 * @param {String} Name of event to remove a listener for
	 * @param {Function} Callback function
	 */
	private getEventListenerIndex(type:string, listener:Function , scope : Object = null ):number
	{
		if (this.listeners[ type ] !== undefined)
		{
			var a:Array<ListenerVO> = this.listeners[ type ];
			var l:number = a.length;
			var lv : ListenerVO;
			for (var i:number = 0; i < l; i++)
			{
				lv = a[i];
				if (listener == lv.listener && lv.scope == scope )
				{
					return i;
				}
			}
		}

		return -1;
	}

	/**
	 * check if an object has an event listener assigned to it
	 * @method hasListener
	 * @param {String} Name of event to remove a listener for
	 * @param {Function} Callback function
	 */
	public hasEventListener(type:string, listener?:Function , scope : Object = null ):boolean
	{
		if (listener != null)
		{
			return ( this.getEventListenerIndex(type, listener , scope ) !== -1 );
		}
		else
		{
			if (this.listeners[ type ] !== undefined)
				return ( this.listeners[ type ].length > 0 );

			return false;
		}

		return false;
	}
}

class ListenerVO
{
	public scope 	: Object;
	public listener : Function;
	public type 	: string;
}

export = EventDispatcher;