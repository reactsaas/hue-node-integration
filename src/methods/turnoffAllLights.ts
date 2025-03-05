import { AxiosInstance } from "axios";

/**
 * Turns off all lights by checking if a grouped_light with id_v1 "/groups/0" exists.
 * If it exists, it uses that endpoint to turn off all lights.
 * @param {AxiosInstance} axiosInstance - Your configured Axios instance for the Hue API.
 * @returns {Promise<boolean>} - Returns true if the process was successful, false otherwise.
 */
export async function turnOffAllLights(axiosInstance: AxiosInstance): Promise<boolean> {
  try {
    // Fetch grouped lights using the Hue API v2 endpoint
    const groupedResponse = await axiosInstance.get("/grouped_light");
    const groups = groupedResponse.data.data; // assuming grouped lights are in data.data
    console.log("Grouped lights:", groups);
    
    // Look for a group where id_v1 is "/groups/0"
    const groupZero = groups.find((group: any) => group.id_v1 === "/groups/0");

    if (groupZero) {
      console.log("Group 0 exists. Turning off all lights using grouped_light endpoint.");
      const offPayload = { on: { on: false } };
      const offResponse = await axiosInstance.put(`/grouped_light/${groupZero.id}`, offPayload);
      if (offResponse.status === 200) {
        console.log("All lights turned off successfully using grouped_light group 0.");
        return true;
      } else {
        console.warn(`Unexpected response status: ${offResponse.status}`);
        return false;
      }
    } else {
      console.log("Group 0 not found. Cannot turn off all lights using this method.");
      return false;
    }
  } catch (error: any) {
    console.error("Error in turning off all lights:", error.message);
    return false;
  }
}
