import { CONSTANTS } from "js/common/constants/constants";
import { NS } from "types/NetscriptDefinitions";

export class Position {
    ns: NS;

    private _type!:     string;
    private _shares!:   number;
    private _price!:    number;
    value:     number;

    constructor(netscript: NS, positionType: string, positionShares: number, positionPrice: number) {
        this.ns     = netscript;
        this.type   = positionType;
        this.shares = positionShares;
        this.price  = positionPrice;
        this.value   = this.shares * this.price;
    }

    get type() {
        return this._type;
    }
    set type(value: string) {
        if (CONSTANTS.POSITIONS.includes(value)){
            this._type = value;
        }
        else {
            this.ns.tprintf("Error: Expected %s, but got %s", CONSTANTS.POSITIONS, value);
        }
    }

    get shares() {
        return this._shares;
    }
    set shares(value: number) {
        if (value >= 0){
            this._shares = value;
        }
        else {
            this.ns.tprintf("Error: Expected shares to be >= 0. Got %s.", value);
        }
    }

    get price() {
        return this._price;
    }
    set price(value: number) {
        if (value  >= 0){
            this._price = value;
        }
        else {
            this.ns.tprintf("Error: Price must be >= 0. Got %s.", value);
        }
    }

    static getPositionFromData(ns: NS, positionData: number[]): [boolean, Position] {
        if (positionData.length == 4) {
            let [positionType, positionShares, positionPrice] = this.getPosition(positionData);
            let position = new Position(ns, positionType, positionShares, positionPrice);

            if (positionType != CONSTANTS.STOCKS.NO_POSITION && positionPrice) {
                return [true, position]
            }
            else {
                return [false, position];
            }
        }
        else {
            // If we don't get a valid input, return false and no position, but report an error.
            ns.tprintf("Error: Expected %s, but got %s", "[#, #, #, #]", positionData);
            return [false, new Position(ns, CONSTANTS.STOCKS.NO_POSITION, 0, 0)];
        }
    }

    private static getPosition(positionData: number[]): [string, number, number] {
        if (positionData[0] > 0) {
            return [CONSTANTS.STOCKS.LONG_POSITION, positionData[0], positionData[1]];
        }
        else if (positionData[2] > 0) {
            return [CONSTANTS.STOCKS.SHORT_POSITION, positionData[2], positionData[3]];
        }
        else {
            return [CONSTANTS.STOCKS.NO_POSITION, 0, 0];
        }
    }
}