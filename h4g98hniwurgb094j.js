const script = (function (paid=false) {
  /*
  Layouts:

  commentArchive: {
    "COMMENT_DATA": [firstNodeLocation],
    ...
  }

  botArchive: {
    "COMMENT_DATA",
    ...
  }
  */
  class ListNode {
    constructor(data) {
      this.data = data;
      this.next = null;
    }
  }

  class LinkedList {
    constructor(firstNodeData=null) {
      if (firstNodeData) {
        this.head = this.tail = new ListNode(firstNodeData);
        this.size = 1;
      } else {
        this.head = this.tail = null;
        this.size = 0;
      }
    }

    reset() {
      this.head = this.tail = null;
      this.size = 0;
    }

    addNode(nodeData) {
      /* Automatically kick off any old comments after 100 comments is reached.
      */
      let newNode = new ListNode(nodeData);
      if (!this.head) {
        this.head = this.tail = newNode;
        this.size++;
        return null;
      } else {
        let origTail = this.tail;
        this.tail = newNode;
        origTail.next = newNode;
        if (this.size > 199) {
          let origHead = this.head;
          this.head = this.head.next;
          return origHead;
        } else {
          this.size++;
          return null;
        }
      }
    }
  }

  const typicallyFlaggedChannelNamePatterns = [
    "channe",
    "subs",
    "0 video",
    "touch",
    "profile",
    "tap ",
    "vlog",
    "!ve",
    "check",
    "ck me",
    "sex",
    "s]e",
    "hot",
    "text",
    "🔞",
    "🍆",
    "🔥",
    "👈",
    "👉",
    "telegram",
    "tsapp",
    "@",
    "①",
    "𝟙",
    "nora smith"
  ];

  const typicallyFlaggedComments = [
    "Can we all just appreciate the",
    "nigg"
  ];

  const promotions = [
    "<span>\n\nQuick message from the creator: Looking to make some easy money online? Click on the following link to get started!\n\
    <a href=\"https://www.swagbucks.com/p/register?rb=127459126\" target=\"_blank\" rel=\"noopener noreferrer\">https://www.SwagBucks.com/</a></span>",

    "<span>\n\nQuick message from the creator: Looking to make some easy money online? Click on the following link to get started!\n\
    <a href=\"https://www.prizerebel.com/index.php?r=13177620\" target=\"_blank\" rel=\"noopener noreferrer\">https://www.PrizeRebel.com/</a></span>",

    "<span>\n\nMessage from the creator: Looking for more meaning in life? Check this out for answers.\n\
    <a href=\"https://www.comeuntochrist.org/\" target=\"_blank\" rel=\"noopener noreferrer\">https://www.ComeUntoChrist.org/</a></span>"
  ];

  const textColor = getComputedStyle(document.body).getPropertyValue("--yt-live-chat-primary-text-color");

  // CLEAR CACHES FOR NEW PAGE LOAD
  let currentVideoId;
  try {
    currentVideoId = location.href.split("?v=")[1].split("&")[0];
  } catch (e) {
    currentVideoId = null;
  }

  let currentUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== currentUrl) {
      // If the user goes from one video to the home and decides to go back to same vid
      currentUrl = location.href;
      commentArchive = new Object;
      commentQueue.reset();
      // Critical to reload window so corpses of blocked comments from previous 
      // videos don't spill over to other videos
      // Go by video id since playlists will change the index right after changing the url
      // So we want to avoid that infinite refresh state
      try {
        if (location.href.split("?v=")[1].split("&")[0] !== currentVideoId) {
          window.location.reload();
        }
      } catch (e) {}
    }
  }).observe(document, {childList: true, subtree: true});

  let commentsLoaded = false;
  let commentQueue = new LinkedList;
  let commentArchive = new Object;
  let botArchive = new Set;

  // Set up main mutation observer after comments div has loaded in background 
  const setupCommentsContainerMO = () => {
    setTimeout(() => {
      new MutationObserver((mutations) => {
        try {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              // Search channels titles in replies
              if (node.id === "body") {
                parseChannelName(node.children[1].firstElementChild.lastElementChild.firstElementChild.firstElementChild.firstElementChild);
              }
              // All else
              else if ((node.tagName === "YTD-COMMENT-THREAD-RENDERER"
                && node.classList.contains("ytd-item-section-renderer"))
                // Comments will pop up in a node with this id
                || node.id === "content-text") {
                findBotComments(node);
                // Set up event listeners
                if (!commentsLoaded) {
                  setupCommentSettingELs();
                }
              }
            });
          });
        } catch (e) {}
      }).observe(document.getElementById("comments"), {subtree: true, childList: true});
    }, 1000);
  };
 
  // Reload point of entry
  if (currentVideoId)
    console.log("resetting all with video id", currentVideoId);
    setupCommentsContainerMO();

  // Step 1 helper functions
  const setupCommentSettingELs = () => {
    commentsLoaded = true;
    document.addEventListener("click", commentSettingEvList)
  };

  const commentSettingEvList = (e) => {
    let innerText = e.target.innerText;
    if (innerText === "Newest first" || innerText === "Top comments") {
      // This is so the first batch of comments can be detected
      let parent = document.getElementById("comments").lastElementChild.children[2];
      while (parent.hasChildNodes()) {
        parent.removeChild(parent.firstChild);
      }
      commentQueue.reset();
      commentArchive = new Object;
    }
  };

  // Observe for new comments loaded
  const findBotComments = (node) => {
    // Comment content
    if (node.id === "content-text") {
      if (node.childElementCount) {
        // Complex comment, with imgs (emojis) and/or anchors (comments with just one single anchor will go here)
        let containsMaliciousAnchorTag = false;
        for (let child of node.childNodes) {
          if (child.nodeType === Node.ELEMENT_NODE) {
            if (child.tagName === "A") {
              // Remove any comments with links (unless it's a response, hashtag, or a time stamp)
              if (!(child.textContent.includes("@")
                || child.textContent.includes("#")
                || /([0-9]:[0-9])/.test(child.textContent))) {
                containsMaliciousAnchorTag = true;
                break;
              }
            }
          }
        }
        if (containsMaliciousAnchorTag) {
          try {
            // Check to see if pinned.
            if (window.getComputedStyle(node.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild).display === "none") {
              // x7 for complex comments
              console.log("🚨(DETECTION)Detected as a comment unpinned with malicious anchor", node);
              modifyContanimatedContainer(node.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement, "Bot");
            } else {
              console.log("Pinned comment, safe", node);
            }
          } catch (e) {
            console.log("🚨[COULD NOT DETECT IF PINNED] Detected as a comment unpinned with malicious anchor", node);
            modifyContanimatedContainer(node.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement, "Bot");
          }
        } else {
          archiveComment(node);
        }
      } else {
        archiveComment(node);
      }
    }
    else if (node.hasChildNodes()) {
      node.childNodes.forEach(findBotComments); // Dig deeper in the DOM
    }
    else if (node.nodeType === Text.TEXT_NODE) {
      parseMainSectionChannelNames(node);
    }
  };

  const parseMainSectionChannelNames = (textNode) => {
    try {
      if (textNode.parentElement.tagName === "A") {
        // id="author-text" === UNVERIFIED
        // id="name" === VERIFIED
        if (textNode.parentElement.id === "author-text") {
          parseChannelName(textNode.nextElementSibling);
        }
      }
    } catch (e) {}
  };

  const specialCharParser = {
    "а":"a",
    "ɑ":"a",
    "с":"c",
    "ɛ":"e",
    "е":"e",
    "ᴇ":"e",
    "к":"k",
    "м":"m",
    "ɴ":"n",
    "т":"t",
    "р":"p",
    "ɡ":"g",
    "ɢ":"g",
  };

  const parseChannelName = (channelNameContainer) => {
    let channelName = channelNameContainer.textContent.toLowerCase();
    console.log(channelName); // useful!

    // Check for the 55349 special char
    if (channelName.includes(String.fromCharCode(55349))) {
      console.log("🚨[DETECTION]Common special char found", channelName);
      // x6 for channel names
      modifyContanimatedContainer(channelNameContainer.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement, "Bot");
      return;
    }

    for (let char in specialCharParser) {
      let regex = new RegExp(char, "gi");
      channelName = channelName.replace(regex, specialCharParser[char]);
    }

    for (let pattern of typicallyFlaggedChannelNamePatterns) {
      if (channelName.includes(pattern)) {
        console.log("🚨[DETECTION]channel name was flagged", channelName);
        // x6 for channel names
        modifyContanimatedContainer(channelNameContainer.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement, "Bot");
        break;
      }
    }
  };

  const archiveComment = (textNode) => {
    // Check to see if this exact comment has been seen before
    let wholeComment = new String;
    let childrenCount = 0;
    try {
      for (let child of textNode.parentElement.parentElement.children) {
        if (childrenCount >= 3) {
          break; // Don't clog with comments of massive size
        }
        child.tagName === "IMG"
          ? wholeComment += child.alt
          : wholeComment += child.innerText;
        childrenCount++;
      }

      let commentContainer = textNode.parentElement.parentElement.parentElement.parentElement.parentElement;

      for (let char in specialCharParser) {
        let regex = new RegExp(char, "gi");
        wholeComment = wholeComment.replace(regex, specialCharParser[char]);
      }
      
      // console.log(wholeComment) // useful!

      // Put common bot sayings here

      for (let comment of typicallyFlaggedComments) {
        if (wholeComment.includes(comment)) {
          console.log("🚨TYPICAL BOT COMMENT", wholeComment);
          modifyContanimatedContainer(commentContainer, "Bot");
          return;
        }
      }
      if (commentArchive[wholeComment]) {
        console.log("🚨COMMENT NOT UNIQUE", wholeComment);
        if (!botArchive.has(wholeComment)) {
          botArchive.add(wholeComment);
          modifyContanimatedContainer(commentArchive[wholeComment], "Repetitive");
        }
        modifyContanimatedContainer(commentContainer, "Repetitive");
      } else if (botArchive.has(wholeComment)) {
        console.log("🚨🚨🚨SEEN MORE THAN 2X", wholeComment);
        modifyContanimatedContainer(commentContainer, "Repetitive");
      } else {
        commentArchive[wholeComment] = commentContainer;
        let oldComment = commentQueue.addNode(wholeComment);
        if (oldComment)
          delete commentArchive[oldComment];
      }
    } catch (e) {}
  };

  // Step 4: Replace the whole comment container
  const modifyContanimatedContainer = (container, commentType) => {
    let parentElement;
    container.parentElement.id === "contents"
      ? parentElement = container
      : parentElement = container.parentElement;
    try {
      while (parentElement.firstElementChild !== null) {
        parentElement.removeChild(parentElement.firstElementChild);
      }
    } catch (e) {}
    finally {
      let botCommentDiv = document.createElement("span");
      let message = `[${commentType} comment removed]`;
      if (paid) {
        if (Math.random() > 0.995) {
          message += promotions[Math.floor(Math.random() * 2)];
        }
        else if (Math.random() > 0.9999) {
          message += promotions[2];
        }
      }
      botCommentDiv.innerHTML = message;
      botCommentDiv.style = `color: ${textColor}; font-size: 14px; font-style: italic; font-weight: normal;`;
      parentElement.appendChild(botCommentDiv);
    }
  };
});

chrome.storage.sync.get(["authenticated"], function(result) {
  if (result.authenticated) {
    chrome.storage.sync.get(["paid"], function(result1) {
      result1.paid
      ? script(true)
      : script();
    });
  }
});
