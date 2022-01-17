export class CONSTANTS {
    static readonly SCRIPT_DIRECTORY = "js/";
    static readonly HOME_SERVER = "home";

    static readonly DIRECTORIES = {
        CRAWL_LOGS:     '/logs',
    };

    static readonly TEXT_FILES = {
        KNOWN_HOSTS:        '/known-hosts.txt',
        CRAWL_REPORT:       '/crawl-report.txt',
        HOST_INFO:          '/host-info.txt',
        ROOTED_HOSTS:       '/rooted-hosts.txt',
        CRAWLED_CONTRACTS:  '/crawled-contracts.txt'
    };

    static readonly FILE_EXTENSIONS = {
        NS1:                '.script',
        NS2:                '.js',
        TEXT:               '.txt',
        MESSAGE:            '.msg',
        CODING_CONTRACT:    '.cct'
    }

    static readonly STOCKS = {
        MARKET_ORDER:   'market',
        LIMIT_ORDER:    'limit',
        STOP_ORDER:     'stop',
        
        LONG_POSITION:  'long',
        SHORT_POSITION: 'short',
        NO_POSITION:    'none',

        COMMISSION_FEE:         1000000,
        UPDATE_TICK_DURATION:   6000,
    };

    static readonly ORDER_TYPES = [CONSTANTS.STOCKS.LIMIT_ORDER, CONSTANTS.STOCKS.STOP_ORDER];
    static readonly POSITIONS   = [CONSTANTS.STOCKS.LONG_POSITION, CONSTANTS.STOCKS.SHORT_POSITION, 
                                    CONSTANTS.STOCKS.NO_POSITION];

}