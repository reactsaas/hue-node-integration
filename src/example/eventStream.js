import { HueIntegration } from "../../dist/esm/index.js";

const main = async () => {
  const hue = new HueIntegration("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu");

  try {
    // Get Bridge Info and log it
    const bridgeInfo = await hue.getBridgeInfo();
    console.log("Bridge Info:", bridgeInfo);

    // Start Event Stream and handle events
    console.log("Starting Event Stream...");
    hue.startEventStream(
      (data) => {
        console.log("Event Data:", JSON.stringify(data, null, 2));
      },
      (error) => {
        console.error("Event Stream Error:", error);
      }
    );

    console.log("Event Stream started successfully!");
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

main();
