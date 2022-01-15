export async function main(ns) {
    async function clearCustomTest() {
        let customNode = document.getElementById("custom-1");
        if (customNode !== null) {
            customNode.remove();
        }
    }
    await clearCustomTest();
}
