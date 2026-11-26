/* ===== TRẠNG THÁI & LƯU TRỮ ===== */
const HX=/^#[0-9a-f]{6}$/i;
const START_MONEY=1000000, BANKRUPT_CD=6*3600*1000;
const okLk=a=>Array.isArray(a)&&a.length==8&&Number.isInteger(a[0])&&a[0]>=0&&a[0]<6&&(a[1]===0||a[1]===1||a[1]===2)&&[2,3,4,5].every(i=>typeof a[i]=="string"&&HX.test(a[i]))&&Number.isFinite(a[6])&&a[6]>=70&&a[6]<=140&&Number.isFinite(a[7])&&a[7]>=78&&a[7]<=125;
const mkSave=()=>({nm:"Bạn",lk:[0,0,"#c08a5a","#f1c9a0","#e8656b","#f2c14e",100,100],r:"g",stars:0,money:START_MONEY,bankruptAt:0,tut:0,v:.7});
let VIEW=0,banUntil=0,S=mkSave(),CC=null,ME,ALL=[],TOP=[],RP={},IS={},F=[],PF=null,BR=null,RG=null,ROOT=null,RM=null,RN=null,RID="",unsub=null;
let started=false,vk=null,myPeer=null,MYSG={},MYSV={},MYPAY={},NQ=[],nseq=0,oseq=0,seen={},seenPay={},HN={},cool={},sy=0,hT=0,G=ctx;
const P=Array.from({length:22},()=>({x:250+R()*290,y:R()*H,v:5+R()*9,r:1+R()*1.6}));

const vnd=n=>Math.max(0,Math.round(n||0)).toLocaleString("vi-VN")+"đ";
const fmtRemainHours=ms=>{
  const sec=Math.max(0,Math.ceil(ms/1000));
  const h=fl(sec/3600),m=fl((sec%3600)/60),s=sec%60;
  return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
};

const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const load=()=>{
  try{
    const j=JSON.parse(localStorage.getItem(KEY)),f=mkSave();
    if(j&&okLk(j.lk)){
      const res={...f,...j};
      if(typeof res.money!=="number"||isNaN(res.money))res.money=START_MONEY;
      if(typeof res.bankruptAt!=="number"||isNaN(res.bankruptAt))res.bankruptAt=0;
      return res;
    }
  }catch(e){}
  return null;
};

function checkBankrupt(){
  if(S.bankruptAt>0 && Date.now()-S.bankruptAt>=BANKRUPT_CD){
    S.money=START_MONEY;
    S.bankruptAt=0;
    save();
    toast("🎉 Đã hết 6 tiếng! Hệ thống cấp lại "+vnd(START_MONEY)+" cho bạn!");
    if(typeof hud==="function")hud();
  }
}

function addMoney(amt,msg){
  S.money=Math.max(0,Math.round((S.money||0)+amt));
  if(S.money<MIN_DRINK_PRICE && !S.bankruptAt){
    S.bankruptAt=Date.now();
  }else if(S.money>=MIN_DRINK_PRICE && S.bankruptAt){
    S.bankruptAt=0;
  }
  if(ME && amt!==0){
    F.push({x:ME.x,y:ME.y-112,s:(amt>0?"+":"-")+vnd(Math.abs(amt)),t:1.6});
  }
  save();
  if(msg)toast(msg);
  if(typeof hud==="function")hud();
}

const toast=m=>{const d=document.createElement("div");d.className="tt";d.textContent=m;document.body.appendChild(d);setTimeout(()=>d.remove(),3200)};
const build=()=>{ALL=[ME,...Object.values(RP)]};
function addStar(n){S.stars+=n;ME.st=S.stars;F.push({x:ME.x,y:ME.y-95,s:"⭐ +"+n,t:1.4});save();pub()}

function pub(){
  if(!RM||!ME)return;
  Promise.resolve(RM.presence({
    n:S.nm,lk:S.lk,r:ME.r,s:ME.seat,st:S.stars,sg:MYSG,vk:vk,
    pf:PF?{i:PF.i,t0:PF.t0}:null,nq:PF?NQ:null,
    od:ME.od||null,dr:ME.dr==null?null:ME.dr,
    dlv:ME.dlv==null?null:ME.dlv,
    sv:MYSV,pay:MYPAY
  })).catch(()=>{});
}
