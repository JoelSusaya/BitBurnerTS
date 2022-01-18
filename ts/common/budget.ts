import { NS } from "types/NetscriptDefinitions";
import { Formatter } from "js/common/formatter";

export class BUDGET {
    private static _CASH: number;
    static _STOCKS: number;
    private static _HACKNET: number;

    static get CASH() {
        return BUDGET._CASH;
    }
    
    static updateCash(ns: NS): void {
        let player = ns.getPlayer();
        BUDGET._CASH = player.money;
    }

    static get STOCKS(): number {
        return BUDGET._STOCKS;
    }

    // A method to add to our stock budget so we don't need to start a new trading bot every time we want to add funds
    static addToStockBudget(ns: NS, amount: number): boolean {
        BUDGET.updateCash(ns);

        let formatter = new Formatter(ns);
        
        // Check if we have enough cash to add the amount to our budget
        // If we do, add it to our stock budget
        // If we don't print an error.
        if (amount < BUDGET._CASH) {
            ns.print(ns.vsprintf("Trying to add %s to budget of %s", 
            [amount, BUDGET._STOCKS].map(formatter.formatCurrency)));
            BUDGET._STOCKS += amount;
            ns.print(ns.vsprintf("New budget: %s", 
            [amount, BUDGET._STOCKS].map(formatter.formatCurrency)));
            return true;
        } 
        else {
            ns.print(ns.vsprintf("Error: Tried to add %s to budget, but only have %s.", 
            [amount, BUDGET._CASH].map(formatter.formatCurrency)));
            return false;
        }
    }

    // A method to remove money from our stock budget
    // It will remove as much as possible.
    static withdrawFromStockBudget(ns: NS, amount: number): boolean {
        let formatter = new Formatter(ns);

        if (amount < BUDGET._STOCKS) {
            BUDGET._STOCKS -= amount;
            return true;
        }
        else {
            BUDGET._STOCKS = 0;
            ns.print(ns.vsprintf("Error: Tried to remove %s from budget, but only had %s. Removed everything.", 
            [amount, BUDGET._CASH].map(formatter.formatCurrency)));
            return false;
        }
    }

    static clearStockBudget() {
        BUDGET._STOCKS = 0;
    }
}