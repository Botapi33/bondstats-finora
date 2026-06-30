/* ==========================================================================
   BondStats Finora
   File: js/data.js
   ========================================================================== */

export const KNOWLEDGE_TOPICS=[

{
id:"stocks",
title:"Stocks",
category:"Equities",
difficulty:"Beginner",
tags:["equity","valuation","earnings","markets"],
summary:"Ownership interests in publicly traded companies.",
related:["etfs","portfolio","valuation"]
},

{
id:"bonds",
title:"Bonds",
category:"Fixed Income",
difficulty:"Intermediate",
tags:["yield","duration","credit","interest rates"],
summary:"Debt securities paying periodic coupons or issued at discount.",
related:["rates","inflation","portfolio"]
},

{
id:"etfs",
title:"Exchange Traded Funds",
category:"Investing",
difficulty:"Beginner",
tags:["index","diversification","fund"],
summary:"Diversified investment vehicles traded like stocks.",
related:["stocks","portfolio"]
},

{
id:"inflation",
title:"Inflation",
category:"Macroeconomics",
difficulty:"Intermediate",
tags:["CPI","prices","economy"],
summary:"Persistent increase in the general price level.",
related:["rates","centralbanks"]
},

{
id:"rates",
title:"Interest Rates",
category:"Macroeconomics",
difficulty:"Intermediate",
tags:["yield","policy","central bank"],
summary:"The price of borrowing money across different maturities.",
related:["bonds","inflation"]
},

{
id:"centralbanks",
title:"Central Banks",
category:"Macroeconomics",
difficulty:"Advanced",
tags:["FED","ECB","policy","liquidity"],
summary:"Institutions responsible for monetary policy and financial stability.",
related:["rates","inflation"]
},

{
id:"currencies",
title:"Currencies",
category:"FX",
difficulty:"Intermediate",
tags:["USD","EUR","FX"],
summary:"Exchange rates between monetary systems.",
related:["trade","macro"]
},

{
id:"commodities",
title:"Commodities",
category:"Markets",
difficulty:"Intermediate",
tags:["gold","oil","metals"],
summary:"Physical goods traded globally.",
related:["inflation","portfolio"]
},

{
id:"portfolio",
title:"Portfolio Management",
category:"Investment",
difficulty:"Intermediate",
tags:["allocation","risk","diversification"],
summary:"Construction and management of investment portfolios.",
related:["stocks","bonds","etfs"]
},

{
id:"risk",
title:"Risk Management",
category:"Investment",
difficulty:"Advanced",
tags:["volatility","VaR","drawdown"],
summary:"Frameworks used to identify and manage financial risks.",
related:["portfolio"]
}

];

export const LEARN_ARTICLES=[

{
id:1,
title:"Understanding Duration",
minutes:8,
level:"Intermediate"
},

{
id:2,
title:"How Diversification Works",
minutes:6,
level:"Beginner"
},

{
id:3,
title:"Reading Yield Curves",
minutes:12,
level:"Advanced"
},

{
id:4,
title:"Equity Valuation Basics",
minutes:10,
level:"Intermediate"
},

{
id:5,
title:"Inflation Explained",
minutes:7,
level:"Beginner"
}

];

export const DAILY_BRIEF_TEMPLATE={

markets:[
"Global equities",
"Government bonds",
"Corporate bonds",
"Credit spreads",
"Currencies",
"Commodities"
],

calendar:[
"Central Bank Meetings",
"Economic Releases",
"Earnings Season",
"Inflation Data"
],

sections:[

{
title:"Market Overview",
text:"Summarize today's financial market developments."
},

{
title:"Bond Market",
text:"Highlight important fixed-income developments."
},

{
title:"Macro",
text:"Explain macroeconomic drivers."
},

{
title:"AI & Future Finance",
text:"Cover emerging technology and financial innovation."
}

]

};

export const FUTURE_SCENARIOS=[

{
title:"AI Productivity Boom",
category:"Technology"
},

{
title:"Tokenized Capital Markets",
category:"Digital Assets"
},

{
title:"CBDC Adoption",
category:"Central Banking"
},

{
title:"Autonomous Financial Advisors",
category:"Artificial Intelligence"
},

{
title:"Climate Capital Reallocation",
category:"ESG"
},

{
title:"Programmable Money",
category:"Payments"
}

];

export const QUICK_PROMPTS=[

"Explain bond duration",

"Compare ETFs vs Mutual Funds",

"How do interest rates affect stocks?",

"Explain inflation simply",

"Analyze a diversified portfolio",

"How does the yield curve work?",

"Explain GDP",

"What is credit risk?",

"Create a portfolio checklist",

"Summarize macroeconomic risks"

];

export const INVESTMENT_MODES=[

{
id:"professional",
title:"Professional"
},

{
id:"student",
title:"Student"
},

{
id:"investor",
title:"Investor"
},

{
id:"research",
title:"Research"
},

{
id:"eli5",
title:"Explain Like I'm 5"
}

];
