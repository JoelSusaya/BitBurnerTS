// Pretty useless class, I thought I would do more with it
export class Argument {
    readonly value: string | number| boolean;

    constructor(arg: string | number| boolean) {
        this.value = arg;
    }

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

export class StringArgument extends Argument {
    readonly value: string;

    constructor(arg: string) {
        super(arg);

        this.value = arg;
    }
}

export class NumberArgument extends Argument {
    readonly value: number;

    constructor(arg: number) {
        super(arg);

        this.value = arg;
    }
}

export class BooleanArgument extends Argument {
    readonly value: boolean;

    constructor(arg: boolean) {
        super(arg);

        this.value = arg;
    }
}