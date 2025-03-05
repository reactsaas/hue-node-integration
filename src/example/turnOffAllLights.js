import { HueIntegration } from "../../dist/index.js";

const main = async () => {
  // Instantiate the HueIntegration with your API key
  const hue = new HueIntegration("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu");

  console.log("Turning off all lights...");
  const success = await hue.turnOffAllLightsExceptPlugs();

  if (success) {
    console.log("✅ All lights turned off successfully!");
  } else {
    console.log("❌ Failed to turn off all lights.");
  }
};

main().catch((error) => {
  console.error("❌ Error occurred:", error);
});
