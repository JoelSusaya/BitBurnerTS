import { NS } from "types/NetscriptDefinitions";
import { PROGRAMS   }   from "js/common/constants/programs";


// Once again I am dumb. You can't even copy programs to servers.
export async function main(ns: NS) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    ns.tail();
    // Function must be async
    // Get purchased servers and copy all available scripts to them
    async function copyProgramsToServers() {
        const HOST_SERVER = ns.getHostname();

        let purchasedServers: string[];
        let filesToCopy: string[] = [];

        let failedCopies: string[] = [];

        /*
        // For checking avialble programs on the system
		let hasNuke             : boolean;
		let hasAutoLink         : boolean;
        let hasDeepScanV1       : boolean;
        let hasServerProfiler   : boolean;
		let hasBruteSSH         : boolean;
        let hasFTPCrack         : boolean;
        */

        function initialize() : void{
            // Check which programs are available on this computer
            /*
			hasNuke 	        = ns.fileExists(PROGRAMS.NUKE, HOST_SERVER);
			hasAutoLink         = ns.fileExists(PROGRAMS.AUTO_LINK, HOST_SERVER);
            hasDeepScanV1       = ns.fileExists(PROGRAMS.DEEPSCAN_V1, HOST_SERVER);
            hasServerProfiler   = ns.fileExists(PROGRAMS.SERVER_PROFILER, HOST_SERVER);
			hasBruteSSH         = ns.fileExists(PROGRAMS.BRUTE_SSH, HOST_SERVER);
            hasFTPCrack         = ns.fileExists(PROGRAMS.FTP_CRACK, HOST_SERVER);
            */

            purchasedServers = ns.getPurchasedServers();
            for (let program of PROGRAMS.all()) {
                ns.tprint(program);
                ns.tprint(HOST_SERVER);
                ns.tprint(ns.fileExists(program, HOST_SERVER));
                if (ns.fileExists(program, HOST_SERVER)) {
                    filesToCopy.push(program);
                }
           }

           ns.tprint("Files ready to copy: " + filesToCopy);
        }

        async function copyFiles(): Promise<void> {
            for (let server in purchasedServers) {
                let fileCopied = await ns.scp(filesToCopy, HOST_SERVER, server);

                if (!fileCopied) {
                    failedCopies.push(server);
                }
            }

            ns.tprint("Finished copying. " + failedCopies.length + " Failures. Failed servers: " + failedCopies);
        }

        initialize();
        await copyFiles();
    }

    // Run the function or it's useless
    await copyProgramsToServers();
}