// Pretty useless class, I thought I would do more with it
export class Argument {
    constructor(arg) {
        this.value = arg;
    }
    static validateString(arg) {
        if (typeof (arg) == "string") {
            return [true, arg];
        }
        else {
            return [false, ""];
        }
    }
    static validateNumber(arg) {
        if (typeof (arg) == "number") {
            return [true, arg];
        }
        else {
            return [false, 0];
        }
    }
    static validateBoolean(arg) {
        if (typeof (arg) == "boolean") {
            return [true, arg];
        }
        else {
            return [false, false];
        }
    }
}
export class StringArgument extends Argument {
    constructor(arg) {
        super(arg);
        this.value = arg;
    }
}
export class NumberArgument extends Argument {
    constructor(arg) {
        super(arg);
        this.value = arg;
    }
}
export class BooleanArgument extends Argument {
    constructor(arg) {
        super(arg);
        this.value = arg;
    }
}
