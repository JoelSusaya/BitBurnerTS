import { NS } from "../types/NetscriptDefinitions";

export async function main(ns: NS) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)

    // Function must be async
    async function gainRoot() {

    }

    // Run the function or it's useless
    gainRoot();
}