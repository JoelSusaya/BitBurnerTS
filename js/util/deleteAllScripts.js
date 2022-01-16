export async function main(ns) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    // Function must be async
    // Blatantly remove all .js scripts from a machine
    // Made under the premise that files are stored remotely, e.g. I am using a remote text editor and have a repo
    // Hopefully useful for cleaning out scripts when you remove, rename, or move them
    async function deleteAllScripts() {
        const HOST_SERVER = ns.getHostname();
        const SCRIPT_EXTENSION = ".js";
        let files = ns.ls(HOST_SERVER, SCRIPT_EXTENSION);
        for (let file of files) {
            ns.rm(file, HOST_SERVER);
        }
        ns.sprintf("Deleted %1$s files from system.", files.length);
    }
    // Run the function or it's useless
    await deleteAllScripts();
}
