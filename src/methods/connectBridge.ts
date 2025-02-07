import axios from "axios";
import https from "https";

export async function connectBridge(appName: string, bridgeIp: string): Promise<string> {
  console.log(`🛑 Press the button on your Hue Bridge to proceed...`);

  const maxRetries = 30;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await axios.post(
        `https://${bridgeIp}/api`,
        { devicetype: appName || "my-hue-app" },
        {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false, // Ignore self-signed certificates
          }),
        }
      );

      console.log("🔍 Full response from Hue Bridge:", response.data);

      if (response.data[0]?.success) {
        const username = response.data[0].success.username;
        console.log(`✅ Successfully registered with API Key: ${username}`);
        return username;
      }

      if (response.data[0]?.error?.type === 101) {
        console.log(`⏳ Waiting for button press... (${retries + 1}/${maxRetries})`);
        retries++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }
    } catch (err: any) {
      console.error("❌ Request failed:", err.message);
      throw err;
    }
  }

  throw new Error("❌ Failed to register after 30 attempts.");
}
