/* ===== NHẠC CỤ PIXEL: vẽ trên lưới, dây/phím rung theo thời điểm bấm ===== */
const px=(c,x,y,w,h)=>{G.fillStyle=c;G.fillRect(Math.round(x),Math.round(y),w,h)};
const pe=(c,cx,cy,rx,ry)=>{G.fillStyle=c;cx=Math.round(cx);cy=Math.round(cy);for(let j=-ry;j<=ry;j++){const w=Math.round(rx*Math.sqrt(1-j*j/(ry*ry+.01)));G.fillRect(cx-w,cy+j,2*w,1)}};
const vb=(V,k,t,T)=>{const v=V[k];return v&&t-v[0]<T?t-v[0]:-1};
const ring=(cx,cy,r,d,k)=>{G.strokeStyle="rgba(255,255,255,"+Math.max(0,.7-d*1.6)+")";G.lineWidth=1;G.beginPath();G.ellipse(cx,cy,r,r*(k||.45),0,0,2*PI);G.stroke()};
// piano đủ 88 phím (A0–C8); chữ đỏ/vàng là phím máy tính đang gán, Z/X dịch quãng tám
function dP(st,t){const K=KY(IN[0]),b0=23+7*(st.o||0);G.textAlign="center";
px("#3b2316",0,0,160,60);px("#5c3622",2,2,156,12);px("#e9a24c",70,6,20,3);px("#2a170d",2,14,156,2);
for(const k of K)if(!k.bk){const d=vb(st.V,k.id,t,.5),dn=d>=0&&d<.2?2:0,q=d>=0?Math.round(Math.sin(d*70)*Math.exp(-d*8)):0;px(dn?"#d3cdbd":"#f7f2e8",k.x+q,k.y+dn,3,40-dn);px("#b8ae98",k.x+q,k.y+38,3,2);px("#cfc7b2",k.x+q+2,k.y+dn,1,38-dn)}
for(const k of K)if(k.bk){const d=vb(st.V,k.id,t,.5),dn=d>=0&&d<.2?2:0;px("#1a1020",k.x,k.y,2,24-dn);px("#3a2a48",k.x,k.y,1,20-dn)}
G.font="2.8px 'VT323',monospace";
for(const k of K)if(!k.bk&&k.m%12==0){G.fillStyle="#6b5b45";G.fillText("C"+(k.m/12-1),k.x+1.5,k.y+30)}
WK.forEach((c,i)=>{const m=WMI[b0+i];if(m==null)return;G.fillStyle="#e8656b";G.fillText(WL[i],K[m-21].x+1.5,K[m-21].y+36)});
BM.forEach(b=>{const m=WMI[b0+b[0]],k=m==null?null:K[m-20];if(k){G.fillStyle="#ffd27d";G.fillText(b[3],k.x+1,k.y+21)}});
px("#e8656b",2+3*b0,57,30,1)}
// guitar: cần đàn hiển thị khoang 0–11 (dây buông + 11 phím), cuộn tới đủ số phím thật; đánh dấu 3-5-7-9-12-15-17-19-21; dây rung theo nốt vừa gảy
const INL=[3,5,7,9,15,17,19,21];
function dG(I,st,t){const n=I.o.length,sp=6,xs=s=>30+Math.round((s-(n-1)/2)*sp),b=I.c,xa=xs(0)-sp/2-1,wn=n*sp+2,f0=st.f0||1;G.textAlign="center";
pe("#2b1a10",30,110,25,19);pe("#2b1a10",30,92,18,13);pe(b[0],30,110,23,17);pe(b[0],30,92,16,11);pe(b[1],24,106,9,8);pe("#e8d6b0",30,104,9,9);pe("#120a06",30,104,7,7);
px("#2b1a10",21,118,18,3);px("#6b4326",xa-1,14,wn+2,82);px("#24160e",xa,16,wn,80);
const fr=st.fr,rw=fr?fr-f0+1:0;if(rw>=0&&rw<=11){const y0=rw?16+7*(rw-1):3;G.fillStyle="rgba(255,210,125,.2)";G.fillRect(xa,y0,wn,(rw?16+7*rw:16)-y0)}
for(let j=1;j<=11;j++){const f=f0+j-1,yy=16+7*j;px("#cfc7b4",xa,yy,wn,1);G.fillStyle=f==fr?"#ffd27d":"#e9dcc0";G.font="3.6px 'VT323',monospace";G.fillText(f,xa-3.5,yy-2.5);if(INL.includes(f))pe("#efe6d0",30,yy-4,1,1);else if(f%12==0){pe("#efe6d0",30-sp,yy-4,1,1);pe("#efe6d0",30+sp,yy-4,1,1)}}
if(f0==1)px("#efe6d0",xa-1,15,wn+2,2);else px("#8f8672",xa,15,wn,1);
px("#4a3a2a",xa+wn+3,16,2,77);px("#ffd27d",xa+wn+3,16+Math.round(71*(f0-1)/Math.max(1,I.fr-11)),2,6);px("#3b2a22",xa-2,1,wn+4,13);
for(let s=0;s<n;s++){const X=xs(s);G.fillStyle="#fff";G.font="6px 'VT323',monospace";G.fillText(NN[I.o[s]%12],X,8);G.fillStyle="#ffd27d";G.font="4px 'VT323',monospace";G.fillText(GK[s].slice(3),X,13);
const v=st.V[s],d=v?t-v[0]:9,c=v?v[1]:0,yt=c?16+7*c:16;
for(let y=15;y<118;y+=2){let o=0;const vv=d<1.5&&y>=yt;if(vv)o=Math.round(3*Math.exp(-2.6*d)*Math.sin(2*PI*15*d)*Math.sin(PI*(y-yt)/(118-yt)));px(vv?"#fff3b0":s<2?"#b9894a":"#e6e6e6",X+o,y,1,2)}
if(d<.45)pe("#ffd27d",X,c?16+7*c-3:9,2,2)}}
function dS(st,t){const cx=y=>20+Math.round((y-12)*.08),K=KY(IN[3]);let ho=0;
for(let y=12;y<=92;y++){const c=cx(y);px("#7a4c0c",c-5,y,10,1);px("#d9a52b",c-4,y,7,1);px("#f6dc7a",c-3,y,2,1)}
px("#2a1a10",14,3,10,5);px("#7a4c0c",18,7,6,6);
pe("#7a4c0c",34,90,12,9);pe("#d9a52b",34,90,10,7);pe("#150c06",36,86,7,4);
K.forEach(k=>{const d=vb(st.V,k.id,t,.35),dn=st.hd[k.id]||d>=0;if(dn)ho=1;px("#9a6a14",k.x+5,k.y-1,4,2);pe(dn?"#6b5a40":"#d8d0bc",k.x,k.y,dn?2:3,dn?2:3);pe("#5a4a30",k.x,k.y,1,1)});
if(ho){G.strokeStyle="rgba(255,236,160,"+(.5+.3*Math.sin(t*14))+")";G.lineWidth=1;for(let i=0;i<3;i++){G.beginPath();G.arc(38,84,6+i*5+(t*20%5),-1.2,.2);G.stroke()}}
G.textAlign="center";G.fillStyle="#6b4a35";G.font="3.5px 'VT323',monospace";K.forEach(k=>G.fillText(k.kc.slice(3),k.x-8,k.y+1))}
function dD(st,t){const hv=k=>vb(st.V,k,t,.4);
px("#4a4a55",100,16,1,40);px("#4a4a55",18,24,1,32);px("#4a4a55",30,46,1,12);px("#4a4a55",46,26,1,8);px("#4a4a55",72,26,1,8);
let d=hv(5);pe("#1c1420",62,44,16,14);pe(d>=0&&d<.12?"#fff":"#efe3c9",62,44,14,12);pe("#b23a3a",62,44,6,5);if(d>=0)ring(62,44,10+d*20,d,.8);
[[4,30,40,10,5,"#8e2f2f"],[2,46,20,9,5,"#2f5f9e"],[3,72,20,9,5,"#2f5f9e"]].forEach(([id,cx,cy,rx,ry,c])=>{const d=hv(id),q=d>=0?Math.round(Math.sin(d*60)*Math.exp(-d*9)):0;px(c,cx-rx+q,cy,2*rx,7);pe("#2a1a14",cx+q,cy+7,rx,ry);pe(d>=0&&d<.12?"#fff":"#f4efe2",cx+q,cy,rx,ry);if(d>=0)ring(cx,cy,rx*(.4+d*3),d,ry/rx)});
[[0,100,14,12],[1,18,22,10]].forEach(([id,cx,cy,rx])=>{const d=hv(id),o=d>=0?Math.round(Math.sin(d*40)*Math.exp(-d*6)*2.5):0;pe("#8a6a14",cx,cy+o+1,rx,2);pe("#e6bf3a",cx,cy+o,rx,2)})}
function drawI(I,st,t){if(I.f=="p")dP(st,t);else if(I.f=="g")dG(I,st,t);else if(I.f=="s")dS(st,t);else dD(st,t)}

