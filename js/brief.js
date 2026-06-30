import { state } from "./state.js";
import { saveStorage } from "./storage.js";
import { toast } from "./ui.js";
import { DAILY_BRIEF_TEMPLATE } from "./data.js";

export function initializeBrief(){

document.addEventListener("finora-route-change",event=>{

if(event.detail==="brief"){

renderBrief();

}

});

renderBrief();

}

function renderBrief(){

const view=document.getElementById("view-brief");

if(!view)return;

view.innerHTML=`

<div class="page fade-in">

<div class="section-header">

<div>

<h1 class="section-title">Daily Brief</h1>

<p class="section-description">
Offline market intelligence briefing workspace.
</p>

</div>

<div class="inline">

<button class="button button-secondary" id="refreshBriefBtn">
Refresh Brief
</button>

<button class="button button-primary" id="saveBriefBtn">
Save Brief
</button>

</div>

</div>

<div class="grid grid-4">

${briefMetric("Markets",DAILY_BRIEF_TEMPLATE.markets.length,"◈")}

${briefMetric("Calendar",DAILY_BRIEF_TEMPLATE.calendar.length,"◎")}

${briefMetric("Signals",calculateSignals(),"⬢")}

${briefMetric("Insight",briefQuality(),"✦")}

</div>

<div class="grid grid-2">

<div class="card">

<h3>Today's Markets</h3>

<div class="stack" style="margin-top:18px">

${DAILY_BRIEF_TEMPLATE.markets.map(item=>`

<div class="card">

<strong>${item}</strong>

<p>${marketText(item)}</p>

</div>

`).join("")}

</div>

</div>

<div class="card">

<h3>Market Calendar</h3>

<div class="stack" style="margin-top:18px">

${DAILY_BRIEF_TEMPLATE.calendar.map(item=>`

<div class="card">

<strong>${item}</strong>

<p>${calendarText(item)}</p>

</div>

`).join("")}

</div>

</div>

</div>

<div class="card">

<h3>BondStats Insight</h3>

<div id="briefInsight" class="stack" style="margin-top:18px">

${renderInsightSections()}

</div>

</div>

<div class="card">

<h3>Custom Brief Notes</h3>

<textarea
id="briefNotes"
class="textarea"
style="min-height:220px"
placeholder="Write your own market observations...">${state.dailyBrief.notes||""}</textarea>

</div>

</div>

`;

registerBriefEvents();

}

function briefMetric(title,value,icon){

return`

<div class="card metric-card">

<div class="metric-header">

<div class="metric-title">${title}</div>

<div class="metric-icon">${icon}</div>

</div>

<div class="metric-value">${value}</div>

</div>

`;

}

function marketText(item){

const texts={

"Global equities":"Track broad equity momentum, sector leadership, valuation sensitivity and earnings expectations.",

"Government bonds":"Monitor yield curve movement, duration risk, central bank expectations and inflation premium.",

"Corporate bonds":"Watch credit spreads, default risk, liquidity and refinancing conditions.",

"Credit spreads":"Wider spreads often signal tighter financial conditions and higher perceived credit risk.",

"Currencies":"FX movements can affect international assets, inflation dynamics and corporate earnings translation.",

"Commodities":"Commodity prices can reflect growth, inflation, supply constraints and geopolitical risk."

};

return texts[item]||"Monitor key market drivers and risk transmission.";

}

function calendarText(item){

const texts={

"Central Bank Meetings":"Policy decisions, guidance and balance sheet signals can move rates, currencies and risk assets.",

"Economic Releases":"Growth, labor and inflation data influence expectations for monetary policy and earnings.",

"Earnings Season":"Corporate results can reshape valuation narratives and sector leadership.",

"Inflation Data":"Inflation readings affect real yields, policy expectations and purchasing power."

};

return texts[item]||"Review timing, relevance and potential market sensitivity.";

}

function renderInsightSections(){

return DAILY_BRIEF_TEMPLATE.sections.map(section=>`

<div class="card">

<h3>${section.title}</h3>

<p>${generateSectionText(section.title)}</p>

</div>

`).join("");

}

function generateSectionText(title){

const map={

"Market Overview":"Risk appetite should be interpreted through equity breadth, bond yields, credit conditions and currency movements. A balanced view avoids overreacting to one asset class.",

"Bond Market":"Fixed income signals are central to macro interpretation. Yields, curve shape, credit spreads and duration sensitivity help reveal market expectations.",

"Macro":"Macro conditions connect inflation, growth, employment, policy rates and financial liquidity. These drivers influence portfolio construction and scenario risk.",

"AI & Future Finance":"Artificial intelligence, automation, tokenization and digital market infrastructure continue to reshape productivity, financial workflows and long-term investing themes."

};

return map[title]||"This section summarizes important financial intelligence signals.";

}

function calculateSignals(){

return DAILY_BRIEF_TEMPLATE.markets.length+DAILY_BRIEF_TEMPLATE.calendar.length;

}

function briefQuality(){

return "Ready";

}

function registerBriefEvents(){

document.getElementById("refreshBriefBtn")?.addEventListener("click",()=>{

renderBrief();

toast("Brief refreshed");

});

document.getElementById("saveBriefBtn")?.addEventListener("click",()=>{

state.dailyBrief={

notes:document.getElementById("briefNotes").value,

savedAt:new Date().toISOString()

};

saveStorage();

toast("Brief saved");

});

}
