export class PROGRAMS {
    static all() {
        let allPrograms = [];
        allPrograms.push(PROGRAMS.NUKE);
        allPrograms.push(PROGRAMS.AUTO_LINK);
        allPrograms.push(PROGRAMS.SERVER_PROFILER);
        allPrograms.push(PROGRAMS.DEEPSCAN_V1);
        allPrograms.push(PROGRAMS.BRUTE_SSH);
        allPrograms.push(PROGRAMS.FTP_CRACK);
        return allPrograms;
    }
}
PROGRAMS.NUKE = "NUKE.exe";
PROGRAMS.AUTO_LINK = "AutoLink.exe";
PROGRAMS.SERVER_PROFILER = "ServerProfiler.exe";
PROGRAMS.DEEPSCAN_V1 = "DeepscanV1.exe";
PROGRAMS.BRUTE_SSH = "BruteSSH.exe";
PROGRAMS.FTP_CRACK = "FTPCrack.exe";
