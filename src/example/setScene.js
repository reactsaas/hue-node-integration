import { HueIntegration } from "../../dist/index.js";

const main = async () => {
  const hue = new HueIntegration("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu");

  const sceneId = "44845d3c-b044-40f3-9b5c-1086ff2f2418"; // Example Scene ID
  const groupId = "2e0b251b-3bfb-4021-a2c5-cc627a1706ef"; // Example Group ID

  console.log(`🎭 Setting Scene: ${sceneId}`);
  const success = await hue.setScene(sceneId, groupId);

  if (success) {
    console.log("✅ Scene successfully activated!");
  } else {
    console.log("❌ Failed to activate scene.");
  }
};

main().catch((error) => {
  console.error("❌ Error occurred:", error);
});
