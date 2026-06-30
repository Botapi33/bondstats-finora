import { state } from "./state.js";
import { exportState, downloadBackup } from "./storage.js";
import { toast } from "./ui.js";

export function exportJSON(filename,data){

const blob=new Blob(
[
JSON.stringify(data,null,2)
],
{
type:"application/json;charset=utf-8"
}
);

downloadBlob(filename,blob);

}

export function exportCSV(filename,rows){

if(!rows.length){

toast("Nothing to export");

return;

}

const headers=Object.keys(rows[0]);

const csv=[
headers,
...rows.map(row=>
headers.map(header=>
`"${String(row[header]??"").replaceAll('"','""')}"`
).join(",")
)
].join("\n");

const blob=new Blob(
[csv],
{
type:"text/csv;charset=utf-8"
}
);

downloadBlob(filename,blob);

}

export function exportConversation(conversation){

if(!conversation){

toast("No conversation selected");

return;

}

const text=conversation.messages.map(message=>{

return `${message.role.toUpperCase()}

${message.content}

`;

}).join("\n---\n\n");

const blob=new Blob(
[text],
{
type:"text/plain;charset=utf-8"
}
);

downloadBlob(
`finora-conversation-${conversation.id}.txt`,
blob
);

toast("Conversation exported");

}

export function exportPortfolioCSV(){

const rows=state.portfolio.map(asset=>({

Name:asset.name,

Type:asset.type,

Allocation:asset.allocation,

Region:asset.region,

Sector:asset.sector,

Currency:asset.currency,

Risk:asset.risk,

Notes:asset.notes

}));

exportCSV(
"bondstats-finora-portfolio.csv",
rows
);

toast("Portfolio CSV exported");

}

export function exportPortfolioJSON(){

exportJSON(
"bondstats-finora-portfolio.json",
state.portfolio
);

toast("Portfolio JSON exported");

}

export function exportResearchJSON(){

exportJSON(
"bondstats-finora-research.json",
{
notes:state.notes,
bookmarks:state.bookmarks,
collections:state.collections
}
);

toast("Research exported");

}

export function printWorkspace(){

window.print();

}

export function downloadFullBackup(){

downloadBackup();

toast("Backup downloaded");

}

export function copyToClipboard(text,message="Copied"){

navigator.clipboard

?.writeText(text)

.then(()=>toast(message))

.catch(()=>toast("Clipboard unavailable"));

}

function downloadBlob(filename,blob){

const url=URL.createObjectURL(blob);

const link=document.createElement("a");

link.href=url;

link.download=filename;

document.body.appendChild(link);

link.click();

link.remove();

URL.revokeObjectURL(url);

}

export function registerExportShortcuts(){

document.addEventListener("keydown",event=>{

if(!(event.metaKey||event.ctrlKey))return;

if(event.key.toLowerCase()==="e"){

event.preventDefault();

downloadFullBackup();

}

if(event.key.toLowerCase()==="p"){

event.preventDefault();

printWorkspace();

}

});

}

export function getWorkspaceSnapshot(){

return exportState();

}
