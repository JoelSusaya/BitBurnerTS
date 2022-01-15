export async function main(ns) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    // Function must be async
    // This script will be used to kill off scripts on a server and then inject a new one
    async function killThenInject() {
        const TOTAL_ARGS = ns.args.length;
        const HOST_SERVER = ns.getHostname();
        /* ARGUMENTS */
        // args[0] - script to run
        // Parse the script from the argument, checking its type to give it a definite type
        let arg0 = "";
        if (typeof (ns.args[0]) == "string") {
            arg0 = ns.args[0];
        }
        else {
            ns.tprint("Error: args[0] is not a string. It should be the host to run on. Got: " + ns.args[0]);
        }
        const TARGET_SERVER = arg0;
        let arg1 = "";
        if (TOTAL_ARGS > 1) {
            if (typeof (ns.args[1]) == "string") {
                arg1 = ns.args[1];
            }
            else {
                ns.tprint("Error: args[1] is not a number. It should be the script to run. Got: " + ns.args[1]);
            }
        }
        const SCRIPT_NAME = arg1;
        let arg2 = 1;
        if (TOTAL_ARGS > 2) {
            if (typeof (ns.args[2]) == "number") {
                arg2 = ns.args[2];
            }
            else {
                ns.tprint("Error: args[2] is not a number. It should be the number of threads to use. Got: " + ns.args[2]);
            }
        }
        const THREADS = arg2;
        // We need to accept an unknown amount of arguments and bundle them into an array
        let args = new Array();
        if (TOTAL_ARGS > 3) {
            for (let index = 3; index < TOTAL_ARGS; index++) {
                ns.print("arg: " + ns.args[index]);
                args.push(ns.args[index]);
            }
        }
        async function initiailize() {
            ns.killall(TARGET_SERVER);
            ns.exec(SCRIPT_NAME, TARGET_SERVER, THREADS, ...args);
        }
        await initiailize();
    }
    // Run the function or it's useless
    await killThenInject();
}
