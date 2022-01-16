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
        // Check the value of our portolio to find our potential budget
        this.updatePortfolioData();
        this.sortPortfolio();

        // Our potential budget is our budget plus the value of our portfolio
        let potentialBudget = this.budget + this.portfolioValue;

        // Spend our budget. If we want to buy a stock, but don't have enough money, check if we have any stocks
        // in our portfolio that have a worse forcast. Sell the worst stocks and buy better ones.

        // Calculate how to spend the potential budget based on the stock forecasts.
        for (let stock of this.stocks) {
            // Stocks are sorted by forecast, 
            if (stock.forecast < this.forecastThreshold) {
                break;
            }
        }

    }

    private updateStockData() {
        for (let stock of this.stocks) {
            stock.update();
        }
    }

    private sortForecasts() {
        // Update the stock data.
        this.updateStockData();

        // Sort stocks by the absolute value of their forecast
        // We don't care which direction it is going because we can take long or short positions
        this.stocks.sort( (stockA, stockB) => Math.abs(stockA.forecast) - Math.abs(stockB.forecast) );
    }

    // Update the stock data and get our portfolio value
    private updatePortfolioData() {
        this.portfolioValue = 0;
        for (let stock of this.portfolio) {
            stock.update();
            this.portfolioValue += stock.position.value;
        }
    }

    private sortPortfolio() {
        // Sort stocks by the absolute value of their forecast
        // We don't care which direction it is going because we can take long or short positions
        this.portfolio.sort( (stockA, stockB) => Math.abs(stockA.forecast) - Math.abs(stockB.forecast) );
    }
}