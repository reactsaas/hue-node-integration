import { AxiosInstance } from "axios";
import { setGroup } from "./setGroup.js";

export async function setGroups(
  axiosInstance: AxiosInstance,
  groupIds: string[], // Array of group IDs
  brightness?: number, // Optional brightness (0-100)
  xyColor?: { x: number; y: number }, // Optional XY color
  isOn?: boolean // Optional On/Off state
): Promise<boolean> {
  try {
    console.log(`Setting multiple groups (${groupIds.length} groups)...`);

    // Track the status of all updates
    const results = await Promise.all(
      groupIds.map(async (groupId) => {
        console.log(`🔧 Updating Group: ${groupId}`);
        const success = await setGroup(axiosInstance, groupId, brightness, xyColor, isOn);
        return { groupId, success };
      })
    );

    // Log results
    results.forEach(({ groupId, success }) => {
      if (success) {
        console.log(`Group ${groupId} updated successfully!`);
      } else {
        console.log(`❌ Failed to update Group ${groupId}.`);
      }
    });

    // Return overall success (true if all groups updated successfully)
    return results.every((result) => result.success);
  } catch (err: any) {
    console.error("❌ Failed to update multiple groups:", err.message);
    if (err.response) {
      console.error("Response Data:", JSON.stringify(err.response.data, null, 2));
    }
    return false;
  }
}
