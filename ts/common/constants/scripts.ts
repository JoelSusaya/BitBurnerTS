export class SCRIPTS {
    static readonly CONSTANTS 		= "/js/common/constants/constants.js";
    static readonly PROGRAMS        = "/js/common/constants/programs.js";
    static readonly SERVERS         = "/js/common/constants/servers.js";
    
    static readonly KILL_THEN_INJECT = "/js/common/util/killThenInject.js";

    static readonly GAIN_ROOT       = "/js/gainRoot.js";
    static readonly SIMPLE_HACK     = "/js/simpleHack.js";
    static readonly CRAWL           = "/js/crawl.js";
    static readonly RUN_KNOWN_HOSTS = "/js/runOnKnownHosts.js";

    static all(): string[] {
        let allScripts: string[] = [];

        allScripts.push(SCRIPTS.CONSTANTS);
        allScripts.push(SCRIPTS.PROGRAMS);
        allScripts.push(SCRIPTS.SERVERS);

        allScripts.push(SCRIPTS.KILL_THEN_INJECT);

        allScripts.push(SCRIPTS.GAIN_ROOT);
        allScripts.push(SCRIPTS.SIMPLE_HACK);
        allScripts.push(SCRIPTS.CRAWL);
        allScripts.push(SCRIPTS.RUN_KNOWN_HOSTS);

        return allScripts;
    }
}