import { NS, TIX } from "types/NetscriptDefinitions";
import { CONSTANTS } from "js/common/constants/constants";
import { Stock } from "js/stocks/stock";

export class TradeBot {
    private readonly ns: NS;
    private readonly TIX: TIX;

    // A name to reference by
    private readonly name: string;

    private readonly stockSymbols: string[];
    
    private stocks: Stock[];
    private portfolio: Stock[];
    private portfolioValue: number;

    private fileName : string;

    budget: number;
    forecastThreshold: number;
    
    constructor(netscript: NS, name: string, budget: number, forecastThreshold: number, ...symbolsToAdd: string[]) {
        this.ns = netscript;
        this.TIX = this.ns.stock;
        
        this.name = name;

        this.fileName = "/data/stocks/" + this.name + ".txt";
        
        this.budget = budget;
        this.forecastThreshold = forecastThreshold;
        this.portfolioValue = 0;

        // Get all of the stock symbols
        this.stockSymbols = this.TIX.getSymbols();

        // Create an array of Stocks
        this.stocks = new Array<Stock>();
        for (let stockSymbol of this.stockSymbols) {
            this.stocks.push(new Stock(this.ns, stockSymbol));
        }

        // Check if we should add any symbols to our portfolio
        this.portfolio = new Array<Stock>();
        if (symbolsToAdd) {
            for (let stockSymbol of symbolsToAdd) {
                let stock = new Stock(this.ns, stockSymbol)
                this.portfolio.push(stock);
                this.portfolioValue += stock.position.value;
            }
        }
    }

    // Tick the TradeBot
    async tick() {
        // Delete data file
        this.ns.rm(this.fileName, this.ns.getHostname());

        // Update our portfolio, selling off anything below our threshold
        this.updatePortfolio();

        // Our potential budget is our budget plus the value of our portfolio
        let potentialBudget = this.budget + this.portfolioValue;

        // Spend our budget. If we want to buy a stock, but don't have enough money, check if we have any stocks
        // in our portfolio that have a worse forcast. Sell the worst stocks and buy better ones.

        // Update our stock data, which also sorts by forecast
        this.updateStockData();

        // for (let stock of this.stocks) {
        //     this.ns.print(this.ns.vsprintf("Stock: %s, forecast: %s, fMag: %s", [stock.symbol, stock.forecast, stock.forecastMagnitude]))
        // }

        // Calculate how to spend the potential budget based on the stock forecasts.
        for (let stock of this.stocks) {
            // Apparently shorting stocks isn't available until you get some shit I don't have, so we will
            // skip any short positions for now
            if (stock.forecastType == CONSTANTS.STOCKS.SHORT_POSITION) {
                continue;
            }

            // Skip this one if there are no available shares
            if (stock.availableShares == 0) {
                continue;
            }

            //this.ns.print(this.ns.vsprintf("Stock: %s, forecast: %s, fMag: %s", [stock.symbol, stock.forecast, stock.forecastMagnitude]))
            // Stocks are sorted by forecast, so if we hit one beneath our threshold before our budget is gone,
            // just stop
            if (stock.forecastMagnitude < this.forecastThreshold) {
                break;
            }

            // Next check how much it would cost to buy all available shares
            // We use the API to make sure the price is accurate
            // this.ns.print(this.ns.vsprintf("Calculating puchase cost for %s, %s shares available, %s position", 
            //                 [stock.symbol, stock.availableShares, stock.position.type]));
            let purchaseCost = this.TIX.getPurchaseCost(stock.symbol, stock.availableShares, stock.forecastType);

            // If we have enough budget, sell our worst forecasted stock first
            // Unless we have no portfolio, then skip
            if (this.portfolio.length > 0 && purchaseCost > this.budget) {
                // Get the worst forecasted stock
                let worstPortfolioStock = this.portfolio[this.portfolio.length - 1];

                // If our worst portfolio stock has a better forecast than this one
                // break because we are out of money
                if (worstPortfolioStock.forecastMagnitude > stock.forecastMagnitude) {
                    break;
                }

                // Find out how much we need to sell
                // Add a bit of room for error
                let neededBudget = purchaseCost - this.budget;
                let sharesToSell = Math.ceil(neededBudget / worstPortfolioStock.position.price);
                sharesToSell *= 1.05;
                
                // Sell the shares
                let isSuccess: boolean;
                let sellPrice: number;
                [isSuccess, sellPrice] = worstPortfolioStock.marketSell(stock.position.type, sharesToSell);
                this.budget += sellPrice;
            }
            // Check again if we meet the budget
            if (purchaseCost > this.budget) {
                this.ns.print(this.ns.vsprintf("Can't afford %s. Trying to budget starting with %s.", [purchaseCost, this.budget]));
                // If we don't have enough money, buy as much of the stock as we can
                // Leave a bit of room because the price may be higher than estimated
                let approxSharesCanBuy = Math.floor(this.budget / stock.price) * 0.90;

                stock.marketOrder(stock.forecastType, approxSharesCanBuy);
                // Write the stock symbol to a file in case we end the bot
                await this.ns.write(this.fileName, stock.symbol + "\n", "a");
                // Exit because we are out of budget
                break;
            }


            stock.marketOrder(stock.forecastType, stock.availableShares);
            // Write the stock symbol to a file in case we end the bot
            await this.ns.write(this.fileName, stock.symbol + "\n", "a");
        }

    }

    liquidate(): void {

    }

    private updateStockData(): void {
        for (let stock of this.stocks) {
            stock.update();
        }

        this.sortForecasts();
    }

    private sortForecasts(): void {
        // Sort stocks by the magnitude of their forecast
        // We don't care which direction it is going because we can take long or short positions
        this.stocks.sort( this.sortStocksByForecastMagnitude );
    }

    // Update the stock data and get our portfolio value
    private updatePortfolio(): void {
        this.portfolioValue = 0;
        
        // Go through each stock and update it
        // If it is under our threshold or we have the wrong position, sell it, 
        // otherwise add it's value to our portfolio
        for (let stock of this.portfolio) {
            stock.update();
            
            // If we sell the stock, lower our porfolio value and add to our budget
            if (stock.forecastMagnitude < this.forecastThreshold || stock.forecastType != stock.position.type) {
                let sellSuccess: boolean;
                let sellPrice: number;
                [sellSuccess, sellPrice] = stock.marketSell(stock.position.type, stock.position.shares);

                this.portfolioValue -= sellPrice;
                this.budget         += sellPrice;
            }
            else {
                this.portfolioValue += stock.position.value;
            }
        }

        this.sortPortfolio();
    }

    private sortPortfolio(): void {
        // Sort stocks by the magnitude of their forecast
        // We don't care which direction it is going because we can take long or short positions
        this.portfolio.sort( this.sortStocksByForecastMagnitude );
    }

    private sortStocksByForecastMagnitude(stockA: Stock, stockB: Stock): number {
        return stockB.forecastMagnitude - stockA.forecastMagnitude;
    }
}