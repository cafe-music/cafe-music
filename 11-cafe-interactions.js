/* ===== QUÁN: chỗ ngồi, vai trò, bưng đồ ra bàn & tương tác khách ===== */
const used=()=>[ME.seat,...Object.values(RP).map(p=>p.seat)];
const freeSeat=p=>{const u=used();if(p>=0&&p<18&&!u.includes(p))return p;const f=[...Array(18).keys()].filter(i=>!u.includes(i));return f.length?f[fl(R()*f.length)]:-1};
function mv(c,tx,ty,d){const dx=tx-c.x,dy=ty-c.y,l=Math.hypot(dx,dy);if(l<=d){c.x=tx;c.y=ty;return true}c.x+=dx/l*d;c.y+=dy/l*d;return false}

function barDest(){
  return {x:595,y:178};
}

function startDelivery(targetId, drinkIdx, onArrive){
  ME.dlv=drinkIdx;
  ME._dlvTask={targetId, onArrive, phase:0};
  pub();
}

function stepChar(r,dt){
  if(r===ME && r._dlvTask){
    const task=r._dlvTask;
    const cust=RP[task.targetId];
    if(!cust){
      r.dlv=null;r._dlvTask=null;r._wp=[barDest()];
      if(task.onArrive)task.onArrive();
      pub();
      return;
    }
    const cPos=spot(cust.seat);
    const servePos={x:cPos.x+(cPos.x<400?28:-28),y:cPos.y+6};
    if(task.phase===0){
      r._wp=[{x:400,y:178},{x:400,y:230},servePos];
      task.phase=1;
    }else if(task.phase===1 && r._wp && r._wp.length===1){
      r._wp[0]=servePos;
    }
    const target=r._wp[0];
    if(mv(r,target.x,target.y,125*dt)){
      if(r._wp.length>1){
        r._wp.shift();
        r.mv=true;
      }else if(task.phase===1){
        task.phase=2;
        r.dlv=null;
        if(task.onArrive)task.onArrive();
        r._wp=[{x:400,y:230},{x:400,y:178},barDest()];
        pub();
      }else{
        r._dlvTask=null;
        r.mv=false;
      }
    }else{
      r.mv=true;
    }
    return;
  }

  const isBar=(r.r==="b"||r.seat==100||r.seat==101);
  const dest=isBar?barDest():spot(r.seat);

  if(r._tSeat===undefined){
    r._tSeat=r.seat;
    if(isBar&&r.y<165){r.x=dest.x;r.y=dest.y;}
    r._wp=[dest];
  }

  if(r._tSeat!==r.seat){
    r._tSeat=r.seat;
    const fromBar=(r.x>425&&r.y<205);
    if(isBar&&!fromBar){
      r._wp=[{x:400,y:230},{x:400,y:178},dest];
    }else if(!isBar&&fromBar){
      r._wp=[{x:400,y:178},{x:400,y:230},dest];
    }else{
      r._wp=[dest];
    }
  }

  if(!r._wp||!r._wp.length)r._wp=[dest];
  const target=r._wp[0];
  if(mv(r,target.x,target.y,110*dt)){
    if(r._wp.length>1){
      r._wp.shift();
      r.mv=true;
    }else{
      r.mv=false;
    }
  }else{
    r.mv=true;
  }
}

const aud=()=>ALL.filter(r=>r.seat>=0&&r.seat<18).length,need=()=>{const a=aud();return a<2?1:Math.max(2,Math.ceil(a*.55))};
function curPerf(){if(PF)return{w:ME,i:PF.i,rem:PERF-(Date.now()-PF.t0)/1e3};const p=Object.values(RP).find(p=>p.pf);return p?{w:p,i:p.pf.i,rem:cl(PERF-(Date.now()-p.pf.t0)/1e3,0,PERF)}:null}
function curBar(){if(ME.r==="b"||ME.seat==100||ME.seat==101)return ME;return Object.values(RP).find(p=>p.r==="b"||p.seat==100||p.seat==101)||null}

