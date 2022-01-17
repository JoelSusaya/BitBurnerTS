import { Argument } from "js/common/argument";
import { GLOBAL } from "js/common/global";
export async function main(ns) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    // this.ns.print(this.ns.vsprintf("", []));
    // Function must be async
    async function template() {
        if (GLOBAL.DEBUG) {
            ns.print("Debug mode is on.");
            ns.tail();
        }
        /* ARGUMENTS */
        // I like to store my arguments as constants, so I need some regular variables for validating the arguments
        // before assignment
        let argument;
        let isArgumentValid;
        // arg[0] - Target Server //
        // This is the server we want to hack. We can hack any server in the game, but only if our skill is high enough
        // and we have root access.
        [isArgumentValid, argument] = Argument.validateString(ns.args[0]);
        if (!isArgumentValid) {
            ns.tprintf("Error: arg[0] is invalid. Expected a string, but got %s", argument);
            argumentError();
        }
        const ARGUMENT = argument;
        // For calling when we have an argument error. Prints the usage info and exits.
        function argumentError() {
            usage();
            ns.exit();
        }
        // A function for printing the usage data to the terminal
        function usage() {
            let usage = `
                arg[0] - Target Server
                Expected: string
                This is the server we want to hack. We can hack any server in the game, but only 
                if our skill is high enough and we have root access.

                arg[1]? - Affect Stock Market?
                Optional
                Expected: boolean
                If true, hack() will affect the stock market, making it trend downwards on a successful hack()

                arg[2]? - threads
                Optional
                Expected: number
                The number of threads to use for this function. Must be less than or equal to the number of threads
                the script is running with.
            `;
            ns.tprint(usage);
        }
    }
    // Run the function or it's useless
    await template();
}
