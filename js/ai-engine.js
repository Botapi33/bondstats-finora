import { state } from "./state.js";
import { saveStorage } from "./storage.js";
import { toast } from "./ui.js";
import { renderMarkdown } from "./markdown.js";

let generating=false;
let stopRequested=false;

const KNOWLEDGE_BASE=[
{
keywords:["stock","stocks","equity","share"],
title:"Stocks",
summary:"Stocks represent ownership in a company. Their value is influenced by earnings, growth expectations, interest rates, sentiment and risk appetite."
},
{
keywords:["bond","bonds","fixed income","yield","duration"],
title:"Bonds",
summary:"Bonds are debt instruments. Key drivers include interest rates, credit quality, maturity, duration, inflation expectations and central bank policy."
},
{
keywords:["etf","fund","index"],
title:"ETFs",
summary:"ETFs bundle multiple securities into one tradable vehicle. They can improve diversification, lower costs and simplify portfolio construction."
},
{
keywords:["option","options","call","put"],
title:"Options",
summary:"Options are derivative contracts that provide asymmetric exposure. They involve time decay, volatility sensitivity and defined contract terms."
},
{
keywords:["inflation","cpi","prices"],
title:"Inflation",
summary:"Inflation measures price increases over time. It impacts purchasing power, interest rates, bond yields, wages and real returns."
},
{
keywords:["central bank","fed","ecb","rates","monetary"],
title:"Central Banks",
summary:"Central banks influence liquidity, interest rates and financial conditions through policy rates, balance sheets and guidance."
},
{
keywords:["portfolio","allocation","risk","diversification"],
title:"Portfolio Management",
summary:"Portfolio management balances return goals, risk tolerance, diversification, liquidity, time horizon and rebalancing discipline."
},
{
keywords:["currency","fx","usd","eur","chf"],
title:"Currencies",
summary:"Currencies are influenced by interest rate differentials, growth expectations, trade balances, risk appetite and central bank policy."
},
{
keywords:["commodity","commodities","gold","oil"],
title:"Commodities",
summary:"Commodities can respond to supply-demand dynamics, inflation, geopolitics, currency moves and global growth."
},
{
keywords:["ai","artificial intelligence","technology"],
title:"Artificial Intelligence",
summary:"AI affects productivity, software economics, infrastructure demand, labor markets, regulation and long-term competitive advantage."
}
];

const PROMPTS=[
"Explain why bond prices fall when yields rise.",
"Compare ETFs and mutual funds.",
"Analyze concentration risk in a portfolio.",
"Explain inflation like I am 5.",
"Build a recession stress-test checklist.",
"Compare USD strength vs emerging markets.",
"Summarize central bank policy transmission.",
"Create a quiz about fixed income."
];

export function initializeAI(){

document.addEventListener("finora-route-change",event=>{

if(event.detail==="chat"){

wireChat();

renderConversationHistory();

}

});

document.getElementById("newChatBtn")?.addEventListener("click",()=>{

createConversation();

});

document.addEventListener("finora-search",event=>{

if(state.route==="chat"){

filterConversationHistory(event.detail);

}

});

}

function wireChat(){

const input=document.getElementById("chatInput");
const send=document.getElementById("sendChat");
const area=document.getElementById("conversationArea");

if(!input||!send||!area)return;

if(!state.currentChat){

createConversation(false);

}

renderSuggestedPrompts();

send.onclick=()=>sendMessage();

input.onkeydown=event=>{

if(event.key==="Enter"&&!event.shiftKey){

event.preventDefault();

sendMessage();

}

};

}

function createConversation(show=true){

const conversation={

id:crypto.randomUUID(),

title:"New Financial Conversation",

createdAt:new Date().toISOString(),

updatedAt:new Date().toISOString(),

pinned:false,

messages:[
{
role:"assistant",
content:"Welcome to BondStats Finora. Ask me about bonds, stocks, macroeconomics, portfolios, central banks, currencies, commodities, AI or financial strategy.",
createdAt:new Date().toISOString()
}
]

};

state.conversations.unshift(conversation);

state.currentChat=conversation.id;

saveStorage();

if(show){

toast("New conversation created");

}

renderConversation();

renderConversationHistory();

}

function currentConversation(){

return state.conversations.find(chat=>chat.id===state.currentChat);

}

async function sendMessage(){

if(generating)return;

const input=document.getElementById("chatInput");

if(!input)return;

const text=input.value.trim();

if(!text)return;

const conversation=currentConversation();

if(!conversation)return;

conversation.messages.push({

role:"user",

content:text,

createdAt:new Date().toISOString()

});

conversation.title=deriveTitle(text);

conversation.updatedAt=new Date().toISOString();

input.value="";

saveStorage();

renderConversation();

await generateResponse(text);

}

async function generateResponse(prompt){

const conversation=currentConversation();

if(!conversation)return;

generating=true;
stopRequested=false;

const response={

role:"assistant",

content:"",

createdAt:new Date().toISOString(),

citations:generateCitations(prompt)

};

conversation.messages.push(response);

renderConversation();

const answer=createFinancialAnswer(prompt);

for(const char of answer){

if(stopRequested)break;

response.content+=char;

renderConversation(false);

await wait(8);

}

generating=false;

conversation.updatedAt=new Date().toISOString();

saveStorage();

renderConversationHistory();

}

