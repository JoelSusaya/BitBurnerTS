import { NS } from "../../types/NetscriptDefinitions";

// Pretty useless class, I thought I would do more with it
export class Argument {
    static validateString(arg: string | number | boolean): [boolean, string] {
        if (typeof(arg) == "string") {
            return [true, arg];
        }
        else {
            return [false, ""];
        }
    }

    static validateNumber(arg: string | number | boolean): [boolean, number] {
        if (typeof(arg) == "number") {
            return [true, arg];
        }
        else {
            return [false, 0];
        }
    }

    static validateBoolean(arg: string | number | boolean): [boolean, boolean] {
        if (typeof(arg) == "boolean") {
            return [true, arg];
        }
        else {
            return [false, false];
        }
    }
}
