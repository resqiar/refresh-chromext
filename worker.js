const TARGET_URL = "http://localhost:3000";
const INTERVAL_TIME = 5000;

chrome.runtime.onInstalled.addListener(async () => {
    await chrome.storage.local.set({
        enabled: "OFF",
    });
    await chrome.action.setBadgeText({
        text: "OFF",
    })
})

chrome.tabs.onUpdated.addListener(async () => {
    const { enabled } = await chrome.storage.local.get(["enabled"]);
    await chrome.action.setBadgeText({ text: enabled });
})

chrome.action.onClicked.addListener(startJob);

async function startJob(tab) {
    if (tab.url.startsWith(TARGET_URL)) {
        const { enabled } = await chrome.storage.local.get(["enabled"]);
        const next = enabled === "ON" ? "OFF" : "ON";

        await chrome.storage.local.set({ enabled: next });
        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: next,
        });

        if (next === "OFF") {
            return clearAlarm();
        }

        setAlarm(tab.id);
    }
}

let intervalId;

function setAlarm(id) {
    intervalId = setInterval(async () => {
        await chrome.tabs.reload(id);
    }, INTERVAL_TIME);
}

async function clearAlarm() {
    if (!intervalId) return;
    clearInterval(intervalId);
}
