
import Point            = require("../geom/Point");
import Rectangle        = require("../geom/Rectangle");
import Matrix           = require("../geom/Matrix");
import ColorUtils       = require("../utils/ColorUtils");
import ByteArray        = require("../utils/ByteArray");
import ColorTransform   = require("../geom/ColorTransform");
import BlendMode        = require("./BlendMode");

/**
 * The BitmapData class lets you work with the data(pixels) of a Bitmap
 * object. You can use the methods of the BitmapData class to create
 * arbitrarily sized transparent or opaque bitmap images and manipulate them
 * in various ways at runtime. You can also access the BitmapData for a bitmap
 * image that you load with the <code>flash.Assets</code> or
 * <code>flash.display.Loader</code> classes.
 *
 * <p>This class lets you separate bitmap rendering operations from the
 * internal display updating routines of flash. By manipulating a
 * BitmapData object directly, you can create complex images without incurring
 * the per-frame overhead of constantly redrawing the content from vector
 * data.</p>
 *
 * <p>The methods of the BitmapData class support effects that are not
 * available through the filters available to non-bitmap display objects.</p>
 *
 * <p>A BitmapData object contains an array of pixel data. This data can
 * represent either a fully opaque bitmap or a transparent bitmap that
 * contains alpha channel data. Either type of BitmapData object is stored as
 * a buffer of 32-bit integers. Each 32-bit integer determines the properties
 * of a single pixel in the bitmap.</p>
 *
 * <p>Each 32-bit integer is a combination of four 8-bit channel values(from
 * 0 to 255) that describe the alpha transparency and the red, green, and blue
 * (ARGB) values of the pixel.(For ARGB values, the most significant byte
 * represents the alpha channel value, followed by red, green, and blue.)</p>
 *
 * <p>The four channels(alpha, red, green, and blue) are represented as
 * numbers when you use them with the <code>BitmapData.copyChannel()</code>
 * method or the <code>DisplacementMapFilter.componentX</code> and
 * <code>DisplacementMapFilter.componentY</code> properties, and these numbers
 * are represented by the following constants in the BitmapDataChannel
 * class:</p>
 *
 * <ul>
 *   <li><code>BitmapDataChannel.ALPHA</code></li>
 *   <li><code>BitmapDataChannel.RED</code></li>
 *   <li><code>BitmapDataChannel.GREEN</code></li>
 *   <li><code>BitmapDataChannel.BLUE</code></li>
 * </ul>
 *
 * <p>You can attach BitmapData objects to a Bitmap object by using the
 * <code>bitmapData</code> property of the Bitmap object.</p>
 *
 * <p>You can use a BitmapData object to fill a Graphics object by using the
 * <code>Graphics.beginBitmapFill()</code> method.</p>
 *
 * <p>You can also use a BitmapData object to perform batch tile rendering
 * using the <code>flash.display.Tilesheet</code> class.</p>
 *
 * <p>In Flash Player 10, the maximum size for a BitmapData object
 * is 8,191 pixels in width or height, and the total number of pixels cannot
 * exceed 16,777,215 pixels.(So, if a BitmapData object is 8,191 pixels wide,
 * it can only be 2,048 pixels high.) In Flash Player 9 and earlier, the limitation
 * is 2,880 pixels in height and 2,880 in width.</p>
 */
class BitmapData
{
	private _imageCanvas:HTMLCanvasElement;
	private _context:CanvasRenderingContext2D;
	private _imageData:ImageData;
	private _rect:Rectangle;
	private _transparent:boolean;
	private _locked:boolean = false;

	/**
	 * The height of the bitmap image in pixels.
	 */
	public get height():number
	{
		return this._rect.height;
	}

	public set height(value:number)
	{
		if (this._rect.height == value)
			return;

		this._rect.height = value;

		if (this._locked)
			this._context.putImageData(this._imageData, 0, 0);

		this._imageCanvas.height = value;

		if (this._locked)
			this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
	}

	/**
	 * The rectangle that defines the size and location of the bitmap image. The
	 * top and left of the rectangle are 0; the width and height are equal to the
	 * width and height in pixels of the BitmapData object.
	 */
	public get rect():Rectangle
	{
		return this._rect;
	}

	/**
	 * Defines whether the bitmap image supports per-pixel transparency. You can
	 * set this value only when you construct a BitmapData object by passing in
	 * <code>true</code> for the <code>transparent</code> parameter of the
	 * constructor. Then, after you create a BitmapData object, you can check
	 * whether it supports per-pixel transparency by determining if the value of
	 * the <code>transparent</code> property is <code>true</code>.
	 */
	public get transparent():boolean
	{
		return this._transparent;
	}

