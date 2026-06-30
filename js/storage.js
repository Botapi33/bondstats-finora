import { state } from "./state.js";

const STORAGE_KEY = "bondstats-finora-v1";

const DEFAULT_DATA = {

portfolio:[],

conversations:[],

notes:[],

collections:[],

bookmarks:[],

dailyBrief:{},

learnHistory:[],

futureHistory:[],

settings:{

theme:"dark",

offline:true,

animations:true

}

};

export function loadStorage(){

try{

const raw=localStorage.getItem(STORAGE_KEY);

if(!raw){

saveStorage();

return;

}

const data=JSON.parse(raw);

Object.assign(state,data);

}catch(error){

console.error("Storage load failed",error);

resetStorage();

}

}

export function saveStorage(){

const payload={

portfolio:state.portfolio,

conversations:state.conversations,

notes:state.notes,

collections:state.collections,

bookmarks:state.bookmarks,

dailyBrief:state.dailyBrief,

learnHistory:state.learnHistory,

futureHistory:state.futureHistory,

settings:state.settings

};

localStorage.setItem(

STORAGE_KEY,

JSON.stringify(payload)

);

}

export function resetStorage(){

Object.assign(state,structuredClone(DEFAULT_DATA));

saveStorage();

}

export function exportState(){

return JSON.stringify({

exportedAt:new Date().toISOString(),

version:"1.0",

data:{

portfolio:state.portfolio,

conversations:state.conversations,

notes:state.notes,

collections:state.collections,

bookmarks:state.bookmarks,

dailyBrief:state.dailyBrief,

learnHistory:state.learnHistory,

futureHistory:state.futureHistory,

settings:state.settings

}

},null,2);

}

export function importState(json){

try{

const parsed=JSON.parse(json);

if(!parsed.data){

throw new Error("Invalid backup");

}

Object.assign(state,parsed.data);

saveStorage();

return true;

}catch(error){

console.error(error);

return false;

}

}

export function downloadBackup(){

const blob=new Blob(

[exportState()],

{

type:"application/json"

}

);

const url=URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download=`bondstats-finora-backup-${Date.now()}.json`;

document.body.appendChild(a);

a.click();

a.remove();

URL.revokeObjectURL(url);

}

window.addEventListener("beforeunload",()=>{

saveStorage();

});
