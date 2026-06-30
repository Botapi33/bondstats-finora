import { state } from "./state.js";
import { saveStorage } from "./storage.js";
import { toast } from "./ui.js";

export function initializeResearch(){

document.addEventListener("finora-route-change",event=>{

if(event.detail==="research"){

renderResearch();

}

});

renderResearch();

}

function renderResearch(){

const view=document.getElementById("view-research");

if(!view)return;

view.innerHTML=`

<div class="page fade-in">

<div class="section-header">

<div>

<h1 class="section-title">Research Workspace</h1>

<p class="section-description">
Notes, bookmarks, collections, tags and pinned financial research.
</p>

</div>

<button class="button button-primary" id="newNoteBtn">
New Note
</button>

</div>

<div class="grid grid-2">

<div class="card">

<h3>Research Notes</h3>

<div class="stack" style="margin-top:18px">

<input class="input" id="noteTitle" placeholder="Research title">

<textarea class="textarea" id="noteBody" placeholder="Write a financial research note..." style="min-height:220px"></textarea>

<input class="input" id="noteTags" placeholder="Tags separated by commas">

<button class="button button-primary" id="saveNoteBtn">
Save Note
</button>

</div>

</div>

<div class="card">

<h3>Bookmarks</h3>

<div class="stack" style="margin-top:18px">

<input class="input" id="bookmarkTitle" placeholder="Bookmark title">

<input class="input" id="bookmarkUrl" placeholder="Source or reference">

<input class="input" id="bookmarkTags" placeholder="Tags separated by commas">

<button class="button button-secondary" id="saveBookmarkBtn">
Save Bookmark
</button>

</div>

</div>

</div>

<div class="grid grid-2">

<div class="card">

<h3>Pinned Research</h3>

<div id="pinnedResearch" class="stack" style="margin-top:18px"></div>

</div>

<div class="card">

<h3>Collections</h3>

<div class="inline" style="margin-top:18px">

<input class="input" id="collectionName" placeholder="Collection name">

<button class="button button-secondary" id="saveCollectionBtn">
Create
</button>

</div>

<div id="collectionList" class="stack" style="margin-top:18px"></div>

</div>

</div>

<div class="card">

<h3>All Notes</h3>

<div id="notesList" class="stack" style="margin-top:18px"></div>

</div>

<div class="card">

<h3>All Bookmarks</h3>

<div id="bookmarksList" class="stack" style="margin-top:18px"></div>

</div>

</div>

`;

registerResearchEvents();

renderResearchLists();

}

function registerResearchEvents(){

document.getElementById("newNoteBtn")?.addEventListener("click",()=>{

document.getElementById("noteTitle")?.focus();

});

document.getElementById("saveNoteBtn")?.addEventListener("click",saveNote);

document.getElementById("saveBookmarkBtn")?.addEventListener("click",saveBookmark);

document.getElementById("saveCollectionBtn")?.addEventListener("click",saveCollection);

document.addEventListener("finora-search",event=>{

if(state.route==="research"){

renderResearchLists(event.detail);

}

});

}

function saveNote(){

const title=document.getElementById("noteTitle").value.trim();

const body=document.getElementById("noteBody").value.trim();

const tags=parseTags(document.getElementById("noteTags").value);

if(!title||!body){

toast("Title and note body required");

return;

}

state.notes.unshift({

id:crypto.randomUUID(),

title,

body,

tags,

pinned:false,

createdAt:new Date().toISOString(),

updatedAt:new Date().toISOString()

});

saveStorage();

clearNoteForm();

renderResearchLists();

toast("Research note saved");

}

function saveBookmark(){

const title=document.getElementById("bookmarkTitle").value.trim();

const url=document.getElementById("bookmarkUrl").value.trim();

const tags=parseTags(document.getElementById("bookmarkTags").value);

if(!title||!url){

toast("Bookmark title and reference required");

return;

}

state.bookmarks.unshift({

id:crypto.randomUUID(),

title,

url,

tags,

pinned:false,

createdAt:new Date().toISOString()

});

saveStorage();

document.getElementById("bookmarkTitle").value="";

document.getElementById("bookmarkUrl").value="";

document.getElementById("bookmarkTags").value="";

renderResearchLists();

toast("Bookmark saved");

}

function saveCollection(){

const name=document.getElementById("collectionName").value.trim();

if(!name){

toast("Collection name required");

return;

}

state.collections.unshift({

id:crypto.randomUUID(),

name,

items:[],

createdAt:new Date().toISOString()

});

saveStorage();

document.getElementById("collectionName").value="";

renderResearchLists();

toast("Collection created");

}

function clearNoteForm(){

document.getElementById("noteTitle").value="";

document.getElementById("noteBody").value="";

document.getElementById("noteTags").value="";

}

function parseTags(value){

return value

.split(",")

.map(tag=>tag.trim())

.filter(Boolean);

}

function renderResearchLists(query=""){

renderNotes(query);

renderBookmarks(query);

renderPinned();

renderCollections();

}

