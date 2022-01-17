import { NS, TIX } from "types/NetscriptDefinitions";
import { CONSTANTS } from "js/common/constants/constants";
import { Stock } from "js/stocks/stock";

export class TradeBot {
    private readonly ns: NS;
    private readonly TIX: TIX;

    private readonly stockSymbols: string[];
    
    private stocks: Stock[];
    private portfolio: Stock[];
    private portfolioValue: number;

    budget: number;
    forecastThreshold: number;
    
    constructor(netscript: NS, budget: number, forecastThreshold: number, ...symbolsToAdd: string[]) {
        this.ns = netscript;
        this.TIX = this.ns.stock;
        
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
    tick() {
        // Update our portfolio, selling off anything below our threshold
        this.updatePortfolio();

        // Our potential budget is our budget plus the value of our portfolio
        let potentialBudget = this.budget + this.portfolioValue;

        // Spend our budget. If we want to buy a stock, but don't have enough money, check if we have any stocks
        // in our portfolio that have a worse forcast. Sell the worst stocks and buy better ones.

        // Update our stock data, which also sorts by forecast
        this.updateStockData();

        // Calculate how to spend the potential budget based on the stock forecasts.
        for (let stock of this.stocks) {
            // Stocks are sorted by forecast, so if we hit one beneath our threshold before our budget is gone,
            // just stop
            if (stock.forecast < this.forecastThreshold) {
                break;
            }

            // Next check how much it would cost to buy all available shares
            // We use the API to make sure the price is accurate
            let sharesAvailable = stock.maxShares - stock.position.shares;
            let purchaseCost = this.TIX.getPurchaseCost(stock.symbol, sharesAvailable, stock.position.type);

            // If we have enough budget, sell our worst forecasted stock first
            if (purchaseCost > this.budget) {
                // Get the worst forecasted stock
                let worstPortfolioStock = this.portfolio[this.portfolio.length - 1];

                // If our worst portfolio stock has a better forecast than this one
                // break because we are out of money
                if (Math.abs(worstPortfolioStock.forecast) > Math.abs(stock.forecast)) {
                    break;
                }

                // Find out how much we need to sell
                // Add a bit of room for error
                let neededBudget = purchaseCost - this.budget;
                let sharesToSell = Math.ceil(neededBudget / worstPortfolioStock.position.price);
                sharesToSell *= 1.05;
                
                // Sell the shares, buy the stock
                worstPortfolioStock.marketSell(stock.position.type, sharesToSell);
            }

            stock.marketOrder(stock.forecastType, sharesAvailable);
        }

    }

    private updateStockData() {
        for (let stock of this.stocks) {
            stock.update();
        }

        this.sortForecasts();
    }

    private sortForecasts() {
        // Sort stocks by the absolute value of their forecast
        // We don't care which direction it is going because we can take long or short positions
        this.stocks.sort( (stockA, stockB) => Math.abs(stockA.forecast) - Math.abs(stockB.forecast) );
    }

    // Update the stock data and get our portfolio value
    private updatePortfolio() {
        this.portfolioValue = 0;
        
        // Go through each stock and update it
        // If it is under our threshold or we have the wrong position, sell it, 
        // otherwise add it's value to our portfolio
        for (let stock of this.portfolio) {
            stock.update();
            
            // If we sell the stock, lower our porfolio value and add to our budget
            if (Math.abs(stock.forecast) < this.forecastThreshold || stock.forecastType != stock.position.type) {
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

    private sortPortfolio() {
        // Sort stocks by the absolute value of their forecast
        // We don't care which direction it is going because we can take long or short positions
        this.portfolio.sort( (stockA, stockB) => Math.abs(stockA.forecast) - Math.abs(stockB.forecast) );
    }
}