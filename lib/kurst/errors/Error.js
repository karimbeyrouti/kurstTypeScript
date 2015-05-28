class Error {
    constructor(message = '', id = 0, _name = '') {
        this._errorID = 0;
        this._messsage = '';
        this._name = '';
        this._messsage = message;
        this._name = name;
        this._errorID = id;
    }
    get message() {
        return this._messsage;
    }
    set message(value) {
        this._messsage = value;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get errorID() {
        return this._errorID;
    }
}
