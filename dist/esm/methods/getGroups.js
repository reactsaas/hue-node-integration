export async function getGroups(axiosInstance) {
    try {
        console.log("🔎 Fetching all `grouped_light` groups...");
        // Fetch grouped lights
        const groupResponse = await axiosInstance.get("/grouped_light");
        const groups = groupResponse.data.data;
        if (!groups || groups.length === 0) {
            console.log("🚨 No groups (`grouped_light`) found on the Hue Bridge.");
            return [];
        }
        console.log("🔎 Fetching all rooms...");
        // Fetch rooms to map groups to their parent rooms
        const roomResponse = await axiosInstance.get("/room");
        const rooms = roomResponse.data.data;
        // Create a mapping of grouped_light IDs to room names
        const groupToRoomMap = {};
        rooms.forEach((room) => {
            const groupedLightService = room.services.find((s) => s.rtype === "grouped_light");
            if (groupedLightService) {
                groupToRoomMap[groupedLightService.rid] = room.metadata?.name || "Unnamed Room";
            }
        });
        console.log(`💡 Found ${groups.length} \`grouped_light\` group(s):`);
        // Build structured data
        const groupData = groups.map((group, index) => {
            const roomName = groupToRoomMap[group.id] || "No Linked Room";
            const groupObj = {
                id: group.id || "N/A",
                name: group.metadata?.name || roomName || "Unnamed Group",
                type: group.type || "Unknown Type",
                services: group.services?.map((s) => s.rtype).join(", ") || "N/A",
                linkedRoom: roomName,
            };
            console.log(`💡 Group ${index + 1}:`);
            console.log("🆔 ID:", groupObj.id);
            console.log("📛 Name:", groupObj.name);
            console.log("🔘 Type:", groupObj.type);
            console.log("🔗 Linked Room:", groupObj.linkedRoom);
            console.log("🔗 Services:", groupObj.services);
            console.log("---------------------------------------------------");
            return groupObj;
        });
        return groupData;
    }
    catch (err) {
        console.error("❌ Failed to retrieve groups:", err.message);
        if (err.response) {
            console.error("Response Data:", err.response.data);
        }
        return [];
    }
}
//# sourceMappingURL=getGroups.js.map