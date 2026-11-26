/* ===== NGÀY ĐÊM & THỜI TIẾT: 1 phút thật = 1 giờ trong game (24 phút / ngày), mọi người cùng một đồng hồ ===== */
const sm=(a,b,x)=>{x=cl((x-a)/(b-a),0,1);return x*x*(3-2*x)};
const hs=n=>{let h=Math.imul(n|0,2654435761)>>>0;h^=h>>>15;h=Math.imul(h,2246822519)>>>0;h^=h>>>13;return(h%10000)/10000};
const mx=(a,b,k)=>{const p=s=>parseInt(s.slice(1),16),A=p(a),B=p(b),f=(s,t)=>Math.round(s+(t-s)*k);return"#"+((1<<24)+(f(A>>16,B>>16)<<16)+(f(A>>8&255,B>>8&255)<<8)+f(A&255,B&255)).toString(16).slice(1)};
const rgba=(h,a)=>{const n=parseInt(h.slice(1),16);return"rgba("+(n>>16)+","+(n>>8&255)+","+(n&255)+","+a+")"};
const SKY=[[0,"#0a0f2e","#1b2455"],[5,"#141a45","#3a3a6b"],[6.2,"#5b4b7e","#f19a6b"],[7.8,"#78b7e6","#f6d9a8"],[12,"#6bb6f0","#d4ecfa"],[16.5,"#78b7e6","#f2e1b8"],[18,"#7b5b8c","#f58a5a"],[19.6,"#2a2a5a","#c0607a"],[21,"#0f1538","#232a5c"],[24,"#0a0f2e","#1b2455"]];
const CLD=Array.from({length:8},(_,i)=>({x:i*83.7,y:30+(i*29)%48,w:22+(i*13)%16,v:3+(i*5)%7}));
const SPR=document.createElement("canvas"),spr=SPR.getContext("2d");{const d=Math.min(2,devicePixelRatio||1);SPR.width=130*d;SPR.height=160*d;spr.setTransform(d,0,0,d,0,0)}
const SHC=document.createElement("canvas"),shc=SHC.getContext("2d");SHC.width=320;SHC.height=200;
const PCV=document.createElement("canvas"),pcv=PCV.getContext("2d");PCV.width=100;PCV.height=63;
let ENV=null;
function env(){const T=Date.now()/60000,h=T%24,blk=fl(T/3),fr=T/3-blk,rn=hs(blk)<.13?Math.sqrt(Math.sin(PI*fr)):0,cd=cl(hs(blk+977)*.7+rn*.8,0,1);
let i=0;while(i<SKY.length-2&&h>=SKY[i+1][0])i++;const k=(h-SKY[i][0])/(SKY[i+1][0]-SKY[i][0]);
const day=sm(5.6,7.6,h)*(1-sm(17.2,19.6,h)),su=cl((h-6)/12,0,1),sel=Math.sin(PI*su),mu=cl(h>=12?(h-18)/12:(h+6)/12,0,1),mel=Math.sin(PI*mu);
let top=mx(SKY[i][1],SKY[i+1][1],k),bot=mx(SKY[i][2],SKY[i+1][2],k);top=mx(top,"#59616e",rn*.85);bot=mx(bot,"#8d96a2",rn*.85);top=mx(top,"#7d8794",cd*.3*day);
const sunUp=h>=5.6&&h<=18.4,moonUp=h>=17.6||h<=6.4,sunP=sunUp?[470+(h-6)/12*200,100-sel*72]:null,moonP=moonUp?[470+mu*200,100-mel*70]:null;
const ts=Date.now()/1e3,nc=1+cd*7,cl2=CLD.map((c,j)=>({cx:420+((c.x+ts*c.v)%340),y:c.y,w:c.w,on:j<nc}));let cover=0;
if(sunP)for(const c of cl2)if(c.on)cover=Math.max(cover,cl(1.2-Math.hypot((sunP[0]-c.cx)/(c.w*.8),(sunP[1]-c.y)/(c.w*.4)),0,1));
const sunI=sunUp?sm(0,.18,sel)*(1-rn*.95)*(1-cover*.8)*(1-cd*.3):0,moonI=moonUp?sm(0,.2,mel)*(1-day)*(1-rn*.8)*.4:0,dir=sunI>=moonI;
const ax=(dir?0.5-su:0.5-mu)*1.8,cot=1/Math.tan(Math.max(.14,(dir?sel:mel)*1.25)),nr=Math.hypot(ax,.55);
return{h,day,rn,cd,sunI,moonI,sunP,moonP,top,bot,cl2,lamp:cl(1-day*.88+rn*.3,.1,1),amb:.26+(1-day)*.5+rn*.12*day+cd*.05*day,tint:mx("#0a0e28","#2d2440",day),
star:(1-day)*(1-cd)*(1-rn),sil:mx("#0b0d1e","#4a5a4a",day),cc:mx(mx("#2a3158","#ffffff",day),"#7b8490",Math.max(rn*.8,cd*.45*day)),
ax,cot,pc:dir?mx("#ff9a4d","#fff4cf",sm(.1,.7,sel)):"#9fb4ff",pI:dir?sunI:moonI,pA:dir?.55*sunI:.3*moonI,sh:[ax/nr,.55/nr,Math.min(2.6,.45*cot),dir?.5*sunI:.5*moonI]}}
function mkL(E,cp){const k=E.lamp,L=LT.map((a,i)=>i==3?[a[0],a[1],(cp?1.15:.55)*Math.max(k,cp?.9:.2),a[3]]:[a[0],a[1],a[2]*k,a[3]]).concat(TBP.map(([x,y])=>[x,y-8,.55*k,70]));E.nl=L.length;
L.push([570,170,E.day*(.6-.3*E.rn)+E.moonI*.5,270]);
if(E.pI>.03){const dd=Math.min(330,(150-60)*E.cot*.55);L.push([570+E.ax*dd,150+dd*.6,Math.min(1,E.pI*1.4),70+dd*.4])}
return L}

