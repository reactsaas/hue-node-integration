"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGroups = setGroups;
const setGroup_js_1 = require("./setGroup.js");
async function setGroups(axiosInstance, groupIds, // Array of group IDs
brightness, // Optional brightness (0-100)
xyColor, // Optional XY color
isOn // Optional On/Off state
) {
    try {
        console.log(`💡 Setting multiple groups (${groupIds.length} groups)...`);
        // Track the status of all updates
        const results = await Promise.all(groupIds.map(async (groupId) => {
            console.log(`🔧 Updating Group: ${groupId}`);
            const success = await (0, setGroup_js_1.setGroup)(axiosInstance, groupId, brightness, xyColor, isOn);
            return { groupId, success };
        }));
        // Log results
        results.forEach(({ groupId, success }) => {
            if (success) {
                console.log(`✅ Group ${groupId} updated successfully!`);
            }
            else {
                console.log(`❌ Failed to update Group ${groupId}.`);
            }
        });
        // Return overall success (true if all groups updated successfully)
        return results.every((result) => result.success);
    }
    catch (err) {
        console.error("❌ Failed to update multiple groups:", err.message);
        if (err.response) {
            console.error("Response Data:", JSON.stringify(err.response.data, null, 2));
        }
        return false;
    }
}
//# sourceMappingURL=setGroups.js.map