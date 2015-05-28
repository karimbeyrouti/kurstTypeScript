///<reference path="../../libs/waa.d.ts" />
///<reference path="../../libs/usermedia.d.ts" />
import UserMediaManagerEvent from "../events/UserMediaManagerEvent";
class UserMediaManager extends EventDispatcher {
    constructor() {
        super();
    }
    getMicrophoneStream() {
        if (!navigator.getUserMedia) {
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        }
        navigator.getUserMedia({ "audio": true, "video": false }, (stream) => this.streamInitialized(stream), (e) => this.streamInitializeError(e));
    }
    streamInitialized(stream) {
        this.stream = stream;
        var e = new UserMediaManagerEvent(UserMediaManagerEvent.MIC_INITIALIZED);
        e.stream = stream;
        this.dispatchEvent(e);
    }
    streamInitializeError(error) {
        this.dispatchEvent(new UserMediaManagerEvent(UserMediaManagerEvent.MIC_INITIALIZED_ERROR));
    }
}
