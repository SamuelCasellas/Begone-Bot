/* © 2022 Samuel Casellas All rights reserved | Follow me on LinkedIn: https://www.linkedin.com/in/samuel-casellas-a9b390208/ | Mangler command used: terser FILE -c -m --mangle-props regex=/_$/ */const script=function(e=!1){class t{constructor(e){this.data=e,this.next=null}}const o=["channe","subs","0 video","touch","profile","tap ","vlog","!ve","check","ck me","sex"," body","s]e","hot","text","🔞","🍆","🔥","👈","👉","telegram","tsapp","@","①","𝟙","nora smith","ava adams"],n=["Can we all just appreciate the","nigg"],r=['<span>\n\nQuick message from the creator: Looking to make some easy money online? Click on the following link to get started!\n    <a href="https://www.swagbucks.com/p/register?rb=127459126" target="_blank" rel="noopener noreferrer">https://www.swagbucks.com/p/register?rb=127459126</a></span>','<span>\n\nQuick message from the creator: Looking to make some easy money online? Click on the following link to get started!\n    <a href="https://www.prizerebel.com/index.php?r=13177620" target="_blank" rel="noopener noreferrer">https://www.prizerebel.com/index.php?r=13177620</a></span>','<span>\n\nMessage from the creator: Looking for more meaning in life? Check this out for answers.\n    <a href="https://www.comeuntochrist.org/" target="_blank" rel="noopener noreferrer">https://www.ComeUntoChrist.org/</a></span>'],i=getComputedStyle(document.body).getPropertyValue("--yt-live-chat-primary-text-color");let s;try{s=location.href.split("?v=")[1].split("&")[0]}catch(e){s=null}let l=location.href;new MutationObserver((()=>{if(location.href!==l){l=location.href,h=new Object,a.reset();try{location.href.split("?v=")[1].split("&")[0]!==s&&window.location.reload()}catch(e){}}})).observe(document,{childList:!0,subtree:!0});let c=!1,a=new class{constructor(e=null){e?(this.head=this.tail=new t(e),this.size=1):(this.head=this.tail=null,this.size=0)}reset(){this.head=this.tail=null,this.size=0}addNode(e){let o=new t(e);if(this.head){let e=this.tail;if(this.tail=o,e.next=o,this.size>199){let e=this.head;return this.head=this.head.next,e}return this.size++,null}return this.head=this.tail=o,this.size++,null}},h=new Object,f=new Set;s&&setTimeout((()=>{new MutationObserver((e=>{try{e.forEach((e=>{e.addedNodes.forEach((e=>{"body"===e.id?d(e.children[1].firstElementChild.lastElementChild.firstElementChild.firstElementChild.firstElementChild):("YTD-COMMENT-THREAD-RENDERER"===e.tagName&&e.classList.contains("ytd-item-section-renderer")||"content-text"===e.id)&&(w(e),c||m())}))}))}catch(e){}})).observe(document.getElementById("comments"),{subtree:!0,childList:!0})}),1e3);const m=()=>{c=!0,document.addEventListener("click",p)},p=e=>{let t=e.target.innerText;if("Newest first"===t||"Top comments"===t){let e=document.getElementById("comments").lastElementChild.children[2];for(;e.hasChildNodes();)e.removeChild(e.firstChild);a.reset(),h=new Object}},w=e=>{if("content-text"===e.id)if(e.childElementCount){let t=!1;for(let o of e.childNodes)if(o.nodeType===Node.ELEMENT_NODE&&"A"===o.tagName&&!(o.textContent.includes("@")||o.textContent.includes("#")||/([0-9]:[0-9])/.test(o.textContent))){t=!0;break}if(t)try{"none"===window.getComputedStyle(e.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild).display&&b(e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement,"Bot")}catch(t){b(e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement,"Bot")}else k(e)}else k(e);else e.hasChildNodes()?e.childNodes.forEach(w):e.nodeType===Text.TEXT_NODE&&u(e)},u=e=>{try{"A"===e.parentElement.tagName&&"author-text"===e.parentElement.id&&d(e.nextElementSibling)}catch(e){}},g={"а":"a","ɑ":"a","с":"c","ɛ":"e","е":"e","ᴇ":"e","к":"k","м":"m","ɴ":"n","т":"t","р":"p","ɡ":"g","ɢ":"g"},d=e=>{let t=e.textContent.toLowerCase();if(t.includes(String.fromCharCode(55349)))b(e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement,"Bot");else{for(let e in g){let o=new RegExp(e,"gi");t=t.replace(o,g[e])}for(let n of o)if(t.includes(n)){b(e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement,"Bot");break}}},k=e=>{let t=new String,o=0;try{for(let n of e.parentElement.parentElement.children){if(o>=3)break;"IMG"===n.tagName?t+=n.alt:t+=n.innerText,o++}let r=e.parentElement.parentElement.parentElement.parentElement.parentElement;for(let e in g){let o=new RegExp(e,"gi");t=t.replace(o,g[e])}for(let e of n)if(t.includes(e))return void b(r,"Bot");if(h[t])f.has(t)||(f.add(t),b(h[t],"Repetitive")),b(r,"Repetitive");else if(f.has(t))b(r,"Repetitive");else{h[t]=r;let e=a.addNode(t);e&&delete h[e]}}catch(e){}},b=(t,o)=>{let n;n="contents"===t.parentElement.id?t:t.parentElement;try{for(;null!==n.firstElementChild;)n.removeChild(n.firstElementChild)}catch(e){}finally{let t=document.createElement("span"),s=`[${o} comment removed]`;e&&(Math.random()>.995?s+=r[Math.floor(2*Math.random())]:Math.random()>.9999&&(s+=r[2])),t.innerHTML=s,t.style=`color: ${i}; font-size: 14px; font-style: italic; font-weight: normal;`,n.appendChild(t)}}};chrome.storage.sync.get(["x"],(function(e){e.x&&chrome.storage.sync.get(["w"],(function(e){e.w?script(!0):script()}))}));