function goSeat(p){
  const o=ME.seat;
  ME.seat=-1;
  const s=freeSeat(p>=0?p:o>=0&&o<18?o:-1);
  ME.r="g";
  ME.seat=s;
  ME.br=null;
  ME.dlv=null;
  ME._dlvTask=null;
  if(s<0)toast("Quán đã kín chỗ!");
  pub();
}

function goBar(){
  const cb=curBar();
  if(cb&&cb!==ME){
    toast("Quầy pha chế đang có "+cb.nm+" đứng quầy. Hãy chờ họ xuống!");
    return;
  }
  ME.r="b";
  ME.seat=100;
  ME.od=null;
  ME.br=null;
  ME.dlv=null;
  ME._dlvTask=null;
  pub();
}

function goStage(){
  if(Date.now()<banUntil){toast("Bạn vừa bị mời xuống sân khấu, thử lại sau "+Math.ceil((banUntil-Date.now())/1e3)+" giây");return}
  const cp=curPerf();
  if(cp){toast("Sân khấu đang có "+cp.w.nm+" biểu diễn (còn "+fmt(cp.rem)+"). Hãy chờ hoặc bỏ phiếu đuổi!");return}
  ME.od=null;
  ME.br=null;
  ME.dlv=null;
  ME._dlvTask=null;
  let h="<h3>🎤 Chọn nhạc cụ</h3><small>Sân khấu chỉ chứa 1 người, mỗi lượt 10 phút. Mỗi lần diễn nhận <b>+10.000đ</b> + <b>5.000đ</b> mỗi lượt khán giả thích (tối đa <b>100.000đ</b>).</small>";
  IN.forEach((I,i)=>h+=`<div class="row"><span class="ic">${I.e}</span><div><b>${I.n}</b></div><button class="b" data-a="inst" data-v="${i}">Lên!</button></div>`);
  openModal(h+'<button class="b g big" data-a="close">Đóng</button>');
}

function who(r){
  const me=r===ME,cd=(cool[r.id]||0)>Date.now(),cp=curPerf(),on=cp&&cp.w===r&&!me,sp=SPN[r.lk[0]].split(" ");
  let btns="";
  if(me){
    btns=`<p>Số dư: <b>${vnd(S.money)}</b></p>`+(ME.r==="g"?`<button class="b big" data-a="open_menu">📋 Gọi đồ uống</button>`:"");
  }else{
    btns=`<button class="b big" data-a="star" data-v="${esc(r.id)}" ${cd?"disabled":""}>⭐ Tặng 1 sao</button>`
      +(ME.r==="g"?`<button class="b big" data-a="open_menu">📋 Gọi đồ uống</button>`:"")
      +(on?`<button class="b g big" data-a="kick" data-v="${esc(r.id)}">🚫 Bỏ phiếu đuổi khỏi sân khấu</button>`:"");
  }
  openModal(`<h3>${r.lk[1]==2?"🧑":sp[0]} ${esc(r.nm)}</h3><p>${ROLE[r.r]} · ${r.lk[1]==2?"Người":r.lk[1]?"Người-thú "+sp[1]:"Thú "+sp[1]} · ⭐ ${r.st}</p>${btns}<button class="b g big" data-a="close">Đóng</button>`);
}

function update(dt){
  if((sy-=dt)<=0){sy=.5;sync()}
  if(typeof checkBankrupt==="function")checkBankrupt();
  const otherBar=Object.values(RP).find(p=>(p.r==="b"||p.seat==100||p.seat==101));
  if((ME.r==="b"||ME.seat==100||ME.seat==101)&&otherBar&&String(ME.id)>String(otherBar.id)){
    toast("Quầy pha chế đã có người!");
    goSeat(-1);
  }
  for(const r of ALL){stepChar(r,dt);r.ent=(r.ent||0)+dt}
  if(ME.dr!=null&&Date.now()>ME.drT){ME.dr=null;pub()}
  if(PF&&Date.now()-PF.t0>PERF*1000)leaveStage("👏 Hết giờ biểu diễn!");
  F.forEach(f=>{f.y-=28*dt;f.t-=dt});F=F.filter(f=>f.t>0);
  P.forEach(p=>{p.y-=p.v*dt;p.x+=Math.sin(p.y*.03)*10*dt;if(p.y<0){p.y=H*.85;p.x=250+R()*290}});
  build();
}