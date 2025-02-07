export async function getLights(axiosInstance) {
    try {
        // Fetch all lights
        const response = await axiosInstance.get("/light");
        const lights = response.data.data;
        if (!lights || lights.length === 0) {
            console.log("🚨 No lights found on the Hue Bridge.");
            return [];
        }
        console.log(`💡 Found ${lights.length} light(s) on the Hue Bridge:`);
        // Build structured data
        const lightData = lights.map((light, index) => {
            const lightObj = {
                id: light.id || "N/A",
                name: light.metadata?.name || "Unnamed Light",
                type: light.type || "Unknown Type",
                isOn: light?.on?.on ? true : false,
                brightness: light?.dimming?.brightness || "N/A",
                xyColor: light.color?.xy ? { x: light.color.xy.x, y: light.color.xy.y } : null,
                colorTemperature: light.color?.temperature?.mirek || null,
                saturation: light.color?.saturation?.saturation || null,
            };
            console.log(`🔆 Light ${index + 1}:`);
            console.log("🆔 ID:", lightObj.id);
            console.log("📛 Name:", lightObj.name);
            console.log("🔘 Type:", lightObj.type);
            console.log("💡 On:", lightObj.isOn ? "Yes" : "No");
            console.log("🔅 Brightness:", lightObj.brightness);
            if (lightObj.xyColor) {
                console.log("🌈 XY Color:", `(${lightObj.xyColor.x}, ${lightObj.xyColor.y})`);
            }
            if (lightObj.colorTemperature) {
                console.log("🌡️ Color Temperature:", `${lightObj.colorTemperature} Mired`);
            }
            if (lightObj.saturation) {
                console.log("🎨 Saturation:", `${lightObj.saturation} %`);
            }
            console.log("---------------------------------------------------");
            return lightObj;
        });
        return lightData;
    }
    catch (err) {
        console.error("❌ Failed to retrieve lights:", err.message);
        if (err.response) {
            console.error("Response Data:", err.response.data);
        }
        return [];
    }
}
//# sourceMappingURL=getLights.js.map