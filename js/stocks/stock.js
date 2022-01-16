import { CONSTANTS } from "js/common/constants/constants";
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
        this.price = this.TIX.getPrice(this.symbol);
        this.askPrice = this.TIX.getAskPrice(this.symbol);
        this.bidPrice = this.TIX.getBidPrice(this.symbol);
        this.forecast = this.TIX.getForecast(this.symbol);
        this.volatility = this.TIX.getVolatility(this.symbol);
        this.maxShares = this.TIX.getMaxShares(this.symbol);
        this.marketCap = this.price * this.maxShares;
    }
    buy(orderType, shares, orderPrice, orderPosition) {
        if (Stock.ORDER_TYPES.includes(orderType)) {
            if (orderType == CONSTANTS.STOCKS.MARKET_ORDER) {
                this.TIX.buy(this.symbol, shares);
            }
            else {
                // Make sure that order price is defined and positive
                if (orderPrice && orderPrice > 0) {
                    // Make sure the order position is definied and valid
                    if (orderPosition && Stock.POSITIONS.includes(orderPosition)) {
                        this.TIX.placeOrder(this.symbol, shares, orderPrice, orderType, orderPosition);
                    }
                    else {
                        this.ns.tprintf("Error: Need a valid position (long | short). Got %s", orderPosition);
                    }
                }
                else {
                    this.ns.tprintf("Error: Need a positive order price. Got %s", orderType);
                }
            }
        }
        else {
            this.ns.tprintf("Error: Order type not found. Expected market | limit | stop, got %s", orderType);
        }
    }
    sell() {
    }
    short() {
    }
    shortSell() {
    }
    placeOrder() {
    }
}
Stock.ORDER_TYPES = [CONSTANTS.STOCKS.MARKET_ORDER, CONSTANTS.STOCKS.LIMIT_ORDER, CONSTANTS.STOCKS.STOP_ORDER];
Stock.POSITIONS = [CONSTANTS.STOCKS.LONG_POSITION, CONSTANTS.STOCKS.SHORT_POSITION];
