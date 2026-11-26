/* ===== SÂN KHẤU: chơi nhạc cụ thật & nhận tiền thưởng biểu diễn ===== */
function strike(st,I,id){const t=performance.now()/1e3;let m;
if(I.f=="g"){const s=id>>5,f=id&31;if(s>=I.o.length||f>I.fr)return null;m=I.o[s]+f;if(st.auto&&f>0)st.f0=cl(f-3,1,I.fr-10);st.V[s]=[t,f?cl(f-st.f0+1,1,11):0]}
else{const K=KY(I)[id];if(!K)return null;m=K.m;st.V[id]=[t]}
if(!A.ac)return null;
if(I.f=="p")A.piano(m);else if(I.f=="g")A.pluck(I.ty,fq(m));else if(I.f=="d")A.drum(id);else{st.hd[id]=1;return A.sax(m)}
return null}
function play(id){const I=IN[PF.i],st=IS.me,stop=strike(st,I,id);if(stop)RG.hold[id]=stop;NQ.push([++nseq,id]);if(NQ.length>8)NQ.shift();pub()}
function rel(id){const h=RG&&RG.hold[id];if(h){h();delete RG.hold[id];IS.me.hd[id]=0}}
function startPerf(i){
if(BR||RG||curPerf())return;
closeModal();
A.init();
PF={i,t0:Date.now(),likes:0};
NQ=[];
IS.me={V:{},hd:{},fr:0,f0:1};
ME.r="m";
ME.seat=200;
RG={hold:{},pt:{}};
const I2=IN[i],fs=$("#fsl");
fs.style.display=I2.f=="g"?"block":"none";
if(I2.f=="g"){fs.min=1;fs.max=I2.fr-10;fs.value=1}
$("#rh").style.display="block";
sizeR();
pub();
requestAnimationFrame(oloop);
}
function leaveStage(msg){
let rewardMsg=msg||"";
if(PF){
const dur=(Date.now()-PF.t0)/1000;
if(dur>=5){
const likes=PF.likes||0;
const earned=Math.min(100000, 10000 + likes*5000);
addMoney(earned);
rewardMsg="🎤 Biểu diễn xong! Nhận +"+vnd(earned)+" (10.000đ + "+likes+" lượt thích)";
}
}
if(RG){for(const k in RG.hold)try{RG.holdk}catch(e){}}
RG=null;
PF=null;
NQ=[];
$("#rh").style.display="none";
$("#fsl").style.display="none";
ME.r="g";
goSeat(-1);
if(rewardMsg)toast(rewardMsg);
}
const rc=$("#r"),rx=rc.getContext("2d"),HINT={p:"Phím A S D F G H J K L ; (trắng) · W E T Y U O P (đen) · Z/X đổi quãng tám · hoặc chạm/kéo trên phím",g:"Phím A S D F G H gảy 6 dây · phím 0–9 hoặc ↑↓ chọn phím đàn · hoặc chạm/lướt trên dây",s:"Giữ phím A S D F G H J K để thổi nốt · hoặc giữ ngón trên các nắp",d:"A Crash · S Hi-hat · D Snare · F J Tom · K hoặc Space Kick"};
function sizeR(){const d=Math.min(2,devicePixelRatio||1);rc.width=innerWidthd;rc.height=innerHeightd;rx.setTransform(d,0,0,d,0,0)}
addEventListener("resize",()=>{if(RG)sizeR()});
function tx(s,x0,y0,z,al){const x=G,f=q=>"700 "+q+"px 'Baloo 2',sans-serif";x.font=f(z);while(z>9&&x.measureText(s).width>innerWidth-16){z--;x.font=f(z)}x.textAlign=al||"center";x.lineWidth=4;x.lineJoin="round";x.strokeStyle="#4a2c1a";x.strokeText(s,x0,y0);x.fillStyle="#fff";x.fillText(s,x0,y0)}
function oloop(){if(!RG)return;G=rx;const x=rx,t=performance.now()/1e3,w=innerWidth,h=innerHeight,I=IN[PF.i],ver=I.f=="g"||I.f=="s",gw=I.f=="p"?160:ver?60:120,gh=I.f=="g"?128:ver?120:60,rem=PERF-(Date.now()-PF.t0)/1e3;
const rv=Object.values(RP).filter(p=>p.vk&&p.vk==myPeer).length,nd=need();
if(rv>=nd){banUntil=Date.now()+60000;PF=null;leaveStage("Khán giả đã mời bạn xuống sân khấu!");return}
if(rem<=0){leaveStage("👏 Hết giờ biểu diễn!");return}
let g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,"#dcd3b3");g.addColorStop(1,"#c4b891");x.fillStyle=g;x.fillRect(0,0,w,h);
for(let i=0;i<16;i++){const bx=i*w/15,by=14+Math.sin(i/15*PI)*22;x.fillStyle="rgba(70,50,30,.18)";x.beginPath();x.moveTo(bx-7,by+4);x.lineTo(bx+17,by+4);x.lineTo(bx+5,by+32);x.fill();x.fillStyle=["#e9a24c","#4fb3c8","#f0cf6a","#e8656b"][i%4];x.beginPath();x.moveTo(bx-12,by);x.lineTo(bx+12,by);x.lineTo(bx,by+28);x.fill()}
const top=100,bot=h-(I.f=="g"?96:64),u=Math.max(2,Math.floor(Math.min((w-16)/gw,(bot-top)/gh))),ox=Math.round((w-gw*u)/2),oy=top+Math.round((bot-top-gh*u)/2);RG.u=u;RG.ox=ox;RG.oy=oy;

