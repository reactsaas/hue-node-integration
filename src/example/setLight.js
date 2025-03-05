// testSetLight.ts
import { HueIntegration } from "../../dist/index.js";

const main = async () => {
  // Replace with your actual API key if needed
  const hue = new HueIntegration("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu");

  const lightId = "30d27db7-6476-434b-a24e-733922817205"; // Example Light ID
  const brightness = 80;       // Using brightness as provided (0-100)
  const xyColor = { x: 0.5, y: 0.4 }; // Example XY color (orange)
  const isOn = true;           // Turn light ON
  const transition = 1000;       // Transition time of 10 seconds

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
