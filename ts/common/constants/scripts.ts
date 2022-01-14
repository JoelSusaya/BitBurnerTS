export class SCRIPTS {
    static readonly CONSTANTS 		= "/js/common/constants/constants.js";
    static readonly PROGRAMS        = "/js/common/constants/programs.js";
    static readonly SERVERS         = "/js/common/constants/servers.js";

    static readonly GAIN_ROOT       = "/js/gainRoot.js";
    static readonly SIMPLE_HACK     = "/js/simpleHack.js";

    static all(): string[] {
        let allScripts: string[] = [];

        allScripts.push(SCRIPTS.CONSTANTS);
        allScripts.push(SCRIPTS.PROGRAMS);
        allScripts.push(SCRIPTS.SERVERS);

        allScripts.push(SCRIPTS.GAIN_ROOT);
        allScripts.push(SCRIPTS.SIMPLE_HACK);

        return allScripts;
    }
}