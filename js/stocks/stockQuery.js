import { Stock } from "js/stocks/stock";
import { Formatter } from "js/common/formatter";
export async function main(ns) {
    async function stockQuery() {
        // I use EMPTY_STRING because it is easier for me to visually grep and semantically understand
        const EMPTY_STRING = "";
        // Create a constant for the TIX API, which we can get access to through ns.stock.
        // We could check if we have API access, but I think that persists through Augmentations, so I won't bother.
        const TIX = ns.stock;
        // Check to see if we have access to the necessary APIS
        // Parse the script from the argument, checking its type to give it a definite type
        let arg0 = EMPTY_STRING;
        if (typeof (ns.args[0]) == "string") {
            arg0 = ns.args[0];
        }
        else {
            ns.tprint("Error: args[0] is not a string. arg[0] should be the stock symbol to query. Got: " + ns.args[0]);
            ns.exit();
        }
        // I'm really sorry about this.
        // Declare a constant, setting it to arg0 if it isn't empty.
        // Then check if STOCK_SYMBOL is empty and exit if it is.
        const STOCK_SYMBOL = (arg0 != EMPTY_STRING) ? arg0 : EMPTY_STRING;
        if (STOCK_SYMBOL == EMPTY_STRING) {
            ns.tprint("Error: args[0] is missing. args[0] should be the stock symbol to query.");
            ns.exit();
        }
        let formatter = new Formatter(ns);
        let stock = new Stock(ns, STOCK_SYMBOL);
        // Format the currency, percentages, and other numbers
        let currencyData = [stock.price, stock.askPrice, stock.bidPrice, stock.marketCap, stock.position.price].map(formatter.formatCurrency);
        let percentageData = [stock.forecast, stock.volatility, stock.forecastMagnitude].map(formatter.formatPercentage);
        let numberData = [stock.maxShares, stock.position.shares].map(formatter.formatNumber);
        // Prepare a formatted string to print to the terminal.
        let outputData = ns.sprintf(`
            Price:      %1$s
            Ask Price: 	%2$s
            Bid Price:	%3$s
    
            Volatility:	%7$s

            Forecast:	%6$s
            Magnitude:  %8$s

            Position:   %11$s
            Shares:     %10$s
            Price:      %5$s
    
            Max Shares:	%9$s
            Market Cap: %4$s
        `, ...currencyData, ...percentageData, ...numberData, stock.position.type);
        ns.tprint(outputData);
    }
    await stockQuery();
}
