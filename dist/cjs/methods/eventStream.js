"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startEventStream = void 0;
const https_1 = __importDefault(require("https"));
const startEventStream = (bridgeIp, apiKey, onMessage, onError) => {
    const url = `/eventstream/clip/v2`;
    console.log(`📡 Connecting to EventStream at https://${bridgeIp}${url}...`);
    let isClosed = false;
    let buffer = "";
    // HTTPS request options
    const options = {
        hostname: bridgeIp,
        path: url,
        method: "GET",
        headers: {
            "hue-application-key": apiKey,
            "Accept": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
        rejectUnauthorized: false, // Ignore self-signed certificates
    };
    const req = https_1.default.request(options, (res) => {
        console.log("✅ EventStream connected successfully.");
        res.on("data", (chunk) => {
            if (isClosed)
                return;
            // Append incoming data to buffer
            buffer += chunk.toString();
            // Split buffer by newline (SSE messages are newline-separated)
            const lines = buffer.split("\n");
            let eventType = "unknown"; // Store `event:` value
            let eventId = "unknown"; // Store `id:` value
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith("event:")) {
                    eventType = trimmedLine.replace("event:", "").trim();
                }
                if (trimmedLine.startsWith("id:")) {
                    eventId = trimmedLine.replace("id:", "").trim();
                }
                if (trimmedLine.startsWith("data:")) {
                    const jsonString = trimmedLine.replace("data:", "").trim();
                    try {
                        const parsedData = JSON.parse(jsonString);
                        // ✅ Handle **multiple** events in a single batch properly
                        if (Array.isArray(parsedData)) {
                            parsedData.forEach((event) => {
                                onMessage({ eventType, eventId, event });
                            });
                        }
                        else {
                            onMessage({ eventType, eventId, parsedData });
                        }
                    }
                    catch (err) {
                        console.error("❌ Error parsing event data:", err);
                    }
                }
            }
            // Keep last partial event in buffer
            buffer = lines[lines.length - 1];
        });
        res.on("end", () => {
            console.log("🔌 EventStream ended. Reconnecting...");
            if (!isClosed) {
                setTimeout(() => (0, exports.startEventStream)(bridgeIp, apiKey, onMessage, onError), 2000);
            }
        });
        res.on("error", (error) => {
            console.error("❌ Error in EventStream:", error);
            if (onError)
                onError(error);
        });
    });
    req.on("error", (error) => {
        console.error("❌ Failed to connect to EventStream:", error);
        if (onError)
            onError(error);
        // Retry connection
        if (!isClosed) {
            setTimeout(() => (0, exports.startEventStream)(bridgeIp, apiKey, onMessage, onError), 2000);
        }
    });
    req.end();
    // Return object with a `close` method
    return {
        close: () => {
            isClosed = true;
            req.destroy();
            console.log("🔌 EventStream connection closed.");
        },
    };
};
exports.startEventStream = startEventStream;
//# sourceMappingURL=eventStream.js.map