// import io from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const ORIGIN = 'https://meet.google.com';

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);

  if (url.origin === ORIGIN) {
    await chrome.sidePanel.setOptions({
      tabId: tab.id,
      path: '../../sidepanel.html',
      enabled: true
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId: tab.id,
      enabled: false
    });
  }
});
