/** @param {NS} ns **/
export async function main(ns) {
    // Our target server and the name of this file
	let TARGET_SERVER = "n00dles";
	let SCRIPT_NAME = "n00dles.js";

    // For tracking our hacking level
	let hackingLevel;

    // We will want to know some system details, including how much we can weaken the target, before we hack
	let minSecruityLevel;
	let maxMoney;
	let securityDecrease;

    // We will want to keep track of how much money is available on the server.
	let moneyAvailable = ns.getServerMoneyAvailable(TARGET_SERVER);

    // Get some of the basic system details and other needed setup
	initialize_();

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
	while (moneyAvailable > maxMoney * 0.1) {
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
	kill(SCRIPT_NAME);

	// Initialize by getting the min security level and max money so we can manage those
	// Also check how much weaken will affect the target, so we can determine how often to run it
	function initialize_() {
		minSecruityLevel = ns.getServerMinSecurityLevel(TARGET_SERVER);
		securityDecrease = ns.weakenAnalyze(TARGET_SERVER);
		maxMoney = ns.getServerMaxMoney(TARGET_SERVER);
		hackingLevel = ns.getHackingLevel();
		ns.tail(SCRIPT_NAME);
	}

	// Check the security level and weaken it if it gets too high.
	// We can check how much weaken will work, so we will only use weaken if the security level exceeds
	// a threshold defined as the sum of the minimum security level plus the 
	async function securityCheck_() {
		let securityLevel = ns.getServerSecurityLevel(TARGET_SERVER);
		
		if (securityLevel >= minSecruityLevel + securityDecrease) {
			await ns.weaken(TARGET_SERVER);
		}
	}

	// Run when our hacking level goes up
	function hackingLeveledUp_(newLevel) {
		securityDecrease = ns.weakenAnalyze(TARGET_SERVER);
		hackingLevel = newLevel;
	}
}