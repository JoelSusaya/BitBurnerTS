import { NS } from "types/NetscriptDefinitions";
import { TradeBot } from "js/stocks/tradeBot";
// import { Stock } from "js/stocks/stock";

export async function main(ns: NS) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)

    // Function must be async
    async function tradeManager() {
        // Handle arguments
        // Optional: Find a sexy way to do it

        //let tradeBot = new TradeBot(ns, args[0], args[1], )
    }

    // Run the function or it's useless
    await tradeManager();
}