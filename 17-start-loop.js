/* ===== KHỞI ĐỘNG & VÒNG LẶP ===== */
function boot(){ME={id:"me",nm:S.nm,lk:S.lk,r:"g",seat:-1,x:830,y:440,ent:0,st:S.stars,od:null,dr:null};RP={};IS.me={V:{},hd:{},fr:0,f0:1};build()}
function begin(){$("#st").style.display="none";
if(!started){started=true;A.v=S.v;A.init();boot()}else{ME.nm=S.nm;ME.lk=S.lk;ME.x=830;ME.y=440;ME.ent=0;ME.seat=-1}if(A.ac)A.bell();
if(S.r=="b")goBar();else goSeat(-1);
if(!S.tut){S.tut=1;help()}else{closeModal();if(S.r=="m")goStage()}
save();pub()}
const hasSave=!!load();$("#cont").style.display=hasSave?"":"none";
$("#cont").onclick=()=>{S=load();begin()};
$("#newb").onclick=function(){if(hasSave&&!this.dataset.s){this.dataset.s=1;this.textContent="Ghi đè bản lưu? Bấm lần nữa";return}S=mkSave();CC={nm:"",lk:S.lk.slice(),r:"g",p:2};$("#st").style.display="none";cc()};
addEventListener("pagehide",()=>{if(started)save()});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&started)save()});
let last=performance.now();
(function loop(n){const dt=Math.min(.05,(n-last)/1e3);last=n;
try{if(started){update(dt);(VIEW?drawFront:draw)(n/1e3);if((hT+=dt)>.2){hT=0;hud()}}}catch(e){console.error(e)}
requestAnimationFrame(loop)})(last);