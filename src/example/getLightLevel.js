import { HueIntegration } from "../../dist/esm/index.js";

const main = async () => {
  const hue = new HueIntegration("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu");

  const lightlevel = await hue.getMLightLevel();
  console.log("🔆 Fetching all light level sensors...", lightlevel);
};

main().catch((error) => {
  console.error("❌ Error occurred:", error);
});
