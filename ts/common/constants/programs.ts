export class PROGRAMS {
    static readonly NUKE 		    = "NUKE.exe";
    static readonly AUTO_LINK       = "AutoLink.exe";
    static readonly SERVER_PROFILER = "ServerProfiler.exe";
    static readonly DEEPSCAN_V1     = "DeepscanV1.exe";
    static readonly DEEPSCAN_V2     = "DeepscanV2.exe";
    static readonly BRUTE_SSH       = "BruteSSH.exe";
    static readonly FTP_CRACK       = "FTPCrack.exe";
    static readonly RELAY_SMTP      = "relaySMTP.exe";
    static readonly HTTP_WORM       = "HTTPWorm.exe";
    static readonly SQL_INJECT      = "SQLInject.exe";
    static readonly FORMULAS        = "Formulas.exe";

    static all(): string[] {
        let allPrograms: string[] = [];

        allPrograms.push(PROGRAMS.NUKE);
        allPrograms.push(PROGRAMS.AUTO_LINK);
        allPrograms.push(PROGRAMS.SERVER_PROFILER);
        allPrograms.push(PROGRAMS.DEEPSCAN_V1);
        allPrograms.push(PROGRAMS.DEEPSCAN_V2);
        allPrograms.push(PROGRAMS.BRUTE_SSH);
        allPrograms.push(PROGRAMS.FTP_CRACK);
        allPrograms.push(PROGRAMS.RELAY_SMTP);
        allPrograms.push(PROGRAMS.HTTP_WORM);
        allPrograms.push(PROGRAMS.SQL_INJECT);
        allPrograms.push(PROGRAMS.FORMULAS);

        return allPrograms;
    }
}