	public set transparent(value:boolean)
	{
		this._transparent = value;
	}

	/**
	 * The width of the bitmap image in pixels.
	 */
	public get width():number
	{
		return this._rect.width;
	}

	public set width(value:number)
	{
		if (this._rect.width == value)
			return;

		this._rect.width = value;

		if (this._locked)
			this._context.putImageData(this._imageData, 0, 0);

		this._imageCanvas.width = value;

		if (this._locked)
			this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
	}

	/**
	 * Creates a BitmapData object with a specified width and height. If you
	 * specify a value for the <code>fillColor</code> parameter, every pixel in
	 * the bitmap is set to that color.
	 *
	 * <p>By default, the bitmap is created as transparent, unless you pass
	 * the value <code>false</code> for the transparent parameter. After you
	 * create an opaque bitmap, you cannot change it to a transparent bitmap.
	 * Every pixel in an opaque bitmap uses only 24 bits of color channel
	 * information. If you define the bitmap as transparent, every pixel uses 32
	 * bits of color channel information, including an alpha transparency
	 * channel.</p>
	 *
	 * @param width       The width of the bitmap image in pixels.
	 * @param height      The height of the bitmap image in pixels.
	 * @param transparent Specifies whether the bitmap image supports per-pixel
	 *                    transparency. The default value is <code>true</code>
	 *                    (transparent). To create a fully transparent bitmap,
	 *                    set the value of the <code>transparent</code>
	 *                    parameter to <code>true</code> and the value of the
	 *                    <code>fillColor</code> parameter to 0x00000000(or to
	 *                    0). Setting the <code>transparent</code> property to
	 *                    <code>false</code> can result in minor improvements
	 *                    in rendering performance.
	 * @param fillColor   A 32-bit ARGB color value that you use to fill the
	 *                    bitmap image area. The default value is
	 *                    0xFFFFFFFF(solid white).
	 */
	constructor(width:number, height:number, transparent:boolean = true, fillColor:number = null )
	{
		this._transparent = transparent;
		this._imageCanvas = <HTMLCanvasElement> document.createElement("canvas")



		this._imageCanvas.width = width;
		this._imageCanvas.height = height;
		this._context = <CanvasRenderingContext2D> this._imageCanvas.getContext("2d");
		this._rect = new Rectangle(0, 0, width, height);

		if (fillColor != null)
			this.fillRect(this._rect, fillColor);
	}

	/**
	 * Returns a new BitmapData object that is a clone of the original instance
	 * with an exact copy of the contained bitmap.
	 *
	 * @return A new BitmapData object that is identical to the original.
	 */
	public clone():BitmapData
	{
		var t:BitmapData = new BitmapData(this.width, this.height, this.transparent);
		t.draw(this);
		return t;
	}

	/**
	 * Adjusts the color values in a specified area of a bitmap image by using a
	 * <code>ColorTransform</code> object. If the rectangle matches the
	 * boundaries of the bitmap image, this method transforms the color values of
	 * the entire image.
	 *
	 * @param rect           A Rectangle object that defines the area of the
	 *                       image in which the ColorTransform object is applied.
	 * @param colorTransform A ColorTransform object that describes the color
	 *                       transformation values to apply.
	 */
	public colorTransform(rect:Rectangle, colorTransform:ColorTransform)
	{
		if (!this._locked)
			this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);

		var data:Array<number> = this._imageData.data;

		var i:number /*uint*/, j:number /*uint*/, index:number /*uint*/;
		for (i = 0; i < rect.width; ++i) {
			for (j = 0; j < rect.height; ++j) {
				index = (i + rect.x + (j + rect.y)*this.width)*4;

				data[index] = data[index]*colorTransform.redMultiplier + colorTransform.redOffset;
				data[index + 1] = data[index + 1]*colorTransform.greenMultiplier + colorTransform.greenOffset;
				data[index + 2] = data[index + 2]*colorTransform.blueMultiplier + colorTransform.blueOffset;
				data[index + 3] = data[index + 3]*colorTransform.alphaMultiplier + colorTransform.alphaOffset;
			}
		}

