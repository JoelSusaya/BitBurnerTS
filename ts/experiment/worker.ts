import { NS } from "types/NetscriptDefinitions";

export async function main(ns: NS) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)

    // Function must be async
    // Simple idea for stopping scripts from another script. Just give each script an event named after the
    // script path and a custom name
    // This idea doesn't play that nicely with the netscript environemtn
    async function worker() {
        ns.tail();
        let name = ns.args[0];
        const SCRIPT_NAME = ns.getScriptName();

        let eventName = ns.vsprintf("%s %s", [SCRIPT_NAME, name]);
        ns.print(eventName);

        // Add an event listener to stop the script
        //window.addEventListener(eventName, stop);

        while (true) {
            ns.print(ns.sprintf("Running %1$s", name));
            await ns.sleep(1000);
        }

        function stop() {
            ns.print("Stopping...");
            ns.exit();
        }
    }

    // Run the function or it's useless
    await worker();
}