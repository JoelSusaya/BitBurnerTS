export class CONSTANTS {
}
CONSTANTS.SCRIPT_DIRECTORY = "js/";
CONSTANTS.HOME_SERVER = "home";
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
CONSTANTS.ORDER_TYPES = [CONSTANTS.STOCKS.LIMIT_ORDER, CONSTANTS.STOCKS.STOP_ORDER];
CONSTANTS.POSITIONS = [CONSTANTS.STOCKS.LONG_POSITION, CONSTANTS.STOCKS.SHORT_POSITION,
    CONSTANTS.STOCKS.NO_POSITION];
