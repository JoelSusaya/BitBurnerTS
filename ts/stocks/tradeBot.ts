import { NS, TIX } from "types/NetscriptDefinitions";
import { CONSTANTS } from "js/common/constants/constants";
import { Stock } from "js/stocks/stock";
import { Formatter } from "js/common/formatter";
import { BUDGET } from "js/common/budget";

export class TradeBot {
    private readonly ns: NS;
    private readonly TIX: TIX;

    // A name to reference by
    private readonly name: string;

    private readonly stockSymbols: string[];
    
    private stocks: Stock[];
    portfolio: Stock[];
    portfolioValue: number;

    // private fileName : string;

    //budget: number;
    forecastThreshold: number;

    private formatter: Formatter;
    
    constructor(netscript: NS, name: string, forecastThreshold: number, ...symbolsToAdd: string[]) {
        this.ns = netscript;
        this.TIX = this.ns.stock;
        
        this.formatter = new Formatter(this.ns);
        
        this.name = name;

        // this.fileName = "/data/stocks/" + this.name + ".txt";
        this.ns.print(this.ns.vsprintf("Budget: %s, ", [BUDGET.STOCKS].map(this.formatter.formatCurrency) ) );

        
        //this.ns.print(BUDGET.STOCKS);
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
        // Update our portfolio, selling off anything below our threshold
        this.updatePortfolio();

        //this.ns.print(this.ns.vsprintf("Budget: %s", [this.budget]));

        // Our potential budget is our budget plus the value of our portfolio
        //let potentialBudget = this.budget + this.portfolioValue;

        // Spend our budget. If we want to buy a stock, but don't have enough money, check if we have any stocks
        // in our portfolio that have a worse forcast. Sell the worst stocks and buy better ones.

        // Update our stock data, which also sorts by forecast
        this.updateStockData();

        // for (let stock of this.stocks) {
        //     this.ns.print(this.ns.vsprintf("Stock: %s, forecast: %s, fMag: %s", [stock.symbol, stock.forecast, stock.forecastMagnitude]))
        // }

        // Calculate how to spend the potential budget based on the stock forecasts.
        for (let stock of this.stocks) {
            //this.ns.print(this.ns.vsprintf("Checking %s, Forecast: %s, Available Shares %s", [stock.symbol, stock.forecast, stock.availableShares]));
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
                this.ns.print(this.ns.vsprintf("Does not meet threshold %s / %s", 
                                [stock.forecastMagnitude, this.forecastThreshold]));
                break;
            }

            // Next check how much it would cost to buy all available shares
            // We use the API to make sure the price is accurate
            // this.ns.print(this.ns.vsprintf("Calculating puchase cost for %s, %s shares available, %s position", 
            //                 [stock.symbol, stock.availableShares, stock.position.type]));
            let purchaseCost = this.TIX.getPurchaseCost(stock.symbol, stock.availableShares, stock.forecastType);

            // If we have enough budget, sell our worst forecasted stock first
            // Unless we have no portfolio, then skip
            if (this.portfolio.length > 0 && purchaseCost > BUDGET.STOCKS) {
                // Get the worst forecasted stock
                let worstPortfolioStock = this.portfolio[this.portfolio.length - 1];

                // If our worst portfolio stock has a better forecast than this one
                // skip the rest
                // Also check that the stock isn't the same as the one we are buying
                if (worstPortfolioStock.symbol != stock.symbol && worstPortfolioStock.forecastMagnitude < stock.forecastMagnitude) {
                    this.ns.print("Trying to rebalance...");
                    // Find out how much we need to sell
                    // Add a bit of room for error
                    let neededBudget = purchaseCost - BUDGET.STOCKS;
                    let sharesToSell = Math.ceil(neededBudget / worstPortfolioStock.position.price);
                    sharesToSell *= 1.05;
                    
                    // Sell the shares
                    let sellPrice = worstPortfolioStock.marketSell(sharesToSell) - CONSTANTS.STOCKS.COMMISSION_FEE;;
                    if (sellPrice != 0) {
                        let budgetSuccess = BUDGET.addToStockBudget(this.ns, sellPrice);

                        // TEMP FIX: my budgeter sometimes refuses to add money to the budget, so just yolo it all
                        // if that happens
                        if (!budgetSuccess) {
                            BUDGET.stock_yolo(this.ns.getPlayer());
                        }
                    }
                }
            }
            // Check again if we meet the budget, if we don't check to see if our budget is less than the commission fee
            // if it is, skip this
            if (purchaseCost > BUDGET.STOCKS) {
                // If we couldn't rebalance and we have a smaller budget than the commission fee, don't waste money
                if (BUDGET.STOCKS < CONSTANTS.STOCKS.COMMISSION_FEE) {
                    break;
                }

                this.ns.print(this.ns.vsprintf("Can't afford %s. Trying to budget starting with %s.", 
                            [purchaseCost, BUDGET.STOCKS].map(this.formatter.formatCurrency) ) );
                // If we don't have enough money, buy as much of the stock as we can
                // Leave a bit of room because the price may be higher than estimated
                let approxSharesCanBuy = Math.floor(BUDGET.STOCKS / stock.price) * CONSTANTS.STOCKS.SHARE_PURCHASE_MULTIPLIER;

                // We're out of money if this happens, so break
                if (approxSharesCanBuy == 0) {
                    break;
                }

                let buyPrice = stock.marketOrder(stock.forecastType, approxSharesCanBuy) + CONSTANTS.STOCKS.COMMISSION_FEE;;
                
                // If we succeeded, add the stock to our profolio and subtract the buy price from our budget
                if (buyPrice != 0) {
                    // If we just bought more of the stock, we don't want to add it
                    if (!this.portfolio.includes(stock)) {
                        this.portfolio.push(stock);
                    }
                    BUDGET.withdrawFromStockBudget(this.ns, buyPrice);

                    this.ns.print(this.ns.vsprintf("Purchased successfully. Bought %s for %s.", 
                    [stock.symbol, this.formatter.formatCurrency(buyPrice)]));
                }  
                // Exit because we are out of budget if we got here
                break;
            }

            this.ns.print(this.ns.vsprintf("Trying to purchase %s, %s shares, %s position", 
                [stock.symbol, stock.availableShares, stock.forecastType] ) );
            
            // Try to buy the stock
            let buyPrice = stock.marketOrder(stock.forecastType, stock.availableShares) + CONSTANTS.STOCKS.COMMISSION_FEE;;

            // If we succeeded, add the stock to our profolio and subtract the buy price from our budget
            if (buyPrice != 0) {
                // If we just bought more of the stock, we don't want to add it
                if (!this.portfolio.includes(stock)) {
                    this.portfolio.push(stock);
                }
                BUDGET.withdrawFromStockBudget(this.ns, buyPrice);

                this.ns.print(this.ns.vsprintf("Purchased successfully. Bought %s for %s.", 
                [stock.symbol, this.formatter.formatCurrency(buyPrice)]));
            }  
        }

