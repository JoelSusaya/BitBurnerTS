export class PROGRAMS {
    static readonly NUKE 		    = "NUKE.exe";
    static readonly AUTO_LINK       = "AutoLink.exe";
    static readonly SERVER_PROFILER = "ServerProfiler.exe";
    static readonly DEEPSCAN_V1     = "DeepscanV1.exe";
    static readonly BRUTE_SSH       = "BruteSSH.exe";
    static readonly FTP_CRACK       = "FTPCrack.exe";

    static all(): string[] {
        let allPrograms: string[] = [];

        allPrograms.push(PROGRAMS.NUKE);
        allPrograms.push(PROGRAMS.AUTO_LINK);
        allPrograms.push(PROGRAMS.SERVER_PROFILER);
        allPrograms.push(PROGRAMS.DEEPSCAN_V1);
        allPrograms.push(PROGRAMS.BRUTE_SSH);
        allPrograms.push(PROGRAMS.FTP_CRACK);

        return allPrograms;
    }
}