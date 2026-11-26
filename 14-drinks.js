/* ===== MENU 1 MẶT MÀU NÂU & MINI-GAME PHA CHẾ ĐA QUY TRÌNH ===== */
function menu(){
  if(ME.r==="b"||ME.seat==100||ME.seat==101){toast("Bạn đang đứng quầy pha chế!");return}
  checkBankrupt();
  const hasB=Object.values(RP).some(p=>p.r=="b"||p.seat==100||p.seat==101);
  $("#mb").classList.add("menu-board");

  if(S.bankruptAt>0 || S.money<MIN_DRINK_PRICE){
    const rem=Math.max(0, BANKRUPT_CD - (Date.now()-(S.bankruptAt||Date.now())));
    openModal([
      '<div class="mb-head"><div class="mb-sub">MUSIC CAFÉ · THÔNG BÁO</div><h2 class="mb-title">💸 BẠN ĐÃ PHÁ SẢN!</h2><div class="mb-ribbon">HẾT TIỀN GỌI ĐỒ UỐNG</div></div>',
      '<div style="text-align:center;padding:18px 12px;background:rgba(28,15,9,0.65);border:1.5px solid #8c6239;border-radius:12px;margin:10px 0;">',
      '<p style="margin:0 0 8px;color:#f7e8d0;">Số dư hiện tại của bạn: <b style="color:#ff8585;">', vnd(S.money), '</b></p>',
      '<p style="margin:0 0 10px;color:#d6bfa2;">Hệ thống sẽ tự động cấp lại <b style="color:#ffca57;">1.000.000đ</b> sau:</p>',
      '<div style="font:400 38px \'VT323\',monospace;color:#ffca57;letter-spacing:1px;">⏳ ', fmtRemainHours(rem), '</div>',
      '<p style="margin:10px 0 0;opacity:0.85;">💡 Mẹo: Bạn vẫn có thể lên sân khấu <b>Biểu diễn</b> để kiếm thêm tiền ngay!</p></div>',
      '<button class="b g big" data-a="close">Đóng</button>'
    ].join(""));
    return;
  }

  let bodyHTML="";
  if(ME.od){
    const curD=DR[ME.od.d];
    bodyHTML=[
      '<div style="text-align:center;padding:18px 12px;background:rgba(28,15,9,0.6);border:1.5px solid #8c6239;border-radius:12px;margin:10px 0;">',
      '<div style="font-size:44px;margin-bottom:6px;">', curD.e, '</div>',
      '<p style="margin:0 0 6px;color:#fff5e4;">Đang chờ quầy pha chế làm món <b>', curD.n, '</b> (', vnd(curD.p), ')…</p>',
      '<small style="color:#cbb292;">Pha chế sẽ sớm bưng đồ uống ra tận bàn của bạn!</small></div>',
      '<button class="b g big" data-a="cancel">Hủy đơn hàng</button>'
    ].join("");
  }else{
    const notice=!hasB?'<div class="mb-warn">⚠️ Hiện chưa có người đứng quầy Pha chế trong phòng.</div>':"";
    const itemsHTML=DR.map((d,i)=>{
      const afford=S.money>=d.p;
      return [
        '<div class="mb-item', (afford?"":" mb-disabled"), '" data-a="sel_drink" data-v="', i, '">',
          '<div class="mb-pic">', d.e, '</div>',
          '<div class="mb-info">',
            '<div class="mb-row-top"><span class="mb-name">', d.n, '</span><span class="mb-price">', vnd(d.p), '</span></div>',
            '<div class="mb-desc">', d.desc, '</div>',
            '<div class="mb-order-box">',
              '<button type="button" class="mb-order-btn" data-a="order" data-v="', i, '" ', ((!hasB||!afford)?"disabled":""), '>',
                (!afford?"Không đủ tiền":(!hasB?"Chưa có Pha chế":"✔ Order cho Pha chế")),
              '</button>',
            '</div>',
          '</div>',
        '</div>'
      ].join("");
    }).join("");

    bodyHTML=[
      notice,
      '<div class="mb-list">', itemsHTML, '</div>',
      '<div class="mb-footer"><span>Ví của bạn: <b style="color:#ffca57;">', vnd(S.money), '</b></span><span>Chạm vào món để hiện nút Order</span></div>'
    ].join("");
  }

  openModal([
    '<div class="mb-head"><div class="mb-sub">MUSIC CAFÉ · THE RHYTHM OF COFFEE</div><h2 class="mb-title">MENU</h2><div class="mb-ribbon">THỰC ĐƠN ĐỒ UỐNG (7 MÓN)</div></div>',
    bodyHTML,
    '<button class="b g big" style="margin-top:10px;" data-a="close">Đóng Menu</button>'
  ].join(""));
}

