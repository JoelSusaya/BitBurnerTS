export class CONSTANTS {
    static readonly SCRIPT_DIRECTORY = "js/";
    static readonly HOME_SERVER = "home";

    static readonly STOCKS = {
        MARKET_ORDER:   'market',
        LIMIT_ORDER:    'limit',
        STOP_ORDER:     'stop',
        
        LONG_POSITION:  'long',
        SHORT_POSITION: 'short',
        NO_POSITION:    'none',

        COMMISSION_FEE:         1000000,
        UPDATE_TICK_DURATION:   6000,
    }

    static readonly ORDER_TYPES = [CONSTANTS.STOCKS.LIMIT_ORDER, CONSTANTS.STOCKS.STOP_ORDER];
    static readonly POSITIONS   = [CONSTANTS.STOCKS.LONG_POSITION, CONSTANTS.STOCKS.SHORT_POSITION, 
                                    CONSTANTS.STOCKS.NO_POSITION];

}