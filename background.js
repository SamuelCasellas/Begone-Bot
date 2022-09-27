importScripts("ExtPay.js");
const extpay = ExtPay("begone-bot");
extpay.startBackground();

const millisecondsInOneDay = 86400000;

const t = (timeTrialStartedAt) => {
  return new Date().getTime() - timeTrialStartedAt > millisecondsInOneDay * 3;
};

const p = (q=false) => {
  if (q) {
    chrome.storage.sync.set({w: true});
  }
  chrome.storage.sync.set({x: true});
};

const l = () => {
  chrome.storage.sync.get(["z"], function(val) {
    if (!val.z) {
      chrome.storage.sync.set({z: true});
      extpay.openTrialPage("3-day (IMPORTANT: After starting trial, please be sure to allow one minute and refresh any pages already open.)");
    }
  });
};

const r = () => {
  chrome.storage.sync.get(["v"], function(val) {
    if (!val.v) {
      chrome.storage.sync.set({v: true});
      extpay.openPaymentPage();
    }
  });
};

extpay.getUser().then(user => {
  if (user.paid) {
    p(true);
  } else {
    if (!user.trialStartedAt) {
      l();
    }
    else if (t(user.trialStartedAt.getTime())) {
      chrome.storage.sync.set({x: false});
      r();
    } else {
      p();
    }
  }
});

extpay.onPaid.addListener(user => {
  chrome.alarms.clearAll();
  p(true);
});

extpay.onTrialStarted.addListener(user => {
  p();
});

chrome.storage.sync.get(["w"], function(val) {
  if (!val.w) chrome.alarms.create({ delayInMinutes: 1 });
});
  
chrome.alarms.onAlarm.addListener(() => {
  chrome.alarms.create({ delayInMinutes: 1 });
});