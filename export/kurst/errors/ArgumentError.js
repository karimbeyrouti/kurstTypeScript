class ArgumentError extends Error {
    constructor(message = null, id = 0) {
        super(message || "ArgumentError", id);
    }
}
