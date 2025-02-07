"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScenes = getScenes;
async function getScenes(axiosInstance) {
    try {
        // Fetch all scenes
        const response = await axiosInstance.get("/scene");
        const scenes = response.data.data;
        if (!scenes || scenes.length === 0) {
            console.log("🎭 No scenes found on the Hue Bridge.");
            return [];
        }
        console.log(`🎭 Found ${scenes.length} scene(s) on the Hue Bridge:`);
        // Build structured data
        const sceneData = scenes.map((scene, index) => {
            const sceneObj = {
                id: scene.id || "N/A",
                name: scene.metadata?.name || "Unnamed Scene",
                type: scene.type || "Unknown Type",
                group: scene.group?.rid || "N/A",
            };
            console.log(`🎬 Scene ${index + 1}:`);
            console.log("🆔 ID:", sceneObj.id);
            console.log("📛 Name:", sceneObj.name);
            console.log("🔘 Type:", sceneObj.type);
            console.log("🏠 Group ID:", sceneObj.group);
            console.log("---------------------------------------------------");
            return sceneObj;
        });
        return sceneData;
    }
    catch (err) {
        console.error("❌ Failed to retrieve scenes:", err.message);
        if (err.response) {
            console.error("Response Data:", err.response.data);
        }
        return [];
    }
}
//# sourceMappingURL=getScenes.js.map