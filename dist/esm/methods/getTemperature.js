export async function getTemperature(axiosInstance) {
    try {
        // Step 1: Fetch all devices to get their names
        const devicesResponse = await axiosInstance.get("/device");
        const devices = devicesResponse.data.data;
        // Create a mapping of device IDs to their names
        const deviceMap = {};
        devices.forEach((device) => {
            deviceMap[device.id] = device.metadata?.name || "Unnamed Device";
        });
        // Step 2: Fetch all temperature sensors
        const response = await axiosInstance.get("/temperature");
        const sensors = response.data.data;
        if (!sensors || sensors.length === 0) {
            console.log("🌡️ No temperature sensors found on the Hue Bridge.");
            return [];
        }
        console.log(`🌡️ Found ${sensors.length} temperature sensor(s):`);
        // Build and return structured data
        const sensorData = sensors.map((sensor, index) => {
            const deviceName = deviceMap[sensor.owner?.rid] || "Unknown Device";
            const sensorObj = {
                id: sensor.id || "N/A",
                deviceName,
                temperature: sensor.temperature?.temperature ?? "N/A",
            };
            console.log(`🌡️ Sensor ${index + 1}:`);
            console.log("🆔 ID:", sensorObj.id);
            console.log("📛 Device Name:", sensorObj.deviceName);
            console.log("🌡️ Temperature:", sensorObj.temperature, "°C");
            console.log("---------------------------------------------------");
            return sensorObj;
        });
        return sensorData;
    }
    catch (err) {
        console.error("❌ Failed to retrieve temperature sensors:", err.message);
        if (err.response) {
            console.error("Response Data:", err.response.data);
        }
        return [];
    }
}
//# sourceMappingURL=getTemperature.js.map