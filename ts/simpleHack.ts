import { BasicHGWOptions, NS         }   from "../types/NetscriptDefinitions";
import { CONSTANTS  }   from "js/common/constants/constants";
import { Argument } from "js/common/argument";

export async function main(ns: NS) : Promise<void> {
    // Open a window on screen so we can see our progress
    //ns.tail();
	// Wrapping everything in a function to keep the variables from entering the global scope. 
	async function simpleHack() : Promise<void> {
        /* CONSTANTS */
        const MAX_MONEY_PERCENTAGE_THRESHOLD = 0.9;
        const SECURITY_MULTIPLIER = 20;

		const HOST_SERVER = ns.getHostname();

        // Name of file
		const SCRIPT_NAME = CONSTANTS.SCRIPT_DIRECTORY + "simpleHack.js";

        let argument: string | number | boolean;
        let isArgumentValid: boolean;

        // arg[0] - Target Server
        [isArgumentValid, argument] = Argument.validateString(ns.args[0]);
        if (!isArgumentValid) {
            ns.tprintf("Error: arg[1] is invalid. Expected a string, but got %s", argument);
            ns.exit();
        }
        const TARGET_SERVER = argument;

        // arg[1] - Threads
        // Default to 1 if no argument is passed in
        if (ns.args.length > 1) {
            [isArgumentValid, argument] = Argument.validateNumber(ns.args[1]);
            if (!isArgumentValid || argument < 0) {
                ns.tprintf("Error: arg[1] is invalid. Expected a number above 0, but got %s", typeof(argument));
                ns.exit();
            }
        }
        else {
            argument = 1;
        }

        const THREADS = argument;

        let opts: BasicHGWOptions = {
            threads: THREADS
        }

		const MAX_OPEN_PORTS = 1;

        /* VARIABLES */

		// For tracking our hacking level
		let hackingLevel : number;

		// We will want to know some system details, including how much we can weaken the target, before we hack
		let minSecruityLevel : number;
		let maxMoney : number;
		let securityDecrement : number;

		let openPorts = 0;
		let portsRequired : number;

		// For checking avialble programs on the system
		let hasNuke : boolean;
		let hasAutoLink : boolean;
		let hasBruteSSH : boolean;

		// We will want to keep track of how much money is available on the server as well as the security level.
		let moneyAvailable : number;
		let securityLevel : number;

        /* Functions */

		// Initialize by getting the min security level and max money so we can manage those
		// Also check how much weaken will affect the target, so we can determine how often to run it
		async function initialize() : Promise<void> {
			minSecruityLevel 	= ns.getServerMinSecurityLevel(	TARGET_SERVER   );
			securityLevel 		= ns.getServerSecurityLevel(	TARGET_SERVER   );
			securityDecrement 	= ns.weakenAnalyze(				THREADS         );
			maxMoney 			= ns.getServerMaxMoney(			TARGET_SERVER   );
			moneyAvailable 		= ns.getServerMoneyAvailable(	TARGET_SERVER   );

			portsRequired		= ns.getServerNumPortsRequired(	TARGET_SERVER);

			hackingLevel 		= ns.getHackingLevel();

			// Check if we have root, if we don't see if we can get it
			// Kill the script if we can't open enough ports
			if (!ns.hasRootAccess(TARGET_SERVER)) {
				ns.print("Error: Do not have root access. Trying to gain root.");
                ns.run("js/gainRoot.js", 1, TARGET_SERVER);
                
                // Wait for script to start up
                await ns.sleep(2000);
                
                while(ns.isRunning("js/gainRoot.js", HOST_SERVER, TARGET_SERVER)) {
                    await ns.sleep(100);
                }

                if (!ns.hasRootAccess(TARGET_SERVER)) {
                    ns.print("Error: Failed to gain root. Ending hack.");
                    ns.exit();
                }
			}
		}

        async function preHack() : Promise<void> {
            // First we lower the security level before hacking further
            while (securityLevel > minSecruityLevel) {
                ns.print("Security Level: " + securityLevel + " / " + minSecruityLevel + " + " + securityDecrement);
                await securityCheck();
            }

            // Grow the money until it is at least X% of the maximum possible
            while (moneyAvailable < (maxMoney * MAX_MONEY_PERCENTAGE_THRESHOLD)) {
                ns.print("Available Money: " + moneyAvailable + " / " + maxMoney);
                await ns.grow(TARGET_SERVER, opts);
                await securityCheck();
                moneyAvailable = ns.getServerMoneyAvailable(TARGET_SERVER);
            }
        }

        async function continuousHack() : Promise<void> {
            // Hack as long as there is 10% of the maximum money available.
            // Try to replenish funding when it falls below X%, but I'm not sure
            // if max money means max money ever, or just a funding cap on the machine.
            // At the end of each loop, check the hacking level, and update our security decrease value t
            while (moneyAvailable > 0) {
                await ns.hack(TARGET_SERVER, opts);

                if (moneyAvailable < (maxMoney * MAX_MONEY_PERCENTAGE_THRESHOLD)) {
                    await ns.grow(TARGET_SERVER, opts);
                }

                await securityCheck();

                let currentHackingLevel = ns.getHackingLevel();
                if (hackingLevel < currentHackingLevel) {
                    hackingLeveledUp(currentHackingLevel);
                }

                moneyAvailable = ns.getServerMoneyAvailable(TARGET_SERVER);

                if (moneyAvailable < maxMoney * MAX_MONEY_PERCENTAGE_THRESHOLD) {
                    await preHack();
                }
            }

            // If we cannot continuously grow money, then we will eventually kill the script when the
            // funding drops
            ns.print("ERROR: No money to hack.");
            ns.exit();
        }

		// Check the security level and weaken it if it gets too high.
		// We can check how much weaken will work, so we will only use weaken if the security level exceeds
		// a threshold defined as the sum of the minimum security level plus the 
		async function securityCheck() : Promise<void> {
			securityLevel = ns.getServerSecurityLevel(TARGET_SERVER);
			
			if (securityLevel >= minSecruityLevel) {
				await ns.weaken(TARGET_SERVER, opts);
			}
		}

		// Run when our hacking level goes up
		function hackingLeveledUp(newLevel: number) : void {
			securityDecrement = ns.weakenAnalyze(THREADS, ns.getServer().cpuCores);
			hackingLevel = newLevel;
		}

        /* EXECUTION */

        // Get some of the basic system details and other needed setup
		await initialize();

        if (ns.hasRootAccess(TARGET_SERVER)) {
            await preHack();

            await continuousHack();
        }
	}

	await simpleHack();
}