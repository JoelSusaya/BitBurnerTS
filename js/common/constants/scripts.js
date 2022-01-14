export class SCRIPTS {
    static all() {
        let allScripts = [];
        allScripts.push(SCRIPTS.CONSTANTS);
        allScripts.push(SCRIPTS.PROGRAMS);
        allScripts.push(SCRIPTS.SERVERS);
        allScripts.push(SCRIPTS.GAIN_ROOT);
        allScripts.push(SCRIPTS.SIMPLE_HACK);
        return allScripts;
    }
}
SCRIPTS.CONSTANTS = "/js/common/constants/constants.js";
SCRIPTS.PROGRAMS = "/js/common/constants/programs.js";
SCRIPTS.SERVERS = "/js/common/constants/servers.js";
SCRIPTS.GAIN_ROOT = "/js/gainRoot.js";
SCRIPTS.SIMPLE_HACK = "/js/simpleHack.js";
