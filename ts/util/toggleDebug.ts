import { NS } from "types/NetscriptDefinitions";
import { GLOBAL } from "js/common/global";

export async function main(ns: NS) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    // this.ns.print(this.ns.vsprintf("", []));
    // Function must be async

    // A simple script for toggling the Global debug variable
    async function toggleDebug() {
        if (GLOBAL.DEBUG) {
            GLOBAL.DEBUG = false;
            ns.tprint("Debug mode disabled.");
        }
        else { 
            GLOBAL.DEBUG = true;
            ns.tprint("Debug mode enabled.");
        }
    }

    // Run the function or it's useless
    await toggleDebug();
}