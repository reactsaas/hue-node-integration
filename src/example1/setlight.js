import { HueIntegrationV1 } from "../../dist/index.js";

const main = async () => {
  // Replace with your actual API key and bridge IP if needed.
  const hue = new HueIntegrationV1("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu", "192.168.1.105");

  const lightId = "24"; // Example Light ID V1 AND V2 use differnt ids
  const xyColor = { x: 0.5, y: 0.4 }; // Example XY color (orange-ish)
  const isOn = false;         // Turn the light ON
  const brightness = 80;     // Brightness on a 0–100 scale
  const transition = 5000;   // Transition time of 5000 ms (i.e., 5 seconds)

  console.log(`💡 Updating Light: ${lightId}`);
  const success = await hue.setLight(lightId, xyColor, isOn, brightness, transition);

  if (success) {
    console.log("✅ Light successfully updated!");
  } else {
    console.log("❌ Failed to update light.");
  }
};

main().catch((error) => {
  console.error("❌ Error occurred:", error);
});
