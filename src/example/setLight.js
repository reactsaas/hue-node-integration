import { HueIntegration } from "../../dist/esm/index.js";

const main = async () => {
  const hue = new HueIntegration("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu");

  const lightId = "73c5e5ab-4525-41b5-8667-69f837b7b074"; // Example Light ID
  const brightness = 80; // Set brightness to 80%
  const xyColor = { x: 0.5, y: 0.4 }; // Example XY color (orange)
  const isOn = true; // Turn light ON

  console.log(`💡 Updating Light: ${lightId}`);
  const success = await hue.setLight(lightId, brightness, xyColor, isOn);

  if (success) {
    console.log("✅ Light successfully updated!");
  } else {
    console.log("❌ Failed to update light.");
  }
};

main().catch((error) => {
  console.error("❌ Error occurred:", error);
});
