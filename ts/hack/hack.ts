import { BasicHGWOptions, NS } from "types/NetscriptDefinitions";
import { Argument } from "js/common/argument";
import { GLOBAL } from "js/common/global";

export async function main(ns: NS) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    // this.ns.print(this.ns.vsprintf("", []));
    // Function must be async
    async function hack() {
        if (GLOBAL.DEBUG) {
            ns.print("Debug mode is on.");
            ns.tail();
        }

        /* ARGUMENTS */
        // I like to store my arguments as constants, so I need some regular variables for validating the arguments
        // before assignment
        let argument: string | number | boolean;
        let isArgumentValid: boolean;

        // arg[0] - Target Server //
        // This is the server we want to hack. We can hack any server in the game, but only if our skill is high enough
        // and we have root access.
        [isArgumentValid, argument] = Argument.validateString(ns.args[0]);
        if (!isArgumentValid) {
            ns.tprintf("Error: arg[0] is invalid. Expected a string, but got %s", argument);
            argumentError();
        }
        const TARGET_SERVER = argument;

        // arg[1] - (Optional) Affect stock market? //
        // Default - false
        // Control whether we want the hack to affect the stock market. This will cause the stock to trend downward, for
        // hack()
        if(ns.args.length > 1) {
            [isArgumentValid, argument] = Argument.validateBoolean(ns.args[1]);
            if (!isArgumentValid) {
                ns.tprintf("Error: arg[1] is invalid. Expected true/false, but got %s", argument);
                argumentError();
            }
        }
        else {
            argument = false;
        }

        const AFFECT_STOCK_MARKET = argument;

        // arg[2] - (Optional) Threads //
        // Default - Number of threads the script is running with
        // The number of threads to use for this function. Must be less than or equal to the number of threads the
        // script is running with
        if (ns.args.length > 2) {
            [isArgumentValid, argument] = Argument.validateNumber(ns.args[2]);
            if (!isArgumentValid) {
                ns.tprintf("Error: arg[2] is invalid. Expected a number, but got %s", argument);
                argumentError();
            }
        }
        else {
            argument = 0;
        }

        const THREADS = argument ? argument : 1;

        // Wrap these guys into a BasicHGWOptions object to give to the hack script
        let HGW_OPTIONS: BasicHGWOptions = {
            stock: AFFECT_STOCK_MARKET,
            threads: THREADS
        }

        // LOL all of that just to call this
        await ns.hack(TARGET_SERVER, HGW_OPTIONS)

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
    await hack();
}