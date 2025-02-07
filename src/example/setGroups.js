import { HueIntegration } from "../../dist/index.js";

const main = async () => {
  const hue = new HueIntegration("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu");

  // Group IDs
  const groupIds = [
    "c8a16aa0-669d-4794-a2ab-800acc170107", // Hauptraum
    "f9920f4f-db16-4c38-92d6-8e9c1fd974d1", // Wohnzimmer
  ];

  // Test parameters
  const brightness = 70; // Set brightness to 70%
  const xyColor = { x: 0.5, y: 0.4 }; // Example XY color (orange)
  const isOn = true; // Turn all groups ON

  console.log("💡 Updating multiple groups...");
  const success = await hue.setGroups(groupIds, brightness, xyColor, isOn);

  if (success) {
    console.log("✅ All groups updated successfully!");
  } else {
    console.log("❌ Failed to update some groups.");
  }
};

main().catch((error) => {
  console.error("❌ Error occurred:", error);
});
