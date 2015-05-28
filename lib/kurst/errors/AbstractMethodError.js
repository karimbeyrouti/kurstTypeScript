class AbstractMethodError extends Error {
    constructor(message = null, id = 0) {
        super(message || "An abstract method was called! Either an instance of an abstract class was created, or an abstract method was not overridden by the subclass.", id);
    }
}
