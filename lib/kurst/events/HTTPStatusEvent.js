class HTTPStatusEvent extends Event {
    constructor(type, status = null) {
        super(type);
        this.status = status;
    }
}
HTTPStatusEvent.HTTP_STATUS = "HTTPStatusEvent_HTTP_STATUS";
