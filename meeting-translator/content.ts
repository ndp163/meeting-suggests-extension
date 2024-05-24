import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ["https://meet.google.com/*-*-*"],
  all_frames: true
}
console.log("OKE");
chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    console.log({ msg });
    if (msg.command === "detectTalking")  {
      observeParticipants();
      setInterval(detectTalking, 1000);
    }
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.command === "getParticipantTalking") {
      const participant = getParticipantTalking();
      sendResponse(participant);
    }
  }
);

const participants = {};

const observer = new MutationObserver(function(mutations) {
  try {
    mutations.forEach(function(mutation) {
      const el: any = mutation.target;
      console.log({ mutation });
      // Only act if there really was a change
      // I don't think I should have to do this, but here we are
      if (mutation.oldValue===el.className) { return; }
      if (el.className.split(" ").length < 5) { return; }

      let id = el.getAttribute('talk-id');

      if (!id) {
        let item = parentElement(el, 'div[role="listitem"]');
        if (item) {
          id = item.getAttribute('data-participant-id');
          el.setAttribute('talk-id', id);
        }
      }

      const record = participants[id];

      const now = Date.now();
      if (record.talking === false) {
        record.last_start = now;
        record.talking = true;
      }
      if (record.last_end < now) {
        record.last_end = now;
      }
    });
  } catch(e) {
    console.log(e);
  }
});

function getParticipantInfo(element) {
  return {
    id: element.getAttribute('data-participant-id'),
    last_start: 0,
    last_end: 0,
    talking: false,
    name: element.querySelector("span").innerText,
    avatar: element.querySelector("img").getAttribute("src"),
  }
}

function parentElement(el, selector) {
  if (el.matches && el.matches(selector)) { return el; }
  if (el.parentNode) { return parentElement(el.parentNode,selector); }
  return null;
}

function observeParticipants() {
  const parentElement = document.querySelector('div[role="list"]');
  for (const element of parentElement.querySelectorAll('div[role="listitem"]')) {
    const participant = getParticipantInfo(element);
    participants[participant.id] = participant;
  }

  if (!parentElement) {
    console.log("List participants is not exist");
    return;
  }
  observer.observe(parentElement, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['class'],
    subtree: true,
  });
}

function detectTalking() {
  for (const id in participants) {
    const record = participants[id];
    const now = Date.now();
    console.log(record.name);
    console.log(now -record.last_end);
    if (now - record.last_end > 2000) {
      record.talking = false;
    }
  }
}

function getParticipantTalking() {
  let speaker = null;
  for (const id in participants) {
    const record = participants[id];
    if (record.talking && (speaker === null || record.last_start < speaker.last_start)) {
      speaker = record;
    }
  }
  return speaker;
}