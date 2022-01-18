import { CONSTANTS } from "js/common/constants/constants";
import { NS } from "types/NetscriptDefinitions";

export class Formatter {
    private ns: NS;

    constructor(netscript: NS) {
        this.ns = netscript;
    }

    formatCurrency      = (number: number) => this.formatNumbers( number, CONSTANTS.FORMAT.CURRENCY  );
    formatPercentage    = (number: number) => this.formatNumbers( number, CONSTANTS.FORMAT.PERCENTAGE);
    formatNumber        = (number: number) => this.formatNumbers( number, CONSTANTS.FORMAT.NUMBER    );
    // This method serves as a factory for formatting different numbers in a string format
    // based on a string format. See http://numeraljs.com/
    private formatNumbers(number: number, format: string): string {
        return this.ns.nFormat(number, format);
    }
}