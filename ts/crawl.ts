import { NS } from "types/NetscriptDefinitions";

export async function main(ns: NS) {
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
        const CRAWL_LOG = "/logs/crawl.txt";

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
        let crawledServers: Array<string> = new Array<string>();
        let hostsToScan: Array<string> = new Array<string>();
        let currentDepth: number;

        async function initialize(): Promise<void> {
            ns.print("Initializing...");

            currentDepth = 0;
            hostsToScan.push(HOST_SERVER);
            crawledServers.push(HOST_SERVER);

            await ns.write(CRAWL_LOG, HOST_SERVER + "\n", "w");

            ns.print("Initialization complete...");
        }

        async function crawlToDepth(depth: number): Promise<void> {
            ns.print("Beginning crawl...");
            while (currentDepth < depth) {
                ns.print("Crawling at a depth of " + currentDepth + " / " + CRAWL_DEPTH);
                ns.print("Hosts to scan: " + hostsToScan);
                let newHostsToScan: Array<string> = new Array<string>();

                while (hostsToScan.length > 0) {
                    let host = hostsToScan.shift();
                    
                    let scannedServers = ns.scan(host);

                    for (let server of scannedServers) {
                        // Only add a server to be crawled if we haven't crawled it yet.
                        if (!crawledServers.includes(server)) {
                            newHostsToScan.push(server);
                            crawledServers.push(server);
                            await ns.write(CRAWL_LOG, server + "\n", "a");
                        }

                    }
                }

                // Copy the new hosts to scan to the hosts to scan so we can scan those hosts
                hostsToScan = [...newHostsToScan];
                currentDepth++;
                ns.print("Current depth crawl complete. \n Depth reached: " + currentDepth + " / " + CRAWL_DEPTH);
            }
        }

        await initialize();
        await crawlToDepth(CRAWL_DEPTH);

    }

    // Run the function or it's useless
    await crawl();
}