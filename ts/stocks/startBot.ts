import { NS } from "types/NetscriptDefinitions";
import { TradeBot } from "js/stocks/tradeBot";
import { Argument } from "js/common/argument";
import { CONSTANTS } from "js/common/constants/constants";
// import { Stock } from "js/stocks/stock";

export async function main(ns: NS) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)

    // Function must be async
    async function startBot() {
        ns.tail();
        // Handle arguments
        // Optional: Find a sexy way to do it
        /* ARGUMENTS */
        // args[0] - Name of tradebot
        // args[1] - Budget amount for this tradebot
        // args[2] - Forecast Threshold (minimum forecast magnitude)
        // args[3...] - Any symbols for stocks we want to add to the bot, in case we want to track stocks we own already
        
        let argument: string | number | boolean;
        let isArgumentValid: boolean;

        // arg[0] - Name
        [isArgumentValid, argument] = Argument.validateString(ns.args[0]);
        if (!isArgumentValid) {
            ns.tprintf("Error: arg[1] is invalid. Expected a string, but got %s", argument);
            ns.exit();
        }
        const NAME = argument;

        // arg[1] - Budget
        [isArgumentValid, argument] = Argument.validateNumber(ns.args[1]);
        if (!isArgumentValid || argument < 0) {
            ns.tprintf("Error: arg[1] is invalid. Expected a number above 0, but got %s", typeof(argument));
            ns.exit();
        }
        const BUDGET = argument;

        // arg[2] - Forecast Threshold
        [isArgumentValid, argument] = Argument.validateNumber(ns.args[2]);
        if (!isArgumentValid || argument < 0 || argument > 1) {
            ns.tprintf("Error: arg[1] is invalid. Expected a number between 1 and 0 but got %s", argument);
            ns.exit();
        }
        const FORECAST_THRESHOLD = argument;

        // args[3...] - Stock Symbols
        // Loop over the rest of the args starting with index 3 and add them to a stock symbol array if valid
        let stockSymbols: Array<string> = new Array<string>();
        for (let index = 3; index < ns.args.length; index++) {
            [isArgumentValid, argument] = Argument.validateString(ns.args[index]);
            if (!isArgumentValid) {
                ns.tprintf("Error: arg[1] is invalid. Expected a string, but got %s", typeof(argument));
                ns.exit();
            }
            stockSymbols.push(argument);
        }

        let tradeBot = new TradeBot(ns, NAME, BUDGET, FORECAST_THRESHOLD, ...stockSymbols);

        while(true) {
            await tradeBot.tick();
            await ns.asleep(CONSTANTS.STOCKS.UPDATE_TICK_DURATION);
        }
    }

    // Run the function or it's useless
    await startBot();
}