import { HueIntegration } from "../../dist/index.js";

const main = async () => {
  const hue = new HueIntegration("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu");

  const lights = await hue.getLights();
  console.log("🔍 Fetching all lights..." , lights);
};

main().catch((error) => {
  console.error("❌ Error occurred:", error);
});
