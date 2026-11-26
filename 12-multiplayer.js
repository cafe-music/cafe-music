/* ===== MẠNG: người chơi thật qua presence; sao, phiếu đuổi, đơn hàng, hoàn tiền & doanh thu ===== */
function sync(){
  A.rain(ENV?ENV.rn:0);
  if(RM){
    let ps=[];
    try{ps=RM.peers()}catch(e){}
    const mp=ps.find(p=>p.sameTab);
    if(mp)myPeer=mp.peer;
    const ids={};

    for(const p of ps){
      if(p.isMe||p.kind!="viewer")continue;
      const q=p.presence||{};
      if(!okLk(q.lk))continue;
      ids[p.peer]=1;

      let r=RP[p.peer];
      if(!r){
        const d=spot(-1);
        r=RP[p.peer]={id:p.peer,x:d.x,y:d.y,seat:-1,ent:0};
        if(A.ac)A.bell();
      }
      r.nm=String(q.n||"Khách").slice(0,12);
      r.lk=q.lk;
      r.r="gbm".includes(q.r)?q.r:"g";
      r.seat=Number.isInteger(q.s)&&(q.s>=-1&&q.s<18||q.s==100||q.s==101||q.s==200)?q.s:-1;
      r.st=q.st|0;
      r.pf=q.pf&&typeof q.pf=="object"&&Number.isInteger(q.pf.i)&&IN[q.pf.i]&&Date.now()-q.pf.t0<(PERF+8)*1000?{i:q.pf.i,t0:+q.pf.t0}:null;
      r.vk=q.vk;
      r.od=q.od&&typeof q.od=="object"&&Number.isInteger(q.od.d)&&q.od.d>=0&&q.od.d<7?{d:q.od.d,n:q.od.n|0}:null;
      r.dr=Number.isInteger(q.dr)&&q.dr>=0&&q.dr<7?q.dr:null;
      r.dlv=Number.isInteger(q.dlv)&&q.dlv>=0&&q.dlv<7?q.dlv:null;
      r.sv=q.sv&&typeof q.sv=="object"?q.sv:{};

      // Nhận tiền tặng sao & cộng dồn lượt thích khi đang biểu diễn
      const g=q.sg&&typeof q.sg=="object"&&myPeer?q.sg[myPeer]|0:0,o=seen[p.peer]|0;
      if(g>o){
        const diff=g-o;
        seen[p.peer]=g;
        addStar(diff);
        if(PF)PF.likes=(PF.likes||0)+diff;
        toast("⭐ "+r.nm+" tặng bạn "+diff+" sao!");
      }

      // Chủ phòng nhận 80% doanh thu từ pha chế
      if(q.pay&&typeof q.pay=="object"&&myPeer&&q.pay[myPeer]){
        const py=q.pay[myPeer];
        const prevSeq=seenPay[p.peer]|0;
        if(py.seq>prevSeq&&py.amt>0){
          seenPay[p.peer]=py.seq;
          addMoney(py.amt,"🏠 Chủ phòng nhận +"+vnd(py.amt)+" (doanh thu đơn từ "+r.nm+")!");
        }
      }

      // Khách nhận đồ uống (và tiền hoàn lại nếu pha chế làm fail dưới 35% hoặc dưới 20%)
      const v=myPeer&&r.sv[myPeer];
      if(ME.od&&v&&v.n==ME.od.n){
        const d=ME.od.d;
        const rf=v.rf||0;
        ME.od=null;
        ME.dr=d;
        ME.drT=Date.now()+25000;
        if(rf>0){
          addMoney(rf,"⚠️ "+r.nm+" pha lỗi ("+v.q+"%)! Bạn được hoàn lại "+vnd(rf)+"!");
        }else{
          toast("☕ "+r.nm+" đã bưng "+DR[d].n+" ("+v.q+"%) ra bàn cho bạn!");
        }
        pub();
      }
    }

    for(const k in RP){
      if(!ids[k]){
        delete RP[k];
        delete IS[k];
      }
    }
  }

  if(vk&&!Object.values(RP).some(p=>p.id==vk&&p.pf))vk=null;
  if(ME.seat>=0&&ME.seat<18&&myPeer&&Object.values(RP).some(p=>p.seat==ME.seat&&p.id<myPeer))goSeat(-1);
  heard();
}

function heard(){
  if(!RM||RG)return;
  let ps;
  try{ps=RM.peers()}catch(e){return}
  for(const p of ps){
    if(p.isMe||p.kind!="viewer")continue;
    const q=p.presence||{},pf=q.pf,I=pf&&Number.isInteger(pf.i)&&IN[pf.i];
    if(!I||!Array.isArray(q.nq))continue;
    const mxid=I.f=="g"?I.o.length*32:KY(I).length;
    const ev=q.nq.filter(a=>Array.isArray(a)&&Number.isInteger(a[0])&&Number.isInteger(a[1])&&a[1]>=0&&a[1]<mxid).sort((a,b)=>a[0]-b[0]);
    if(!ev.length)continue;
    const st=IS[p.peer]||(IS[p.peer]={V:{},hd:{},fr:0,f0:1,auto:1});
    if(HN[p.peer]===undefined){
      HN[p.peer]=ev[ev.length-1][0];
      continue;
    }
    for(const[s,id]of ev){
      if(s>HN[p.peer]){
        HN[p.peer]=s;
        const stop=strike(st,I,id);
        if(stop)setTimeout(()=>{stop();st.hd[id]=0},500);
      }
    }
  }
}

function setRoom(r,id){
  if(unsub)unsub();
  RM=r;
  RID=id;
  RP={};
  IS={me:IS.me||{V:{},hd:{},fr:0,f0:1}};
  seen={};
  seenPay={};
  HN={};
  myPeer=null;
  MYSG={};
  MYSV={};
  MYPAY={};
  vk=null;
  const u=r.onPeers(()=>{sy=0;heard()},()=>{});
  unsub=typeof u=="function"?u:null;
  if(ME){
    ME.od=null;
    ME.dr=null;
    ME.dlv=null;
    ME._dlvTask=null;
    ME.x=830;
    ME.y=440;
    ME.ent=0;
    if(A.ac)A.bell();
    goSeat(-1);
  }else{
    pub();
  }
}

async function joinRoom(id){
  id=String(id||"").toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,12);
  if(!ROOT){toast("Tính năng phòng chưa sẵn sàng (cần mở bằng tài khoản được mời)");return}
  if(RG){toast("Hãy rời sân khấu trước");return}
  try{
    if(RN){
      try{RN.leave()}catch(e){}
      RN=null;
    }
    if(!id){
      setRoom(ROOT,"");
      toast("Đã về sảnh chung");
      return;
    }
    const n=await ROOT.join("pc-"+id);
    Promise.resolve(ROOT.presence({n:null,lk:null,r:null,s:null,st:null,sg:null,vk:null,pf:null,nq:null,od:null,dr:null,dlv:null,sv:null,pay:null})).catch(()=>{});
    RN=n;
    setRoom(n,id);
    toast("Đã vào phòng "+id);
  }catch(e){
    toast("Không vào được phòng ("+(e&&e.code||"lỗi")+")");
  }
}