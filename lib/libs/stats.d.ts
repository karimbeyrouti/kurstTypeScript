// Type definitions for Stats.js r12
// Project: http://github.com/mrdoob/stats.js
// Definitions by: Gregory Dalton <https://github.com/gregolai>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module STATSLIB {
	export class StatsView {

		constructor();

		REVISION:number;

		domElement:HTMLDivElement;

		// 0: fps, 1: ms
		setMode(value:number):void;

		begin():void;

		end():number;

		update():void;

	}
}


declare module "statslib" {
	export = STATSLIB;
}
