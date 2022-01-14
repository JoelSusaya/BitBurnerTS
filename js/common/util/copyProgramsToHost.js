export async function main(ns) {
    // Wrap the function to prevent anything from entering the global namespace (unless we want to add it)
    // Function must be async
    async function copyProgramsToHost() {
    }
    // Run the function or it's useless
    await copyProgramsToHost();
}
