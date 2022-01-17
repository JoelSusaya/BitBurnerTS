import { CONSTANTS } from "js/common/constants/constants";
/* TODO

1) Read the known hosts file ahead of time and don't overwrite it. In case new hosts are added/discovered.

*/
export async function main(ns) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    //ns.tail();
    // This script should crawl hosts up to a specified depth
    // Function must be async
    async function crawl() {
        const HOST_SERVER = ns.getHostname();
        // Name of file
        const SCRIPT_NAME = ns.getScriptName();
        // Log crawled hosts
        const CRAWL_LOG = CONSTANTS.DIRECTORIES.CRAWL_LOGS + CONSTANTS.TEXT_FILES.KNOWN_HOSTS;
        const CRAWL_REPORT = CONSTANTS.DIRECTORIES.CRAWL_LOGS + CONSTANTS.TEXT_FILES.CRAWL_REPORT;
        const HOST_INFO_REPORT = CONSTANTS.DIRECTORIES.CRAWL_LOGS + CONSTANTS.TEXT_FILES.HOST_INFO;
        /* ARGUMENTS */
        // args[0] - crawl depth
        // Parse the target system from the argument, checking its type to give it a definite type
        let arg0 = 0;
        if (typeof (ns.args[0]) == "number") {
            arg0 = ns.args[0];
            if (arg0 <= 0) {
                ns.tprint("Error: args[0] - Crawl Depth must be greater than or equal 1.");
            }
        }
        const CRAWL_DEPTH = arg0;
        /* VARIABLES */
        // Keep track of the hosts that we crawl
        let crawledHosts = new Array();
        let hostsToScan = new Array();
        let currentDepth;
        async function initialize() {
            ns.print("Initializing...");
            currentDepth = 0;
            hostsToScan.push(HOST_SERVER);
            crawledHosts.push(HOST_SERVER);
            // Write the depth and host to start the report off
            // Log the HOST_SERVER to the known hosts file
            await ns.write(CRAWL_REPORT, "Depth 0: \n", "w");
            await ns.write(CRAWL_REPORT, HOST_SERVER + "\n", "a");
            await ns.write(CRAWL_LOG, HOST_SERVER + "\n", "w");
            await ns.write(HOST_INFO_REPORT, "", "w");
            ns.print("Initialization complete...");
        }
        async function crawlToDepth(depth) {
            ns.print("Beginning crawl...");
            while (currentDepth < depth) {
                ns.print("Crawling at a depth of " + (currentDepth + 1) + " / " + CRAWL_DEPTH);
                ns.print("Hosts to scan: " + hostsToScan);
                // Write the depth we are crawling at in the log. We need to add 1.
                await ns.write(CRAWL_REPORT, "\nDepth " + (currentDepth + 1) + ": \n", "a");
                let newHostsToScan = new Array();
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
                                let hostInfo = ns.vsprintf("%s,%s,%s,%s,%s,%s\n", [host, server.hasAdminRights, server.requiredHackingSkill, server.openPortCount, server.numOpenPortsRequired, server.ramUsed, server.maxRam]);
                                newHostsToScan.push(host);
                                crawledHosts.push(host);
                                await ns.write(CRAWL_LOG, host + "\n", "a");
                                await ns.write(CRAWL_REPORT, host + "\n", "a");
                                await ns.write(HOST_INFO_REPORT, hostInfo, "a");
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
