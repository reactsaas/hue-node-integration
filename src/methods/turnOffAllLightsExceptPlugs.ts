import { AxiosInstance } from "axios";

/**
 * Turns off all lights except those whose metadata.archetype is "plug".
 * Logs the full lights response for debugging.
 * Applies a 250 ms rate limit for every 2 requests.
 * @param {AxiosInstance} axiosInstance - Your configured Axios instance for the Hue API.
 * @returns {Promise<boolean>} - Returns true if the process was successful.
 */
export async function turnOffAllLightsExceptPlugs(axiosInstance: AxiosInstance): Promise<boolean> {
  try {
    // Fetch all lights using the Hue API v2 endpoint for individual light resources
    const lightsResponse = await axiosInstance.get("/light");

    // Try to extract the array of lights:
    let lightsArray: any[] = [];
    if (Array.isArray(lightsResponse.data.data)) {
      lightsArray = lightsResponse.data.data;
    } else if (Array.isArray(lightsResponse.data)) {
      lightsArray = lightsResponse.data;
    } else {
      console.error("Unexpected lights response structure:", lightsResponse.data);
      return false;
    }
    
    console.log("Full lights array:", JSON.stringify(lightsArray, null, 2));

    // Arrays to keep track of non-plug lights and plugs filtered out
    const nonPlugLightIds: string[] = [];
    const filteredOutPlugIds: string[] = [];

    // Filter out lights based on metadata.archetype being "plug"
    lightsArray.forEach((light: any) => {
      const archetype = (light.metadata?.archetype || "").toLowerCase();
      if (archetype === "plug") {
        filteredOutPlugIds.push(light.id);
      } else {
        nonPlugLightIds.push(light.id);
      }
    });

    // Log the IDs of lights that are filtered out as plugs
/*     console.log("Filtered out plugs (not turning off):", filteredOutPlugIds);
    console.log("Non-plug lights to turn off:", nonPlugLightIds); */

    if (!nonPlugLightIds.length) {
      //console.warn("No non-plug lights found.");
      return false;
    }

    // Turn off non-plug lights in batches of 2 with a 250 ms delay between batches
    for (let i = 0; i < nonPlugLightIds.length; i += 2) {
      const batch = nonPlugLightIds.slice(i, i + 2);
      await Promise.all(
        batch.map(async (lightId) => {
          const offPayload = { on: { on: false } };
          try {
            const offResponse = await axiosInstance.put(`/light/${lightId}`, offPayload);
            if (offResponse.status === 200) {
              console.log(`Light ${lightId} turned off successfully.`);
            } else {
              console.warn(`Failed to turn off light ${lightId}. Status: ${offResponse.status}`);
            }
          } catch (error: any) {
            console.error(`Error turning off light ${lightId}:`, error.message);
          }
        })
      );
      if (i + 2 < nonPlugLightIds.length) {
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }

    return true;
  } catch (error: any) {
    console.error("Error turning off lights except plugs:", error.message);
    return false;
  }
}
