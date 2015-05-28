class ImageUtils {
    static arrayBufferToImage(data) {
        var byteStr = '';
        var bytes = new Uint8Array(data);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++)
            byteStr += String.fromCharCode(bytes[i]);
        var base64Image = window.btoa(byteStr);
        var str = 'data:image/png;base64,' + base64Image;
        var img = new Image();
        img.src = str;
        return img;
    }
    static byteArrayToImage(data) {
        var byteStr = '';
        var bytes = new Uint8Array(data.arraybytes);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            byteStr += String.fromCharCode(bytes[i]);
        }
        var base64Image = window.btoa(byteStr);
        var str = 'data:image/png;base64,' + base64Image;
        var img = new Image();
        img.src = str;
        return img;
    }
    static blobToImage(data) {
        var URLObj = window['URL'] || window['webkitURL'];
        var src = URLObj.createObjectURL(data);
        var img = new Image();
        img.src = src;
        return img;
    }
}
