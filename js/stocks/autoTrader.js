import { Stock } from "js/stocks/stock";
export class TradeBot {
    constructor(netscript) {
        this.ns = netscript;
        this.TIX = this.ns.stock;
        // Get all of the stock symbols
        this.stockSymbols = this.TIX.getSymbols();
        // Create an array of Stocks
        this.stocks = new Array();
        for (let stockSymbol of this.stockSymbols) {
            this.stocks.push(new Stock(this.ns, stockSymbol));
        }
    }
    // Run the AutoTrader
    run() {
    }
    stop() {
    }
    updateStockData() {
        for (let stock of this.stocks) {
            stock.update();
        }
    }
    sortForecasts() {
        // Update the stock data.
        this.updateStockData();
        // Sort stocks by the absolute value of their forecast
        // We don't care which direction it is going because we can take long or short positions
        this.stocks.sort((stockA, stockB) => Math.abs(stockA.forecast) - Math.abs(stockB.forecast));
    }
}
