import { NS } from "types/NetscriptDefinitions";
import { TradeBot } from "js/stocks/tradeBot";
import { Argument } from "js/common/argument";
import { SCRIPTS } from "js/common/constants/scripts";
// import { Stock } from "js/stocks/stock";

export async function main(ns: NS) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)

    // Function must be async
    async function tradeManager() {
        const START = 'start';
        const STOP = 'stop';
        const COMMANDS = [START, STOP];

        // Handle arguments
        // Optional: Find a sexy way to do it
        /* ARGUMENTS */
        // args[0] - Command (Start, Stop, List)
        //

        
        let argument: string | number | boolean;
        let isArgumentValid: boolean;

        // arg[0] - Command
        [isArgumentValid, argument] = Argument.validateString(ns.args[0]);

        // If the argument is invalid or the command isn't valid, exit
        if (!isArgumentValid || !COMMANDS.includes(argument)) {
            ns.tprintf("Error: arg[0] is invalid. Expected %s, got %s", COMMANDS, argument);
            ns.exit();
        }

        const COMMAND = argument;

        if (COMMAND == START) {
            ns.run(SCRIPTS.START_BOT, 1, ...ns.args.slice(1));
        }
        else if (COMMAND == STOP) {
            
        }
    }

    // Run the function or it's useless
    await tradeManager();
}