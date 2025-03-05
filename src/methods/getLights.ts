import { AxiosInstance } from "axios";

export async function getLights(axiosInstance: AxiosInstance): Promise<any[]> {
  try {
    // Fetch all lights
    const response = await axiosInstance.get("/light");
    const lights = response.data.data;

    if (!lights || lights.length === 0) {
      console.log("No lights found on the Hue Bridge.");
      return [];
    }

    //console.log(`Found ${lights.length} light(s) on the Hue Bridge:`);

    // Build structured data
    const lightData = lights.map((light: any, index: number) => {
      const lightObj = {
        id: light.id || "N/A",
        name: light.metadata?.name || "Unnamed Light",
        type: light.type || "Unknown Type",
        isOn: light?.on?.on ? true : false,
        brightness: light?.dimming?.brightness || "N/A",
        xyColor: light.color?.xy ? { x: light.color.xy.x, y: light.color.xy.y } : null,
      };

/*       console.log(`Light ${index + 1}:`);
      console.log("ID:", lightObj.id);
      console.log("Name:", lightObj.name);
      console.log("Type:", lightObj.type);
      console.log("On:", lightObj.isOn ? "Yes" : "No");
      console.log("Brightness:", lightObj.brightness); */

/*       if (lightObj.xyColor) {
        console.log("XY Color:", `(${lightObj.xyColor.x}, ${lightObj.xyColor.y})`);
      } */

      //ANCHOR - console.log("---------------------------------------------------");

      return lightObj;
    });

    return lightData;
  } catch (err: any) {
    console.error("Failed to retrieve lights:", err.message);
    if (err.response) {
      console.error("Response Data:", err.response.data);
    }
    return [];
  }
}
