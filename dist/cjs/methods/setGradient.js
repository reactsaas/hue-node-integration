"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGradient = setGradient;
async function setGradient(axiosInstance, lightId, gradientColors, // Array of XY color points
isOn = true, // Default ON
brightness = 60 // Default brightness
) {
    try {
        console.log(`🌈 Setting Gradient on Light: ${lightId}`);
        if (!gradientColors || gradientColors.length < 2 || gradientColors.length > 5) {
            console.error("❌ Gradient requires between 2 and 5 color points.");
            return false;
        }
        console.log(`🎨 Gradient Points: ${gradientColors.length}`);
        gradientColors.forEach((color, index) => {
            console.log(`🎨 Point ${index + 1}: (${color.x}, ${color.y})`);
        });
        console.log(`💡 Light State: ${isOn ? "ON" : "OFF"}`);
        console.log(`🔆 Brightness: ${brightness}%`);
        // Build request payload with correct Hue API structure
        const requestBody = {
            gradient: {
                points: gradientColors.map((xy) => ({
                    color: { xy }
                }))
            },
            on: { on: isOn },
            dimming: { brightness }
        };
        console.log("🚀 Sending request to set gradient...");
        const response = await axiosInstance.put(`/light/${lightId}`, requestBody);
        if (response.status === 200) {
            console.log(`✅ Gradient Applied to Light: ${lightId}`);
            return true;
        }
        else {
            console.warn(`⚠️ Unexpected response status: ${response.status}`);
            return false;
        }
    }
    catch (err) {
        console.error(`❌ Failed to set gradient on light (${lightId}):`, err.message);
        if (err.response) {
            console.error("📜 Response Data:", JSON.stringify(err.response.data, null, 2));
        }
        return false;
    }
}
//# sourceMappingURL=setGradient.js.map