function createFinancialAnswer(prompt){

const lower=prompt.toLowerCase();

const matches=KNOWLEDGE_BASE.filter(item=>

item.keywords.some(keyword=>lower.includes(keyword))

);

const mode=state.mode;

const header=matches.length

?`## ${matches[0].title} Intelligence`

:"## Financial Intelligence";

let tone="";

if(mode==="student"){

tone="I will explain this step by step in simple language.";

}else if(mode==="investor"){

tone="I will focus on portfolio implications, risks and decision quality.";

}else if(mode==="research"){

tone="I will structure this as a research memo with drivers, risks and open questions.";

}else if(mode==="eli5"){

tone="Imagine finance as a machine that moves money, risk and time between people.";

}else{

tone="Here is a professional financial breakdown.";

}

const knowledge=matches.length

?matches.map(item=>`- **${item.title}:** ${item.summary}`).join("\n")

:"- **Core view:** The topic should be evaluated through incentives, risk, liquidity, valuation, time horizon and uncertainty.";

return `${header}

${tone}

### Key Points

${knowledge}

### Practical Interpretation

- Identify the main driver: rates, growth, inflation, liquidity, earnings, credit quality or sentiment.
- Separate short-term market noise from structural financial logic.
- Consider second-order effects, because financial systems are interconnected.
- Avoid treating one metric as a complete decision framework.

### Risk Lens

| Risk Area | What To Watch |
|---|---|
| Liquidity | Can the asset be sold or rebalanced efficiently? |
| Duration | How sensitive is it to interest rates or time horizon? |
| Concentration | Is too much exposure tied to one sector, region or factor? |
| Currency | Does FX movement change the outcome? |
| Macro | Is the asset exposed to inflation, growth or central bank shifts? |

### Finora Insight

A strong financial decision should connect thesis, probability, downside risk, liquidity, time horizon and portfolio role.

This is educational analysis, not financial advice.`;

}

function generateCitations(prompt){

const lower=prompt.toLowerCase();

return KNOWLEDGE_BASE

.filter(item=>item.keywords.some(keyword=>lower.includes(keyword)))

.slice(0,3)

.map(item=>({

title:item.title,

description:item.summary

}));

}

function renderConversation(autoScroll=true){

const area=document.getElementById("conversationArea");

const conversation=currentConversation();

if(!area||!conversation)return;

area.innerHTML=conversation.messages.map((message,index)=>`

<div class="card message ${message.role}">

<div class="message-head">

<strong>${message.role==="user"?"You":"Finora"}</strong>

<div class="inline">

<button class="button button-secondary copy-message" data-index="${index}">Copy</button>

${message.role==="assistant"&&index===conversation.messages.length-1?`

<button class="button button-secondary regenerate-message">Regenerate</button>

<button class="button button-secondary stop-message">Stop</button>

`:""}

</div>

</div>

<div class="message-body">

${renderMarkdown(message.content)}

</div>

${message.citations?.length?`

<div class="citation-grid">

${message.citations.map(citation=>`

<div class="card">

<strong>${citation.title}</strong>

<p>${citation.description}</p>

</div>

`).join("")}

</div>

`:""}

</div>

`).join("");

area.querySelectorAll(".copy-message").forEach(button=>{

button.addEventListener("click",()=>{

const msg=conversation.messages[Number(button.dataset.index)];

navigator.clipboard?.writeText(msg.content);

toast("Message copied");

});

});

area.querySelector(".regenerate-message")?.addEventListener("click",()=>{

const lastUser=[...conversation.messages].reverse().find(message=>message.role==="user");

conversation.messages=conversation.messages.filter((message,index)=>{

return !(message.role==="assistant"&&index===conversation.messages.length-1);

});

saveStorage();

if(lastUser)generateResponse(lastUser.content);

});

area.querySelector(".stop-message")?.addEventListener("click",()=>{

stopRequested=true;

toast("Generation stopped");

});

if(autoScroll){

area.scrollTop=area.scrollHeight;

}

}

function renderSuggestedPrompts(){

const area=document.getElementById("conversationArea");

if(!area||document.getElementById("suggestedPrompts"))return;

const wrapper=document.createElement("div");

wrapper.id="suggestedPrompts";

wrapper.className="inline";

wrapper.innerHTML=PROMPTS.map(prompt=>`

<button class="button button-secondary suggested-prompt">

${prompt}

</button>

`).join("");

area.after(wrapper);

wrapper.querySelectorAll(".suggested-prompt").forEach(button=>{

button.addEventListener("click",()=>{

document.getElementById("chatInput").value=button.textContent.trim();

sendMessage();

});

});

}

function renderConversationHistory(){

const view=document.getElementById("view-chat");

if(!view||document.getElementById("chatHistoryPanel"))return;

const panel=document.createElement("div");

panel.id="chatHistoryPanel";

panel.className="card";

panel.innerHTML=`

<h3>Conversation History</h3>

<div id="chatHistoryList" class="stack" style="margin-top:16px"></div>

`;

view.querySelector(".page")?.prepend(panel);

updateHistoryList();

}

function updateHistoryList(list=state.conversations){

const target=document.getElementById("chatHistoryList");

if(!target)return;

if(list.length===0){

target.innerHTML="<p>No conversations yet.</p>";

return;

}

target.innerHTML=list.map(chat=>`

<button class="button button-secondary history-item" data-id="${chat.id}">

${chat.pinned?"★ ":""}${chat.title}

</button>

`).join("");

target.querySelectorAll(".history-item").forEach(button=>{

button.addEventListener("click",()=>{

state.currentChat=button.dataset.id;

saveStorage();

renderConversation();

});

});

}

function filterConversationHistory(query){

const filtered=state.conversations.filter(chat=>

chat.title.toLowerCase().includes(query)||

chat.messages.some(message=>message.content.toLowerCase().includes(query))

);

updateHistoryList(filtered);

}

function deriveTitle(text){

return text.split(" ").slice(0,7).join(" ");

}

function wait(ms){

return new Promise(resolve=>setTimeout(resolve,ms));

}
