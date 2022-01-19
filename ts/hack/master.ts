import { NS } from "types/NetscriptDefinitions";
import { Argument } from "js/common/argument";
import { GLOBAL } from "js/common/global";

export async function main(ns: NS) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    // this.ns.print(this.ns.vsprintf("", []));
    // Function must be async

    // This is a master script for running a hacking operation on a target
    async function master() {
        // if debug mode is one, 
        if (GLOBAL.DEBUG) {
            ns.print("Debug mode is on.");
            ns.tail();
        }

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
            `;

            ns.tprint(usage);
        }

        /* ARGUMENTS */
        // An enum for naming your arguments instead of just using integers
        enum ARGS {
            TARGET_SERVER
        }

        // I like to store my arguments as constants, so I need some regular variables for validating the arguments
        // before assignment
        let argument: string | number | boolean;
        let isArgumentValid: boolean;

        // arg[0] - Target Server //
        // This is the server we want to hack. We can hack any server in the game, but only if our skill is high enough
        // and we have root access.
        [isArgumentValid, argument] = Argument.validateString(ns.args[ARGS.TARGET_SERVER]);
        if (!isArgumentValid) {
            ns.tprintf("Error: arg[0] is invalid. Expected a string, but got %s", argument);
            argumentError();
        }
        const TARGET_SERVER = argument;

        
    }

    // Run the function or it's useless
    await master();
}