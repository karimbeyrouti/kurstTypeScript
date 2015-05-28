import ByteArray   = require("./ByteArray");


class ImageUtils
{

	/**
	 * Converts an ArrayBuffer to a base64 string
	 *
	 * @param image data as a ByteArray
	 *
	 * @return HTMLImageElement
	 *
	 */
	public static arrayBufferToImage(data:ArrayBuffer):HTMLImageElement
	{

		var byteStr:string = '';
		var bytes:Uint8Array = new Uint8Array(data);
		var len:number = bytes.byteLength;

		for (var i = 0; i < len; i++)
			byteStr += String.fromCharCode(bytes[ i ])

		var base64Image:string = window.btoa(byteStr);
		var str:string = 'data:image/png;base64,' + base64Image;
		var img:HTMLImageElement = <HTMLImageElement> new Image();
		img.src = str;

		return img;

	}

	/**
	 * Converts an ByteArray to an Image - returns an HTMLImageElement
	 *
	 * @param image data as a ByteArray
	 *
	 * @return HTMLImageElement
	 *
	 */
	public static byteArrayToImage(data:ByteArray):HTMLImageElement
	{

		var byteStr	: string 		= '';
		var bytes	: Uint8Array 	= new Uint8Array(data.arraybytes);
		var len		: number 		= bytes.byteLength;

		for (var i = 0; i < len; i++)
		{
			byteStr += String.fromCharCode(bytes[ i ])
		}

		var base64Image	: string 		= window.btoa(byteStr);
		var str			: string 		= 'data:image/png;base64,' + base64Image;
		var img:HTMLImageElement 		= <HTMLImageElement> new Image();
			img.src = str;

		return img;

	}

	/**
	 * Converts an Blob to an Image - returns an HTMLImageElement
	 *
	 * @param image data as a Blob
	 *
	 * @return HTMLImageElement
	 *
	 */
	public static blobToImage(data:Blob):HTMLImageElement
	{
		var URLObj : URL 			= window['URL'] || window['webkitURL'];
		var src 					= URLObj.createObjectURL(data);
		var img : HTMLImageElement 	= <HTMLImageElement> new Image();
			img.src 				= src;
		return img;
	}
}


export = ImageUtils;