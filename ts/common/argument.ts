import { NS } from "../../types/NetscriptDefinitions";

// Pretty useless class, I thought I would do more with it
export class Argument {
    index: number;
    type: string;
    value: (string | number | boolean);

    constructor(argument: string | number | boolean, argumentIndex: number) {
        this.index = argumentIndex;
        this.type = typeof(argument);
        this.value = argument;
    }

    public isString() {
        if (this.type == "string") {
            return true;
        }
        else {
            return false;
        }
    }

    public isNumber() {
        if (this.type == "number") {
            return true;
        }
        else {
            return false;
        }
    }

    public isBoolean() {
        if (this.type == "string") {
            return true;
        }
        else {
            return false;
        }
    }

    public static parseArgs(ns: NS, args: (string | number | boolean)[]): Argument[] {
        let parsedArgs: Argument[] = [];

        if (args.length == 0) {
            ns.tprint("Error: No arguments passed to parseArgs. Got: " + args.toString());
        }

        for (let index = 0; index < args.length; index++) {
            new Argument(args[index], index)
        }

        return parsedArgs;
    }
}
