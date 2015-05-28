///<reference path="../../libs/waa.d.ts" />
///<reference path="../../libs/usermedia.d.ts" />
class UserMediaManagerEvent extends Event {
    constructor(type) {
        super(type);
    }
}
UserMediaManagerEvent.MIC_INITIALIZED = "MIC_INITIALIZED";
UserMediaManagerEvent.MIC_INITIALIZED_ERROR = "MIC_INITIALIZED_ERROR";
