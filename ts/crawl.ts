import { NS } from "types/NetscriptDefinitions";
import { CONSTANTS } from "js/common/constants/constants";

/* TODO

1) Read the known hosts file ahead of time and don't overwrite it. In case new hosts are added/discovered.

*/

export async function main(ns: NS) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    //ns.tail();

    // This script should crawl hosts up to a specified depth
    // Function must be async
    async function crawl() {
        const HOST_SERVER = ns.getHostname();

        // Name of file
		const SCRIPT_NAME = ns.getScriptName();

        // Log crawled hosts
        const KNOWN_HOSTS           = CONSTANTS.DIRECTORIES.CRAWL_LOGS + CONSTANTS.TEXT_FILES.KNOWN_HOSTS;
        const CRAWL_REPORT          = CONSTANTS.DIRECTORIES.CRAWL_LOGS + CONSTANTS.TEXT_FILES.CRAWL_REPORT;
        const HOST_INFO_REPORT      = CONSTANTS.DIRECTORIES.CRAWL_LOGS + CONSTANTS.TEXT_FILES.HOST_INFO;
        const ROOTED_HOSTS          = CONSTANTS.DIRECTORIES.CRAWL_LOGS + CONSTANTS.TEXT_FILES.ROOTED_HOSTS;
        const CRAWLED_CONTRACTS     = CONSTANTS.DIRECTORIES.CRAWL_LOGS + CONSTANTS.TEXT_FILES.CRAWLED_CONTRACTS;

        /* ARGUMENTS */
        // args[0] - crawl depth

        // Parse the target system from the argument, checking its type to give it a definite type
        let arg0 = 0;

        if (typeof(ns.args[0]) == "number") {
            arg0 = ns.args[0];

            if (arg0 <= 0) {
                ns.tprint("Error: args[0] - Crawl Depth must be greater than or equal 1.");
            }
        }

        const CRAWL_DEPTH = arg0;

        /* VARIABLES */
        // Keep track of the hosts that we crawl
        let crawledHosts: Array<string> = new Array<string>();
        let hostsToScan: Array<string> = new Array<string>();
        let currentDepth: number;

        async function initialize(): Promise<void> {
            ns.print("Initializing...");

            currentDepth = 0;
            hostsToScan.push(HOST_SERVER);
            crawledHosts.push(HOST_SERVER);

            // Write the depth and host to start the report off
            // Log the HOST_SERVER to the known hosts file
            // Clear the reports
            await ns.write(CRAWL_REPORT, "Depth 0: \n", "w");
            await ns.write(CRAWL_REPORT, HOST_SERVER + "\n", "a");
            await ns.write(KNOWN_HOSTS, HOST_SERVER + "\n", "w");
            await ns.write(HOST_INFO_REPORT, "", "w");
            await ns.write(ROOTED_HOSTS, HOST_SERVER, "w");
            await ns.write(CRAWLED_CONTRACTS, "", "w");

            ns.print("Initialization complete...");
        }

        async function crawlToDepth(depth: number): Promise<void> {
            ns.print("Beginning crawl...");
            while (currentDepth < depth) {
                ns.print("Crawling at a depth of " + (currentDepth + 1) + " / " + CRAWL_DEPTH);
                ns.print("Hosts to scan: " + hostsToScan);

                // Write the depth we are crawling at in the log. We need to add 1.
                await ns.write(CRAWL_REPORT, "\nDepth " + (currentDepth + 1) + ": \n", "a");

                let newHostsToScan: Array<string> = new Array<string>();

                // Shift off the first host in our list of hosts to scan and scan it to see which nodes it is connected to
                while (hostsToScan.length > 0) {
                    let host = hostsToScan.shift();
                    
                    let scannedHosts = ns.scan(host);

                    // For each scanned server, make sure that we haven't crawled it before.
                    // If we haven't crawled it, then push it into an array of new hosts to scan after we exhaust all
                    // hosts at our current crawl depth
                    // Finally, write to the crawl reports/logs
                    for (let host of scannedHosts) {
                        // Only add a server to be crawled if we haven't crawled it yet.
                        if (!crawledHosts.includes(host)) {
                            // Get a server object for the host we are crawling
                            let server = ns.getServer(host);

                            // If the server is one of ours, skip crawling it, there are better ways to access them
                            if (!server.purchasedByPlayer) {
                                // Host Info Report
                                // Hostname, Has Admin Rights, Required Hacking Skill, Open Port Count,
                                // Number of Open Ports Required, Max RAM, CPU Cores, Max Money, Organization 

                                let hostInfoData = [host, server.hasAdminRights, server.requiredHackingSkill, 
                                    server.openPortCount, server.numOpenPortsRequired, server.maxRam, 
                                    server.cpuCores, server.moneyMax, server.organizationName]

                                // Format a string for this line of the report
                                let hostInfo = ns.vsprintf("%s ".repeat(hostInfoData.length)+ "\n", 
                                [host, server.hasAdminRights, server.requiredHackingSkill, server.openPortCount, 
                                    server.numOpenPortsRequired, server.maxRam, server.cpuCores, server.moneyMax,
                                    server.organizationName]);

                                // Get the files on the servers
                                let files = ns.ls(host);

                                // Filter out coding contracts. I could just use ".cct" as the second argument in
                                // ns.ls(host, grep), but I will do it this way in case I want to do something with 
                                // the other files
                                let contractsInfo = "";
                                for (let codingContract of files.filter(file => file.match(".cct"))) {
                                    let contractInfo = ns.vsprintf("%s %s\n", [codingContract, host]);
                                    contractsInfo += contractInfo;
                                }
                                    
                                // Track the new hosts to scan and track that we crawled this host
                                newHostsToScan.push(host);
                                crawledHosts.push(host);
                                let hostReportString = host + "\n";

                                await ns.write(KNOWN_HOSTS, hostReportString, "a");
                                await ns.write(CRAWL_REPORT, hostReportString, "a");
                                await ns.write(HOST_INFO_REPORT, hostInfo, "a");

                                await ns.write(CRAWLED_CONTRACTS, contractsInfo, "a");
                        
                                // If we have root acess, write that to the rooted-hosts.txt file
                                if (server.hasAdminRights) {
                                    await ns.write(ROOTED_HOSTS, hostReportString, "a");
                                }
                            }
                        }

                    }
                }

                // Copy the new hosts to scan to the hosts to scan so we can scan those hosts durring the next pass
                // Increase the depth and report our progress to the popup window
                hostsToScan = [...newHostsToScan];
                currentDepth++;
                ns.print("Current depth crawl complete.");
                ns.print("Hosts scanned: " + crawledHosts.length);
            }
        }

        await initialize();
        await crawlToDepth(CRAWL_DEPTH);
    }

    // Run the function or it's useless
    await crawl();
}