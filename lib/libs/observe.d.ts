interface Object {
	observe(beingObserved: any, callback: (update: any) => any) : void;
	unobserve(beingObserved : any , observer ? : any );

}