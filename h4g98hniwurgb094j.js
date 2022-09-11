
const script = (function () {
  'use strict';

  const textColor = getComputedStyle(document.body).getPropertyValue("--text-primary-color");

  findBotComments(document.body);
  
  let currentUrl = location.href;
  const newTextMO = new MutationObserver((mutations) => {
    if (location.href !== currentUrl) {
      currentUrl = location.href;
      setTimeout(() => {
        findBotComments(document.body);
      }, 3000);
    }
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach(findBotComments);
    });
  });

  newTextMO.observe(
    document.body,  
    { 
      subtree: true,
      childList: true // Look for any additions of child nodes
      
    }
  );

  function findBotComments(node) {
    if (node.hasChildNodes()) {
      node.childNodes.forEach(findBotComments); // Dig deeper in the DOM
    } 
    else if (node.nodeType === Text.TEXT_NODE) {
      replaceText(node);
    }
  }

  const modifyContanimatedContainer = (container) => {
    let parentElement = container.parentElement;
    try {
      while (parentElement.firstElementChild !== null) {
        parentElement.removeChild(parentElement.firstElementChild);
      }
    } catch (e) {}
    finally {
      let botCommentDiv = document.createElement("span");
      botCommentDiv.innerHTML = "(Bot comment removed)";
      botCommentDiv.style = `color: ${textColor}; font-size: 16px; font-style: italic;`;
      parentElement.appendChild(botCommentDiv);
    }
  }

  function replaceText(textNode) {
    try {
      if (textNode.parentElement.tagName === "A") {
        // Search channel title
        if (textNode.parentElement.id === "author-text") {
          let lowerCaseText = textNode.nextElementSibling.textContent.toLowerCase();
          if (lowerCaseText.includes("channe")
          || lowerCaseText.includes("sub")
          || lowerCaseText.includes("touch")
          || lowerCaseText.includes("ck me")
          || lowerCaseText.includes("sex")
          || lowerCaseText.includes("s]ex")
          || lowerCaseText.includes("🔞")
          || lowerCaseText.includes("🍆")
          || lowerCaseText.includes("🔥")) { 
            modifyContanimatedContainer(textNode.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);
          }
        }
        // Search content of comment itself
        // Remove any comments with links (unless it's a response, hashtag, or a time stamp)
        else if (textNode.parentElement.parentElement.id === "content-text") {
          // RegExp for filtering out timestamps
          if (!(textNode.textContent.includes("@") 
          || textNode.textContent.includes("#") 
          || /([0-9]:[0-9])/.test(textNode.textContent))) {
            try {
              // Check to see if pinned.
              if (window.getComputedStyle(textNode.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild).display === "none") {
                modifyContanimatedContainer(textNode.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);
              }
            } catch (e) {
              modifyContanimatedContainer(textNode.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);
            }
          }
        }
      }
    } catch (e) {}
  }
});

chrome.storage.sync.get(["authenticated"], function(result) {
  if (result.authenticated) {
    script();
  }
});
