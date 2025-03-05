// testSetLightsSequentialV1.js
import { HueIntegrationV1 } from "../../dist/index.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// First configuration for the lights (v1)
const firstConfig = {
  lights: [
    {
      id: "18",
      name: "Light 18",
      isOn: true,
      brightness: 23, // 0-100 scale
      xyColor: { x: 0.5834, y: 0.3986 },
      dynamics: { duration: 1000 } // in ms
    },
    {
      id: "19",
      name: "Light 19",
      isOn: false,
      brightness: 80,
      xyColor: { x: 0.4951, y: 0.4565 },
      dynamics: { duration: 1000 }
    },
    {
      id: "24",
      name: "Light 24",
      isOn: true,
      brightness: 100,
      xyColor: { x: 0.4954, y: 0.4569 },
      dynamics: { duration: 2000 }
    },
    {
      id: "4",
      name: "Light 4",
      isOn: false,
      brightness: 70,
      xyColor: { x: 0.5324, y: 0.4401 },
      dynamics: { duration: 1000 }
    }
  ]
};

// Second configuration for the lights (v1)
const secondConfig = {
  lights: [
    {
      id: "18",
      name: "Light 18",
      isOn: false,
      brightness: 30,
      xyColor: { x: 0.5316, y: 0.4286 },
      dynamics: { duration: 1000 }
    },
    {
      id: "19",
      name: "Light 19",
      isOn: true,
      brightness: 60,
      xyColor: { x: 0.5724, y: 0.4079 },
      dynamics: { duration: 1000 }
    },
    {
      id: "24",
      name: "Light 24",
      isOn: false,
      brightness: 60,
      xyColor: { x: 0.5666, y: 0.4128 },
      dynamics: { duration: 4000 }
    },
    {
      id: "4",
      name: "Light 4",
      isOn: true,
      brightness: 70,
      xyColor: { x: 0.5646, y: 0.4131 },
      dynamics: { duration: 1000 }
    }
  ],
  rooms: [],
  scenes: []
};

const main = async () => {
  // Replace with your actual API key (username) and bridge IP as needed.
  const hue = new HueIntegrationV1("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu", "192.168.1.105");

  console.log("🔄 Applying first configuration...");
  // Update each light with the first configuration using setLightV1.
  for (const light of firstConfig.lights) {
    console.log(`💡 Updating Light: ${light.name} (ID: ${light.id}) - first config`);
    const success = await hue.setLight(
      light.id,
      light.xyColor,
      light.isOn,
      light.brightness,
      light.dynamics.duration
    );
    console.log(success ? `✅ Updated ${light.name}` : `❌ Failed to update ${light.name}`);
  }

  console.log("🔄 Applying second configuration...");
  // For the second configuration, update power first then (if on) update color/brightness.
  for (const light of secondConfig.lights) {
    console.log(`💡 Updating Light: ${light.name} (ID: ${light.id}) - second config`);

    // Update power state.
    const powerSuccess = await hue.setLightPower(light.id, light.isOn);
    console.log(powerSuccess ? `✅ Power updated for ${light.name}` : `❌ Power update failed for ${light.name}`);

    // If the light should be on, update its color and brightness.
    if (light.isOn) {
      const colorSuccess = await hue.setLight(
        light.id,
        light.xyColor,
        light.isOn,
        light.brightness,
        light.dynamics.duration
      );
      console.log(colorSuccess ? `✅ Color updated for ${light.name}` : `❌ Color update failed for ${light.name}`);
    }
  }
};

main().catch((error) => {
  console.error("❌ Error occurred:", error);
});
