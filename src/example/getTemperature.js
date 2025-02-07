import { HueIntegration } from "../../dist/esm/index.js";

const main = async () => {
  const hue = new HueIntegration("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu");

  const temp = await hue.getTemperature();
  console.log("🌡️ Fetching all temperature sensors...",temp);
};

main().catch((error) => {
  console.error("❌ Error occurred:", error);
});
