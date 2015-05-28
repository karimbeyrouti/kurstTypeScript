///<reference path="../../libs/waa.d.ts" />
///<reference path="../../libs/usermedia.d.ts" />
class AudioContextManager extends EventDispatcher {
    constructor() {
        super();
        this.audioContext = new AudioContext();
        this.inputPoint = this.audioContext.createGain();
    }
    createInputFromStream(stream) {
        this.audioInput = this.audioContext.createMediaStreamSource(stream);
        this.audioInput.connect(this.inputPoint);
        return this.audioInput;
    }
    createAnalyser(fftSize = 2048) {
        this.analyserNode = this.audioContext.createAnalyser();
        this.analyserNode.fftSize = fftSize;
        this.freqByteData = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.inputPoint.connect(this.analyserNode);
        return this.analyserNode;
    }
    updateFrequencyData() {
        this.analyserNode.getByteFrequencyData(this.freqByteData);
    }
    getBin(bin, numBars, groupAverage = true) {
        this.multiplier = this.analyserNode.frequencyBinCount / numBars;
        this.offset = Math.floor(bin * this.multiplier);
        this.mag = 0;
        if (groupAverage) {
            for (var j = 0; j < this.multiplier; j++) {
                this.mag += this.freqByteData[this.offset + j];
            }
            this.mag = (this.mag / this.multiplier);
        }
        else {
            this.mag += this.freqByteData[this.offset];
        }
        return this.mag / 255;
    }
}
