"use strict";
/* MUSIC CAFÉ v4 – Dữ liệu › Âm thanh › Nhân vật › Nhạc cụ › Ngày đêm & ánh sáng › Quán › Mạng/Phòng › Pha chế › Sân khấu › Giao diện */
const $=s=>document.querySelector(s),R=Math.random,PI=Math.PI,cl=(v,a,b)=>Math.min(b,Math.max(a,v)),fl=Math.floor;
const W=800,H=500,KEY="musiccafe_v3",PERF=600,cv=$("#c"),ctx=cv.getContext("2d"),LM=document.createElement("canvas"),lm=LM.getContext("2d");
LM.width=W;LM.height=H;{const d=Math.min(2,devicePixelRatio||1);cv.width=W*d;cv.height=H*d;ctx.scale(d,d)}
const esc=s=>String(s).replace(/[&<>"']/g,c=>"&#"+c.charCodeAt(0)+";"),fmt=s=>{s=Math.max(0,Math.ceil(s));return fl(s/60)+":"+String(s%60).padStart(2,"0")};

