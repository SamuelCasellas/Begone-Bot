importScripts("ExtPay.js");
const extpay = ExtPay('begone-bot');
extpay.startBackground();

const millisecondsInOneDay = 86400000;

const trialTimeOut = (timeTrialStartedAt) => {
  return new Date().getTime() - timeTrialStartedAt > millisecondsInOneDay * 3
};

const authenticateUser = (paidFor=false) => {
  if (paidFor) {
    chrome.storage.sync.set({paid: true});
  }
  chrome.storage.sync.set({authenticated: true});
};

const showTrialPageLogic = () => {
  chrome.storage.sync.get(["shownTrialPage"], function(val) {
    if (!val.shownTrialPage) {
      chrome.storage.sync.set({shownTrialPage: true});
      extpay.openTrialPage("3-day (IMPORTANT: After starting trial, please be sure to allow one minute and refresh any pages already open.)");
    }
  });
};

const showPaymentPageLogic = () => {
  chrome.storage.sync.get(["shownPaymentPage"], function(val) {
    if (!val.shownPaymentPage) {
      chrome.storage.sync.set({shownPaymentPage: true});
      extpay.openPaymentPage();
    }
  });
};

extpay.getUser().then(user => {
  if (user.paid) {
    authenticateUser(true);
  } else {
    if (!user.trialStartedAt) {
      showTrialPageLogic();
    }
    else if (trialTimeOut(user.trialStartedAt.getTime())) {
      chrome.storage.sync.set({authenticated: false});
      showPaymentPageLogic();
    } else {
      authenticateUser();
    }
  }
});

extpay.onPaid.addListener(user => {
  chrome.alarms.clearAll();
  authenticateUser(true);
});

extpay.onTrialStarted.addListener(user => {
  chrome.storage.sync.set({trialStarted: user.trialStartedAt.getTime()});
  authenticateUser();
});

chrome.storage.sync.get(["paid"], function(val) {
  if (!val.paid) chrome.alarms.create({ delayInMinutes: 1 });
});
  
chrome.alarms.onAlarm.addListener(() => {
  chrome.alarms.create({ delayInMinutes: 1 });
});