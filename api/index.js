const cron = require('node-cron');
const speedTest = require('speedtest-net');
const axios = require('axios');

let notifications = [];
let lastSpeed = null;

const SPEED_THRESHOLD = 9;
const CHECK_INTERVAL_MINUTES = 1;

async function checkSpeed() {
  try {
    const test = await speedTest({ acceptLicense: true });
    const downloadSpeedMbps = test.download.bandwidth / (1024 * 1024) * 8;

    console.log(`Download Speed: ${downloadSpeedMbps.toFixed(2)} Mbps`);
    lastSpeed = downloadSpeedMbps;

    if (downloadSpeedMbps < SPEED_THRESHOLD) {
      const message = `Internet speed is below threshold: ${downloadSpeedMbps.toFixed(2)} Mbps`;
      await sendNotification(downloadSpeedMbps);
      notifications.push({ message, timestamp: new Date() });
    }
  } catch (error) {
    console.error('Error checking speed:', error);
  }
}

async function sendNotification(downloadSpeed) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  const message = `Internet speed is below threshold: ${downloadSpeed.toFixed(2)} Mbps`;

  try {
    await axios.post(webhookUrl, {
      text: message,
    });
    console.log('Notification sent:', message);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

cron.schedule(`*/${CHECK_INTERVAL_MINUTES} * * * *`, checkSpeed);
checkSpeed();

module.exports = (req, res) => {
  res.json({ lastSpeed, notifications });
};
