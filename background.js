importScripts("ExtPay.js");
const bod = ExtPay("begone-bot");
bod.startBackground();

const abc = 86400000;

const t = (om) => new Date().getTime() - om > abc * 3;

const p = (q=false) => {
  if (q) {
    chrome.storage.sync.set({w: true});
  }
  chrome.storage.sync.set({x: true});
};

bod.getUser().then(user => {
  if (user.paid) {
    p(true);
  } else {
    if (!user.trialStartedAt) {
      bod.openTrialPage("3-day (IMPORTANT: After starting trial, please be sure to allow one minute and refresh any pages already open.)");
    }
    else if (t(user.trialStartedAt.getTime())) {
      chrome.storage.sync.set({x: false});
      bod.openPaymentPage();
    } else {
      p();
    }
  }
});

bod.onPaid.addListener(user => {
  p(true);
});

bod.onTrialStarted.addListener(user => {
  p();
});