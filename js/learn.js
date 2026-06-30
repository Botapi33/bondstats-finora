import { state } from "./state.js";
import { saveStorage } from "./storage.js";
import { toast } from "./ui.js";
import { KNOWLEDGE_TOPICS, LEARN_ARTICLES } from "./data.js";

export function initializeLearn(){

document.addEventListener("finora-route-change",event=>{

if(event.detail==="learn"){

renderLearn();

}

});

renderLearn();

}

function renderLearn(){

const view=document.getElementById("view-learn");

if(!view)return;

view.innerHTML=`

<div class="page fade-in">

<div class="section-header">

<div>

<h1 class="section-title">Learn Intelligence</h1>

<p class="section-description">
Personalized financial education, concept maps, quizzes and summaries.
</p>

</div>

<button class="button button-primary" id="generateQuizBtn">
Generate Quiz
</button>

</div>

<div class="grid grid-3">

<div class="card">

<h3>Recommended Articles</h3>

<div class="stack" id="articleList" style="margin-top:18px"></div>

</div>

<div class="card">

<h3>Related Concepts</h3>

<div class="stack" id="conceptList" style="margin-top:18px"></div>

</div>

<div class="card">

<h3>Learning Progress</h3>

<div class="metric-value" id="learnProgress">0%</div>

<div class="progress" style="margin-top:18px">
<div class="progress-fill" id="learnProgressBar"></div>
</div>

<p style="margin-top:18px">
Progress is stored locally on this device.
</p>

</div>

</div>

<div class="card">

<h3>Concept Summary Generator</h3>

<div class="inline" style="margin-top:18px">

<select class="select" id="summaryTopic">
${KNOWLEDGE_TOPICS.map(topic=>`
<option value="${topic.id}">
${topic.title}
</option>
`).join("")}
</select>

<button class="button button-secondary" id="summaryBtn">
Create Summary
</button>

</div>

<div class="card" id="summaryOutput" style="margin-top:18px">
<p>Select a topic to generate a structured summary.</p>
</div>

</div>

<div class="card">

<h3>Quiz</h3>

<div id="quizOutput" style="margin-top:18px">
<p>No quiz generated yet.</p>
</div>

</div>

</div>

`;

renderArticles();

renderConcepts();

renderProgress();

registerLearnEvents();

}

function renderArticles(){

const list=document.getElementById("articleList");

if(!list)return;

list.innerHTML=LEARN_ARTICLES.map(article=>`

<button class="button button-secondary learn-article" data-id="${article.id}">
${article.title} • ${article.minutes} min • ${article.level}
</button>

`).join("");

list.querySelectorAll(".learn-article").forEach(button=>{

button.addEventListener("click",()=>{

const article=LEARN_ARTICLES.find(item=>item.id===Number(button.dataset.id));

if(!article)return;

if(!state.learnHistory.includes(article.id)){

state.learnHistory.push(article.id);

saveStorage();

}

toast(`Opened ${article.title}`);

renderProgress();

});

});

}

function renderConcepts(){

const list=document.getElementById("conceptList");

if(!list)return;

list.innerHTML=KNOWLEDGE_TOPICS.slice(0,8).map(topic=>`

<div class="card">
<strong>${topic.title}</strong>
<p>${topic.summary}</p>
<div class="inline" style="margin-top:12px">
${topic.tags.slice(0,3).map(tag=>`
<span class="badge">${tag}</span>
`).join("")}
</div>
</div>

`).join("");

}

function renderProgress(){

const progress=Math.round(

(state.learnHistory.length/LEARN_ARTICLES.length)*100

);

document.getElementById("learnProgress").textContent=`${progress}%`;

document.getElementById("learnProgressBar").style.width=`${progress}%`;

}

function registerLearnEvents(){

document.getElementById("summaryBtn")?.addEventListener("click",()=>{

const id=document.getElementById("summaryTopic").value;

const topic=KNOWLEDGE_TOPICS.find(item=>item.id===id);

if(!topic)return;

document.getElementById("summaryOutput").innerHTML=`

<h3>${topic.title}</h3>

<p>${topic.summary}</p>

<hr style="margin:18px 0">

<h4>Why it matters</h4>

<p>
${topic.title} connects to risk, return, liquidity, time horizon and portfolio construction.
Understanding it helps investors interpret market behavior more clearly.
</p>

<h4 style="margin-top:18px">Related Concepts</h4>

<div class="inline" style="margin-top:12px">
${topic.related.map(item=>`
<span class="badge">${item}</span>
`).join("")}
</div>

`;

});

document.getElementById("generateQuizBtn")?.addEventListener("click",generateQuiz);

}

function generateQuiz(){

const topics=[...KNOWLEDGE_TOPICS]

.sort(()=>Math.random()-.5)

.slice(0,5);

document.getElementById("quizOutput").innerHTML=`

<div class="stack">

${topics.map((topic,index)=>`

<div class="card quiz-question">

<h4>${index+1}. What best describes ${topic.title}?</h4>

<div class="stack" style="margin-top:12px">

<button class="button button-secondary quiz-answer" data-correct="true">
${topic.summary}
</button>

<button class="button button-secondary quiz-answer">
A guaranteed way to avoid all investment risk.
</button>

<button class="button button-secondary quiz-answer">
A fixed return product with no market sensitivity.
</button>

</div>

</div>

`).join("")}

</div>

`;

document.querySelectorAll(".quiz-answer").forEach(button=>{

button.addEventListener("click",()=>{

if(button.dataset.correct){

button.classList.add("button-primary");

toast("Correct");

}else{

toast("Try again");

}

});

});

}
