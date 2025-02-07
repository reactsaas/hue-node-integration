import { HueIntegration } from "../../dist/esm/index.js";

const main = async () => {
  const hue = new HueIntegration("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu");

  const lightId = "c355f54d-1492-42a9-b145-a4256a097105"; // Example Light ID

  // Example 5-point gradient (red, green, blue, yellow, purple)
  const gradientColors = [
    { x: 0.7, y: 0.3 }, // Red
    { x: 0.17, y: 0.7 }, // Green
    { x: 0.15, y: 0.06 }, // Blue
    { x: 0.45, y: 0.47 }, // Yellow
    { x: 0.3, y: 0.2 } // Purple
  ];

  const isOn = true; // Turn the light ON

  console.log(`🌈 Applying Gradient to Light: ${lightId}`);
  const success = await hue.setGradient(lightId, gradientColors, isOn);

  if (success) {
    console.log("✅ Gradient successfully applied!");
  } else {
    console.log("❌ Failed to apply gradient.");
  }
};

main().catch((error) => {
  console.error("❌ Error occurred:", error);
});
