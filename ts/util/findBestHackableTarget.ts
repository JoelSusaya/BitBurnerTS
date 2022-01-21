import { NS } from "types/NetscriptDefinitions";
import { Argument } from "js/common/argument";
import { GLOBAL } from "js/common/global";
import { CONSTANTS } from "js/common/constants/constants";
import { Formatter } from "js/common/formatter";

export async function main(ns: NS) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    // this.ns.print(this.ns.vsprintf("", []));
    // Function must be async

    // Use our crawl data to find the best hackable target
    async function findBestHackableTarget() {
        if (GLOBAL.DEBUG) {
            ns.print("Debug mode is on.");
            ns.tail();
        }

        const FORMATTER = new Formatter(ns);

        const HOST_INFO = CONSTANTS.DIRECTORIES.CRAWL_LOGS + CONSTANTS.TEXT_FILES.HOST_INFO;

        // Make sure we have a host-info.txt, otherwise exit
        if (!ns.fileExists(HOST_INFO)) {
            ns.tprint(ns.vsprintf("Error: Missing no host-info.txt at %s", [HOST_INFO]));
            ns.exit();
        }

        const DATA = ns.read(HOST_INFO);

        let bestHost: string = "";
        let highestMoney: number = 0;

        let playerHackingSkill = ns.getHackingLevel();

        // Parse the data and iterate over it to find the best target
        // Host Info Report
        // Hostname, Has Admin Rights, Required Hacking Skill, Open Port Count,
        // Number of Open Ports Required, Max RAM, CPU Cores, Max Money, Organization 
        for (let row of DATA.split(CONSTANTS.NEWLINE)) {
            let hostData = row.split(CONSTANTS.SPACE);

            let hostName = hostData[0];
            let hasAdminRights = hostData[1];
            let requiredHackingSkill = hostData[2];
            let maxMoney = hostData[7];

            let debugReport = ns.sprintf("Host: %1$s, Admin: %2$s, Hack Skill: %3$s, Max Money: %4$s",
            hostName, hasAdminRights, requiredHackingSkill, FORMATTER.formatCurrency(maxMoney));
            ns.print(debugReport);

            // If we don't have admin rights or our hacking skill is too low, then go to the next host
            if (!hasAdminRights || requiredHackingSkill > playerHackingSkill) {
                continue;
            }

            // Check if the max money is higher than the current highestMoney
            if (highestMoney < maxMoney) {
                highestMoney = maxMoney;
                bestHost = hostName;
            }
        }

        ns.tprintf("Best Host to Hack: %s, Max Money: %s", bestHost, highestMoney);
    }

    // Run the function or it's useless
    await findBestHackableTarget();
}