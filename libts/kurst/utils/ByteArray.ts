import ByteArrayBase from "./ByteArrayBase"

class ByteArray extends ByteArrayBase
{

	//----------------------------------------------------------------------------------

	public maxlength:number = 0;
	public arraybytes; //ArrayBuffer
	public unalignedarraybytestemp; //ArrayBuffer

	//----------------------------------------------------------------------------------

	constructor()
	{
		super();

		this._mode 						= "Typed array";
		this.maxlength 					= 4;
		this.arraybytes 				= new ArrayBuffer(this.maxlength);
		this.unalignedarraybytestemp 	= new ArrayBuffer(16);
	}

	//----------------------------------------------------------------------------------

	/**
	 * ensureWriteableSpace
	 * ensure there is 'n' writable space in the ByteArray after the current position
	 * @param n
	 */
	public ensureWriteableSpace(n:number)
	{
		this.ensureSpace(n + this.position);
	}
	/**
	 * Assign an ArrayBuffer to the ByteArray Object
	 * @param aBuffer
	 */
	public setArrayBuffer(aBuffer:ArrayBuffer):void
	{

		this.ensureSpace(aBuffer.byteLength);

		this.length 				= aBuffer.byteLength;
		var inInt8AView:Int8Array 	= new Int8Array(aBuffer);
		var localInt8View:Int8Array = new Int8Array(this.arraybytes, 0, this.length);

		localInt8View.set(inInt8AView);

		this.position 				= 0;

	}
	/**
	 * The number of bytes of data available for reading from the current position in the byte array to the end of the array
	 * @returns {number}
	 */
	public getBytesAvailable():number
	{
		return ( this.length ) - ( this.position );
	}
	/**
	 * Ensure the ByteArray stream has n space
	 * @param n
	 */
	public ensureSpace(n:number)
	{
		if (n > this.maxlength)
		{
			var newmaxlength:number = (n + 255) & (~255);
			var newarraybuffer 		= new ArrayBuffer(newmaxlength);
			var view 				= new Uint8Array(this.arraybytes, 0, this.length);
			var newview 			= new Uint8Array(newarraybuffer, 0, this.length);

			newview.set(view);      // memcpy

			this.arraybytes			 = newarraybuffer;
			this.maxlength 			= newmaxlength;
		}
	}
	/**
	 * Writes a byte to the byte stream.
	 * @param b
	 */
	public writeByte(b:number)
	{
		this.ensureWriteableSpace(1);

		var view = new Int8Array(this.arraybytes);
			view[ this.position++ ] = (~~b); // ~~ is cast to int

		if (this.position > this.length)
		{
			this.length = this.position;
		}
	}
	/**
	 * Reads a signed byte from the byte stream.
	 * @returns {any}
	 */
	public readByte()
	{
		if (this.position >= this.length)
		{
			throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
		}

		var view = new Int8Array(this.arraybytes);
		return view[ this.position++ ];
	}
	/**
	 * Reads the number of data bytes, specified by the length parameter, from the byte stream.
	 * @param bytes
	 * @param offset
	 * @param length
	 */
	public readBytes(bytes:ByteArray, offset:number = 0, length:number = 0)
	{

		if (length == null)
		{
			length = bytes.length;
		}

		bytes.ensureWriteableSpace(offset + length);

		var byteView:Int8Array 		= new Int8Array(bytes.arraybytes);
		var localByteView:Int8Array = new Int8Array(this.arraybytes);

		byteView.set(localByteView.subarray(this.position, this.position + length), offset);

		this.position += length;

		if (length + offset > bytes.length)
		{
			bytes.length += ( length + offset ) - bytes.length;
		}

	}
	/**
	 * Writes an unsigned byte from the byte stream.
	 * @param b
	 */
	public writeUnsignedByte(b:number)
	{
		this.ensureWriteableSpace(1);
		var view = new Uint8Array(this.arraybytes);
			view[this.position++] = (~~b) & 0xff; // ~~ is cast to int

		if (this.position > this.length)
		{
			this.length = this.position;
		}
	}
	/**
	 * Reads an unsigned byte from the byte stream.
	 * @returns {any}
	 */
	public readUnsignedByte()
	{
		if (this.position >= this.length)
		{
			throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
		}
		var view = new Uint8Array(this.arraybytes);
		return view[this.position++];
	}
	/**
	 * Writes a unsigned short to the byte stream.
	 * @param b
	 */
	public writeUnsignedShort(b:number)
	{
		this.ensureWriteableSpace(2);

		if (( this.position & 1 ) == 0)
		{
			var view = new Uint16Array(this.arraybytes);
				view[ this.position >> 1 ] = (~~b) & 0xffff; // ~~ is cast to int
		}
		else
		{
			var view = new Uint16Array(this.unalignedarraybytestemp, 0, 1);
				view[0] = (~~b) & 0xffff;
			var view2 = new Uint8Array(this.arraybytes, this.position, 2);
			var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 2);
				view2.set(view3);
		}
		this.position += 2;
		if (this.position > this.length)
		{
			this.length = this.position;
		}
	}
	/**
	 * Reads a UTF-8 string from the byte stream
	 * @param len
	 * @returns {string}
	 */
	public readUTFBytes(len:number):string
	{

		var value:string 	= "";
		var max:number 		= this.position + len;
		var data:DataView 	= new DataView(this.arraybytes);

		// utf8-encode
		while (this.position < max)
		{

			var c:number = data.getUint8(this.position++);

			if (c < 0x80)
			{

				if (c == 0) break;
				value += String.fromCharCode(c);

			}
			else if (c < 0xE0)
			{

				value += String.fromCharCode(((c & 0x3F) << 6) | (data.getUint8(this.position++) & 0x7F));

			}
			else if (c < 0xF0)
			{

				var c2 = data.getUint8(this.position++);
				value += String.fromCharCode(((c & 0x1F) << 12) | ((c2 & 0x7F) << 6) | (data.getUint8(this.position++) & 0x7F));

			}
			else
			{

				var c2 = data.getUint8(this.position++);
				var c3 = data.getUint8(this.position++);

				value += String.fromCharCode(((c & 0x0F) << 18) | ((c2 & 0x7F) << 12) | ((c3 << 6) & 0x7F) | (data.getUint8(this.position++) & 0x7F));

			}

		}

		return value;

	}
	/**
	 * Reads a signed 32-bit integer from the byte stream.
	 * @returns {number}
	 */
	public readInt():number
	{
		var data:DataView 	= new DataView(this.arraybytes);
		var int:number 		= data.getInt32(this.position, true);

		this.position 		+= 4;

		return int;
	}
	/**
	 * Reads a signed 16-bit integer from the byte stream
	 * @returns {number}
	 */
	public readShort():number
	{

		var data:DataView 	= new DataView(this.arraybytes);
		var short:number 	= data.getInt16(this.position, true);

		this.position 		+= 2;

		return short;

	}
	/**
	 * Reads an IEEE 754 double-precision (64-bit) floating-point number from the byte stream
	 * @returns {number}
	 */
	public readDouble():number
	{
		var data:DataView 	= new DataView(this.arraybytes);
		var double:number 	= data.getFloat64(this.position, true);

		this.position		 += 8;

		return double;

	}
	/**
	 * Reads an unsigned 16-bit integer from the byte stream
	 * @returns {any}
	 */
	public readUnsignedShort()
	{
		if (this.position > this.length + 2)
		{
			throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
		}

		if (( this.position & 1 ) == 0)
		{
			var view 		= new Uint16Array(this.arraybytes);
			var pa:number 	= this.position >> 1;

			this.position 	+= 2;

			return view[ pa ];

		}
		else
		{
			var view 	= new Uint16Array(this.unalignedarraybytestemp, 0, 1);
			var view2 	= new Uint8Array(this.arraybytes, this.position, 2);
			var view3 	= new Uint8Array(this.unalignedarraybytestemp, 0, 2);
				view3.set(view2);

			this.position += 2;
			return view[0];
		}
	}
	/**
	 * Write an unsigned 32-bit integer from the byte stream.
	 * @param b
	 */
	public writeUnsignedInt(b:number)
	{
		this.ensureWriteableSpace(4);

		if (( this.position & 3 ) == 0)
		{
			var view = new Uint32Array(this.arraybytes);
				view[ this.position >> 2 ] = (~~b) & 0xffffffff; // ~~ is cast to int
		}
		else
		{
			var view = new Uint32Array(this.unalignedarraybytestemp, 0, 1);
				view[0] = (~~b) & 0xffffffff;// ~~ is cast to int
			var view2 = new Uint8Array(this.arraybytes, this.position, 4);
			var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
				view2.set(view3);
		}

		this.position += 4;

		if (this.position > this.length)
		{
			this.length = this.position;
		}
	}
	/**
	 * Reads an unsigned 32-bit integer from the byte stream.
	 * @returns {any}
	 */
	public readUnsignedInt()
	{

		if (this.position > this.length + 4)
		{
			throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
		}

		if (( this.position & 3 ) == 0)
		{
			var view 		= new Uint32Array(this.arraybytes);
			var pa:number 	= this.position >> 2;

			this.position += 4;
			return view[ pa ];

		}
		else
		{
			var view 	= new Uint32Array(this.unalignedarraybytestemp, 0, 1);
			var view2 	= new Uint8Array(this.arraybytes, this.position, 4);
			var view3 	= new Uint8Array(this.unalignedarraybytestemp, 0, 4);
				view3.set(view2);

			this.position += 4;
			return view[0];
		}
	}
	/**
	 * Writes an IEEE 754 single-precision (32-bit) floating-point number to the byte stream.
	 * @param b
	 */
	public writeFloat(b:number)
	{
		this.ensureWriteableSpace(4);

		if (( this.position & 3 ) == 0)
		{
			var view = new Float32Array(this.arraybytes);
				view[ this.position >> 2 ] = b;

		}
		else
		{
			var view 	= new Float32Array(this.unalignedarraybytestemp, 0, 1);
				view[0] = b;
			var view2 	= new Uint8Array(this.arraybytes, this.position, 4);
			var view3 	= new Uint8Array(this.unalignedarraybytestemp, 0, 4);
				view2.set(view3);
		}

		this.position += 4;

		if (this.position > this.length)
		{
			this.length = this.position;
		}
	}
	/**
	 * Reads an IEEE 754 single-precision (32-bit) floating-point number from the byte stream.
	 * @returns {any}
	 */
	public readFloat()
	{
		if (this.position > this.length + 4)
		{
			throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
		}

		if ((this.position & 3) == 0)
		{
			var view 	= new Float32Array(this.arraybytes);
			var pa 		= this.position >> 2;

			this.position += 4;

			return view[pa];
		}
		else
		{
			var view 	= new Float32Array(this.unalignedarraybytestemp, 0, 1);
			var view2 	= new Uint8Array(this.arraybytes, this.position, 4);
			var view3 	= new Uint8Array(this.unalignedarraybytestemp, 0, 4);
				view3.set(view2);

			this.position += 4;
			return view[ 0 ];

		}
	}
}

export = ByteArray;