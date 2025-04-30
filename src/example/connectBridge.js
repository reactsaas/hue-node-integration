import { HueIntegration } from "../../dist/index.js";  // adjust path to your built module

const main = async () => {
  const bridgeIp = '192.168.1.105';      // replace with your actual Bridge IP
  const appName  = 'test-electron-app';  // your application identifier

  try {
    console.log('🔗 Starting Hue Bridge registration test...');

    // Instantiate without API key for initial registration
    const hue = new HueIntegration('', bridgeIp);

    // connectBridge now returns both username and clientkey
    const { username, clientkey } = await hue.connectBridge(appName);

    console.log('✅ Registration succeeded!');
    console.log(`• Username   : ${username}`);
    console.log(`• Client Key : ${clientkey}`);
  } catch (error) {
    console.error('❌ Error during registration test:', error);
  }
};

main();