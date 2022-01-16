import { CONSTANTS } from "js/common/constants/constants";
import { Position } from "js/stocks/position";
export class Stock {
    constructor(netscape, stockSymbol) {
        this.ns = netscape;
        this.TIX = this.ns.stock;
        let allSymbols = this.TIX.getSymbols();
        if (!allSymbols.includes(stockSymbol)) {
            this.ns.tprintf("Error: Stock symbol %s not found.", stockSymbol);
            this.ns.exit();
        }
        this.symbol = stockSymbol;
        this.maxShares = this.TIX.getMaxShares(this.symbol);
        this.update();
    }
    update() {
        this.price = this.TIX.getPrice(this.symbol);
        this.askPrice = this.TIX.getAskPrice(this.symbol);
        this.bidPrice = this.TIX.getBidPrice(this.symbol);
        this.forecast = this.TIX.getForecast(this.symbol);
        this.volatility = this.TIX.getVolatility(this.symbol);
        if (this.forecast > 50) {
            this.forecastType = CONSTANTS.STOCKS.LONG_POSITION;
        }
        else {
            this.forecastType = CONSTANTS.STOCKS.SHORT_POSITION;
        }
        this.positionData = this.TIX.getPosition(this.symbol);
        [this.hasPosition, this.position]
            = Position.getPositionFromData(this.ns, this.positionData);
        this.marketCap = this.price * this.maxShares;
    }
    // A method for buying stocks at market price
    // Arguments:
    // Shares - The number of shares to buy
    // Budget - An optional number denoting the amount of budget available for the purchase
    buy(shares, budget) {
        return this.marketOrder(CONSTANTS.STOCKS.LONG_POSITION, shares, budget);
    }
    sell(shares) {
        return this.marketSell(CONSTANTS.STOCKS.SHORT_POSITION, shares);
    }
    short(shares, budget) {
        return this.marketOrder(CONSTANTS.STOCKS.SHORT_POSITION, shares, budget);
    }
    shortSell(shares) {
        return this.marketSell(CONSTANTS.STOCKS.SHORT_POSITION, shares);
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
    marketOrder(positionType, shares, budget) {
        // If the shares number isn't valid, exit
        if (!this.isValidShares(shares)) {
            this.ns.tprintf("Error: Invalid number of shares to buy. Got %s", shares);
            return [false, 0];
        }
        // Make sure we have the latest stock data
        this.update();
        let purchaseCost = this.price * shares;
        // If we are trying to buy more than we have budgeted, stop.
        if (budget && purchaseCost > (budget - CONSTANTS.STOCKS.COMMISSION_FEE)) {
            return [false, 0];
        }
        // Make sure the position we are in matches the type of order we are trying to place
        if (this.position.type != positionType) {
            this.ns.sprintf("Error: Trying to take %1$s position, but currently in %2$s position", positionType, this.position.type);
            return [false, 0];
        }
        if (positionType == CONSTANTS.STOCKS.LONG_POSITION || positionType == CONSTANTS.STOCKS.NO_POSITION) {
            this.TIX.buy(this.symbol, shares);
            return [true, purchaseCost];
        }
        else if (positionType == CONSTANTS.STOCKS.SHORT_POSITION || positionType == CONSTANTS.STOCKS.NO_POSITION) {
            this.TIX.short(this.symbol, shares);
            return [true, purchaseCost];
        }
        else {
            this.ns.sprintf("Error: Invalid position. How did that happen?!");
            return [false, 0];
        }
    }
    marketSell(positionType, shares) {
        // If the shares number isn't valid, exit
        if (!this.isValidShares(shares)) {
            this.ns.tprintf("Error: Invalid number of shares to buy. Got %s", shares);
            return [false, 0];
        }
        // Make sure we have the latest stock data
        this.update();
        let sellPrice = this.price * shares;
        // Make sure the position we are in matches the type of order we are trying to place
        if (this.position.type != positionType) {
            this.ns.sprintf("Error: Trying to sell in %1$s position, but currently in %2$s position", positionType, this.position.type);
            return [false, 0];
        }
        if (positionType == CONSTANTS.STOCKS.LONG_POSITION) {
            this.TIX.sell(this.symbol, shares);
            return [true, sellPrice];
        }
        else if (positionType == CONSTANTS.STOCKS.SHORT_POSITION) {
            this.TIX.sellShort(this.symbol, shares);
            return [true, sellPrice];
        }
        else {
            this.ns.sprintf("Error: Invalid position. How did that happen?!");
            return [false, 0];
        }
    }
    isValidOrdidType(orderType) {
        if (CONSTANTS.ORDER_TYPES.includes(orderType)) {
            return true;
        }
        else {
            this.ns.tprintf("Error: Order type not found. Expected limit | stop, got %s", orderType);
            return false;
        }
    }
    isValidShares(shares) {
        if (shares > 0) {
            return true;
        }
        else {
            this.ns.tprintf("Error: Shares must be a postive number got %s", shares);
            return false;
        }
    }
}
