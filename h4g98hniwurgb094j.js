const script = (function (paid=false) {
  /*
  Layouts:

  commentArchive: {
    "COMMENT_DATA": [firstNodeLocation, "x2"], // If commentArchive[comment].length >= 2, add to botArchive
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
        if (this.size > 99) {
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

  const promotions = [
    "<span>\n\nQuick notice from creator: Looking to make some easy money online? Click on the following link to get started!\n\
    <a href=\"https://www.swagbucks.com/p/register?rb=127459126\" target=\"_blank\" rel=\"noopener noreferrer\">https://www.swagbucks.com/p/register?rb=127459126</a></span>",
    
    "<span>\n\nQuick notice from creator: Looking to make some easy money online? Click on the following link to get started!\n\
    <a href=\"https://www.prizerebel.com/index.php?r=13177620\" target=\"_blank\" rel=\"noopener noreferrer\">https://www.prizerebel.com/index.php?r=13177620</a></span>",
    
    "<span>\n\nCreator Notice: Looking for more meaning in life? Check this out for answers.\n\
    <a href=\"https://www.comeuntochrist.org/\" target=\"_blank\" rel=\"noopener noreferrer\">https://www.ComeUntoChrist.org/</a></span>"
  ];
  
  const textColor = getComputedStyle(document.body).getPropertyValue("--yt-live-chat-primary-text-color");

  // CLEAR CACHES FOR NEW PAGE LOAD
  let currentUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== currentUrl) {
      currentUrl = location.href;
      commentsLoaded = false;
      commentQueue.reset();
      for (let key in commentArchive) delete commentArchive[key];
      // keep botArchive: these comments have been seen 3 or more times.
      // grabCommentsContainer();
    }
  }).observe(document.head, {childList: true, subtree: true});

  let commentsLoaded = false;
  let commentQueue = new LinkedList;
  let commentArchive = new Object;
  let botArchive = new Set;
  
  // Set up main mutation observer after comments div has loaded in background 

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
      } catch (e) {
        console.log("Is this error preventing something?", e);
      }
    }).observe(document.getElementById("comments"), {subtree: true, childList: true});
  }, 750);

  // Step 1 helper functions
  const setupCommentSettingELs = () => {
    commentsLoaded = true;
    let dropdowns = document.getElementsByClassName("dropdown-content");
    let commentDropdown = dropdowns[dropdowns.length-1];
    commentDropdown.children[0].addEventListener("click", commentSettingEvList);
    commentDropdown.children[1].addEventListener("click", commentSettingEvList);
  };
  const commentSettingEvList = () => {
    let parent = document.getElementById("comments").lastElementChild.children[2];
    while (parent.hasChildNodes()) {
      parent.removeChild(parent.firstChild);
    }
    commentQueue.reset();
    commentArchive = new Object;
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

  const parseChannelName = (channelNameContainer) => {
    let channelName = channelNameContainer.textContent.toLowerCase();
    // console.log("Channel Name", channelName); // USEFUL
    if (channelName.includes("channe")
    || channelName.includes("subs")
    || channelName.includes("touch")
    || channelName.includes("profile")
    || channelName.includes("vlog")
    || channelName.includes("check")
    || channelName.includes("ck me")
    || channelName.includes("sex")
    || channelName.includes("s]ex")
    || channelName.includes("text")
    || channelName.includes("🔞")
    || channelName.includes("🍆")
    || channelName.includes("🔥")
    || channelName.includes("👈")
    || channelName.includes("👉")
    || channelName.includes("telegram")
    || channelName.includes("tsapp")
    || channelName.includes("@")
    || channelName.includes("①")
    || channelName.includes("𝟙")) { 
      // x6 for channel names
      console.log("🚨[DETECTION]channel name was flagged", channelName);
      modifyContanimatedContainer(channelNameContainer.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement, "Bot");
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
        : wholeComment += child.innerText.slice(0,50);
        childrenCount++;
      }

      let commentContainer = textNode.parentElement.parentElement.parentElement.parentElement.parentElement;
      
      // console.log("Comment:", wholeComment); // Useful
      
      // Put common bot sayings here
      if (wholeComment.includes("Can we all just appreciate the")) {
        console.log("🚨TYPICAL BOT COMMENT", wholeComment);
        modifyContanimatedContainer(commentContainer, "Bot");
      } else if (commentArchive[wholeComment]) {
        console.log("🚨COMMENT NOT UNIQUE", wholeComment);
        if (!botArchive.has(wholeComment)) {
          commentArchive[wholeComment].length >= 2
          // Third sighting; add to botArchive
          ? botArchive.add(wholeComment) 
          // Second sighting; delete first occurence as well.
          : (modifyContanimatedContainer(commentArchive[wholeComment][0], "Repetitive"), 
          commentArchive[wholeComment].push("x2"));
        }
        modifyContanimatedContainer(commentContainer, "Repetitive");
      } else if (botArchive.has(wholeComment)) {
        console.log("🚨🚨🚨SEEN MORE THAN 2X", wholeComment);
        modifyContanimatedContainer(commentContainer, "Repetitive");
      } else {
        commentArchive[wholeComment] = [commentContainer];
        let oldComment = commentQueue.addNode(wholeComment);
        if (oldComment)
          delete commentArchive[oldComment];
      }
    } catch (error) {
      console.log("MY ERROR", error);
    }
  };

  // Step 4: Replace the whole comment container
  const modifyContanimatedContainer = (container, commentType) => {
    let parentElement;
    container.parentElement.id === "contents"
    ? parentElement = container
    : parentElement = container.parentElement;
    // let parentElement = container[0];
    console.log("Trying to purify this container", parentElement, "for", container);
    try {
      while (parentElement.firstElementChild !== null) {
        parentElement.removeChild(parentElement.firstElementChild);
      }
    } catch (e) {}
    finally {
      let botCommentDiv = document.createElement("span");
      let message = `[${commentType} comment removed]`;
      if (paid) {
        if (Math.random() < 0.005) {
          message += promotions[Math.floor(Math.random() * 2)];
        }
        else if (Math.random() < 0.0001) {
          message += promotions[2];
        }
      }
      botCommentDiv.innerHTML = message;
      botCommentDiv.style = `color: ${textColor}; font-size: 14px; font-style: italic;`;
      parentElement.appendChild(botCommentDiv);
    }
  }
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
