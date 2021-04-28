(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{49:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return s})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return d}));var a=n(3),r=n(7),i=(n(0),n(69)),o=n(73),s={id:"context",title:"Context Operators"},c={unversionedId:"context",id:"context",isDocsHomePage:!1,title:"Context Operators",description:"Context Operators",source:"@site/docs/context.mdx",sourceDirName:".",slug:"/context",permalink:"/json-logic-engine/docs/context",editUrl:"https://github.com/TotalTechGeek/json-logic-engine-documentation/edit/master/website/docs/context.mdx",version:"current",frontMatter:{id:"context",title:"Context Operators"},sidebar:"someSidebar",previous:{title:"Miscellaneous Operators",permalink:"/json-logic-engine/docs/misc"},next:{title:"Higher Order Operators",permalink:"/json-logic-engine/docs/higher"}},l=[{value:"var",id:"var",children:[]},{value:"Missing",id:"missing",children:[]},{value:"Missing Some",id:"missing-some",children:[]}],b={toc:l};function d(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(i.b)("wrapper",Object(a.a)({},b,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h1",null,"Context Operators"),Object(i.b)("table",null,Object(i.b)("thead",{parentName:"table"},Object(i.b)("tr",{parentName:"thead"},Object(i.b)("th",{parentName:"tr",align:null},"Operators"),Object(i.b)("th",{parentName:"tr",align:null},"Instruction"))),Object(i.b)("tbody",{parentName:"table"},Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},"var"),Object(i.b)("td",{parentName:"tr",align:null},"var")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},"missing"),Object(i.b)("td",{parentName:"tr",align:null},"missing")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},"missing_some"),Object(i.b)("td",{parentName:"tr",align:null},"missing_some")))),Object(i.b)("p",null,"These operators allow you to fetch data from the context ","&"," check for the existence of values."),Object(i.b)("br",null),"Additionally, these operators support handlebars style data traversal  inside of higher order operators (next page).",Object(i.b)("h2",{id:"var"},"var"),Object(i.b)("p",null,"By just using ",Object(i.b)("inlineCode",{parentName:"p"},"''")," as the input for var, you can get the current value that is in scope, regardless of its type."),Object(i.b)(o.a,{defaultLogic:{var:""},defaultData:"Test",mdxType:"LogicRunner"}),Object(i.b)("p",null,"If you wish, you can drill down and fetch specific properties: "),Object(i.b)(o.a,{defaultLogic:{"+":[{var:"a"},{var:"b.c"},{var:"d.0"}]},defaultData:{a:1,b:{c:2},d:[3]},mdxType:"LogicRunner"}),Object(i.b)("h2",{id:"missing"},"Missing"),Object(i.b)("p",null,'Returns an array of the values that are "missing"'),Object(i.b)(o.a,{defaultLogic:{missing:["a","b"]},defaultData:{a:!0},mdxType:"LogicRunner"}),Object(i.b)("h2",{id:"missing-some"},"Missing Some"),Object(i.b)("p",null,"From ",Object(i.b)("inlineCode",{parentName:"p"},"json-logic-js"),", passing in the number of required variables ","&"," the variable names, if it has enough of them, it'll return an empty array, otherwise it'll return the items that are missing."),Object(i.b)(o.a,{defaultLogic:{missing_some:[1,["a","b","c"]]},defaultData:{a:!0},mdxType:"LogicRunner"}))}d.isMDXComponent=!0}}]);