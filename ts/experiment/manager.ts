import { CONSTANTS } from "js/common/constants/constants";
import { NS, ProcessInfo } from "types/NetscriptDefinitions";

export async function main(ns: NS) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)

    // Function must be async
    async function manager() {
        ns.tail();
        const WORKER_SCRIPT = '/js/experiment/worker.js';
        const HOST_SERVER = ns.getHostname();
        const LIST_INFO = `
        Name:    %1$s`

        if (ns.args[0] == 'start') {
            if (typeof(ns.args[1]) == 'string') {
                let name = ns.args[1];
                ns.run(WORKER_SCRIPT, 1, name);
            }
        }
        else if (ns.args[0] == 'stop') {
            if (typeof(ns.args[1]) == 'string') {
                let name = ns.args[1];
                ns.kill(WORKER_SCRIPT, HOST_SERVER, name);
            }
        }
        else if (ns.args[0] == 'list') {
            let processInfo = ns.ps();  
            let name: string;
            let info: string = "";

            for (let process of processInfo) {
                if (process.filename == WORKER_SCRIPT) {
                    name = process.args[0];
                    info += ns.sprintf(LIST_INFO, name);
                }
            }
            ns.tprint(info);
        }
    }

    // Run the function or it's useless
    await manager();
}