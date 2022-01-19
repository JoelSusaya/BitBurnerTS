import { NS, StockOrder, TIX } from "types/NetscriptDefinitions";
import { CONSTANTS  }   from "js/common/constants/constants";
import { Position } from "js/stocks/position";

export class Stock {
    readonly ns: NS;
    readonly TIX: TIX; 

    readonly symbol: string;
    readonly maxShares: number;

    price!: number;
    askPrice!: number;
    bidPrice!: number;
    
    forecast!:          number;
    volatility!:        number;
    forecastType!:      string;
    forecastMagnitude!: number;

    marketCap!: number;

    // Stock may not have a position, so it may be undefined.
    position!: Position;
    hasPosition!: Boolean;
    positionData!: number[];

    availableShares!: number;

    constructor(netscape: NS, stockSymbol: string) {
        this.ns = netscape;
        this.TIX = this.ns.stock;

        let allSymbols = this.TIX.getSymbols();

        if (!allSymbols.includes(stockSymbol)) {
            this.ns.tprintf("Error: Stock symbol %s not found.", stockSymbol);
            this.ns.exit();
        }

        this.symbol = stockSymbol

        this.maxShares      = this.TIX.getMaxShares(    this.symbol);

        this.update();
    }

    update(): void {
        this.price          = this.TIX.getPrice(        this.symbol);
        this.askPrice       = this.TIX.getAskPrice(     this.symbol);
        this.bidPrice       = this.TIX.getBidPrice(     this.symbol);

        this.forecast       = this.TIX.getForecast(     this.symbol);
        this.volatility     = this.TIX.getVolatility(   this.symbol);

        // Figure out the position we should take from the forecast
        // Also calculate a raw magnitude for the forecast, so we can compare
        // the potential of long and short positions.
        if (this.forecast > .5) {
            this.forecastType = CONSTANTS.STOCKS.LONG_POSITION;
            this.forecastMagnitude = this.forecast;
        }
        else {
            this.forecastType = CONSTANTS.STOCKS.SHORT_POSITION;
            this.forecastMagnitude = 1 - this.forecast;
        }
        
        // Create a Position from the position data, so we can know what position we have, if any
        this.positionData   = this.TIX.getPosition(     this.symbol);

        [this.hasPosition, this.position]       
                            = Position.getPositionFromData(this.ns, this.positionData);

        this.availableShares = this.maxShares - this.position.shares;

        this.marketCap      = this.price * this.maxShares;
    }

    // A method for buying stocks at market price
    // Arguments:
    // Shares - The number of shares to buy
    // Budget - An optional number denoting the amount of budget available for the purchase
    buy (shares: number): number {
        return this.marketOrder(CONSTANTS.STOCKS.LONG_POSITION, shares);
    }

    sell (shares: number): number {
        return this.marketSell(shares);
    }

    short (shares: number): number {
        return this.marketOrder(CONSTANTS.STOCKS.SHORT_POSITION, shares);
    }

    shortSell (shares: number): number {
        return this.marketSell(shares);
    }

    placeOrder() {
        
    }

    // Method for buying and shorting at market price
    // Arguments
    // positionType - long or short
    // shares - The number of shares to buy
    // budget? - Optional budget information to check to make sure the sale doesn't go over budget. Maybe shouldn't be part of this method.

    // Method returns [orderSuccess: boolean, orderCost: number]
    // orderSuccess will be false if the order fails for any reason
    // orderCost will be 0 if the order fails
    marketOrder(positionType: string, shares: number): number {
        // If the shares number isn't valid, exit
        if (!this.isValidShares(shares)) {
            this.ns.print(this.ns.vsprintf("Error: Invalid number of shares to buy. Got %s", [shares]));
            return 0;
        }

        // Make sure we have the latest stock data
        this.update();

        let purchaseCost = 0;
        
        // Make sure the position we are in matches the type of order we are trying to place
        if (this.position.type != positionType && this.position.type != CONSTANTS.STOCKS.NO_POSITION) {
            this.ns.print(this.ns.sprintf("Error: Trying to take %1$s position, but currently in %2$s position", 
                            positionType, this.position.type));
            return 0;
        }
        if  (positionType == CONSTANTS.STOCKS.LONG_POSITION) {
            purchaseCost = this.TIX.buy(this.symbol, shares);
        }
        else if (positionType == CONSTANTS.STOCKS.SHORT_POSITION) {
            purchaseCost = this.TIX.short(this.symbol, shares);
        }
        else {
            this.ns.print(this.ns.sprintf("Error: Invalid position. How did that happen?!"));
            return 0;
        }

        let total = purchaseCost * shares;

        
        return total;

    }

    marketSell(shares: number): number {
        // If the shares number isn't valid, exit
        if (!this.isValidShares(shares)) {
            this.ns.vsprintf("Error: Invalid number of shares to buy. Got %s", [shares]);
            return 0;
        }

        // Make sure we have the latest stock data
        this.update();
        
        let sellPrice = 0;
        
        // Make sure the position we are in matches the type of order we are trying to place
        // Unlike buying, we need to be in a position to sell
        if (this.position.type == CONSTANTS.STOCKS.NO_POSITION) {
            this.ns.print(this.ns.sprintf("Error: Trying to sell %1$s, but we don't own any.", 
                            this.symbol));
            return 0;
        }
        if  (this.position.type == CONSTANTS.STOCKS.LONG_POSITION) {
            sellPrice = this.TIX.sell(this.symbol, shares);
        }
        else if (this.position.type == CONSTANTS.STOCKS.SHORT_POSITION) {
            sellPrice = this.TIX.sellShort(this.symbol, shares);
        }
        else {
            this.ns.print(this.ns.sprintf("Error: Invalid position. How did that happen?!"));
            return 0;
        }

        let total = sellPrice * shares;

        // Detect if the sale was successful. Will be 0 if it failed.
        return total;
    }

    private isValidOrdidType(orderType: string) {
        if (CONSTANTS.ORDER_TYPES.includes(orderType)) {
            return true;
        }
        else {
            this.ns.print(this.ns.vsprintf("Error: Order type not found. Expected limit | stop, got %s", [orderType]));
            return false;
        }
    }

    private isValidShares(shares: number) {
        if (shares >= 0) {
            return true;
        }
        else {
            this.ns.print(this.ns.vsprintf("Error: Shares must be a postive number got %s", [shares]));
            return false;
        }
    }
}