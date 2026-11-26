/* ===== NHẠC CỤ: bố cục phím (lưới pixel) – fr = số phím đàn thật của từng loại ===== */
const IN=[
{n:"Piano",e:"🎹",f:"p"},
{n:"Guitar classic",e:"🎸",f:"g",ty:"nylon",fr:19,o:[40,45,50,55,59,64],c:["#d9a86c","#f3dca8"]},
{n:"Guitar acoustic",e:"🎸",f:"g",ty:"steel",fr:20,o:[40,45,50,55,59,64],c:["#b5651d","#e8a85e"]},
{n:"Saxophone",e:"🎷",f:"s"},
{n:"Trống",e:"🥁",f:"d"}];
const WM=[60,62,64,65,67,69,71,72,74,76],WK=["KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL","Semicolon"],WL="ASDFGHJKL;";
const BM=[[0,61,"KeyW","W"],[1,63,"KeyE","E"],[3,66,"KeyT","T"],[4,68,"KeyY","Y"],[5,70,"KeyU","U"],[7,73,"KeyO","O"],[8,75,"KeyP","P"]];
const GK=["KeyA","KeyS","KeyD","KeyF","KeyG","KeyH"],K8=[...GK,"KeyJ","KeyK"],DG=["Digit0","Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9"],DK=["KeyA","KeyS","KeyF","KeyJ","KeyD","KeyK"],SC=[60,62,64,65,67,69,71,72];
const KYC={},fq=m=>440*2**((m-69)/12);
const WMI=[];for(let m=21;m<=108;m++)if(![1,3,6,8,10].includes(m%12))WMI.push(m);   // nốt của 52 phím trắng piano
// guitar/sax dựng dọc (60x120), piano/trống dựng ngang (120x60). Guitar: mỗi ô (dây s, hàng c) – hàng 0 là dây buông, hàng 1-5 là 5 phím đang hiển thị
function KY(I){if(KYC[I.n])return KYC[I.n];const a=[];
if(I.f=="p"){let wi=0;for(let m=21;m<=108;m++){const bk=[1,3,6,8,10].includes(m%12);if(bk)a.push({id:m-21,m,x:2+3*wi-1,y:16,w:2,h:24,bk:1});else{a.push({id:m-21,m,x:2+3*wi,y:16,w:3,h:40});wi++}}a.ht=a.filter(k=>k.bk).concat(a.filter(k=>!k.bk))}
else if(I.f=="g"){const n=I.o.length,sp=6;for(let s=0;s<n;s++)for(let c=0;c<12;c++){const y0=c?16+7*(c-1):3;a.push({id:s*12+c,s,c,x:30+(s-(n-1)/2)*sp-sp/2,y:y0,w:sp,h:(c?16+7*c:16)-y0,kc:GK[s]})}}
else if(I.f=="s")for(let p=0;p<8;p++){const y=22+8*p;a.push({id:p,x:20+Math.round((y-12)*.08),y,rx:5,ry:5,m:SC[7-p],kc:K8[7-p]})}
else for(const[id,cx,cy,rx,ry]of[[0,100,14,12,3],[1,18,22,10,3],[2,46,20,9,5],[3,72,20,9,5],[4,30,40,10,5],[5,62,44,15,13]])a.push({id,x:cx,y:cy,rx:rx+3,ry:ry+3,kc:DK[id]});
return KYC[I.n]=a}
const inK=(k,x,y)=>k.w?x>=k.x&&x<k.x+k.w&&y>=k.y&&y<k.y+k.h:((x-k.x)/k.rx)**2+((y-k.y)/k.ry)**2<=1;

