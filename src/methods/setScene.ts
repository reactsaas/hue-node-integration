import { AxiosInstance } from "axios";

export async function setScene(axiosInstance: AxiosInstance, sceneId: string): Promise<boolean> {
  try {
    console.log(` Attempting to activate Scene: ${sceneId}`);
    console.log(` Checking if Scene exists...`);

    // Step 1: Verify the Scene Exists
    const sceneResponse = await axiosInstance.get("/scene");
    const scenes = sceneResponse.data.data;

    if (!scenes || scenes.length === 0) {
      console.error("❌ No scenes found on the Hue Bridge.");
      return false;
    }

    const scene = scenes.find((s: any) => s.id === sceneId);

    if (!scene) {
      console.error(` Scene ID ${sceneId} not found.`);
      console.log(" Available Scenes:");
      scenes.forEach((s: any) => console.log(`  - ${s.id}: ${s.metadata?.name}`));
      return false;
    }

    console.log(` Scene Found: ${scene.metadata?.name}`);

    // Step 2: Activate the Scene (Correct API Call from cURL Example)
    console.log(` Sending request to activate Scene: ${sceneId} using PUT /scene/{sceneId}...`);
    
    const response = await axiosInstance.put(`/scene/${sceneId}`, {
      recall: { action: "active" }
    });

    if (response.status === 200) {
      console.log(` Scene Activated: ${sceneId} `);
      return true;
    } else {
      console.warn(` Unexpected response status: ${response.status}`);
      return false;
    }
  } catch (err: any) {
    console.error(` Failed to activate scene (${sceneId}):`, err.message);
    if (err.response) {
      console.error("📜 Response Data:", JSON.stringify(err.response.data, null, 2));
    }
    return false;
  }
}