		if (!this._locked) {
			this._context.putImageData(this._imageData, 0, 0);
			this._imageData = null;
		}
	}

	/**
	 * Transfers data from one channel of another BitmapData object or the
	 * current BitmapData object into a channel of the current BitmapData object.
	 * All of the data in the other channels in the destination BitmapData object
	 * are preserved.
	 *
	 * <p>The source channel value and destination channel value can be one of
	 * following values: </p>
	 *
	 * <ul>
	 *   <li><code>BitmapDataChannel.RED</code></li>
	 *   <li><code>BitmapDataChannel.GREEN</code></li>
	 *   <li><code>BitmapDataChannel.BLUE</code></li>
	 *   <li><code>BitmapDataChannel.ALPHA</code></li>
	 * </ul>
	 *
	 * @param sourceBitmapData The input bitmap image to use. The source image
	 *                         can be a different BitmapData object or it can
	 *                         refer to the current BitmapData object.
	 * @param sourceRect       The source Rectangle object. To copy only channel
	 *                         data from a smaller area within the bitmap,
	 *                         specify a source rectangle that is smaller than
	 *                         the overall size of the BitmapData object.
	 * @param destPoint        The destination Point object that represents the
	 *                         upper-left corner of the rectangular area where
	 *                         the new channel data is placed. To copy only
	 *                         channel data from one area to a different area in
	 *                         the destination image, specify a point other than
	 *                        (0,0).
	 * @param sourceChannel    The source channel. Use a value from the
	 *                         BitmapDataChannel class
	 *                        (<code>BitmapDataChannel.RED</code>,
	 *                         <code>BitmapDataChannel.BLUE</code>,
	 *                         <code>BitmapDataChannel.GREEN</code>,
	 *                         <code>BitmapDataChannel.ALPHA</code>).
	 * @param destChannel      The destination channel. Use a value from the
	 *                         BitmapDataChannel class
	 *                        (<code>BitmapDataChannel.RED</code>,
	 *                         <code>BitmapDataChannel.BLUE</code>,
	 *                         <code>BitmapDataChannel.GREEN</code>,
	 *                         <code>BitmapDataChannel.ALPHA</code>).
	 * @throws TypeError The sourceBitmapData, sourceRect or destPoint are null.
	 */
	public copyChannel(sourceBitmap:BitmapData, sourceRect:Rectangle, destPoint:Point, sourceChannel:number, destChannel:number)
	{
		var imageData:ImageData = sourceBitmap.imageData;

		if (!this._locked)
			this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);

		var sourceData:Array<number> = sourceBitmap.imageData.data;
		var destData:Array<number> = this._imageData.data;

		var sourceOffset:number = Math.round(Math.log(sourceChannel)/Math.log(2));
		var destOffset:number = Math.round(Math.log(destChannel)/Math.log(2));

		var i:number /*uint*/, j:number /*uint*/, sourceIndex:number /*uint*/, destIndex:number /*uint*/;
		for (i = 0; i < sourceRect.width; ++i) {
			for (j = 0; j < sourceRect.height; ++j) {
				sourceIndex = (i + sourceRect.x + (j + sourceRect.y)*sourceBitmap.width)*4;
				destIndex = (i + destPoint.x + (j + destPoint.y)*this.width)*4;

				destData[destIndex + destOffset] = sourceData[sourceIndex + sourceOffset];
			}
		}

		if (!this._locked) {
			this._context.putImageData(this._imageData, 0, 0);
			this._imageData = null;
		}
	}

	/**
	 * Provides a fast routine to perform pixel manipulation between images with
	 * no stretching, rotation, or color effects. This method copies a
	 * rectangular area of a source image to a rectangular area of the same size
	 * at the destination point of the destination BitmapData object.
	 *
	 * <p>If you include the <code>alphaBitmap</code> and <code>alphaPoint</code>
	 * parameters, you can use a secondary image as an alpha source for the
	 * source image. If the source image has alpha data, both sets of alpha data
	 * are used to composite pixels from the source image to the destination
	 * image. The <code>alphaPoint</code> parameter is the point in the alpha
	 * image that corresponds to the upper-left corner of the source rectangle.
	 * Any pixels outside the intersection of the source image and alpha image
	 * are not copied to the destination image.</p>
	 *
	 * <p>The <code>mergeAlpha</code> property controls whether or not the alpha
	 * channel is used when a transparent image is copied onto another
	 * transparent image. To copy pixels with the alpha channel data, set the
	 * <code>mergeAlpha</code> property to <code>true</code>. By default, the
	 * <code>mergeAlpha</code> property is <code>false</code>.</p>
	 *
	 * @param sourceBitmapData The input bitmap image from which to copy pixels.
	 *                         The source image can be a different BitmapData
	 *                         instance, or it can refer to the current
	 *                         BitmapData instance.
	 * @param sourceRect       A rectangle that defines the area of the source
	 *                         image to use as input.
	 * @param destPoint        The destination point that represents the
	 *                         upper-left corner of the rectangular area where
	 *                         the new pixels are placed.
	 * @param alphaBitmapData  A secondary, alpha BitmapData object source.
	 * @param alphaPoint       The point in the alpha BitmapData object source
	 *                         that corresponds to the upper-left corner of the
	 *                         <code>sourceRect</code> parameter.
	 * @param mergeAlpha       To use the alpha channel, set the value to
	 *                         <code>true</code>. To copy pixels with no alpha
	 *                         channel, set the value to <code>false</code>.
	 * @throws TypeError The sourceBitmapData, sourceRect, destPoint are null.
	 */
	public copyPixels(bmpd:BitmapData, sourceRect:Rectangle, destRect:Rectangle);
	public copyPixels(bmpd:HTMLImageElement, sourceRect:Rectangle, destRect:Rectangle);
	public copyPixels(bmpd:HTMLCanvasElement, sourceRect:Rectangle, destRect:Rectangle);
	public copyPixels(bmpd:any, sourceRect:Rectangle, destRect:Rectangle)
	{
		if ( bmpd == undefined ) return;
		if (this._locked) {

			// If canvas is locked:
			//
			//      1) copy image data back to canvas
			//      2) draw object
			//      3) read _imageData back out

			if (this._imageData)
				this._context.putImageData(this._imageData, 0, 0); // at coords 0,0

			this._copyPixels(bmpd, sourceRect, destRect);

			if (this._imageData)
				this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);

		} else {
			this._copyPixels(bmpd, sourceRect, destRect);
		}
	}

	/**
	 * Frees memory that is used to store the BitmapData object.
	 *
	 * <p>When the <code>dispose()</code> method is called on an image, the width
	 * and height of the image are set to 0. All subsequent calls to methods or
	 * properties of this BitmapData instance fail, and an exception is thrown.
	 * </p>
	 *
	 * <p><code>BitmapData.dispose()</code> releases the memory occupied by the
	 * actual bitmap data, immediately(a bitmap can consume up to 64 MB of
	 * memory). After using <code>BitmapData.dispose()</code>, the BitmapData
	 * object is no longer usable and an exception may be thrown if
	 * you call functions on the BitmapData object. However,
	 * <code>BitmapData.dispose()</code> does not garbage collect the BitmapData
	 * object(approximately 128 bytes); the memory occupied by the actual
	 * BitmapData object is released at the time the BitmapData object is
	 * collected by the garbage collector.</p>
	 *
	 */
	public dispose()
	{
		this._context = null;
		this._imageCanvas = null;
		this._imageData = null;
		this._rect = null;
		this._transparent = null;
		this._locked = null;
	}

	/**
	 * Draws the <code>source</code> display object onto the bitmap image, using
	 * the NME software renderer. You can specify <code>matrix</code>,
	 * <code>colorTransform</code>, <code>blendMode</code>, and a destination
	 * <code>clipRect</code> parameter to control how the rendering performs.
	 * Optionally, you can specify whether the bitmap should be smoothed when
	 * scaled(this works only if the source object is a BitmapData object).
	 *
	 * <p>The source display object does not use any of its applied
	 * transformations for this call. It is treated as it exists in the library
	 * or file, with no matrix transform, no color transform, and no blend mode.
	 * To draw a display object(such as a movie clip) by using its own transform
	 * properties, you can copy its <code>transform</code> property object to the
	 * <code>transform</code> property of the Bitmap object that uses the
	 * BitmapData object.</p>
	 *
	 * @param source         The display object or BitmapData object to draw to
	 *                       the BitmapData object.(The DisplayObject and
	 *                       BitmapData classes implement the IBitmapDrawable
	 *                       interface.)
	 * @param matrix         A Matrix object used to scale, rotate, or translate
	 *                       the coordinates of the bitmap. If you do not want to
	 *                       apply a matrix transformation to the image, set this
	 *                       parameter to an identity matrix, created with the
	 *                       default <code>new Matrix()</code> constructor, or
	 *                       pass a <code>null</code> value.
	 * @param colorTransform A ColorTransform object that you use to adjust the
	 *                       color values of the bitmap. If no object is
	 *                       supplied, the bitmap image's colors are not
	 *                       transformed. If you must pass this parameter but you
	 *                       do not want to transform the image, set this
	 *                       parameter to a ColorTransform object created with
	 *                       the default <code>new ColorTransform()</code>
	 *                       constructor.
	 * @param blendMode      A string value, from the flash.display.BlendMode
	 *                       class, specifying the blend mode to be applied to
	 *                       the resulting bitmap.
	 * @param clipRect       A Rectangle object that defines the area of the
	 *                       source object to draw. If you do not supply this
	 *                       value, no clipping occurs and the entire source
	 *                       object is drawn.
	 * @param smoothing      A Boolean value that determines whether a BitmapData
	 *                       object is smoothed when scaled or rotated, due to a
	 *                       scaling or rotation in the <code>matrix</code>
	 *                       parameter. The <code>smoothing</code> parameter only
	 *                       applies if the <code>source</code> parameter is a
	 *                       BitmapData object. With <code>smoothing</code> set
	 *                       to <code>false</code>, the rotated or scaled
	 *                       BitmapData image can appear pixelated or jagged. For
	 *                       example, the following two images use the same
	 *                       BitmapData object for the <code>source</code>
	 *                       parameter, but the <code>smoothing</code> parameter
	 *                       is set to <code>true</code> on the left and
	 *                       <code>false</code> on the right:
	 *
	 *                       <p>Drawing a bitmap with <code>smoothing</code> set
	 *                       to <code>true</code> takes longer than doing so with
	 *                       <code>smoothing</code> set to
	 *                       <code>false</code>.</p>
	 * @throws ArgumentError The <code>source</code> parameter is not a
	 *                       BitmapData or DisplayObject object.
	 * @throws ArgumentError The source is null or not a valid IBitmapDrawable
	 *                       object.
	 * @throws SecurityError The <code>source</code> object and(in the case of a
	 *                       Sprite or MovieClip object) all of its child objects
	 *                       do not come from the same domain as the caller, or
	 *                       are not in a content that is accessible to the
	 *                       caller by having called the
	 *                       <code>Security.allowDomain()</code> method. This
	 *                       restriction does not apply to AIR content in the
	 *                       application security sandbox.
	 */
	public draw(source:BitmapData, matrix?:Matrix, colorTransform?:ColorTransform, blendMode?:BlendMode, clipRect?:Rectangle, smoothing?:boolean);
	public draw(source:HTMLImageElement, matrix?:Matrix, colorTransform?:ColorTransform, blendMode?:BlendMode, clipRect?:Rectangle, smoothing?:boolean);
	public draw(source:HTMLCanvasElement, matrix?:Matrix, colorTransform?:ColorTransform, blendMode?:BlendMode, clipRect?:Rectangle, smoothing?:boolean);
	public draw(source:any, matrix?:Matrix, colorTransform?:ColorTransform, blendMode?:BlendMode, clipRect?:Rectangle, smoothing?:boolean)
	{
		if ( source == undefined ) return;
		if (this._locked) {

			// If canvas is locked:
			//
			//      1) copy image data back to canvas
			//      2) draw object
			//      3) read _imageData back out

			this._context.putImageData(this._imageData, 0, 0); // at coords 0,0
			this._draw(source, matrix, colorTransform, blendMode, clipRect, smoothing);
			this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
		} else {
			this._draw(source, matrix, colorTransform, blendMode, clipRect, smoothing);
		}
	}

	/**
	 * Fills a rectangular area of pixels with a specified ARGB color.
	 *
	 * @param rect  The rectangular area to fill.
	 * @param color The ARGB color value that fills the area. ARGB colors are
	 *              often specified in hexadecimal format; for example,
	 *              0xFF336699.
	 * @throws TypeError The rect is null.
	 */
	public fillRect(rect:Rectangle, color:number)
	{
		if (this._locked) {

			// If canvas is locked:
			//
			//      1) copy image data back to canvas
			//      2) apply fill
			//      3) read _imageData back out

			if (this._imageData)
				this._context.putImageData(this._imageData, 0, 0); // at coords 0,0

			this._fillRect(rect, color);

			if (this._imageData)
				this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
		} else {
			this._fillRect(rect, color);
		}
	}

	/**
	 * Returns an integer that represents an RGB pixel value from a BitmapData
	 * object at a specific point(<i>x</i>, <i>y</i>). The
	 * <code>getPixel()</code> method returns an unmultiplied pixel value. No
	 * alpha information is returned.
	 *
	 * <p>All pixels in a BitmapData object are stored as premultiplied color
	 * values. A premultiplied image pixel has the red, green, and blue color
	 * channel values already multiplied by the alpha data. For example, if the
	 * alpha value is 0, the values for the RGB channels are also 0, independent
	 * of their unmultiplied values. This loss of data can cause some problems
	 * when you perform operations. All BitmapData methods take and return
	 * unmultiplied values. The internal pixel representation is converted from
	 * premultiplied to unmultiplied before it is returned as a value. During a
	 * set operation, the pixel value is premultiplied before the raw image pixel
	 * is set.</p>
	 *
	 * @param x The <i>x</i> position of the pixel.
	 * @param y The <i>y</i> position of the pixel.
	 * @return A number that represents an RGB pixel value. If the(<i>x</i>,
	 *         <i>y</i>) coordinates are outside the bounds of the image, the
	 *         method returns 0.
	 */
	public getPixel(x, y):number
	{
		var r:number;
		var g:number;
		var b:number;
		var a:number;

		if (!this._locked) {
			var pixelData:ImageData = this._context.getImageData(x, y, 1, 1);

			r = pixelData.data[0];
			g = pixelData.data[1];
			b = pixelData.data[2];
			a = pixelData.data[3];

		} else {
			var index:number = (x + y*this._imageCanvas.width)*4;

			r = this._imageData.data[index + 0];
			g = this._imageData.data[index + 1];
			b = this._imageData.data[index + 2];
			a = this._imageData.data[index + 3];
		}

		//returns black if fully transparent
		if (!a)
			return 0x0;

		return (r << 16) | (g << 8) | b;
	}

	/**
	 * Returns an ARGB color value that contains alpha channel data and RGB data.
	 * This method is similar to the <code>getPixel()</code> method, which
	 * returns an RGB color without alpha channel data.
	 *
	 * <p>All pixels in a BitmapData object are stored as premultiplied color
	 * values. A premultiplied image pixel has the red, green, and blue color
	 * channel values already multiplied by the alpha data. For example, if the
	 * alpha value is 0, the values for the RGB channels are also 0, independent
	 * of their unmultiplied values. This loss of data can cause some problems
	 * when you perform operations. All BitmapData methods take and return
	 * unmultiplied values. The internal pixel representation is converted from
	 * premultiplied to unmultiplied before it is returned as a value. During a
	 * set operation, the pixel value is premultiplied before the raw image pixel
	 * is set.</p>
	 *
	 * @param x The <i>x</i> position of the pixel.
	 * @param y The <i>y</i> position of the pixel.
	 * @return A number representing an ARGB pixel value. If the(<i>x</i>,
	 *         <i>y</i>) coordinates are outside the bounds of the image, 0 is
	 *         returned.
	 */
	public getPixel32(x, y):number
	{
		var r:number;
		var g:number;
		var b:number;
		var a:number;

		if (!this._locked) {
			var pixelData:ImageData = this._context.getImageData(x, y, 1, 1);

			r = pixelData.data[0];
			g = pixelData.data[1];
			b = pixelData.data[2];
			a = pixelData.data[3];

		} else {
			var index:number = (x + y*this._imageCanvas.width)*4;

			r = this._imageData.data[index + 0];
			g = this._imageData.data[index + 1];
			b = this._imageData.data[index + 2];
			a = this._imageData.data[index + 3];
		}

		return (a << 24) | (r << 16) | (g << 8) | b;
	}

	/**
	 * Locks an image so that any objects that reference the BitmapData object,
	 * such as Bitmap objects, are not updated when this BitmapData object
	 * changes. To improve performance, use this method along with the
	 * <code>unlock()</code> method before and after numerous calls to the
	 * <code>setPixel()</code> or <code>setPixel32()</code> method.
	 *
	 */
	public lock()
	{
		if (this._locked)
			return;

		this._locked = true;
		this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
	}

	/**
	 * Converts an Array into a rectangular region of pixel data. For each pixel,
	 * an Array element is read and written into the BitmapData pixel. The data
	 * in the Array is expected to be 32-bit ARGB pixel values.
	 *
	 * @param rect        Specifies the rectangular region of the BitmapData
	 *                    object.
	 * @param inputArray  An Array that consists of 32-bit unmultiplied pixel
	 *                    values to be used in the rectangular region.
	 * @throws RangeError The vector array is not large enough to read all the
	 *                    pixel data.
	 */
	public setArray(rect:Rectangle, inputArray:Array<number>)
	{
		if (!this._locked)
			this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);

		var i:number /*uint*/, j:number /*uint*/, index:number /*uint*/, argb:number[] /*uint*/;
		for (i = 0; i < rect.width; ++i) {
			for (j = 0; j < rect.height; ++j) {
				argb = ColorUtils.float32ColorToARGB(inputArray[i + j*rect.width]);
				index = (i + rect.x + (j + rect.y)*this._imageCanvas.width)*4;

				this._imageData.data[index + 0] = argb[1];
				this._imageData.data[index + 1] = argb[2];
				this._imageData.data[index + 2] = argb[3];
				this._imageData.data[index + 3] = argb[0];
			}
		}

		if (!this._locked) {
			this._context.putImageData(this._imageData, 0, 0);
			this._imageData = null;
		}
	}

	/**
	 * Sets a single pixel of a BitmapData object. The current alpha channel
	 * value of the image pixel is preserved during this operation. The value of
	 * the RGB color parameter is treated as an unmultiplied color value.
	 *
	 * <p><b>Note:</b> To increase performance, when you use the
	 * <code>setPixel()</code> or <code>setPixel32()</code> method repeatedly,
	 * call the <code>lock()</code> method before you call the
	 * <code>setPixel()</code> or <code>setPixel32()</code> method, and then call
	 * the <code>unlock()</code> method when you have made all pixel changes.
	 * This process prevents objects that reference this BitmapData instance from
	 * updating until you finish making the pixel changes.</p>
	 *
	 * @param x     The <i>x</i> position of the pixel whose value changes.
	 * @param y     The <i>y</i> position of the pixel whose value changes.
	 * @param color The resulting RGB color for the pixel.
	 */
	public setPixel(x:number, y:number, color:number)
	{
		var argb:number[] = ColorUtils.float32ColorToARGB(color);

		if (!this._locked)
			this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);

		var index:number = (x + y*this._imageCanvas.width)*4;

		this._imageData.data[index + 0] = argb[1];
		this._imageData.data[index + 1] = argb[2];
		this._imageData.data[index + 2] = argb[3];
		this._imageData.data[index + 3] = 255;

		if (!this._locked) {
			this._context.putImageData(this._imageData, 0, 0);
			this._imageData = null;
		}
	}

	/**
	 * Sets the color and alpha transparency values of a single pixel of a
	 * BitmapData object. This method is similar to the <code>setPixel()</code>
	 * method; the main difference is that the <code>setPixel32()</code> method
	 * takes an ARGB color value that contains alpha channel information.
	 *
	 * <p>All pixels in a BitmapData object are stored as premultiplied color
	 * values. A premultiplied image pixel has the red, green, and blue color
	 * channel values already multiplied by the alpha data. For example, if the
	 * alpha value is 0, the values for the RGB channels are also 0, independent
	 * of their unmultiplied values. This loss of data can cause some problems
	 * when you perform operations. All BitmapData methods take and return
	 * unmultiplied values. The internal pixel representation is converted from
	 * premultiplied to unmultiplied before it is returned as a value. During a
	 * set operation, the pixel value is premultiplied before the raw image pixel
	 * is set.</p>
	 *
	 * <p><b>Note:</b> To increase performance, when you use the
	 * <code>setPixel()</code> or <code>setPixel32()</code> method repeatedly,
	 * call the <code>lock()</code> method before you call the
	 * <code>setPixel()</code> or <code>setPixel32()</code> method, and then call
	 * the <code>unlock()</code> method when you have made all pixel changes.
	 * This process prevents objects that reference this BitmapData instance from
	 * updating until you finish making the pixel changes.</p>
	 *
	 * @param x     The <i>x</i> position of the pixel whose value changes.
	 * @param y     The <i>y</i> position of the pixel whose value changes.
	 * @param color The resulting ARGB color for the pixel. If the bitmap is
	 *              opaque(not transparent), the alpha transparency portion of
	 *              this color value is ignored.
	 */
	public setPixel32(x, y, color:number)
	{
		var argb:number[] = ColorUtils.float32ColorToARGB(color);

		if (!this._locked)
			this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);

		var index:number = (x + y*this._imageCanvas.width)*4;

		this._imageData.data[index + 0] = argb[1];
		this._imageData.data[index + 1] = argb[2];
		this._imageData.data[index + 2] = argb[3];
		this._imageData.data[index + 3] = argb[0];

		if (!this._locked) {
			this._context.putImageData(this._imageData, 0, 0);
			this._imageData = null;
		}
	}

	/**
	 * Converts a byte array into a rectangular region of pixel data. For each
	 * pixel, the <code>ByteArray.readUnsignedInt()</code> method is called and
	 * the return value is written into the pixel. If the byte array ends before
	 * the full rectangle is written, the function returns. The data in the byte
	 * array is expected to be 32-bit ARGB pixel values. No seeking is performed
	 * on the byte array before or after the pixels are read.
	 *
	 * @param rect           Specifies the rectangular region of the BitmapData
	 *                       object.
	 * @param inputByteArray A ByteArray object that consists of 32-bit
	 *                       unmultiplied pixel values to be used in the
	 *                       rectangular region.
	 * @throws EOFError  The <code>inputByteArray</code> object does not include
	 *                   enough data to fill the area of the <code>rect</code>
	 *                   rectangle. The method fills as many pixels as possible
	 *                   before throwing the exception.
	 * @throws TypeError The rect or inputByteArray are null.
	 */
	public setPixels(rect:Rectangle, inputByteArray:ByteArray)
	{
		if (!this._locked)
			this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);

		inputByteArray.position = 0;
		var i:number /*uint*/, j:number /*uint*/, index:number /*uint*/;
		for (i = 0; i < rect.width; ++i) {
			for (j = 0; j < rect.height; ++j) {
				index = (i + rect.x + (j + rect.y)*this._imageCanvas.width)*4;

				this._imageData.data[index + 0] = inputByteArray.readUnsignedInt();
				this._imageData.data[index + 1] = inputByteArray.readUnsignedInt();
				this._imageData.data[index + 2] = inputByteArray.readUnsignedInt();
				this._imageData.data[index + 3] = inputByteArray.readUnsignedInt();
			}
		}

		if (!this._locked) {
			this._context.putImageData(this._imageData, 0, 0);
			this._imageData = null;
		}
	}

	/**
	 * Unlocks an image so that any objects that reference the BitmapData object,
	 * such as Bitmap objects, are updated when this BitmapData object changes.
	 * To improve performance, use this method along with the <code>lock()</code>
	 * method before and after numerous calls to the <code>setPixel()</code> or
	 * <code>setPixel32()</code> method.
	 *
	 * @param changeRect The area of the BitmapData object that has changed. If
	 *                   you do not specify a value for this parameter, the
	 *                   entire area of the BitmapData object is considered
	 *                   changed.
	 */
	public unlock()
	{
		if (!this._locked)
			return;

		this._locked = false;

		this._context.putImageData(this._imageData, 0, 0); // at coords 0,0
		this._imageData = null;
	}


	private _copyPixels(bmpd:BitmapData, sourceRect:Rectangle, destRect:Rectangle);
	private _copyPixels(bmpd:HTMLImageElement, sourceRect:Rectangle, destRect:Rectangle);
	private _copyPixels(bmpd:HTMLCanvasElement, sourceRect:Rectangle, destRect:Rectangle);
	private _copyPixels(bmpd:any, sourceRect:Rectangle, destRect:Rectangle)
	{

		if (bmpd instanceof BitmapData) {
			this._context.drawImage(bmpd.canvas, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
		} else if (bmpd instanceof HTMLImageElement || bmpd instanceof HTMLCanvasElement || ( bmpd['toDataURL'] != null )) {
			this._context.drawImage(bmpd, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
		}

	}

	private _draw(source:BitmapData, matrix:Matrix, colorTransform:ColorTransform, blendMode:BlendMode, clipRect:Rectangle, smoothing:boolean);
	private _draw(source:HTMLImageElement, matrix:Matrix, colorTransform:ColorTransform, blendMode:BlendMode, clipRect:Rectangle, smoothing:boolean);
	private _draw(source:HTMLCanvasElement, matrix:Matrix, colorTransform:ColorTransform, blendMode:BlendMode, clipRect:Rectangle, smoothing:boolean);
	private _draw(source:any, matrix:Matrix, colorTransform:ColorTransform, blendMode:BlendMode, clipRect:Rectangle, smoothing:boolean)
	{

		if (source instanceof BitmapData) {

			this._context.save();

			if (matrix != null)
			{
				this._context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
			}

			if (clipRect != null)
			{
				this._context.drawImage(source.canvas, clipRect.x, clipRect.y, clipRect.width, clipRect.height);

			}
			else
			{
				this._context.drawImage(source.canvas, 0, 0);
			}

			this._context.restore();

		} else if (source instanceof HTMLImageElement || source instanceof HTMLCanvasElement || ( source['toDataURL'] != null ) ) {

			this._context.save();

			if (matrix != null)
			{
				this._context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
			}

			if (clipRect != null)
			{
				this._context.drawImage(source, clipRect.x, clipRect.y, clipRect.width, clipRect.height);
			}
			else
			{
				this._context.drawImage(source, 0, 0);
			}

			this._context.restore();
		}
	}

	private _fillRect(rect:Rectangle, color:number)
	{
		if (color == 0x0 && this._transparent) {
			this._context.clearRect(rect.x, rect.y, rect.width, rect.height);
		} else {
			var argb:number[] = ColorUtils.float32ColorToARGB(color);

			if (this._transparent)
			{
				this._context.fillStyle = 'rgba(' + argb[1] + ',' + argb[2] + ',' + argb[3] + ',' + argb[0]/255 + ')';
			}
			else
			{
				this._context.fillStyle = 'rgba(' + argb[1] + ',' + argb[2] + ',' + argb[3] + ',1)';
			}

			this._context.fillRect(rect.x, rect.y, rect.width, rect.height);
		}
	}

	/**
	 *
	 * @returns {ImageData}
	 */
	public get imageData():ImageData
	{
		if (!this._locked)
			return this._context.getImageData(0, 0, this._rect.width, this._rect.height);

		return this._imageData;
	}

	/**
	 *
	 * @returns {HTMLCanvasElement}
	 */
	public get canvas() : HTMLCanvasElement
	{
		return this._imageCanvas;
	}
	/**
	 *
	 * @returns {CanvasRenderingContext2D}
	 */
	public get context() : CanvasRenderingContext2D
	{
		return this._context
	}
}

export = BitmapData;
