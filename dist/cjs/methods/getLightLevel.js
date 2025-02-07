"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMLightLevel = getMLightLevel;
async function getMLightLevel(axiosInstance) {
    try {
        // Step 1: Fetch all devices to get their names
        const devicesResponse = await axiosInstance.get("/device");
        const devices = devicesResponse.data.data;
        // Create a mapping of device IDs to their names
        const deviceMap = {};
        devices.forEach((device) => {
            deviceMap[device.id] = device.metadata?.name || "Unnamed Device";
        });
        // Step 2: Fetch all light level sensors
        const response = await axiosInstance.get("/light_level");
        const sensors = response.data.data;
        if (!sensors || sensors.length === 0) {
            console.log("🔆 No light level sensors found on the Hue Bridge.");
            return [];
        }
        console.log(`🔆 Found ${sensors.length} light level sensor(s):`);
        // Build and return structured data
        const sensorData = sensors.map((sensor, index) => {
            const deviceName = deviceMap[sensor.owner?.rid] || "Unknown Device";
            const sensorObj = {
                id: sensor.id || "N/A",
                deviceName,
                lightLevel: sensor.light?.light_level ?? "N/A",
            };
            console.log(`🔆 Sensor ${index + 1}:`);
            console.log("🆔 ID:", sensorObj.id);
            console.log("📛 Device Name:", sensorObj.deviceName);
            console.log("🌞 Light Level:", sensorObj.lightLevel, "lx");
            console.log("---------------------------------------------------");
            return sensorObj;
        });
        return sensorData;
    }
    catch (err) {
        console.error("❌ Failed to retrieve light level sensors:", err.message);
        if (err.response) {
            console.error("Response Data:", err.response.data);
        }
        return [];
    }
}
//# sourceMappingURL=getLightLevel.js.map