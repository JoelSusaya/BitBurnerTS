export class CONSTANTS {
}
CONSTANTS.SCRIPT_DIRECTORY = "js/";
CONSTANTS.HOME_SERVER = "home";
CONSTANTS.NEWLINE = "\n";
CONSTANTS.SPACE = " ";
CONSTANTS.DIRECTORIES = {
    CRAWL_LOGS: '/logs',
};
CONSTANTS.TEXT_FILES = {
    KNOWN_HOSTS: '/known-hosts.txt',
    CRAWL_REPORT: '/crawl-report.txt',
    HOST_INFO: '/host-info.txt',
    ROOTED_HOSTS: '/rooted-hosts.txt',
    CRAWLED_CONTRACTS: '/contracts.txt'
};
CONSTANTS.FILE_EXTENSIONS = {
    NS1: '.script',
    NS2: '.js',
    TEXT: '.txt',
    MESSAGE: '.msg',
    CODING_CONTRACT: '.cct'
};
CONSTANTS.STOCKS = {
    MARKET_ORDER: 'market',
    LIMIT_ORDER: 'limit',
    STOP_ORDER: 'stop',
    LONG_POSITION: 'long',
    SHORT_POSITION: 'short',
    NO_POSITION: 'none',
    COMMISSION_FEE: 1000000,
    UPDATE_TICK_DURATION: 6000,
};
// Create some strings needed to format currency using ns.nFormat()
// See http://numeraljs.com/
CONSTANTS.FORMAT = {
    CURRENCY: "($ 0,0[.]00)",
    PERCENTAGE: "0 %",
    NUMBER: "0,0.0000"
};
CONSTANTS.ORDER_TYPES = [CONSTANTS.STOCKS.LIMIT_ORDER, CONSTANTS.STOCKS.STOP_ORDER];
CONSTANTS.POSITIONS = [CONSTANTS.STOCKS.LONG_POSITION, CONSTANTS.STOCKS.SHORT_POSITION,
    CONSTANTS.STOCKS.NO_POSITION];
