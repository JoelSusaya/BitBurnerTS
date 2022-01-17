export class SCRIPTS {
    static all() {
        let allScripts = [];
        allScripts.push(SCRIPTS.CONSTANTS);
        allScripts.push(SCRIPTS.PROGRAMS);
        allScripts.push(SCRIPTS.SERVERS);
        allScripts.push(SCRIPTS.KILL_THEN_INJECT);
        allScripts.push(SCRIPTS.GAIN_ROOT);
        allScripts.push(SCRIPTS.SIMPLE_HACK);
        allScripts.push(SCRIPTS.CRAWL);
        allScripts.push(SCRIPTS.RUN_KNOWN_HOSTS);
        allScripts.push(SCRIPTS.START_BOT);
        allScripts.push(SCRIPTS.STOP_BOT);
        return allScripts;
    }
}
SCRIPTS.CONSTANTS = "/js/common/constants/constants.js";
SCRIPTS.PROGRAMS = "/js/common/constants/programs.js";
SCRIPTS.SERVERS = "/js/common/constants/servers.js";
SCRIPTS.KILL_THEN_INJECT = "/js/common/util/killThenInject.js";
SCRIPTS.GAIN_ROOT = "/js/gainRoot.js";
SCRIPTS.SIMPLE_HACK = "/js/simpleHack.js";
SCRIPTS.CRAWL = "/js/crawl.js";
SCRIPTS.RUN_KNOWN_HOSTS = "/js/runOnKnownHosts.js";
SCRIPTS.START_BOT = "/js/stocks/startBot.js";
SCRIPTS.STOP_BOT = "/js/stocks/stopBot.js";
