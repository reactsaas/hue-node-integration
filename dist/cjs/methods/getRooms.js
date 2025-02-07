"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRooms = getRooms;
async function getRooms(axiosInstance) {
    try {
        // Fetch all rooms
        const response = await axiosInstance.get("/room");
        const rooms = response.data.data;
        if (!rooms || rooms.length === 0) {
            console.log("🚪 No rooms found on the Hue Bridge.");
            return [];
        }
        console.log(`🚪 Found ${rooms.length} room(s) on the Hue Bridge:`);
        // Build structured data
        const roomData = rooms.map((room, index) => {
            const roomObj = {
                id: room.id || "N/A",
                name: room.metadata?.name || "Unnamed Room",
                type: room.type || "Unknown Type",
                services: room.services?.map((s) => s.rtype).join(", ") || "N/A",
            };
            console.log(`🏠 Room ${index + 1}:`);
            console.log("🆔 ID:", roomObj.id);
            console.log("📛 Name:", roomObj.name);
            console.log("🔘 Type:", roomObj.type);
            console.log("🔗 Services:", roomObj.services);
            console.log("---------------------------------------------------");
            return roomObj;
        });
        return roomData;
    }
    catch (err) {
        console.error("❌ Failed to retrieve rooms:", err.message);
        if (err.response) {
            console.error("Response Data:", err.response.data);
        }
        return [];
    }
}
//# sourceMappingURL=getRooms.js.map