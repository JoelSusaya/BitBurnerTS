export async function main(ns) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    ns.tail();
    // Function must be async
    // This function isn't quite right. It's hacked to run simpleHack on all known hosts (or try to).
    async function runOnKnownHosts() {
        const KNOWN_HOSTS_FILE = "/logs/known-hosts.txt";
        const HOST_SERVER = ns.getHostname();
        /* ARGUMENTS */
        // args[0] - script to run
        ns.print(ns.args);
        // Parse the script from the argument, checking its type to give it a definite type
        let arg0 = "";
        if (typeof (ns.args[0]) == "string") {
            arg0 = ns.args[0];
        }
        else {
            ns.tprint("Error: args[0] is not a string. It should be the script to run. Got: " + ns.args[0]);
        }
        const SCRIPT_NAME = arg0;
        let arg1 = 1;
        if (ns.args.length > 1) {
            if (typeof (ns.args[1]) == "number") {
                arg1 = ns.args[1];
            }
            else {
                ns.tprint("Error: args[1] is not a number. It should be the number of threads to use.");
            }
        }
        const THREADS = arg1;
        let knownHosts = new Array();
        async function initiailize() {
            if (!ns.fileExists(KNOWN_HOSTS_FILE)) {
                ns.tprint("Error: Missing hosts file.");
            }
            let fileText = await ns.read(KNOWN_HOSTS_FILE);
            knownHosts = fileText.split("\n");
            if (knownHosts.length <= 0) {
                ns.tprint("Error: No known hosts.");
            }
        }
        async function remoteExecute() {
            for (let host of knownHosts) {
                if (host != "") {
                    while ((ns.getServerUsedRam(HOST_SERVER) + ns.getScriptRam(SCRIPT_NAME, HOST_SERVER))
                        > 0.9 * ns.getServerMaxRam(HOST_SERVER)) {
                        await ns.sleep(100);
                    }
                    ns.run(SCRIPT_NAME, THREADS, host);
                }
            }
        }
        await initiailize();
        await remoteExecute();
    }
    // Run the function or it's useless
    await runOnKnownHosts();
}
