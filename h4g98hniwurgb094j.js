/* © 2022 Samuel Casellas All rights reserved | Follow me on LinkedIn: https://www.linkedin.com/in/samuel-casellas-a9b390208/ | Mangler command used: terser FILE -c -m --mangle-props regex=/_$/ */const script=function(t=!1){class e{constructor(t){this.data=t,this.next=null}}const n=['<span>\n\nQuick message from creator: Looking to make some easy money online? Click on the following link to get started!\n    <a href="https://www.swagbucks.com/p/register?rb=127459126" target="_blank" rel="noopener noreferrer">https://www.SwagBucks.com/</a></span>','<span>\n\nQuick message from creator: Looking to make some easy money online? Click on the following link to get started!\n    <a href="https://www.prizerebel.com/index.php?r=13177620" target="_blank" rel="noopener noreferrer">https://www.PrizeRebel.com/</a></span>','<span>\n\nMessage from the creator: Looking for more meaning in life? Check this out for answers.\n    <a href="https://www.comeuntochrist.org/" target="_blank" rel="noopener noreferrer">https://www.ComeUntoChrist.org/</a></span>'],o=getComputedStyle(document.body).getPropertyValue("--yt-live-chat-primary-text-color");let r=location.href;new MutationObserver((()=>{location.href!==r&&(r=location.href,r.includes("watch?v=")&&!r.includes("&index=")&&(window.location.reload(),a()))})).observe(document,{childList:!0,subtree:!0});let i=!1,s=new class{constructor(t=null){t?(this.head=this.tail=new e(t),this.size=1):(this.head=this.tail=null,this.size=0)}reset(){this.head=this.tail=null,this.size=0}addNode(t){let n=new e(t);if(this.head){let t=this.tail;if(this.tail=n,t.next=n,this.size>99){let t=this.head;return this.head=this.head.next,t}return this.size++,null}return this.head=this.tail=n,this.size++,null}},c=new Object,l=new Set;const a=()=>{setTimeout((()=>{new MutationObserver((t=>{try{t.forEach((t=>{t.addedNodes.forEach((t=>{"body"===t.id?f(t.children[1].firstElementChild.lastElementChild.firstElementChild.firstElementChild.firstElementChild):("YTD-COMMENT-THREAD-RENDERER"===t.tagName&&t.classList.contains("ytd-item-section-renderer")||"content-text"===t.id)&&(w(t),i||h())}))}))}catch(t){}})).observe(document.getElementById("comments"),{subtree:!0,childList:!0})}),750)};r.includes("watch?v=")&&a();const h=()=>{i=!0;let t=document.getElementsByClassName("dropdown-content"),e=t[t.length-1];e.children[0].addEventListener("click",m),e.children[1].addEventListener("click",m)},m=()=>{let t=document.getElementById("comments").lastElementChild.children[2];for(;t.hasChildNodes();)t.removeChild(t.firstChild);s.reset(),c=new Object},w=t=>{if("content-text"===t.id)if(t.childElementCount){let e=!1;for(let n of t.childNodes)if(n.nodeType===Node.ELEMENT_NODE&&"A"===n.tagName&&!(n.textContent.includes("@")||n.textContent.includes("#")||/([0-9]:[0-9])/.test(n.textContent))){e=!0;break}if(e)try{"none"===window.getComputedStyle(t.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild).display&&d(t.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement,"Bot")}catch(e){d(t.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement,"Bot")}else p(t)}else p(t);else t.hasChildNodes()?t.childNodes.forEach(w):t.nodeType===Text.TEXT_NODE&&u(t)},u=t=>{try{"A"===t.parentElement.tagName&&"author-text"===t.parentElement.id&&f(t.nextElementSibling)}catch(t){}},f=t=>{let e=t.textContent.toLowerCase();(e.includes("channe")||e.includes("subs")||e.includes("0 video")||e.includes("touch")||e.includes("profile")||e.includes("vlog")||e.includes("!ve")||e.includes("check")||e.includes("ck me")||e.includes("sex")||e.includes("s]ex")||e.includes("text")||e.includes("🔞")||e.includes("🍆")||e.includes("🔥")||e.includes("💦")||e.includes("👈")||e.includes("👉")||e.includes("telegram")||e.includes("tsapp")||e.includes("@")||e.includes("①")||e.includes("𝟙"))&&d(t.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement,"Bot")},p=t=>{let e=new String,n=0;try{for(let o of t.parentElement.parentElement.children){if(n>=3)break;"IMG"===o.tagName?e+=o.alt:e+=o.innerText,n++}let o=t.parentElement.parentElement.parentElement.parentElement.parentElement;if(e.includes("Can we all just appreciate the"))d(o,"Bot");else if(c[e])l.has(e)||(l.add(e),d(c[e],"Repetitive")),d(o,"Repetitive");else if(l.has(e))d(o,"Repetitive");else{c[e]=o;let t=s.addNode(e);t&&delete c[t]}}catch(t){}},d=(e,r)=>{let i;i="contents"===e.parentElement.id?e:e.parentElement;try{for(;null!==i.firstElementChild;)i.removeChild(i.firstElementChild)}catch(t){}finally{let e=document.createElement("span"),s=`[${r} comment removed]`;t&&(Math.random()>.999?s+=n[Math.floor(2*Math.random())]:Math.random()>.9999&&(s+=n[2])),e.innerHTML=s,e.style=`color: ${o}; font-size: 14px; font-style: italic;`,i.appendChild(e)}}};chrome.storage.sync.get(["authenticated"],(function(t){t.authenticated&&chrome.storage.sync.get(["paid"],(function(t){t.paid?script(!0):script()}))}));