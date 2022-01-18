import { NS } from "types/NetscriptDefinitions";
import { Argument } from "js/common/argument";
import { GLOBAL } from "js/common/global";
import { BUDGET } from "js/common/budget";
import { Formatter } from "js/common/formatter";

export async function main(ns: NS) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    // this.ns.print(this.ns.vsprintf("", []));
    // Function must be async

    // The budgeter lets your modify the budget from the command line
    async function budgeter() {
        if (GLOBAL.DEBUG) {
            ns.print("Debug mode is on.");
            ns.tail();
        }

        const FORMATTER = new Formatter(ns);

        enum ARGUMENT {
            COMMAND,
            BUDGET_NAME,
            AMOUNT
        }

        const ADD       = 'add';
        const WITHDRAW  = 'withdraw';
        const LIST      = 'list';

        const STOCK_BUDGET= 'stock';
        //const COMMANDS = [ADD, WITHDRAW, LIST];

        /* ARGUMENTS */
        // I like to store my arguments as constants, so I need some regular variables for validating the arguments
        // before assignment
        let argument: string | number | boolean;
        let isArgumentValid: boolean;

        // arg[0] - COMMAND //
        // The command for the budgeter.
        // add - Add money to the specified budget
        // withdraw - Withdraw money from the specified budget
        // list - List all budget data
        [isArgumentValid, argument] = Argument.validateString(ns.args[ARGUMENT.COMMAND]);
        if (!isArgumentValid) {
            ns.tprint(ns.vsprintf("Error: arg[0] is invalid. Expected a string, but got %s", 
                        [argument]));
            argumentError();
        }
        const COMMAND = argument;

        // arg[1] - BUDGET_NAME //
        // The budget we want to add to
        // stock - The stock budget for our trader
        [isArgumentValid, argument] = Argument.validateString(ns.args[ARGUMENT.BUDGET_NAME]);
        if (!isArgumentValid && (COMMAND == ADD || COMMAND == WITHDRAW)) {
            ns.tprint(ns.vsprintf("Error: arg[1] is invalid. Command %s requires a budget target, but got %s", 
                        [COMMAND, argument]));
            argumentError();
        }
        const BUDGET_NAME = argument;

        // arg[1] - AMOUNT //
        // The amount we want to add to our budget
        [isArgumentValid, argument] = Argument.validateNumber(ns.args[ARGUMENT.AMOUNT]);
        if (!isArgumentValid && (COMMAND == ADD || COMMAND == WITHDRAW)) {
            ns.tprint(ns.vsprintf("Error: arg[2] is invalid. Command %s requires an amount to add to the budget, but got %s", 
                        [COMMAND, argument]));
            argumentError();
        }
        const AMOUNT = argument;

        // Check our command and execute the appropriate function
        switch(COMMAND) {
            case ADD:
                addToBudget(BUDGET_NAME, AMOUNT);
                break;
            case WITHDRAW:
                withdrawFromBudget(BUDGET_NAME, AMOUNT);
                break;
            case LIST:
                listBudgetData();
                break;
            default:
                // If none of the commands match, it is invalid so throw an error
                ns.tprint(ns.vsprintf("Error: command not valid, got %s", 
                        [COMMAND]));
                argumentError();
        }

        // Simple function that adds to the stock budget
        function addToBudget(budgetName: string, budgetAmount: number) {
            if (budgetName == STOCK_BUDGET) {
                BUDGET.addToStockBudget(ns, budgetAmount);
            }
        }

        // Simple function that withdraws from the stock budget
        function withdrawFromBudget(budgetName: string, budgetAmount: number) {
            if (budgetName == STOCK_BUDGET) {
                BUDGET.withdrawFromStockBudget(ns, budgetAmount);
            }
        }

        // A function to list our budget data
        function listBudgetData() {
            BUDGET.updateCash(ns);

            let infoString = ns.vsprintf(`
            Budget Info:

            Cash:           %s
            Stock Budget:   %s
            `,
            [BUDGET.CASH, BUDGET.STOCKS].map(FORMATTER.formatCurrency));
            
            ns.tprint(infoString);
        }

        // For calling when we have an argument error. Prints the usage info and exits.
        function argumentError() {
            usage();
            ns.exit();
        }

        // A function for printing the usage data to the terminal
        function usage() {
            let usage = `
                arg[0] - Command
                Expected: string
                add - Add to the specified budget
                withdraw - Withdraw from the specified budget
                list - List all budget data

                arg[1]? - Budget
                Optional
                Expected: string
                stock - The stock budget

                arg[2]? - Amount
                Optional
                Expected: number
                The amount to add or withdraw from the budget. Not optional if command is add or withdraw. 
            `;

            ns.tprint(usage);
        }
    }

    // Run the function or it's useless
    await budgeter();
}