"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectBridge = connectBridge;
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
async function connectBridge(appName, bridgeIp) {
    console.log(`🛑 Press the button on your Hue Bridge to proceed...`);
    const maxRetries = 30;
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const response = await axios_1.default.post(`https://${bridgeIp}/api`, { devicetype: appName || "my-hue-app" }, {
                httpsAgent: new https_1.default.Agent({
                    rejectUnauthorized: false, // Ignore self-signed certificates
                }),
            });
            console.log("🔍 Full response from Hue Bridge:", response.data);
            if (response.data[0]?.success) {
                const username = response.data[0].success.username;
                console.log(`✅ Successfully registered with API Key: ${username}`);
                return username;
            }
            if (response.data[0]?.error?.type === 101) {
                console.log(`⏳ Waiting for button press... (${retries + 1}/${maxRetries})`);
                retries++;
                await new Promise((resolve) => setTimeout(resolve, 2000));
                continue;
            }
        }
        catch (err) {
            console.error("❌ Request failed:", err.message);
            throw err;
        }
    }
    throw new Error("❌ Failed to register after 30 attempts.");
}
//# sourceMappingURL=connectBridge.js.map