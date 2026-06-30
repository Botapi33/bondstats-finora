import { state } from "./state.js";
import { loadStorage } from "./storage.js";
import { initRouter, navigate } from "./router.js";
import { initializeUI, toast } from "./ui.js";
import { initializePortfolio } from "./portfolio.js";
import { initializeResearch } from "./research.js";
import { initializeLearn } from "./learn.js";
import { initializeBrief } from "./brief.js";
import { initializeCharts } from "./charts.js";
import { initializeAI } from "./ai-engine.js";
import { initializeScenario } from "./scenario.js";

class BondStatsFinora{

async init(){

state.loading=true;

loadStorage();

initializeUI();

initializeCharts();

initializePortfolio();

initializeResearch();

initializeLearn();

initializeBrief();

initializeAI();

initializeScenario();

initRouter();

this.registerServiceWorker();

this.registerKeyboardShortcuts();

this.registerSearch();

this.registerThemePulse();

this.hideBoot();

state.loading=false;

toast("BondStats Finora Ready");

}

hideBoot(){

const boot=document.getElementById("boot");

if(!boot)return;

setTimeout(()=>{

boot.style.opacity="0";

boot.style.pointerEvents="none";

setTimeout(()=>boot.remove(),500);

},700);

}

registerServiceWorker(){

if("serviceWorker" in navigator){

navigator.serviceWorker.register("./sw.js");

}

}

registerKeyboardShortcuts(){

document.addEventListener("keydown",event=>{

if(!(event.metaKey||event.ctrlKey))return;

switch(event.key){

case"1":

navigate("dashboard");

break;

case"2":

navigate("chat");

break;

case"3":

navigate("portfolio");

break;

case"4":

navigate("brief");

break;

case"5":

navigate("learn");

break;

case"6":

navigate("research");

break;

case"7":

navigate("future");

break;

case"k":

event.preventDefault();

document.getElementById("globalSearch")?.focus();

break;

case"n":

event.preventDefault();

document.getElementById("newChatBtn")?.click();

break;

}

});

}

registerSearch(){

const search=document.getElementById("globalSearch");

if(!search)return;

search.addEventListener("input",event=>{

const value=event.target.value.toLowerCase();

document.dispatchEvent(new CustomEvent("finora-search",{

detail:value

}));

});

}

registerThemePulse(){

const button=document.getElementById("themePulse");

if(!button)return;

button.addEventListener("click",()=>{

document.body.animate([

{

filter:"brightness(1)"

},

{

filter:"brightness(1.08)"

},

{

filter:"brightness(1)"

}

],{

duration:600,

easing:"ease"

});

});

}

}

window.addEventListener("DOMContentLoaded",()=>{

new BondStatsFinora().init();

});
