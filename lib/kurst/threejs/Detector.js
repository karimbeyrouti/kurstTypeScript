class Detector {
    constructor() {
        this.canvas = !!this.createCanvas();
        this.webgl = this.testWebGlRenderingContext();
        this.workers = !!window['Worker'];
        this.fileAPI = !!(window['File'] && window['FileReader'] && window['FileList'] && window['Blob']);
    }
    addGetWebGLMessage(parameters) {
        var parent, id, element;
        parameters = parameters || {};
        parent = parameters.parent !== undefined ? parameters.parent : document.body;
        id = parameters.id !== undefined ? parameters.id : 'oldie';
        element = this.getWebGLErrorMessage();
        element.id = id;
        parent.appendChild(element);
    }
    getWebGLErrorMessage() {
        var element = document.createElement('div');
        element.id = 'webgl-error-message2';
        element.style.fontFamily = 'monospace';
        element.style.fontSize = '13px';
        element.style.fontWeight = 'normal';
        element.style.textAlign = 'center';
        element.style.background = '#fff';
        element.style.color = '#000';
        element.style.padding = '1.5em';
        element.style.width = '400px';
        element.style.margin = '5em auto 0';
        element.innerHTML = window['WebGLRenderingContext'] ? [
            'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
            'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
        ].join('\n') : [
            'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
            'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
        ].join('\n');
        return element;
    }
    testWebGlRenderingContext() {
        try {
            var experimental = !!this.createCanvas().getContext("experimental-webgl");
            var webGL = !!this.createCanvas().getContext("webgl");
            return experimental || webGL;
        }
        catch (e) {
            return false;
        }
    }
    createCanvas() {
        return document.createElement("canvas");
    }
}
