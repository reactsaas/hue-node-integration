import { HueIntegration } from "../../dist/index.js";

const main = async () => {
  const hue = new HueIntegration("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu");

  console.log("🎭 Fetching all scenes...");
  const scenes = await hue.getScenes();

  console.log("✅ Retrieved Scenes:", scenes);
};

main().catch((error) => {
  console.error("❌ Error occurred:", error);
});
