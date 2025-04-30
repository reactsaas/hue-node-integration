// tests/testEntertainmentAreas.ts

import { HueIntegration } from "../../dist/index.js";

const main = async () => {
  const hue = new HueIntegration("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu");

  // Fetch all entertainment-area configurations
  console.log("🔍 Fetching all entertainment areas...");
  const areas = await hue.getEntertainmentAreas();
  console.log("✅ Entertainment Areas:", areas);
};

main().catch((error) => {
  console.error("❌ Error occurred:", error);
  process.exit(1);
});
