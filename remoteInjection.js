/** @param {NS} ns **/
export async function main(ns) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)

    // Function must be async
    // This function will be run a script on a remote server
    async function remoteInjection_() {

    }

    // Run the function or it's uselss
    remoteInjection_();
}