x.fillStyle="rgba(40,24,30,.22)";x.fillRect(ox-6,oy+6,gwu+12,ghu+12);x.fillStyle="#cdbf9a";x.fillRect(ox-6,oy-6,gwu+12,ghu+12);
x.save();x.translate(ox,oy);x.scale(u,u);drawI(I,IS.me,t);x.restore();
if(I.f=="g"){$("#fsl").value=IS.me.f0;tx("Phím "+IS.me.f0+"–"+(IS.me.f0+10)+" / "+I.fr+" · kéo thanh để dịch cần đàn",w/2,h-62,13)}tx(I.e+" "+I.n,12,76,20,"left");tx("⏱ "+fmt(rem)+"   ⭐ +"+(PF.likes||0)+"   🚫 "+rv+"/"+nd,w-12,76,18,"right");tx(HINT[I.f],w/2,h-30,13);
requestAnimationFrame(oloop)}
const gp=e=>{const r=RG,I=IN[PF.i],gx=(e.clientX-r.ox)/r.u,gy=(e.clientY-r.oy)/r.u;const K=KY(I);return(K.ht||K.slice().reverse()).find(k=>inK(k,gx,gy))};
rc.addEventListener("pointerdown",e=>{if(!RG)return;e.preventDefault();const k=gp(e);if(k){RG.pt[e.pointerId]=k.id;play(kid(IN[PF.i],k,IS.me))}});
rc.addEventListener("pointermove",e=>{if(!RG||RG.pt[e.pointerId]==null)return;const k=gp(e);if(k&&k.id!=RG.pt[e.pointerId]){rel(RG.pt[e.pointerId]);RG.pt[e.pointerId]=k.id;play(kid(IN[PF.i],k,IS.me))}});
const pup=e=>{if(!RG||RG.pt[e.pointerId]==null)return;rel(RG.pt[e.pointerId]);delete RG.pt[e.pointerId]};
rc.addEventListener("pointerup",pup);rc.addEventListener("pointercancel",pup);rc.addEventListener("pointerleave",pup);
addEventListener("keydown",e=>{if(e.repeat)return;
if(RG){const I=IN[PF.i],st=IS.me;
if(I.f=="g"){const d=DG.indexOf(e.code),dv=e.code=="ArrowUp"?-1:e.code=="ArrowDown"?1:e.code=="PageUp"?-5:e.code=="PageDown"?5:0;if((d>=0&&d<=I.fr)||dv){e.preventDefault();st.fr=cl(d>=0?d:st.fr+dv,0,I.fr);if(st.fr&&(st.fr<st.f0||st.fr>st.f0+10))st.f0=cl(st.fr-3,1,I.fr-10);return}const s=GK.indexOf(e.code);if(s>=0&&s<I.o.length){e.preventDefault();play(s32+st.fr)}}
else if(I.f=="p"){const o=st.o||0,b0=23+7*o;if(e.code=="KeyZ"||e.code=="KeyX"){st.o=cl(o+(e.code=="KeyX"?1:-1),-3,2);return}const wi=WK.indexOf(e.code),bi=BM.findIndex(b=>b[2]==e.code);let m=null;if(wi>=0)m=WMI[b0+wi];else if(bi>=0)m=WMI[b0+BM[bi][0]]+1;if(m!=null){e.preventDefault();play(m-21)}}
else{const K=KY(I),k=K.find(k=>k.kc==e.code)||(I.f=="d"&&e.code=="Space"?K[5]:null);if(k){e.preventDefault();play(k.id)}}}
else if(BR&&(e.code=="Space"||e.code=="Enter")){e.preventDefault();if(BR.act)BR.act();else if(BR.dn)BR.dn()}
else if(e.code=="Escape"&&started){$("#md").classList.contains("on")?closeModal():settings()}});
addEventListener("keyup",e=>{if(RG){const I=IN[PF.i];if(I.f=="s"){const k=KY(I).find(k=>k.kc==e.code);if(k)rel(k.id)}}else if(BR&&BR.up&&(e.code=="Space"||e.code=="Enter"))BR.up()});
function kid(I,k,st){if(I.f!="g")return k.id;const f=k.c?st.f0+k.c-1:0;st.fr=f;return k.s*32+f}
rc.addEventListener("wheel",e=>{if(!RG||IN[PF.i].f!="g")return;e.preventDefault();IS.me.f0=cl(IS.me.f0+(e.deltaY>0?1:-1),1,IN[PF.i].fr-10)},{passive:false});
$("#fsl").oninput=e=>{if(IS.me)IS.me.f0=+e.target.value};