function ordersList(){
  const os=Object.values(RP).filter(r=>r.r==="g"&&r.od&&!(MYSV[r.id]&&MYSV[r.id].n==r.od.n));
  const h="<h3>🍵 Đơn hàng của khách</h3>"+(os.length?os.map(r=>{
    const d=DR[r.od.d];
    const tip20=Math.round(d.p*0.2);
    return '<div class="row"><span class="ic">'+d.e+'</span><div><b>'+d.n+'</b> · <span style="color:#d98a4e;">+'+vnd(tip20)+' (20%)</span><br><small>Khách: '+esc(r.nm)+'</small></div><button class="b" data-a="make" data-v="'+esc(r.id)+'">Pha</button></div>';
  }).join(""):"<p>Chưa có đơn nào. Rủ bạn bè vào làm khách gọi đồ nhé!</p>")+"<h3>📖 Luyện tập pha chế</h3><div style='display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;'>"+DR.map((d,i)=>'<button class="b g" data-a="prac" data-v="'+i+'">'+d.e+' '+d.n+'</button>').join("")+"</div>";
  openModal(h+'<button class="b g big" data-a="close">Đóng</button>');
}

function runSteps(d,done){
  const dIdx=DR.indexOf(d);
  ME.br=dIdx>=0?dIdx:0;
  if(typeof pub==="function")pub();
  const clearBrew=()=>{if(ME.br!=null){ME.br=null;if(typeof pub==="function")pub()}};
  let i=0,qs=[];

  const nx=()=>{
    if(i>=d.s.length){
      BR=null;
      clearBrew();
      closeModal();
      done(qs.reduce((a,b)=>a+b)/qs.length);
      return;
    }
    const[t,lb]=d.s[i];
    let end=0;
    const fin=s=>{
      if(end)return;
      end=1;
      BR={};
      qs.push(s);
      const resEl=$("#br");
      if(resEl){
        const pct=Math.round(s*100);
        resEl.textContent=pct>=90?"✨ Tuyệt hảo ("+pct+"%)!":pct>=70?"👍 Khá tốt ("+pct+"%)":pct>=50?"👌 Tạm ổn ("+pct+"%)":"⚠️ Pha lỗi ("+pct+"%)!";
      }
      setTimeout(()=>{i++;nx()},650);
    };

    let stageHTML="";
    if(t==="drag_grind"){
      stageHTML=[
        '<div class="brew-stage">',
          '<div class="brew-bean" id="dragBean" title="Kéo vào">', d.ing, '</div>',
          '<div class="brew-arrow">➔ Kéo thả ➔</div>',
          '<div class="brew-machine" id="grindZone"><div class="bm-hopper"></div><div class="bm-body">⚙️<small>DỤNG CỤ</small></div></div>',
        '</div>',
        '<p style="text-align:center;margin:4px 0;opacity:0.85;">Giữ & kéo <b>', d.ingName, '</b> thả vào dụng cụ (hoặc chạm vào máy)</p>'
      ].join("");
    }else if(t==="grind"){
      stageHTML=[
        '<div class="brew-stage">',
          '<div class="brew-machine" id="grindMach">',
            '<div class="bm-hopper filled">', d.ing, '</div>',
            '<div class="bm-body"><span id="bladeSpin" class="bm-blade">⚙️</span><small id="grindStatus">Sẵn sàng</small></div>',
            '<div class="bm-powder" id="powderPile">', d.pow, '</div>',
          '</div>',
        '</div>',
        '<div class="bar"><u id="pf" style="background:linear-gradient(90deg,#d98a4e,#ffbe55);"></u></div>',
        '<button class="b big" data-a="stop" id="grindBtn">⚡ ẤN LIÊN TỤC!</button>'
      ].join("");
    }else if(t==="zone"){
      stageHTML=[
        '<div class="brew-stage">',
          '<div class="brew-machine">',
            '<div class="bm-body" style="width:110px;">', d.e, '<small>CĂN CHUẨN</small></div>',
          '</div>',
        '</div>',
        '<div class="bar"><i id="tg"></i><b id="cur"></b></div>',
        '<button class="b big" data-a="stop">🎯 DỪNG ĐÚNG VÙNG VÀNG!</button>'
      ].join("");
    }else if(t==="hold"){
      stageHTML=[
        '<div class="brew-stage">',
          '<div class="brew-machine">',
            '<div class="bm-body" style="width:110px;">⏱️<small id="holdTxt">0%</small></div>',
          '</div>',
        '</div>',
        '<div class="bar"><i style="left:68%;width:22%"></i><u id="hf" style="background:linear-gradient(90deg,#54a882,#ffbe55);"></u></div>',
        '<button class="b big" id="hb">✋ GIỮ ĐẾN VẠCH VÀNG RỒI THẢ!</button>'
      ].join("");
    }else if(t==="mix"){
      stageHTML=[
        '<div class="brew-stage">',
          '<div class="brew-machine" id="mixBowl">',
            '<div class="bm-body" style="width:110px;"><span id="whiskIcon" class="bm-blade">🥄</span><small id="mixTxt">Khuấy đều</small></div>',
          '</div>',
        '</div>',
        '<div class="bar"><u id="pf" style="background:linear-gradient(90deg,#769478,#ffbe55);"></u></div>',
        '<button class="b big" data-a="stop">🌀 KHUẤY / ĐÁNH TAN!</button>'
      ].join("");
    }else if(t==="shake"){
      stageHTML=[
        '<div class="brew-stage">',
          '<div class="brew-machine" id="shakerBox">',
            '<div class="bm-body" style="width:94px;">🧊🧋<small id="shakeTxt">Lắc lạnh</small></div>',
          '</div>',
        '</div>',
        '<div class="bar"><u id="pf" style="background:linear-gradient(90deg,#5ca4d6,#ffbe55);"></u></div>',
        '<button class="b big" data-a="stop">📳 LẮC BÌNH SHAKER!</button>'
      ].join("");
    }else{
      stageHTML=[
        '<div class="brew-stage brew-pour-stage">',
          '<div class="brew-filter" id="filterBox"><div class="bf-powder" id="bfPowder">', d.pow, '</div><div class="bf-cup"></div><div class="bf-stream" id="bfStream" style="background:', d.liq, ';"></div></div>',
          '<div class="brew-glass"><div class="bg-target"></div><div class="bg-liquid" id="bgLiquid" style="background:', d.liq, ';"></div><span class="bg-icon">', d.e, '</span></div>',
        '</div>',
        '<button class="b g big" id="addPowBtn">1️⃣ CHO ', d.powName.toUpperCase(), ' VÀO</button>',
        '<button class="b big" id="pourBtn" style="display:none;">2️⃣ GIỮ NÚT ĐỂ RÓT RA LY (ĐẾN VẠCH VÀNG)</button>'
      ].join("");
    }

    openModal('<h3>'+d.e+' '+d.n+' · Bước '+(i+1)+'/'+d.s.length+'</h3><div style="text-align:center;margin-bottom:6px;"><b>'+lb+'</b></div>'+stageHTML+'<div id="br" style="min-height:24px;text-align:center;font-weight:700;margin-top:6px;"></div>');
    BR={};
    const clsBtn=document.querySelector('[data-a="close"]');
    if(clsBtn)clsBtn.addEventListener("click",clearBrew,{once:true});

    if(t==="drag_grind"){
      const bean=$("#dragBean"),zone=$("#grindZone");
      let dragging=false,sx=0,sy=0;
      const completeDrop=()=>{
        if(end)return;
        bean.style.transform="translate(115px, -12px) scale(0.3)";
        bean.style.opacity="0";
        zone.classList.add("active");
        fin(1);
      };
      bean.onpointerdown=e=>{
        if(end)return;
        dragging=true;sx=e.clientX;sy=e.clientY;
        bean.setPointerCapture(e.pointerId);
      };
bean.onpointermove=e=>{
if(!dragging||end)return;
const dx=e.clientX-sx,dy=e.clientY-sy;
bean.style.transform="translate("+dx+"px,"+dy+"px) scale(1.12)";
const br=bean.getBoundingClientRect(),zr=zone.getBoundingClientRect();
if(br.right>zr.left+15 && br.left<zr.right-15 && br.bottom>zr.top+10){
dragging=false;
completeDrop();
}
};
bean.onpointerup=()=>{if(dragging&&!end){dragging=false;bean.style.transform="";}};
zone.onclick=completeDrop;
BR.act=completeDrop;
}
if(t==="grind"){
let taps=0;
const mach=$("#grindMach"),blade=$("#bladeSpin"),pile=$("#powderPile"),stTxt=$("#grindStatus");
BR.act=()=>{
if(end)return;
taps++;
        const pct=Math.min(100,(taps/10)*100);
        $("#pf").style.width=pct+"%";
        mach.classList.remove("shake");
        void mach.offsetWidth;
        mach.classList.add("shake");
        blade.style.transform="rotate("+(taps*75)+"deg)";
        pile.style.opacity=String(pct/100);
        pile.style.transform="scale("+(0.5+pct/200)+")";
        stTxt.textContent="Đang xử lý "+Math.round(pct)+"%";
        if(taps>=10)fin(1);
      };
      setTimeout(()=>{if(!end)fin(Math.max(0.1,taps/10))},4800);
    }

    if(t==="zone"){
      const z=0.26+R()*0.38,w=0.22;
      $("#tg").style.left=z*100+"%";
      $("#tg").style.width=w*100+"%";
      let p=0,dir=1,last=performance.now();
      const tick=n=>{
        if(end)return;
        p+=dir*(n-last)/950;
        last=n;
        if(p>1){p=1;dir=-1}
        if(p<0){p=0;dir=1}
        $("#cur").style.left=p*100+"%";
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      BR.act=()=>{
        const c=z+w/2,dist=Math.abs(p-c);
        fin(dist<=w/2?1:Math.max(0.1,1-(dist-w/2)*2.6));
      };
    }

    if(t==="hold"){
      let v=0,dn=0,last=performance.now();
      const hb=$("#hb");
      const go=()=>{dn=1;last=performance.now()};
      const up=()=>{
        if(!dn||end)return;
        dn=0;
        const dist=Math.abs(v-0.79);
        fin(dist<=0.11?1:Math.max(0.1,1-(dist-0.11)*2.4));
      };
      hb.onpointerdown=go;
      hb.onpointerup=up;
      hb.onpointerleave=up;
      hb.onpointercancel=up;
      BR.dn=go;
      BR.up=up;
      const tick=n=>{
        if(end)return;
        if(dn){
          v=Math.min(1,v+(n-last)/1450);
          $("#hf").style.width=v*100+"%";
          $("#holdTxt").textContent=Math.round(v*100)+"%";
          if(v>=1)up();
        }
        last=n;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    if(t==="mix"){
      let taps=0;
      const whisk=$("#whiskIcon"),mTxt=$("#mixTxt");
      BR.act=()=>{
        if(end)return;
        taps++;
        const pct=Math.min(100,(taps/10)*100);
        $("#pf").style.width=pct+"%";
        whisk.style.transform="rotate("+(taps*90)+"deg) translateX("+(taps%2===0?4:-4)+"px)";
        mTxt.textContent="Hòa tan "+Math.round(pct)+"%";
        if(taps>=10)fin(1);
      };

setTimeout(()=>{if(!end)fin(Math.max(0.1,taps/10))},4800);
}
if(t==="shake"){
let taps=0;
const box=$("#shakerBox"),sTxt=$("#shakeTxt");
BR.act=()=>{
if(end)return;
taps++;
const pct=Math.min(100,(taps/10)*100);
$("#pf").style.width=pct+"%";
box.style.transform="translateY("+(taps%2===0?-8:8)+"px) rotate("+(taps%2===0?-8:8)+"deg)";
sTxt.textContent="Lắc lạnh "+Math.round(pct)+"%";
if(taps>=10){box.style.transform="";fin(1);}
};
setTimeout(()=>{if(!end){box.style.transform="";fin(Math.max(0.1,taps/10))}},4800);
}
if(t==="brew_pour"){
const addBtn=$("#addPowBtn"),pourBtn=$("#pourBtn"),powEl=$("#bfPowder"),stream=$("#bfStream"),liq=$("#bgLiquid");
let poured=false,holding=false,fill=0,raf=0;
addBtn.onclick=()=>{
if(poured||end)return;
poured=true;
powEl.classList.add("dropped");
addBtn.style.display="none";
pourBtn.style.display="block";
$("#br").textContent="Đã cho nguyên liệu vào! Giữ nút để rót nước ra ly.";
};
const startPour=()=>{
if(!poured||holding||end)return;
holding=true;
stream.style.height="68px";
const loop=()=>{
if(!holding||end)return;
fill=Math.min(100,fill+1.35);
liq.style.height=fill+"%";
if(fill>=100)stopPour();
else raf=requestAnimationFrame(loop);
};
raf=requestAnimationFrame(loop);
};
const stopPour=()=>{
if(!holding||end)return;
holding=false;
cancelAnimationFrame(raf);
stream.style.height="0px";
const diff=Math.abs(fill-80);
const score=diff<=8?1:Math.max(0.1,1-diff/45);
fin(score);
};
pourBtn.onpointerdown=startPour;
pourBtn.onpointerup=stopPour;
pourBtn.onpointerleave=stopPour;
pourBtn.onpointercancel=stopPour;
BR.act=()=>{if(!poured)addBtn.click()};
BR.dn=startPour;
BR.up=stopPour;
}
};
nx();
}