        // Update external portfolio file
        // this.ns.rm(this.fileName, this.ns.getHostname());
        // for (let stock of this.portfolio) {
        //     // Write the stock symbol to a file in case we end the bot
        //     await this.ns.write(this.fileName, stock.symbol + "\n", "a");
        // }
    }

    liquidate(): void {

    }

    // Go through each stock and update it. Also update our portfolio stocks to make sure they are up-to-date.
    private updateStockData(): void {
        let newPortfolio: Array<Stock> = new Array<Stock>();
        for (let stock of this.stocks) {
            stock.update();
            if(stock.hasPosition) {
                newPortfolio.push(stock);
            }
        }
        this.portfolio = newPortfolio;

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
            // Make a sell threshold to avoid exiting a position from a 1% forecast dip
            let sellThreshold = this.forecastThreshold - 0.01;
            if (stock.forecastMagnitude < sellThreshold || stock.forecastType != stock.position.type) {
                this.ns.print(this.ns.vsprintf("Selling %s", [stock.symbol]));
                let sellPrice = stock.marketSell(stock.position.shares) - CONSTANTS.STOCKS.COMMISSION_FEE;

                // If the sale worked, remove the stock from the portfolio and it it to our budget
                //this.ns.print(this.ns.vsprintf("Sold %s, removing from portfolio. Portfolio size: %s", [stock.symbol, this.portfolio.length]));
                if (sellPrice != 0) {
                    let index = this.portfolio.indexOf(stock);
                    this.portfolio.splice(index, 1);
                    let budgetSuccess = BUDGET.addToStockBudget(this.ns, sellPrice);
                    
                    // TEMP FIX: my budgeter sometimes refuses to add money to the budget, so just yolo it all
                    // if that happens
                    if (!budgetSuccess) {
                        BUDGET.stock_yolo(this.ns.getPlayer());
                    }
                    this.ns.print(this.ns.vsprintf("Sold %s. Portfolio size: %s", [stock.symbol, this.portfolio.length]));
                }
            }
            else {
                this.portfolioValue += stock.position.shares * stock.price;
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