import { state } from "./state.js";

let canvasRegistry=new Map();

export function initializeCharts(){

document.addEventListener("finora-route-change",event=>{

if(event.detail==="dashboard"){

renderDashboardCharts();

}

if(event.detail==="portfolio"){

renderPortfolioCharts();

}

});

window.addEventListener("resize",()=>{

redrawAll();

});

}

export function createCanvasChart(containerId,config){

const container=document.getElementById(containerId);

if(!container)return;

container.innerHTML="";

const canvas=document.createElement("canvas");

canvas.width=container.clientWidth*2;

canvas.height=320*2;

canvas.style.width="100%";

canvas.style.height="320px";

container.appendChild(canvas);

canvasRegistry.set(containerId,{

canvas,

config

});

draw(canvas,config);

}

function draw(canvas,config){

const ctx=canvas.getContext("2d");

const width=canvas.width;

const height=canvas.height;

ctx.clearRect(0,0,width,height);

drawBackground(ctx,width,height);

drawGrid(ctx,width,height);

switch(config.type){

case"bar":

drawBars(ctx,width,height,config);

break;

case"line":

drawLine(ctx,width,height,config);

break;

case"doughnut":

drawDoughnut(ctx,width,height,config);

break;

default:

drawBars(ctx,width,height,config);

}

}

function drawBackground(ctx,w,h){

ctx.fillStyle="#08110d";

ctx.fillRect(0,0,w,h);

}

function drawGrid(ctx,w,h){

ctx.strokeStyle="rgba(255,255,255,.05)";

ctx.lineWidth=2;

for(let i=0;i<6;i++){

const y=(h/6)*i;

ctx.beginPath();

ctx.moveTo(0,y);

ctx.lineTo(w,y);

ctx.stroke();

}

}

function drawBars(ctx,w,h,config){

const values=config.values||[];

const labels=config.labels||[];

const max=Math.max(...values,1);

const spacing=w/(values.length+1);

values.forEach((value,index)=>{

const barHeight=(value/max)*(h*.72);

const x=(index+1)*spacing-40;

const y=h-barHeight-50;

const gradient=ctx.createLinearGradient(0,y,0,h);

gradient.addColorStop(0,"#48ffd2");

gradient.addColorStop(1,"#00c875");

ctx.fillStyle=gradient;

roundRect(ctx,x,y,80,barHeight,16,true);

ctx.fillStyle="#effff9";

ctx.font="28px Inter";

ctx.textAlign="center";

ctx.fillText(labels[index]||"",x+40,h-12);

});

}

function drawLine(ctx,w,h,config){

const values=config.values||[];

if(values.length===0)return;

const max=Math.max(...values,1);

ctx.strokeStyle="#00ff9c";

ctx.lineWidth=6;

ctx.beginPath();

values.forEach((value,index)=>{

const x=(index/(values.length-1))*w;

const y=h-((value/max)*(h*.7))-40;

if(index===0){

ctx.moveTo(x,y);

}else{

ctx.lineTo(x,y);

}

});

ctx.stroke();

values.forEach((value,index)=>{

const x=(index/(values.length-1))*w;

const y=h-((value/max)*(h*.7))-40;

ctx.beginPath();

ctx.arc(x,y,8,0,Math.PI*2);

ctx.fillStyle="#48ffd2";

ctx.fill();

});

}

function drawDoughnut(ctx,w,h,config){

const values=config.values||[];

const colors=config.colors||defaultColors();

const total=values.reduce((a,b)=>a+b,0);

let start=-Math.PI/2;

values.forEach((value,index)=>{

const angle=(value/total)*Math.PI*2;

ctx.beginPath();

ctx.lineWidth=42;

ctx.strokeStyle=colors[index%colors.length];

ctx.arc(

w/2,

h/2,

110,

start,

start+angle

);

ctx.stroke();

start+=angle;

});

ctx.fillStyle="#effff9";

ctx.font="bold 40px Inter";

ctx.textAlign="center";

ctx.fillText(

`${Math.round(total)}%`,

w/2,

h/2+15

);

}

function roundRect(ctx,x,y,w,h,r,fill){

ctx.beginPath();

ctx.moveTo(x+r,y);

ctx.arcTo(x+w,y,x+w,y+h,r);

ctx.arcTo(x+w,y+h,x,y+h,r);

ctx.arcTo(x,y+h,x,y,r);

ctx.arcTo(x,y,x+w,y,r);

ctx.closePath();

if(fill){

ctx.fill();

}

}

function redrawAll(){

canvasRegistry.forEach(item=>{

draw(item.canvas,item.config);

});

}

function renderDashboardCharts(){

if(!document.getElementById("dashboardAllocationChart"))return;

createCanvasChart("dashboardAllocationChart",{

type:"doughnut",

values:[60,28,12],

labels:["Equity","Bonds","Cash"]

});

createCanvasChart("dashboardRiskChart",{

type:"bar",

labels:["Low","Medium","High"],

values:[30,52,18]

});

createCanvasChart("dashboardTrendChart",{

type:"line",

values:[62,66,64,72,76,82,88]

});

}

function renderPortfolioCharts(){

if(!document.getElementById("portfolioAllocationChart"))return;

const allocation={};

state.portfolio.forEach(asset=>{

allocation[asset.type]=(allocation[asset.type]||0)+asset.allocation;

});

createCanvasChart("portfolioAllocationChart",{

type:"bar",

labels:Object.keys(allocation),

values:Object.values(allocation)

});

const sectors={};

state.portfolio.forEach(asset=>{

const key=asset.sector||"Other";

sectors[key]=(sectors[key]||0)+asset.allocation;

});

createCanvasChart("portfolioSectorChart",{

type:"doughnut",

labels:Object.keys(sectors),

values:Object.values(sectors)

});

}

function defaultColors(){

return[

"#00ff9c",

"#48ffd2",

"#5ec9ff",

"#ffd166",

"#ff6b81",

"#b18cff",

"#79f2ff",

"#7effc9"

];

}
