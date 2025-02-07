import { HueIntegration } from "../../dist/index.js";

const main = async () => {
  const hue = new HueIntegration("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu");

  // Get Bridge Info and log it
  const bridgeInfo = await hue.getBridgeInfo();
  console.log("Bridge Info:", bridgeInfo);

  // Connect to Bridge (if needed)
  // const apiKey = await hue.connectBridge("my-app");
  // console.log("New API Key:", apiKey);
};

main().catch((error) => {
  console.error("Error occurred:", error);
});