function renderNotes(query=""){

const target=document.getElementById("notesList");

if(!target)return;

const notes=state.notes.filter(note=>

matches(note.title,query)||

matches(note.body,query)||

note.tags.some(tag=>matches(tag,query))

);

if(notes.length===0){

target.innerHTML="<p>No notes found.</p>";

return;

}

target.innerHTML=notes.map(note=>`

<div class="card">

<div class="section-header">

<div>

<h3>${escapeHTML(note.title)}</h3>

<small>${new Date(note.updatedAt).toLocaleString()}</small>

</div>

<div class="inline">

<button class="button button-secondary" data-pin-note="${note.id}">
${note.pinned?"Unpin":"Pin"}
</button>

<button class="button button-secondary" data-delete-note="${note.id}">
Delete
</button>

</div>

</div>

<p style="margin-top:14px">${escapeHTML(note.body)}</p>

<div class="inline" style="margin-top:14px">
${note.tags.map(tag=>`<span class="badge">${escapeHTML(tag)}</span>`).join("")}
</div>

</div>

`).join("");

target.querySelectorAll("[data-pin-note]").forEach(button=>{

button.addEventListener("click",()=>toggleNotePin(button.dataset.pinNote));

});

target.querySelectorAll("[data-delete-note]").forEach(button=>{

button.addEventListener("click",()=>deleteNote(button.dataset.deleteNote));

});

}

function renderBookmarks(query=""){

const target=document.getElementById("bookmarksList");

if(!target)return;

const bookmarks=state.bookmarks.filter(bookmark=>

matches(bookmark.title,query)||

matches(bookmark.url,query)||

bookmark.tags.some(tag=>matches(tag,query))

);

if(bookmarks.length===0){

target.innerHTML="<p>No bookmarks saved.</p>";

return;

}

target.innerHTML=bookmarks.map(bookmark=>`

<div class="card">

<div class="section-header">

<div>

<h3>${escapeHTML(bookmark.title)}</h3>

<p>${escapeHTML(bookmark.url)}</p>

</div>

<div class="inline">

<button class="button button-secondary" data-pin-bookmark="${bookmark.id}">
${bookmark.pinned?"Unpin":"Pin"}
</button>

<button class="button button-secondary" data-delete-bookmark="${bookmark.id}">
Delete
</button>

</div>

</div>

<div class="inline" style="margin-top:14px">
${bookmark.tags.map(tag=>`<span class="badge">${escapeHTML(tag)}</span>`).join("")}
</div>

</div>

`).join("");

target.querySelectorAll("[data-pin-bookmark]").forEach(button=>{

button.addEventListener("click",()=>toggleBookmarkPin(button.dataset.pinBookmark));

});

target.querySelectorAll("[data-delete-bookmark]").forEach(button=>{

button.addEventListener("click",()=>deleteBookmark(button.dataset.deleteBookmark));

});

}

function renderPinned(){

const target=document.getElementById("pinnedResearch");

if(!target)return;

const pinned=[

...state.notes.filter(item=>item.pinned).map(item=>({type:"Note",...item})),

...state.bookmarks.filter(item=>item.pinned).map(item=>({type:"Bookmark",...item}))

];

if(pinned.length===0){

target.innerHTML="<p>No pinned research yet.</p>";

return;

}

target.innerHTML=pinned.map(item=>`

<div class="card">

<span class="badge">${item.type}</span>

<h3 style="margin-top:12px">${escapeHTML(item.title)}</h3>

<p>${escapeHTML(item.body||item.url||"")}</p>

</div>

`).join("");

}

function renderCollections(){

const target=document.getElementById("collectionList");

if(!target)return;

if(state.collections.length===0){

target.innerHTML="<p>No collections created.</p>";

return;

}

target.innerHTML=state.collections.map(collection=>`

<div class="card">

<div class="section-header">

<h3>${escapeHTML(collection.name)}</h3>

<button class="button button-secondary" data-delete-collection="${collection.id}">
Delete
</button>

</div>

<p>${collection.items.length} saved items</p>

</div>

`).join("");

target.querySelectorAll("[data-delete-collection]").forEach(button=>{

button.addEventListener("click",()=>{

state.collections=state.collections.filter(item=>item.id!==button.dataset.deleteCollection);

saveStorage();

renderCollections();

toast("Collection deleted");

});

});

}

function toggleNotePin(id){

const note=state.notes.find(item=>item.id===id);

if(!note)return;

note.pinned=!note.pinned;

saveStorage();

renderResearchLists();

}

function toggleBookmarkPin(id){

const bookmark=state.bookmarks.find(item=>item.id===id);

if(!bookmark)return;

bookmark.pinned=!bookmark.pinned;

saveStorage();

renderResearchLists();

}

function deleteNote(id){

state.notes=state.notes.filter(item=>item.id!==id);

saveStorage();

renderResearchLists();

toast("Note deleted");

}

function deleteBookmark(id){

state.bookmarks=state.bookmarks.filter(item=>item.id!==id);

saveStorage();

renderResearchLists();

toast("Bookmark deleted");

}

function matches(value,query){

if(!query)return true;

return String(value).toLowerCase().includes(query.toLowerCase());

}

function escapeHTML(value){

return String(value).replace(/[&<>"']/g,character=>({

"&":"&amp;",

"<":"&lt;",

">":"&gt;",

'"':"&quot;",

"'":"&#039;"

}[character]));

}
