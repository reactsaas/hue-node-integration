import { HueIntegration } from "../../dist/index.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class RateLimiter {
  constructor(maxCalls, windowMs) {
    this.maxCalls = maxCalls;
    this.windowMs = windowMs;
    this.callTimes = [];
    this.logged = false;
  }

  async schedule(fn) {
    const now = Date.now();
    // Remove timestamps older than the window.
    this.callTimes = this.callTimes.filter((t) => now - t < this.windowMs);
    if (this.callTimes.length >= this.maxCalls) {
      if (!this.logged) {
        const oldest = this.callTimes[0];
        const waitTime = this.windowMs - (now - oldest);
        console.log(
          `Rate limiter: reached ${this.maxCalls} calls in the last ${this.windowMs}ms. Waiting for ${waitTime}ms before next call.`
        );
        this.logged = true;
      }
      const oldest = this.callTimes[0];
      const waitTime = this.windowMs - (now - oldest);
      await sleep(waitTime);
    } else {
      if (this.callTimes.length < this.maxCalls) {
        this.logged = false;
      }
    }
    this.callTimes.push(Date.now());
    return await fn();
  }
}

// Create a global rate limiter instance: 2 calls per 250ms.
const rateLimiter = new RateLimiter(2, 250);

// First configuration for the lights
const firstConfig = {
  lights: [
    {
      id: "c355f54d-1492-42a9-b145-a4256a097105",
      name: "TV",
      type: "light",
      isOn: true,
      brightness: 23,
      xyColor: { x: 0.5834, y: 0.3986 },
      dynamics: { duration: 1000 },
      hexColor: "#cd7700NaN",
      isGradient: false,
    },
    {
      id: "73c5e5ab-4525-41b5-8667-69f837b7b074",
      name: "Hue play 1",
      type: "light",
      isOn: false,
      brightness: 79.84,
      xyColor: { x: 0.4951, y: 0.4565 },
      dynamics: { duration: 1000 },
      hexColor: "#FFD030",
      isGradient: false,
    },
    {
      id: "06284684-6903-4f31-a338-7db101dffcbe",
      name: "Hue play 2",
      type: "light",
      isOn: false,
      brightness: 100,
      xyColor: { x: 0.4954, y: 0.4569 },
      dynamics: { duration: 1000 },
      hexColor: "#FFD02F",
      isGradient: false,
    },
    {
      id: "4aeb0d48-92c8-44e1-b940-d1309b4d450f",
      name: "Altes Licht",
      type: "light",
      isOn: false,
      brightness: 71.15,
      xyColor: { x: 0.5324, y: 0.4401 },
      dynamics: { duration: 1000 },
      hexColor: "#FFBA09",
      isGradient: false,
    },
  ],
};

// Second configuration for the lights
const secondConfig = {
  lights: [
    {
      id: "73c5e5ab-4525-41b5-8667-69f837b7b074",
      name: "Hue play 1",
      type: "light",
      isOn: true,
      brightness: 60,
      xyColor: { x: 0.5724, y: 0.4079 },
      dynamics: { duration: 1000 },
      hexColor: "#875100NaN",
      isGradient: false,
    },
    {
      id: "06284684-6903-4f31-a338-7db101dffcbe",
      name: "Hue play 2",
      type: "light",
      isOn: true,
      brightness: 60,
      xyColor: { x: 0.5666, y: 0.4128 },
      dynamics: { duration: 1000 },
      hexColor: "#8e5800NaN",
      isGradient: false,
    },
    {
      id: "c355f54d-1492-42a9-b145-a4256a097105",
      name: "TV",
      type: "light",
      isOn: false,
      brightness: 30.04,
      xyColor: { x: 0.5316, y: 0.4286 },
      dynamics: { duration: 1000 },
      hexColor: "#BC851B",
      isGradient: false,
    },
    {
      id: "30d27db7-6476-434b-a24e-733922817205",
      name: "Hue gradient lightstrip 1",
      type: "light",
      isOn: true,
      brightness: 100,
      xyColor: { x: 0.5679, y: 0.4108 },
      dynamics: { duration: 1000 },
      hexColor: "#6b4001NaN",
      isGradient: false,
    },
    {
      id: "4aeb0d48-92c8-44e1-b940-d1309b4d450f",
      name: "Altes Licht",
      type: "light",
      isOn: false,
      brightness: 71,
      xyColor: { x: 0.5646, y: 0.4131 },
      dynamics: { duration: 1000 },
      hexColor: "#db8b05NaN",
      isGradient: false,
    },
  ],
  rooms: [],
  scenes: [],
};

const main = async () => {
  // Replace with your actual API key if needed.
  const hue = new HueIntegration("Y3upVNys0bwYwTCC20KipdZYvWaks5fioS8xiOHu");

  console.log("🔄 Applying first configuration...");
  for (const light of firstConfig.lights) {
    console.log(`💡 Updating Light: ${light.name} (${light.id}) - first config`);
    const success = await rateLimiter.schedule(() =>
      hue.setLight(
        light.id,
        light.xyColor,
        light.isOn,
        light.brightness,
        light.dynamics.duration
      )
    );
    console.log(success ? `✅ Updated ${light.name}` : `❌ Failed to update ${light.name}`);
  }

  console.log("🔄 Applying second configuration...");
  for (const light of secondConfig.lights) {
    console.log(`💡 Updating Light: ${light.name} (${light.id}) - second config`);
    const success = await rateLimiter.schedule(() =>
      hue.setLight(
        light.id,
        light.xyColor,
        light.isOn,
        light.brightness,
        light.dynamics.duration
      )
    );
    console.log(success ? `✅ Updated ${light.name}` : `❌ Failed to update ${light.name}`);
  }
};

main().catch((error) => {
  console.error("❌ Error occurred:", error);
});
