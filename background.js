
importScripts("ExtPay.js");
const extpay = ExtPay('begone-bot')
extpay.startBackground();

const millisecondsInOneDay = 86400000;

const authenticateUser = () => {
  chrome.storage.sync.set({authenticated: true});
};

extpay.getUser().then(user => {
  if (user.paid) {
    console.log("User paid on: ", user.paidAt)
    console.log("You are enabled into the system.");
    authenticateUser();
  } else {
    if (!user.trialStartedAt) {
      console.log("Start a three day trial.");
      extpay.openTrialPage("3-day (IMPORTANT: After starting trial, please be sure to allow one minute and refresh any pages already open.)");
    }
    else if (new Date().getTime() - user.trialStartedAt.getTime() > millisecondsInOneDay * 3) {
      console.log("Trail expired");
      chrome.storage.sync.set({authenticated: false});
      extpay.openPaymentPage().catch((rej) => {
        console.log(rej, "Something went wrong with the network.");
      });
    } else {
      console.log("Trial is still going.");
      authenticateUser();
    }
  }
}).catch((rej) => {
  console.log(rej, "Something went wrong with the network.");
}); 

extpay.onPaid.addListener(user => {
  console.log("Service just paid.");
  authenticateUser();
});

extpay.onTrialStarted.addListener(user => {
  console.log("Trial started.");
  authenticateUser();
});
