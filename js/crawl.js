/* TODO

1) Read the known hosts file ahead of time and don't overwrite it. In case new hosts are added/discovered.

*/
export async function main(ns) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    ns.tail();
    // This script should crawl hosts up to a specified depth
    // Function must be async
    async function crawl() {
        const HOST_SERVER = ns.getHostname();
        // Name of file
        const SCRIPT_NAME = ns.getScriptName();
        // Error Log
        const ERROR_LOG = "logs/errors/crawl-error.txt";
        // Log crawled hosts
        const CRAWL_LOG = "/logs/known-hosts.txt";
        const CRAWL_REPORT = "/logs/crawl-report.txt";
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
        let crawledServers = new Array();
        let hostsToScan = new Array();
        let currentDepth;
        async function initialize() {
            ns.print("Initializing...");
            currentDepth = 0;
            hostsToScan.push(HOST_SERVER);
            crawledServers.push(HOST_SERVER);
            // Write the depth and host to start the file off
            await ns.write(CRAWL_REPORT, "Depth 0: \n", "w");
            await ns.write(CRAWL_LOG, HOST_SERVER + "\n", "w");
            await ns.write(CRAWL_REPORT, HOST_SERVER + "\n", "a");
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
                while (hostsToScan.length > 0) {
                    let host = hostsToScan.shift();
                    let scannedServers = ns.scan(host);
                    for (let server of scannedServers) {
                        // Only add a server to be crawled if we haven't crawled it yet.
                        if (!crawledServers.includes(server)) {
                            newHostsToScan.push(server);
                            crawledServers.push(server);
                            await ns.write(CRAWL_LOG, server + "\n", "a");
                            await ns.write(CRAWL_REPORT, server + "\n", "a");
                        }
                    }
                }
                // Copy the new hosts to scan to the hosts to scan so we can scan those hosts
                hostsToScan = [...newHostsToScan];
                currentDepth++;
                ns.print("Current depth crawl complete.");
                ns.print("Hosts scanned: " + crawledServers.length);
            }
        }
        await initialize();
        await crawlToDepth(CRAWL_DEPTH);
    }
    // Run the function or it's useless
    await crawl();
}
