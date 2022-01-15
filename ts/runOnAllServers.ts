import { NS } from "types/NetscriptDefinitions";
import { SCRIPTS } from "js/common/constants/scripts";

export async function main(ns: NS) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    ns.tail();
    // Function must be async
    async function runOnAllServers() {
        const TOTAL_ARGS = ns.args.length;
        const HOST_SERVER = ns.getHostname();

        /* ARGUMENTS */
        // args[0] - script to run

        // Parse the script from the argument, checking its type to give it a definite type
        let arg0 = "";

        if (typeof(ns.args[0]) == "string") {
            arg0 = ns.args[0];
        }
        else {
            ns.tprint("Error: args[0] is not a string. It should be the script to run.");
        }

        const SCRIPT_NAME = arg0;

        let arg1 = 1;
        if (TOTAL_ARGS > 1) {  
            if (typeof(ns.args[1]) == "number") {
                arg1 = ns.args[1];
            }
            else {
                ns.tprint("Error: args[1] is not a number. It should be the number of threads to use.");
            }
        }
        const THREADS = arg1;

        let arg2 = false;
        if (TOTAL_ARGS > 2) {  
            if (typeof(ns.args[2]) == "boolean") {
                arg2 = ns.args[2];
            }
            else {
                ns.tprint("Error: args[2] is not boolean. It should be the whether or not to kill "
                            + "all scripts before running new ones.");
            }
        }
        const SHOULD_KILL = arg2;

        // We need to accept an unknown amount of arguments and bundle them into an array
        let args: Array<string | number | boolean> = new Array<string | number | boolean>();

        if (TOTAL_ARGS > 3) {
            for (let index = 3; index < TOTAL_ARGS; index++) {
                ns.print("arg: " + ns.args[index]);
                args.push(ns.args[index]);
            }
        }

        let purchasedServers: string[];

        async function initiailize(): Promise<void> {
            purchasedServers = ns.getPurchasedServers();
            purchasedServers.push(HOST_SERVER);
        }

        // Execute the script on each server, passing in args if we have them
        async function remoteExecute(): Promise<void> {
            for (let server of purchasedServers) {
                if (SHOULD_KILL) {
                    if (server == HOST_SERVER) {
                        if (purchasedServers.length > 1) {
                            // LMAO
                            ns.exec(SCRIPTS.KILL_THEN_INJECT, purchasedServers[1], THREADS, 
                                HOST_SERVER, SCRIPT_NAME, THREADS, ...args);
                        }
                        else {
                            ns.print("Error: Can't Kill All and execute with only one server! Kill all first, then run with arg[2] = false.")
                        }
                    }
                    ns.killall(server);
                }
                if (TOTAL_ARGS > 3) {
                    ns.exec(SCRIPT_NAME, server, THREADS, ...args);
                }
                else {
                    ns.exec(SCRIPT_NAME, server, THREADS);
                }
            }
        }

        await initiailize();
        await remoteExecute();
    }

    // Run the function or it's useless
    await runOnAllServers();
}