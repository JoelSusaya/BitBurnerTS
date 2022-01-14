import { NS } from "types/NetscriptDefinitions";

export async function main(ns: NS) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    //ns.tail();
    // Function must be async
    async function purchaseServers() {
        let purchasedServerMaxRam = ns.getPurchasedServerMaxRam();
        let purchasedServerLimit = ns.getPurchasedServerLimit();

        let purchasedServers = ns.getPurchasedServers();

        ns.tprint("Max RAM can purchase: " + purchasedServerMaxRam);
        ns.tprint("Total Servers: " + purchasedServers.length + " / " + purchasedServerLimit);
        ns.tprint("Price of Max RAM server: " + ns.getPurchasedServerCost(purchasedServerMaxRam));
        ns.tprint("Purchased Servers: " + purchasedServers);

        if(ns.args.length == 0) {
            ns.tprint("Script usage: run purchaseServers.js isBuying RAM_Exponent? Hostname?");
            ns.tprint("RAM is purchased using 2 to the RAM_Exponent power.");
        }

        // Check if we are buying or just looking for information
        // If we are buying, then we check the arguments to make sure they are correct. We then set up a confirmation
        // prompt to avoid wasting money if we put in something wrong.
        if (typeof(ns.args[0]) == "boolean") {
            let isBuying = ns.args[0];
            if (isBuying) {
                if (ns.args.length > 2) {
                    if (typeof(ns.args[1]) == "number") {
                        if (typeof(ns.args[2]) == "string") {
                            let requestedRAM = Math.pow(2, ns.args[1]);
                            let hostname = ns.args[2];

                            let hasConfirmed = await ns.prompt("Purchasing a " + requestedRAM + " GB server for " 
                                                + ns.getPurchasedServerCost(requestedRAM) + " with hostname, "
                                                + hostname + ". Is this correct?");

                            if (hasConfirmed) {
                                ns.purchaseServer(hostname, requestedRAM);
                                ns.tprint("Server purchased. Hostname: " + hostname);
                            }
                            else {
                                ns.tprint("Purchase canceled.");
                            };
                        }
                        else {
                            ns.tprint("Error: args[2] not a string. Got " + ns.args[2].toString());
                        }
                    }
                    else {
                        ns.tprint("Error: args[1] not a number. Got " + ns.args[1].toString());
                    }
                }
            }
            // If we are not buying, then use the second argument to check the cost of the server for that amount
            // of RAM
            else {
                if (ns.args.length > 1) {
                    if (typeof(ns.args[1]) == "number") {
                        let requestedRAM = Math.pow(2, ns.args[1]);
                        ns.tprint("Price of requested " + requestedRAM + " GB RAM server: " 
                                + ns.getPurchasedServerCost(requestedRAM));
                    }
                }
            }
        }


    }

    // Run the function or it's useless
    await purchaseServers();
}