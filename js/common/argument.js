// Pretty useless class, I thought I would do more with it
export class Argument {
    constructor(argument, argumentIndex) {
        this.index = argumentIndex;
        this.type = typeof (argument);
        this.value = argument;
    }
    isString() {
        if (this.type == "string") {
            return true;
        }
        else {
            return false;
        }
    }
    isNumber() {
        if (this.type == "number") {
            return true;
        }
        else {
            return false;
        }
    }
    isBoolean() {
        if (this.type == "string") {
            return true;
        }
        else {
            return false;
        }
    }
    static parseArgs(ns, args) {
        let parsedArgs = [];
        if (args.length == 0) {
            ns.tprint("Error: No arguments passed to parseArgs. Got: " + args.toString());
        }
        for (let index = 0; index < args.length; index++) {
            new Argument(args[index], index);
        }
        return parsedArgs;
    }
}
