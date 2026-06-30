export function renderMarkdown(markdown){

if(!markdown){

return"";

}

let html=escapeHTML(markdown);

html=renderCodeBlocks(html);

html=renderTables(html);

html=renderHeadings(html);

html=renderBold(html);

html=renderInlineCode(html);

html=renderLists(html);

html=renderParagraphs(html);

return html;

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

function renderCodeBlocks(html){

return html.replace(/```([\s\S]*?)```/g,(match,code)=>{

return`
<pre class="code-block"><code>${code.trim()}</code></pre>
`;

});

}

function renderInlineCode(html){

return html.replace(/`([^`]+)`/g,`

<code class="inline-code">$1</code>

`);

}

function renderHeadings(html){

html=html.replace(/^### (.*)$/gm,"<h4>$1</h4>");

html=html.replace(/^## (.*)$/gm,"<h3>$1</h3>");

html=html.replace(/^# (.*)$/gm,"<h2>$1</h2>");

return html;

}

function renderBold(html){

return html.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");

}

function renderLists(html){

const lines=html.split("\n");

let output=[];

let inList=false;

for(const line of lines){

if(line.trim().startsWith("- ")){

if(!inList){

output.push("<ul class='markdown-list'>");

inList=true;

}

output.push(`<li>${line.trim().slice(2)}</li>`);

}else{

if(inList){

output.push("</ul>");

inList=false;

}

output.push(line);

}

}

if(inList){

output.push("</ul>");

}

return output.join("\n");

}

function renderTables(html){

const blocks=html.split("\n\n");

return blocks.map(block=>{

const lines=block.trim().split("\n");

if(lines.length<3)return block;

if(!lines[0].includes("|"))return block;

if(!lines[1].includes("---"))return block;

const headers=lines[0]

.split("|")

.map(cell=>cell.trim())

.filter(Boolean);

const rows=lines.slice(2).map(line=>

line

.split("|")

.map(cell=>cell.trim())

.filter(Boolean)

);

return`

<div class="table-wrapper">

<table class="table markdown-table">

<thead>

<tr>

${headers.map(header=>`<th>${header}</th>`).join("")}

</tr>

</thead>

<tbody>

${rows.map(row=>`

<tr>

${row.map(cell=>`<td>${cell}</td>`).join("")}

</tr>

`).join("")}

</tbody>

</table>

</div>

`;

}).join("\n\n");

}

function renderParagraphs(html){

return html

.split(/\n{2,}/)

.map(block=>{

const trimmed=block.trim();

if(!trimmed)return"";

if(

trimmed.startsWith("<h")||

trimmed.startsWith("<ul")||

trimmed.startsWith("<div")||

trimmed.startsWith("<pre")||

trimmed.startsWith("<table")

){

return trimmed;

}

return `<p>${trimmed.replace(/\n/g,"<br>")}</p>`;

})

.join("");

}
