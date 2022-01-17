export async function main(ns) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    // this.ns.print(this.ns.vsprintf("", []));
    // Function must be async
    async function template() {
    }
    // Run the function or it's useless
    await template();
}
