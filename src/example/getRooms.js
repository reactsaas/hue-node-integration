import { HueIntegration } from "../../dist/esm/index.js";

const main = async () => {
  const hue = new HueIntegration("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu");

  console.log("🏠 Fetching all rooms...");
  const rooms = await hue.getRooms();

  console.log("✅ Retrieved Rooms:", rooms);
};

main().catch((error) => {
  console.error("❌ Error occurred:", error);
});
