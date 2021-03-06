/** @param {NS} ns **/
export async function main(ns) {

	// Wrapping everything in a function to keep the variables from entering the global scope.
	async function simpleHack () {
		const HOST_SERVER = "home";
		// Our target server and the name of this file
		const TARGET_SERVER = ns.args[0];
		const SCRIPT_NAME = "simpleHack.js";

		// Program names
		const NUKE 		= "NUKE.exe";
		const AUTO_LINK = "AutoLink.exe";
		const BRUTE_SSH = "BruteSSH.exe";

		const MAX_OPEN_PORTS = 1;

		// For tracking our hacking level
		let hackingLevel;

		// We will want to know some system details, including how much we can weaken the target, before we hack
		let minSecruityLevel;
		let maxMoney;
		let securityDecrease;

		let openPorts = 0;
		let portsRequired;

		// For checking avialble programs on the system
		let hasNuke;
		let hasAutoLink;
		let hasBruteSSH;

		// We will want to keep track of how much money is available on the server as well as the security level.
		let moneyAvailable;
		let securityLevel;

		// Get some of the basic system details and other needed setup
		initialize_();

		// First we lower the security level before hacking further
		while (securityLevel > minSecruityLevel + securityDecrease) {
			await securityCheck_();
		}

		// Grow the money until it is at least 90% of the maximum possible
		while (moneyAvailable < maxMoney * 0.9) {
			await ns.grow(TARGET_SERVER);
			await securityCheck_();
			moneyAvailable = ns.getServerMoneyAvailable(TARGET_SERVER);
		}

		// Hack as long as there is 10% of the maximum money available.
		// Try to replenish funding when it falls below 85%, but I'm not sure
		// if max money means max money ever, or just a funding cap on the machine.
		// At the end of each loop, check the hacking level, and update our security decrease value t
		while (moneyAvailable > maxMoney * 0.1 && moneyAvailable > 0) {
			await ns.hack(TARGET_SERVER);

			if (moneyAvailable < maxMoney * 0.85) {
				await ns.grow(TARGET_SERVER);
			}

			await securityCheck_();

			let currentHackingLevel = ns.getHackingLevel();
			if (hackingLevel < currentHackingLevel) {
				hackingLeveledUp_(currentHackingLevel);
			}

			moneyAvailable = ns.getServerMoneyAvailable(TARGET_SERVER);
		}

		// If we cannot continuously grow money, then we will eventually kill the script when the
		// funding drops
		ns.tprint("ERROR: No money to hack.");
		ns.kill(SCRIPT_NAME, HOST_SERVER, ns.args[0]);

		// Initialize by getting the min security level and max money so we can manage those
		// Also check how much weaken will affect the target, so we can determine how often to run it
		function initialize_() {
			minSecruityLevel 	= ns.getServerMinSecurityLevel(	TARGET_SERVER);
			securityLevel 		= ns.getServerSecurityLevel(	TARGET_SERVER);
			securityDecrease 	= ns.weakenAnalyze(				TARGET_SERVER);
			maxMoney 			= ns.getServerMaxMoney(			TARGET_SERVER);
			moneyAvailable 		= ns.getServerMoneyAvailable(	TARGET_SERVER);

			portsRequired		= ns.getServerNumPortsRequired(	TARGET_SERVER);

			hackingLevel 		= ns.getHackingLevel();

			// Check which programs are available on this computer
			hasNuke 	= ns.fileExists(NUKE, HOST_SERVER);
			hasAutoLink = ns.fileExists(AUTO_LINK, HOST_SERVER);
			hasBruteSSH = ns.fileExists(BRUTE_SSH, HOST_SERVER);

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
					ns.kill(SCRIPT_NAME, HOST_SERVER, ns.args[0]);
				}
				else {
					nuke();
				}
			}

			ns.tail(SCRIPT_NAME, HOST_SERVER, ns.args[0]);
		}

		// Check the security level and weaken it if it gets too high.
		// We can check how much weaken will work, so we will only use weaken if the security level exceeds
		// a threshold defined as the sum of the minimum security level plus the 
		async function securityCheck_() {
			securityLevel = ns.getServerSecurityLevel(TARGET_SERVER);
			
			if (securityLevel >= minSecruityLevel + securityDecrease) {
				await ns.weaken(TARGET_SERVER);
			}
		}

		// Run when our hacking level goes up
		function hackingLeveledUp_(newLevel) {
			securityDecrease = ns.weakenAnalyze(TARGET_SERVER);
			hackingLevel = newLevel;
		}

		function nuke() {
			if (hasNuke) {
				ns.nuke(TARGET_SERVER);
			}
			else {
				ns.tprint("ERROR: missing NUKE.exe");
				ns.kill(SCRIPT_NAME, HOST_SERVER, ns.args[0]);
			}
		}
	}

	await simpleHack();
}