import { NS, Server } from "../types/NetscriptDefinitions";
import { Argument } from "js/common/argument";
import { PROGRAMS   }   from "js/common/constants/programs";

export async function main(ns: NS) : Promise<void> {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    // ns.tail();
    // Function must be async
    async function gainRoot() :Promise<void> {
        /* CONSTANTS */

		const HOST_SERVER = ns.getHostname();

        // Name of file
		const SCRIPT_NAME = ns.getScriptName();

        /* ARGUMENTS */
        // args[0] - Target System to gain root access to

        // Parse the target system from the argument, checking its type to give it a definite type
        let arg0 = "";

        if (typeof(ns.args[0]) == "string") {
            arg0 = ns.args[0];
        }

        const TARGET_SERVER = arg0;

        /* VARIABLES */

        let server: Server;

        // For checking avialble programs on the system
		let hasNuke : boolean;
		let hasAutoLink : boolean;
		let hasBruteSSH : boolean;
        let hasFTPCrack : boolean;

        function initialize() : void{
            server = ns.getServer(TARGET_SERVER);

            // Check which programs are available on this computer
			hasNuke 	= ns.fileExists(PROGRAMS.NUKE, HOST_SERVER);
			hasAutoLink = ns.fileExists(PROGRAMS.AUTO_LINK, HOST_SERVER);
			hasBruteSSH = ns.fileExists(PROGRAMS.BRUTE_SSH, HOST_SERVER);
            hasFTPCrack = ns.fileExists(PROGRAMS.FTP_CRACK, HOST_SERVER);

            // Open ports, even if we don't need to, just in case
            if (!server.sshPortOpen ) {
                if (hasBruteSSH) {
                    ns.brutessh(TARGET_SERVER);
                }
                else {
                    ns.print("Error: Missing BruteSSH, cannot open SSH port.");
                }
            }
            
            if (!server.ftpPortOpen) {
                if (hasFTPCrack) {
                    ns.ftpcrack(TARGET_SERVER);
                }
                else {
                    ns.print("Error: Missing FTPCrack, cannot open SSH port.");
                }
            }

            // Get server again to update data
            server = ns.getServer(TARGET_SERVER);

            if (!server.hasAdminRights) {
                if (server.numOpenPortsRequired <= server.openPortCount) {
                    if (hasNuke) {
                        ns.nuke(TARGET_SERVER);
                    }
                    else {
                        ns.print("Error: Missing NUKE.exe");
                    }
                }
                else {
                    ns.print("Error: Not enough open ports. Open ports: " + server.openPortCount 
                                + ". Ports required: " + server.numOpenPortsRequired);
                }
            }
            else {
                ns.print("Already have admin right.");
            }
        }

        initialize();
    }

    // Run the function or it's useless
    gainRoot();
}