
importScripts("ExtPay.js");
const extpay = ExtPay('begone-bot')
extpay.startBackground();

const millisecondsInOneDay = 86400000;

const authenticateUser = (paidFor=false) => {
  if (paidFor) {
    chrome.storage.sync.set({paid: true});
  }
  chrome.storage.sync.set({authenticated: true});
};

extpay.getUser().then(user => {
  if (user.paid) {
    authenticateUser(true);
  } else {
    if (!user.trialStartedAt) {
      extpay.openTrialPage("3-day (IMPORTANT: After starting trial, please be sure to allow one minute and refresh any pages already open.)");
    }
    else if (new Date().getTime() - user.trialStartedAt.getTime() > millisecondsInOneDay * 3) {
      chrome.storage.sync.set({authenticated: false});
      extpay.openPaymentPage();
    } else {
      authenticateUser();
    }
  }
}); 

extpay.onPaid.addListener(user => {
  authenticateUser(true);
});

extpay.onTrialStarted.addListener(user => {
  authenticateUser();
});
