import { NS } from "types/NetscriptDefinitions";

export class Stock {
    readonly ns: NS;
    readonly TIX; // Can't figure out how to type this as this.TIX. Might be missing from my defs.

    readonly price: number;
    readonly askPrice: number;
    readonly bidPrice: number;
    
    readonly forecast: number;
    readonly volatility: number;

    readonly maxShares: number;
    readonly marketCap: number;

    constructor(netscape: NS, stockSymbol: string) {
        this.ns = netscape;
        this.TIX = this.ns.stock;

        this.price       = this.TIX.getPrice(         stockSymbol);
        this.askPrice    = this.TIX.getAskPrice(      stockSymbol);
        this.bidPrice    = this.TIX.getBidPrice(      stockSymbol);

        this.forecast    = this.TIX.getForecast(      stockSymbol);
        this.volatility  = this.TIX.getVolatility(    stockSymbol);

        this.maxShares   = this.TIX.getMaxShares(     stockSymbol);

        this.marketCap   = this.price * this.maxShares;
    }
}