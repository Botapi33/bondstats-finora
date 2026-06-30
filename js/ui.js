import { state } from "./state.js";

let toastTimer=null;

export function initializeUI(){

buildDashboard();

buildChat();

buildPortfolio();

buildResearch();

buildLearn();

buildFuture();

registerSidebar();

registerModeSelector();

}

export function toast(message){

const element=document.getElementById("toast");

if(!element)return;

element.textContent=message;

element.classList.add("show");

clearTimeout(toastTimer);

toastTimer=setTimeout(()=>{

element.classList.remove("show");

},2600);

}

function registerSidebar(){

const toggle=document.getElementById("menuToggle");

const sidebar=document.getElementById("sidebar");

if(!toggle||!sidebar)return;

toggle.addEventListener("click",()=>{

sidebar.classList.toggle("open");

});

document.addEventListener("click",event=>{

if(window.innerWidth>900)return;

if(sidebar.contains(event.target))return;

if(toggle.contains(event.target))return;

sidebar.classList.remove("open");

});

}

function registerModeSelector(){

const selector=document.getElementById("globalMode");

if(!selector)return;

selector.value=state.mode;

selector.addEventListener("change",()=>{

state.mode=selector.value;

toast(`${selector.options[selector.selectedIndex].text} Mode Enabled`);

});

}

function buildDashboard(){

const view=document.getElementById("view-dashboard");

if(!view)return;

view.innerHTML=`

<div class="page fade-in">

<div class="section-header">

<div>

<h1 class="section-title">

Financial Intelligence Dashboard

</h1>

<p class="section-description">

Your complete financial operating system.

</p>

</div>

</div>

<div class="grid grid-6">

${metricCard("Portfolio Health","healthMetric","98","◉")}

${metricCard("Diversification","divMetric","84","◎")}

${metricCard("Overall Risk","riskMetric","32","▲")}

${metricCard("Cash Ratio","cashMetric","12%","💵")}

${metricCard("Bond Ratio","bondMetric","28%","📈")}

${metricCard("Equity Ratio","equityMetric","60%","⬢")}

</div>

<div class="grid grid-3">

<div class="card">

<h3>Today's Insight</h3>

<p>

Your allocation remains diversified with moderate concentration risk.

</p>

</div>

<div class="card">

<h3>Portfolio Intelligence</h3>

<p>

No structural allocation weaknesses detected.

</p>

</div>

<div class="card">

<h3>System Status</h3>

<p>

Offline Workspace Active

</p>

</div>

</div>

</div>

`;

}

function metricCard(title,id,value,icon){

return`

<div class="card metric-card">

<div class="metric-header">

<div class="metric-title">

${title}

</div>

<div class="metric-icon">

${icon}

</div>

</div>

<div class="metric-value" id="${id}">

${value}

</div>

<div class="metric-footer">

<div class="progress">

<div class="progress-fill"

style="width:${parseFloat(value)||80}%">

</div>

</div>

</div>

</div>

`;

}

function buildChat(){

const view=document.getElementById("view-chat");

if(!view)return;

view.innerHTML=`

<div class="page">

<div class="card">

<div class="section-header">

<div>

<h2 class="section-title">

AI Financial Assistant

</h2>

<p class="section-description">

Research, explain and analyse financial topics.

</p>

</div>

<button class="button button-secondary">

New Conversation

</button>

</div>

<div id="conversationArea"

style="height:480px;overflow:auto;margin-top:24px;display:flex;flex-direction:column;gap:18px;">

<div class="card">

<strong>

Finora

</strong>

<p style="margin-top:12px">

Welcome to BondStats Finora.

Ask about bonds, stocks, portfolio construction, macroeconomics, central banks or financial markets.

</p>

</div>

</div>

<div style="display:flex;gap:12px;margin-top:24px">

<textarea

id="chatInput"

class="textarea"

placeholder="Ask Finora anything about finance..."

style="height:80px">

</textarea>

<button

id="sendChat"

class="button button-primary">

Send

</button>

</div>

</div>

</div>

`;

}

function buildPortfolio(){

const view=document.getElementById("view-portfolio");

if(!view)return;

view.innerHTML=`

<div class="page">

<div class="card">

<h2 class="section-title">

Portfolio Intelligence

</h2>

<p class="section-description">

Portfolio Risk Check module initialized.

</p>

<div id="portfolioRoot">

</div>

</div>

</div>

`;

}

function buildResearch(){

const view=document.getElementById("view-research");

if(!view)return;

view.innerHTML=`

<div class="page">

<div class="card">

<h2>

Research Workspace

</h2>

<p>

Create notes, save ideas, organize collections and build long-term research.

</p>

<textarea

class="textarea"

placeholder="Write research notes..."

style="margin-top:20px;height:300px">

</textarea>

</div>

</div>

`;

}

function buildLearn(){

const view=document.getElementById("view-learn");

if(!view)return;

view.innerHTML=`

<div class="page">

<div class="card">

<h2>

BondStats Learn

</h2>

<p>

Recommended learning paths, quizzes and concept summaries will appear here.

</p>

</div>

</div>

`;

}

function buildFuture(){

const view=document.getElementById("view-future");

if(!view)return;

view.innerHTML=`

<div class="page">

<div class="card">

<h2>

Future Intelligence Lab

</h2>

<p>

Explore AI, digital assets, tokenization, future banking, CBDCs and long-term scenarios.

</p>

</div>

</div>

`;

}
