import { BasicHGWOptions, NS } from "types/NetscriptDefinitions";
import { Argument, StringArgument } from "js/common/argument";
import { GLOBAL } from "js/common/global";

// A class for handling operations common to all scripts
// Not really sure how to make it work well enough to be useful
export class Script {
    ns: NS;
    totalRequiredArguments: number;
    argumentTypes: Array<string>;
    rawArguments: Array<string | number | boolean>;
    arguments: Array<Argument>;
    usageInfo: string;

    constructor(netscript: NS, totalRequiredArgs: number, argTypes: Array<string>, 
                    rawArgs: Array<string | number | boolean>, usageInfo?: string) {
        this.ns = netscript;
        this.totalRequiredArguments = totalRequiredArgs;
        this.argumentTypes = argTypes;
        this.rawArguments = rawArgs;
        this.arguments = new Array<Argument>();
        this.usageInfo = usageInfo || "";

        this.validateArguments();
        
    }

    validateArguments() {
        // First make sure we have the right number of arguments
        let totalArguments = this.rawArguments.length;
        if (totalArguments < this.totalRequiredArguments) {
            this.ns.tprint(this.ns.vsprintf("Error: Not enough arguments. Expected at least %s arguments, but got %s.", 
            [this.totalRequiredArguments, totalArguments]));
            this.argumentError();
        }

        let argument: Argument;
        let rawArgument: string | number | boolean;
        let isArgumentValid: boolean;

        // Go through each of our raw arguments and check them against their expected type
        for (let index = 0; index < this.rawArguments.length; index++) {
            let expectedArgType = this.argumentTypes[index];
            let argType = typeof(this.rawArguments[index]);

            switch(expectedArgType) {
                case 'string':
                    [isArgumentValid, rawArgument] = Argument.validateString(this.rawArguments[index]);
                    if (!isArgumentValid) {
                        this.ns.tprint(this.ns.vsprintf("Error: arg[%s] is invalid. Expected a number, but got %s",
                        [index, rawArgument]));
                        this.argumentError();
                    }
                    argument = new StringArgument(rawArgument);
                    break;
                case 'number':
                    break;
                case 'boolean':
                    break;
                default:
                    this.ns.print(this.ns.vsprintf("Error: Argument type is not supported. Must be string, number, or boolean. Got %s.", 
                        [argType]));
                    this.argumentError();
                    
            }
        }
    }

    argumentError() {
        this.usage();
        this.ns.exit();
    }

    usage() {
        let usage = `
            arg[0] - Target Server
            Expected: string
            This is the server we want to weaken. We can weaken any server in the game, I think.

            arg[1]? - Affect Stock Market?
            Optional
            Expected: boolean
            If true, weaken() will affect the stock market, making it trend downwards on a successful weaken()

            arg[2]? - threads
            Optional
            Expected: number
            The number of threads to use for this function. Must be less than or equal to the number of threads
            the script is running with.
        `;

        this.ns.tprint(usage);
    }
}