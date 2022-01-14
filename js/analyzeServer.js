export async function main(ns) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    ns.tail();
    // Function must be async
    // This function should get server details and output a report
    async function analyzeServer() {
        /* ARGUMENTS */
        // args[0] - Target System to gain root access to
        // Parse the target system from the argument, checking its type to give it a definite type
        let arg0 = "";
        if (typeof (ns.args[0]) == "string") {
            arg0 = ns.args[0];
        }
        const TARGET_SERVER = arg0;
        async function initialize() {
        }
        await initialize();
    }
    // Run the function or it's useless
    await analyzeServer();
}
