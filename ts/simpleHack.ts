import { NS         }   from "../types/NetscriptDefinitions";
import { CONSTANTS } from "js/common/constants";
import { SERVERS } from "js/common/servers";   
import { PROGRAMS } from "js/common/programs";

export async function main(ns: NS) : Promise<void> {

	// Wrapping everything in a function to keep the variables from entering the global scope.
	async function simpleHack() : Promise<void> {
        /* CONSTANTS */

        // For now, this only runs on the home server
		const HOST_SERVER = SERVERS.HOME_SERVER;

        // Name of file
		const SCRIPT_NAME = CONSTANTS.SCRIPT_DIRECTORY + "simpleHack.js";

        let arg0 = "";
		// Our target server
        if (typeof(ns.args[0]) == "string") {
            arg0 = ns.args[0];
        }
        else {
            ns.tprint("Error: Argument 0 is not a string!");
            ns.kill(SCRIPT_NAME, HOST_SERVER, ns.args[0].toString());
        }
		const TARGET_SERVER = arg0;

        const THREADS = 1;

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
		function initialize() : void {
            // Open a window on screen so we can see our progress
			ns.tail();

			minSecruityLevel 	= ns.getServerMinSecurityLevel(	TARGET_SERVER   );
			securityLevel 		= ns.getServerSecurityLevel(	TARGET_SERVER   );
			securityDecrement 	= ns.weakenAnalyze(				THREADS         );
			maxMoney 			= ns.getServerMaxMoney(			TARGET_SERVER   );
			moneyAvailable 		= ns.getServerMoneyAvailable(	TARGET_SERVER   );

			portsRequired		= ns.getServerNumPortsRequired(	TARGET_SERVER);

			hackingLevel 		= ns.getHackingLevel();

			// Check which programs are available on this computer
			hasNuke 	= ns.fileExists(PROGRAMS.NUKE, HOST_SERVER);
			hasAutoLink = ns.fileExists(PROGRAMS.AUTO_LINK, HOST_SERVER);
			hasBruteSSH = ns.fileExists(PROGRAMS.BRUTE_SSH, HOST_SERVER);

			// Check if we have root, if we don't see if we can get it
			// Kill the script if we can't open enough ports
			if (!ns.hasRootAccess(TARGET_SERVER)) {
				if (portsRequired > 0) {
					if (hasBruteSSH) {
						ns.brutessh(TARGET_SERVER);
						nuke();
					}
					else {
						ns.tprint("ERROR: Missing BruteSSH.exe");
					}
				}
				else if (portsRequired > MAX_OPEN_PORTS) {
					ns.tprint("ERROR: Cannot open enough ports")
					ns.kill(SCRIPT_NAME, HOST_SERVER, TARGET_SERVER);
				}
				else {
					nuke();
				}
			}
		}

        async function preHack() : Promise<void> {
            // First we lower the security level before hacking further
            while (securityLevel > minSecruityLevel + securityDecrement) {
                await securityCheck();
            }

            // Grow the money until it is at least 90% of the maximum possible
            while (moneyAvailable < maxMoney * 0.9) {
                await ns.grow(TARGET_SERVER);
                await securityCheck();
                moneyAvailable = ns.getServerMoneyAvailable(TARGET_SERVER);
            }
        }

        async function continuousHack() : Promise<void> {
            // Hack as long as there is 10% of the maximum money available.
            // Try to replenish funding when it falls below 85%, but I'm not sure
            // if max money means max money ever, or just a funding cap on the machine.
            // At the end of each loop, check the hacking level, and update our security decrease value t
            while (moneyAvailable > maxMoney * 0.1 && moneyAvailable > 0) {
                await ns.hack(TARGET_SERVER);

                if (moneyAvailable < maxMoney * 0.85) {
                    await ns.grow(TARGET_SERVER);
                }

                await securityCheck();

                let currentHackingLevel = ns.getHackingLevel();
                if (hackingLevel < currentHackingLevel) {
                    hackingLeveledUp(currentHackingLevel);
                }

                moneyAvailable = ns.getServerMoneyAvailable(TARGET_SERVER);
            }

            // If we cannot continuously grow money, then we will eventually kill the script when the
            // funding drops
            ns.tprint("ERROR: No money to hack.");
            ns.kill(SCRIPT_NAME, HOST_SERVER, TARGET_SERVER);
        }

		// Check the security level and weaken it if it gets too high.
		// We can check how much weaken will work, so we will only use weaken if the security level exceeds
		// a threshold defined as the sum of the minimum security level plus the 
		async function securityCheck() : Promise<void> {
			securityLevel = ns.getServerSecurityLevel(TARGET_SERVER);
			
			if (securityLevel >= minSecruityLevel + securityDecrement) {
				await ns.weaken(TARGET_SERVER);
			}
		}

		// Run when our hacking level goes up
		function hackingLeveledUp(newLevel: number) : void {
			securityDecrement = ns.weakenAnalyze(THREADS);
			hackingLevel = newLevel;
		}

		function nuke() : void {
			if (hasNuke) {
				ns.nuke(TARGET_SERVER);
			}
			else {
				ns.tprint("ERROR: missing NUKE.exe");
				ns.kill(SCRIPT_NAME, HOST_SERVER, TARGET_SERVER);
			}
		}

        /* EXECUTION */

        // Get some of the basic system details and other needed setup
		initialize();

        await preHack();

        await continuousHack();
	}

	await simpleHack();
}