import { state } from "./state.js";
import { saveStorage } from "./storage.js";
import { toast } from "./ui.js";

const SCENARIOS = [
  {
    id: "higher-rates",
    title: "Higher Interest Rates",
    category: "Rates",
    impact: "Higher rates can pressure long-duration bonds and expensive growth assets. Cash and short-duration fixed income may become relatively more attractive.",
    watch: ["Duration", "Growth valuations", "Debt refinancing", "Cash yield"]
  },
  {
    id: "lower-rates",
    title: "Lower Interest Rates",
    category: "Rates",
    impact: "Lower rates can support bonds, growth equities and interest-rate sensitive assets, while reducing future cash yields.",
    watch: ["Bond prices", "Growth equities", "Real estate", "Cash drag"]
  },
  {
    id: "high-inflation",
    title: "High Inflation",
    category: "Macro",
    impact: "High inflation can reduce purchasing power and pressure fixed income. Commodities, real assets and pricing-power businesses may become more resilient.",
    watch: ["Real yields", "Commodities", "Margins", "Central banks"]
  },
  {
    id: "recession",
    title: "Recession",
    category: "Cycle",
    impact: "A recession can weaken cyclical equities and credit-sensitive assets. Defensive sectors, quality bonds and liquidity often become more important.",
    watch: ["Credit spreads", "Cash", "Defensive sectors", "Earnings risk"]
  },
  {
    id: "bull-market",
    title: "Bull Market",
    category: "Risk Appetite",
    impact: "A bull market generally benefits equities, crypto and higher-beta assets. Concentration risk can still rise if gains become narrow.",
    watch: ["Equity ratio", "Sector breadth", "Valuation", "Rebalancing"]
  },
  {
    id: "bear-market",
    title: "Bear Market",
    category: "Risk Appetite",
    impact: "A bear market can expose concentration, liquidity and volatility risks. Diversification and rebalancing discipline become more valuable.",
    watch: ["Drawdown risk", "Liquidity", "Risk budget", "Diversification"]
  },
  {
    id: "strong-usd",
    title: "Strong USD",
    category: "Currencies",
    impact: "A strong USD can pressure non-USD assets in translated terms and affect commodities and emerging markets differently.",
    watch: ["Currency exposure", "Emerging markets", "Commodities", "Foreign revenue"]
  },
  {
    id: "weak-usd",
    title: "Weak USD",
    category: "Currencies",
    impact: "A weak USD can support foreign asset returns in USD terms and may benefit commodities and globally diversified exposure.",
    watch: ["FX exposure", "International equities", "Commodities", "Inflation"]
  }
];

export function initializeScenario(){

document.addEventListener("finora-route-change",event=>{

if(event.detail==="future"){

renderFutureLab();

}

});

renderFutureLab();

}

function renderFutureLab(){

const view=document.getElementById("view-future");

if(!view)return;

view.innerHTML=`

<div class="page fade-in">

<div class="section-header">

<div>

<h1 class="section-title">Future Intelligence Lab</h1>

<p class="section-description">
Scenario analysis for future finance, macro shifts, AI, digital assets and market structure.
</p>

</div>

<button class="button button-primary" id="saveScenarioBtn">
Save Scenario
</button>

</div>

<div class="grid grid-4">

${SCENARIOS.map(scenario=>`

<button class="card scenario-card ${state.scenario===scenario.id?"active":""}" data-scenario="${scenario.id}">

<div class="badge">${scenario.category}</div>

<h3 style="margin-top:14px">${scenario.title}</h3>

<p style="margin-top:10px">${scenario.impact}</p>

</button>

`).join("")}

</div>

<div class="card">

<h3>Scenario Impact Engine</h3>

<div id="scenarioOutput" style="margin-top:18px"></div>

</div>

<div class="grid grid-3">

<div class="card">

<h3>Technology</h3>

<p>Artificial intelligence may improve productivity, financial analysis, automation and personalization while increasing model, data and governance risks.</p>

</div>

<div class="card">

<h3>Tokenization</h3>

<p>Tokenized assets may change settlement, ownership records, private markets, liquidity design and programmable compliance.</p>

</div>

<div class="card">

<h3>Future Banking</h3>

<p>Banking may evolve toward embedded finance, real-time payments, digital identity, automated advice and programmable money.</p>

</div>

</div>

</div>

`;

registerScenarioEvents();

renderScenarioOutput();

}

function registerScenarioEvents(){

document.querySelectorAll("[data-scenario]").forEach(button=>{

button.addEventListener("click",()=>{

state.scenario=button.dataset.scenario;

saveStorage();

renderFutureLab();

toast("Scenario selected");

});

});

document.getElementById("saveScenarioBtn")?.addEventListener("click",()=>{

state.futureHistory.unshift({

id:crypto.randomUUID(),

scenario:state.scenario,

savedAt:new Date().toISOString()

});

saveStorage();

toast("Scenario saved");

});

}

function renderScenarioOutput(){

const target=document.getElementById("scenarioOutput");

if(!target)return;

const scenario=SCENARIOS.find(item=>item.id===state.scenario)||SCENARIOS[0];

target.innerHTML=`

<div class="grid grid-2">

<div class="card">

<span class="badge">${scenario.category}</span>

<h3 style="margin-top:14px">${scenario.title}</h3>

<p style="margin-top:12px">${scenario.impact}</p>

</div>

<div class="card">

<h3>What To Watch</h3>

<div class="inline" style="margin-top:14px">

${scenario.watch.map(item=>`

<span class="badge">${item}</span>

`).join("")}

</div>

</div>

</div>

<div class="card" style="margin-top:18px">

<h3>Portfolio Interpretation</h3>

<p style="margin-top:12px">
This scenario should be interpreted qualitatively. Finora does not forecast prices, returns or timing. Use it to identify exposures, vulnerabilities and possible rebalancing questions.
</p>

</div>

`;

}
