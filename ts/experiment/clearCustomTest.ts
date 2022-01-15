import { NS } from "types/NetscriptDefinitions";

export async function main(ns: NS) {

    async function clearCustomTest() {   
        let customNode = document.getElementById("custom-1");
        
        if (customNode !== null) {
            customNode.remove();
        }
    }

    await clearCustomTest();
}