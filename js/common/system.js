// Turns out this object exists in NS and this is not needed at all, whoops. Just use Server from the NS definitions.
export class System {
    constructor(netscript, host, threads) {
        this.ns = netscript;
        // If there is no hostname passed in, get the host that the script is running on
        this.host = host || this.ns.getHostname();
        this.threads = threads || 1;
        this.securityMinLevel = this.ns.getServerMinSecurityLevel(this.host);
        this.securityLevel = this.ns.getServerSecurityLevel(this.host);
        this.securityWeakenAmount = this.ns.weakenAnalyze(this.threads);
        this.moneyMaxAvailable = this.ns.getServerMaxMoney(this.host);
        this.moneyAvailable = this.ns.getServerMoneyAvailable(this.host);
        this.portsRequired = this.ns.getServerNumPortsRequired(this.host);
        this.hackingLevelRequired = this.ns.getServerRequiredHackingLevel(this.host);
        this.hasRoot = this.ns.hasRootAccess(this.host);
    }
    updateSecurityLevel() {
        this.securityLevel = this.ns.getServerSecurityLevel(this.host);
    }
    updateSecurityWeakenAmount() {
        this.securityLevel = this.ns.weakenAnalyze(this.threads);
    }
    updateMoneyAvailable() {
        this.moneyAvailable = this.ns.getServerMoneyAvailable(this.host);
    }
    updateRootAccess() {
        this.hasRoot = this.ns.hasRootAccess(this.host);
    }
}
