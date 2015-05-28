interface Touch {
	identifier:number;
	target:EventTarget;
	screenX:number;
	screenY:number;
	clientX:number;
	clientY:number;
	pageX:number;
	pageY:number;

}

interface TouchList {
	length:number;
	item (index:number):Touch;
	identifiedTouch(identifier:number):Touch;
}

interface TouchEvent extends UIEvent {
	touches:TouchList;
	targetTouches:TouchList;
	changedTouches:TouchList;
	altKey:boolean;
	metaKey:boolean;
	ctrlKey:boolean;
	shiftKey:boolean;
	layerX:number;
	layerY:number;
	//initTouchEvent (type:string, canBubble:bool, cancelable:bool, view:AbstractView, detail:number, ctrlKey:bool, altKey:bool, shiftKey:bool, metaKey:bool, touches:TouchList, targetTouches:TouchList, changedTouches:TouchList);
}

declare var TouchEvent: {
	prototype: TouchEvent;
	new(): TouchEvent;
}