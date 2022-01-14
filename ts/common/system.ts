import { NS } from "../../types/NetscriptDefinitions";

// Turns out this object exists in NS and this is not needed at all, whoops. Just use Server from the NS definitions.
export class System {
    // The NetScript context is needed to use it's calls, but I don't know if it is safe to make a new context
    // so I just pass in the context from wherever it gets called into the constructor
    readonly ns: NS;

    // Store the name of the host System and the threads being used by the calling script
    readonly host                   :   string;
    readonly threads                :   number;

    // Store security-related info. Security Level and Weaken Amount can change (I think), so we won't make 
    // those readonly.
    readonly securityMinLevel       :   number;
    securityLevel                   :   number;
    securityWeakenAmount            :   number;

    // Money information
    readonly moneyMaxAvailable      :   number;
    moneyAvailable                  :   number;

    // Hacking information
    readonly portsRequired          :   number;
    readonly hackingLevelRequired   :   number;

    // Do we have root access? Very important.
    hasRoot                :   boolean;
    
    constructor(netscript: NS, host?: string, threads?: number) {
        this.ns = netscript

        // If there is no hostname passed in, get the host that the script is running on
        this.host = host || this.ns.getHostname();
        this.threads = threads || 1;

        this.securityMinLevel       = this.ns.getServerMinSecurityLevel  ( this.host     );
        this.securityLevel 		    = this.ns.getServerSecurityLevel     ( this.host     );
        this.securityWeakenAmount 	= this.ns.weakenAnalyze              ( this.threads  );

        this.moneyMaxAvailable 	    = this.ns.getServerMaxMoney      ( this.host );
        this.moneyAvailable 		= this.ns.getServerMoneyAvailable( this.host );

        this.portsRequired		    = this.ns.getServerNumPortsRequired      ( this.host );
        this.hackingLevelRequired   = this.ns.getServerRequiredHackingLevel  ( this.host );

        this.hasRoot                = this.ns.hasRootAccess( this.host );
    }

    updateSecurityLevel(): void {
        this.securityLevel = this.ns.getServerSecurityLevel ( this.host );
    }

    updateSecurityWeakenAmount(): void {
        this.securityLevel = this.ns.weakenAnalyze ( this.threads );
    }

    updateMoneyAvailable(): void {
        this.moneyAvailable = this.ns.getServerMoneyAvailable( this.host );
    }

    updateRootAccess(): void {
        this.hasRoot = this.ns.hasRootAccess( this.host );
    }
}