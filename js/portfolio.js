import { state } from "./state.js";
import { saveStorage } from "./storage.js";
import { toast } from "./ui.js";

const portfolioRootId = "portfolioRoot";

export function initializePortfolio(){

document.addEventListener("finora-route-change",event=>{

if(event.detail==="portfolio"){

renderPortfolio();

}

});

renderPortfolio();

}

function renderPortfolio(){

const root=document.getElementById(portfolioRootId);

if(!root)return;

root.innerHTML=`

<div class="grid grid-2">

<div class="card">

<h3>Add Asset</h3>

<form id="portfolioForm" class="stack">

<input
class="input"
id="assetName"
placeholder="Asset Name"
required>

<select
class="select"
id="assetType">

<option>Stocks</option>
<option>Bonds</option>
<option>ETFs</option>
<option>Mutual Funds</option>
<option>REITs</option>
<option>Commodities</option>
<option>Gold</option>
<option>Cash</option>
<option>Crypto</option>
<option>Other</option>

</select>

<input
class="input"
type="number"
id="assetAllocation"
placeholder="Allocation %"
required>

<input
class="input"
placeholder="Region"
id="assetRegion">

<input
class="input"
placeholder="Sector"
id="assetSector">

<input
class="input"
placeholder="Currency"
id="assetCurrency">

<select
class="select"
id="assetRisk">

<option value="1">Very Low</option>
<option value="2">Low</option>
<option value="3" selected>Moderate</option>
<option value="4">High</option>
<option value="5">Very High</option>

</select>

<textarea
class="textarea"
id="assetNotes"
placeholder="Notes"></textarea>

<button
class="button button-primary"
type="submit">

Add Asset

</button>

</form>

</div>

<div class="card">

<h3>Portfolio Summary</h3>

<div id="portfolioSummary"></div>

</div>

</div>

<div class="card">

<h3>Portfolio Assets</h3>

<div class="table-wrapper">

<table class="table">

<thead>

<tr>

<th>Name</th>
<th>Type</th>
<th>Allocation</th>
<th>Region</th>
<th>Sector</th>
<th>Currency</th>
<th>Risk</th>
<th></th>

</tr>

</thead>

<tbody id="portfolioTable">

</tbody>

</table>

</div>

</div>

`;

registerPortfolioEvents();

renderPortfolioTable();

renderPortfolioSummary();

}

function registerPortfolioEvents(){

const form=document.getElementById("portfolioForm");

if(!form)return;

form.addEventListener("submit",event=>{

event.preventDefault();

const asset={

id:crypto.randomUUID(),

name:document.getElementById("assetName").value.trim(),

type:document.getElementById("assetType").value,

allocation:Number(document.getElementById("assetAllocation").value),

region:document.getElementById("assetRegion").value.trim(),

sector:document.getElementById("assetSector").value.trim(),

currency:document.getElementById("assetCurrency").value.trim(),

risk:Number(document.getElementById("assetRisk").value),

notes:document.getElementById("assetNotes").value.trim()

};

state.portfolio.push(asset);

saveStorage();

form.reset();

toast("Asset added");

renderPortfolioTable();

renderPortfolioSummary();

});

}

function renderPortfolioTable(){

const body=document.getElementById("portfolioTable");

if(!body)return;

if(state.portfolio.length===0){

body.innerHTML=`
<tr>
<td colspan="8">
No assets added yet.
</td>
</tr>
`;

return;

}

body.innerHTML=state.portfolio.map(asset=>`

<tr>

<td>${asset.name}</td>

<td>${asset.type}</td>

<td>${asset.allocation.toFixed(2)}%</td>

<td>${asset.region}</td>

<td>${asset.sector}</td>

<td>${asset.currency}</td>

<td>${riskLabel(asset.risk)}</td>

<td>

<button
class="button button-secondary"
data-id="${asset.id}">

Delete

</button>

</td>

</tr>

`).join("");

body.querySelectorAll("button").forEach(button=>{

button.addEventListener("click",()=>{

removeAsset(button.dataset.id);

});

});

}

function renderPortfolioSummary(){

const container=document.getElementById("portfolioSummary");

if(!container)return;

const totalAllocation=state.portfolio.reduce(

(sum,asset)=>sum+asset.allocation,

0

);

const averageRisk=

state.portfolio.length===0

?0

:

state.portfolio.reduce(

(sum,asset)=>sum+asset.risk,

0

)/state.portfolio.length;

container.innerHTML=`

<div class="grid grid-2">

<div class="card">

<h4>

Assets

</h4>

<div class="metric-value">

${state.portfolio.length}

</div>

</div>

<div class="card">

<h4>

Allocation

</h4>

<div class="metric-value">

${totalAllocation.toFixed(1)}%

</div>

</div>

<div class="card">

<h4>

Average Risk

</h4>

<div class="metric-value">

${averageRisk.toFixed(1)}

</div>

</div>

<div class="card">

<h4>

Diversification

</h4>

<div class="metric-value">

${calculateDiversification()}%

</div>

</div>

</div>

`;

}

function calculateDiversification(){

const uniqueTypes=new Set(

state.portfolio.map(asset=>asset.type)

).size;

const uniqueRegions=new Set(

state.portfolio.map(asset=>asset.region)

).size;

return Math.min(

100,

(uniqueTypes*12)+(uniqueRegions*8)

);

}

function removeAsset(id){

state.portfolio=

state.portfolio.filter(

asset=>asset.id!==id

);

saveStorage();

toast("Asset removed");

renderPortfolioTable();

renderPortfolioSummary();

}

function riskLabel(level){

switch(level){

case 1:return"Very Low";

case 2:return"Low";

case 3:return"Moderate";

case 4:return"High";

default:return"Very High";

}

}
