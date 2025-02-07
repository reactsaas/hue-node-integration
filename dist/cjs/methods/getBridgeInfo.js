"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBridgeInfo = getBridgeInfo;
async function getBridgeInfo(axiosInstance) {
    try {
        // Fetch Bridge Info
        const response = await axiosInstance.get("/bridge");
        const bridgeData = response.data.data[0];
        if (!bridgeData) {
            console.log("❌ No bridge information found.");
            return null;
        }
        // Structure the bridge info
        const bridgeInfo = {
            bridgeId: bridgeData?.bridge_id || "N/A",
            modelId: bridgeData?.model_id || "N/A",
            apiVersion: bridgeData?.apiversion || "N/A",
        };
        console.log("✅ Successfully connected to Hue Bridge!");
        console.log("🔗 Bridge ID:", bridgeInfo.bridgeId);
        console.log("📌 Model:", bridgeInfo.modelId);
        console.log("⚙️ Firmware Version:", bridgeInfo.apiVersion);
        return bridgeInfo;
    }
    catch (err) {
        console.error("❌ Failed to retrieve bridge info:", err.message);
        if (err.response) {
            console.error("Response Data:", err.response.data);
        }
        return null;
    }
}
//# sourceMappingURL=getBridgeInfo.js.map