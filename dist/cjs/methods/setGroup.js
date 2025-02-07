"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGroup = setGroup;
async function setGroup(axiosInstance, groupId, brightness, // Optional brightness (0-100)
xyColor, // Optional XY color
isOn // Optional On/Off state
) {
    try {
        console.log(`💡 Setting Grouped Light: ${groupId}`);
        // Build request payload dynamically based on provided values
        const requestBody = {};
        if (brightness !== undefined) {
            requestBody.dimming = { brightness };
            console.log(`🔆 Brightness: ${brightness}%`);
        }
        if (xyColor) {
            requestBody.color = { xy: { x: xyColor.x, y: xyColor.y } };
            console.log(`🌈 Color XY: (${xyColor.x}, ${xyColor.y})`);
        }
        if (isOn !== undefined) {
            requestBody.on = { on: isOn };
            console.log(`💡 Group Light State: ${isOn ? "ON" : "OFF"}`);
        }
        if (Object.keys(requestBody).length === 0) {
            console.error("⚠️ No values provided for update!");
            return false;
        }
        console.log("🚀 Sending request to update grouped light...");
        const response = await axiosInstance.put(`/grouped_light/${groupId}`, requestBody);
        if (response.status === 200) {
            console.log(`✅ Grouped Light Updated: ${groupId}`);
            return true;
        }
        else {
            console.warn(`⚠️ Unexpected response status: ${response.status}`);
            return false;
        }
    }
    catch (err) {
        console.error(`❌ Failed to update grouped light (${groupId}):`, err.message);
        if (err.response) {
            console.error("📜 Response Data:", JSON.stringify(err.response.data, null, 2));
        }
        return false;
    }
}
//# sourceMappingURL=setGroup.js.map