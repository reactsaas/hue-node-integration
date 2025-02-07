import { HueIntegration } from "../../dist/index.js";

const main = async () => {
  const hue = new HueIntegration("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu");

  console.log("🔎 Fetching all groups...");
  const groups = await hue.getGroups();

  console.log("✅ Retrieved Groups:", groups);
};

main().catch((error) => {
  console.error("❌ Error occurred:", error);
});
