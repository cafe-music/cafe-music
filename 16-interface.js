/* ===== GIAO DIỆN: menu pixel, tạo nhân vật & xử lý thanh toán / bưng đồ ===== */
function openModal(h){$("#mb").innerHTML=h;$("#md").classList.add("on")}
function closeModal(){$("#md").classList.remove("on");$("#mb").classList.remove("cc-modal","menu-board");hud()}

function settings(){
  openModal([
    "<h3>⚙ MENU</h3>",
    "<small>💰 ", vnd(S.money), " · ⭐ ", S.stars, " sao · ", esc(S.nm), "</small>",
    "<p>🔊 Âm lượng<input type='range' id='vol' min='0' max='100' value='", (S.v*100), "'></p>",
    "<button class='b g big' data-a='room'>🔑 Phòng / ID</button>",
    "<button class='b g big' data-a='help'>? Hướng dẫn</button>",
    "<button class='b g big' data-a='chg'>☺ Đổi nhân vật</button>",
    "<button class='b big' data-a='close'>▶ Tiếp tục</button>"
  ].join(""));
  $("#vol").oninput=e=>{S.v=e.target.value/100;A.v=S.v;if(A.o)A.o.gain.value=A.v;save()};
}

function help(){
  openModal([
    "<h3>Chào mừng đến Music Café!</h3>",
    "<p>Mỗi người chơi được cấp <b>1.000.000đ</b> ban đầu. Nếu hết tiền (Phá sản), bạn sẽ được cấp lại sau 6 tiếng.</p>",
    "<p>🪑 <b>Khách xem</b>: chạm vào bản thân hoặc bấm <b>Gọi đồ</b> để mở Menu. Chạm vào món muốn uống để hiện nút <b>Order</b>.<br>",
    "🍵 <b>Pha chế</b>: nhận đơn, hoàn thành các bước xay & rót nước, sau đó nhân vật sẽ tự bưng khay đồ ra tận bàn khách. Pha chế nhận <b>20%</b>, Chủ phòng nhận <b>80%</b> giá trị đơn.<br>",
    "🎤 <b>Biểu diễn</b>: mỗi lượt diễn nhận <b>+10.000đ</b> + <b>5.000đ</b> mỗi lượt khán giả tặng sao (tối đa <b>100.000đ</b>).</p>",
    "<button class='b big' data-a='close'>Bắt đầu!</button>"
  ].join(""));
}

const CC_PAL = {
  hair: [
    ["Đen tự nhiên", "#2b2220"], ["Nâu Espresso", "#4e3326"], ["Nâu Hạt dẻ", "#8c583a"],
    ["Caramel", "#c08a5a"], ["Vàng Mật ong", "#e6b86a"], ["Kem Sữa", "#f2e2c4"],
    ["Trà Xanh", "#769478"], ["Hồng Đào", "#e88d9c"], ["Xanh Khói", "#6c859e"],
    ["Tím Oải hương", "#9b84b8"], ["Đỏ Rượu", "#9e3f48"], ["Bạch Kim", "#e8eaed"]
  ],
  skin: [
    ["Trắng Sứ", "#fde4d2"], ["Kem Ấm", "#f7d3ba"], ["Vàng Mật", "#f1c9a0"],
    ["Nâu Nhạt", "#dfb088"], ["Nâu Caramel", "#c28b61"], ["Nâu Cà phê", "#8d5b3c"]
  ],
  cloth: [
    ["Đỏ Dâu", "#e8656b"], ["Caramel", "#d4844a"], ["Vàng Bơ", "#f2c14e"],
    ["Xanh Sage", "#769478"], ["Xanh Bạc hà", "#6fb3a8"], ["Xanh Denim", "#5c7fa3"],
    ["Tím Mận", "#86689c"], ["Kem Sữa", "#f5ebd9"], ["Nâu Cà phê", "#5c3d2e"],
    ["Than Chì", "#3b3836"]
  ]
};

const CHIBI_PRESETS = [
  { n: "Nhỏ nhắn", w: 82, t: 82 },
  { n: "Cân đối", w: 100, t: 100 },
  { n: "Mũm mĩm", w: 124, t: 87 }
];

const ROLE_DESC = {
  g: "Ngồi thưởng thức cà phê, nghe nhạc và tặng sao.",
  b: "Nhận đơn từ khách và pha chế đồ uống qua mini-game.",
  m: "Lên sân khấu biểu diễn nhạc cụ cho cả quán thưởng thức."
};

function cprev() {
  const cvp = $("#pv");
  if (!cvp) return;
  G = cvp.getContext("2d");
  G.clearRect(0, 0, cvp.width, cvp.height);
  const isMobile = window.innerWidth <= 680;
  pet(cvp.width / 2, isMobile ? 105 : 192, CC.lk, 0, CC.mood ?? 1, isMobile ? 1.15 : 1.95);
  G = ctx;
}

function renderSwatches(list, activeHex, keyIdx) {
  const cur = String(activeHex || "").toLowerCase();
  return '<div class="cc-swatches">' + list.map(([name, hex]) =>
    '<button type="button" class="cc-swatch' + (cur === hex.toLowerCase() ? ' on' : '') +
    '" style="background:' + hex + '" title="' + name + '" data-a="pal" data-v="' + keyIdx + ':' + hex + '"></button>'
  ).join("") + '</div>';
}

function cc() {
  const L = CC.lk;
  const tab = CC.tab || "look";
  $("#mb").classList.add("cc-modal");

  const chip = (k, i, t, on) =>
    '<button type="button" class="cc-chip' + (on ? ' on' : '') + '" data-a="o" data-v="' + k + ':' + i + '">' + t + '</button>';

  let panelHTML = "";
  if (tab === "look") {
    const activeSize = CHIBI_PRESETS.findIndex(p => Math.abs(p.w - L[6]) <= 4 && Math.abs(p.t - L[7]) <= 4);
    panelHTML =
      '<div><div class="cc-group-title">Nhân vật</div><div class="cc-chips">' +
      chip("h", 0, "Thú", L[1] == 0) +
      chip("h", 1, "Người thú", L[1] == 1) +
      chip("h", 2, "Người", L[1] == 2) +
      '</div></div>' +
      '<div><div class="cc-group-title">' + (L[1] == 2 ? "Kiểu tóc" : "Loài thú") + '</div><div class="cc-chips">' +
      (L[1] == 2 ? HAIR : SPN).map((s, i) => chip("s", i, s, L[0] == i)).join("") +
      '</div></div>' +
      '<div><div class="cc-group-title">Vóc dáng</div><div class="cc-chips">' +
      CHIBI_PRESETS.map((p, i) =>
        '<button type="button" class="cc-chip' + ((activeSize === -1 ? i === 1 : activeSize === i) ? ' on' : '') + '" data-a="sz" data-v="' + i + '">' + p.n + '</button>'
      ).join("") +
      '</div></div>';
  } else if (tab === "hair") {
    panelHTML =
      '<div><div class="cc-group-title"><span>' + (L[1] == 2 ? "Màu tóc" : "Màu lông") + '</span><small>' + L[2] + '</small></div>' +
      renderSwatches(CC_PAL.hair, L[2], 2) + '</div>' +
      (L[1] > 0 ? '<div><div class="cc-group-title"><span>Màu da</span><small>' + L[3] + '</small></div>' +
      renderSwatches(CC_PAL.skin, L[3], 3) + '</div>' : '');
  } else if (tab === "outfit") {
    panelHTML =
      '<div><div class="cc-group-title"><span>Màu áo</span><small>' + L[4] + '</small></div>' +
      renderSwatches(CC_PAL.cloth, L[4], 4) + '</div>' +
      '<div><div class="cc-group-title"><span>Màu khăn quàng</span><small>' + L[5] + '</small></div>' +
      renderSwatches(CC_PAL.cloth, L[5], 5) + '</div>';
  } else if (tab === "role") {
    panelHTML =
      '<div><div class="cc-group-title">Vai trò khi bước vào quán</div><div class="cc-chips">' +
      ["g", "b", "m"].map(r => chip("r", r, ROLE[r], CC.r == r)).join("") +
      '</div><p style="margin:12px 0 0;font-size:14px;color:#6e5039;background:#f2e6d3;padding:10px 14px;border-radius:10px;">' +
      ROLE_DESC[CC.r] + ' (Có thể đổi bất cứ lúc nào ở thanh dưới cùng).</p></div>';
  }

  openModal([
    '<div class="cc-header"><h3>Tạo Nhân Vật</h3><small style="color:#8c6d53;font-weight:700;">Music Café</small></div>',
    '<div class="cc-body">',
      '<div class="cc-left">',
        '<div class="cc-canvas-box"><canvas id="pv" width="210" height="210"></canvas></div>',
        '<div class="cc-left-info">',
          '<div class="cc-moods">',
            '<button type="button" class="cc-mood-btn', ((CC.mood ?? 1) === 1 ? ' on' : ''), '" data-a="mood" data-v="1">Vui</button>',
            '<button type="button" class="cc-mood-btn', (CC.mood === 0 ? ' on' : ''), '" data-a="mood" data-v="0">Tĩnh</button>',
            '<button type="button" class="cc-mood-btn', (CC.mood === -1 ? ' on' : ''), '" data-a="mood" data-v="-1">Buồn</button>',
          '</div>',
          '<div class="cc-name-wrap"><label for="nm">Tên</label>',
            '<input class="in" id="nm" maxlength="12" placeholder="Nhập tên..." value="', esc(CC.nm), '">',
          '</div>',
        '</div>',
      '</div>',
      '<div class="cc-right">',
        '<div class="cc-tabs">',
          '<button type="button" class="cc-tab', (tab === "look" ? ' on' : ''), '" data-a="tab" data-v="look">Ngoại hình</button>',
          '<button type="button" class="cc-tab', (tab === "hair" ? ' on' : ''), '" data-a="tab" data-v="hair">Tóc & Da</button>',
          '<button type="button" class="cc-tab', (tab === "outfit" ? ' on' : ''), '" data-a="tab" data-v="outfit">Trang phục</button>',
          '<button type="button" class="cc-tab', (tab === "role" ? ' on' : ''), '" data-a="tab" data-v="role">Vai trò</button>',
        '</div>',
        '<div class="cc-panel">', panelHTML, '</div>',
      '</div>',
    '</div>',
    '<div class="cc-footer"><button type="button" class="cc-btn-save" data-a="go">Vào Quán ▶</button></div>'
  ].join(""));

  $("#nm").oninput = e => { CC.nm = e.target.value; };
  cprev();
}

function getRoomHostId(){
  const ids=[myPeer,...Object.keys(RP)].filter(Boolean).sort();
  return ids[0]||myPeer;
}

const act={
  close:()=>closeModal(),
  help:()=>help(),
  room:()=>rooms(),
  open_menu:()=>{closeModal();menu()},
  stop:()=>{if(document.activeElement)document.activeElement.blur();if(BR&&BR.act)BR.act()},
  pk:v=>BR&&BR.pk&&BR.pk(v),
  inst:v=>startPerf(+v),
  tab:v=>{CC.tab=v;cc()},
  mood:v=>{CC.mood=+v;cc()},
  sz:v=>{const p=CHIBI_PRESETS[+v];if(p){CC.lk[6]=p.w;CC.lk[7]=p.t;cc()}},
  pal:v=>{const[idx,hex]=v.split(":");CC.lk[+idx]=hex;cc()},
  o:v=>{const[k,i]=v.split(":");if(k=="r")CC.r=i;else if(k=="h")CC.lk[1]=+i;else if(k=="s")CC.lk[0]=+i;cc()},
  chg:()=>{CC={nm:S.nm,lk:S.lk.slice(),r:ME.r,tab:"look",mood:1};cc()},
  go:()=>{S.nm=CC.nm.trim().slice(0,12)||"Bạn";S.lk=CC.lk.slice();S.r=CC.r;closeModal();begin()},
  star:id=>{const r=ALL.find(r=>r.id==id);if(!r||r===ME)return;cool[id]=Date.now()+15000;MYSG[id]=(MYSG[id]||0)+1;r.st++;F.push({x:r.x,y:r.y-95,s:"⭐ +1",t:1.4});pub();toast("⭐ Bạn đã tặng sao cho "+r.nm);closeModal()},
  kick:id=>{const cp=curPerf();if(!cp||cp.w.id!=id||cp.w===ME)return;vk=id;pub();toast("Bạn đã bỏ phiếu đuổi "+cp.w.nm);closeModal()},

  sel_drink:(v,el)=>{
    const item=el.closest(".mb-item");
    if(!item||item.classList.contains("mb-disabled"))return;
    document.querySelectorAll(".mb-item.open").forEach(x=>{if(x!==item)x.classList.remove("open")});
    item.classList.toggle("open");
  },

  order:v=>{
    const d=DR[+v];
    if(!d)return;
    checkBankrupt();
    if(S.money<d.p){toast("💸 Bạn không đủ tiền để gọi "+d.n+"!");menu();return}
    addMoney(-d.p);
    ME.od={d:+v,n:++oseq};
    pub();
    toast("☕ Đã gọi "+d.n+" (-"+vnd(d.p)+"). Chờ pha chế bưng ra nhé!");
    closeModal();
  },

  cancel:()=>{
    if(ME.od){
      const d=DR[ME.od.d];
      if(d)addMoney(d.p);
    }
    ME.od=null;pub();toast("Đã hủy đơn & hoàn tiền.");closeModal();
  },

   make:id=>{
    const r=RP[id];if(!r||!r.od)return;
    const od=r.od, drinkObj=DR[od.d];
    closeModal();
    runSteps(drinkObj,q=>{
      const pct=Math.round(q*100);
      toast("🚶 Đang bưng "+drinkObj.n+" ("+pct+"%) ra bàn cho "+r.nm+"...");
      startDelivery(id, od.d, ()=>{
        const baseBarista=Math.round(drinkObj.p*0.2);
        const hostCut=drinkObj.p-baseBarista;
        const hostId=getRoomHostId();
        let baristaDelta=0;
        let customerRefund=0;
        let msg="";

        if(pct<20){
          customerRefund=drinkObj.p;
          baristaDelta=-drinkObj.p;
          msg=" Hỏng ("+pct+"%)! Bị trừ 100% giá món (-"+vnd(drinkObj.p)+") & hoàn 100% tiền cho khách!";
        }else if(pct<35){
          customerRefund=Math.round(drinkObj.p*0.5);
          baristaDelta=-Math.round(drinkObj.p*0.5);
          msg=" Kém ("+pct+"%)! Bị trừ 50% giá món (-"+vnd(customerRefund)+") & hoàn 50% cho khách!";
        }else if(pct<50){
          baristaDelta=0;
          msg=" Đạt "+pct+"% (<50%): Không được nhận tiền công pha chế!";
        }else if(pct<70){
          baristaDelta=Math.round(baseBarista*0.65);
          msg=" Đạt "+pct+"% (<70%): Giảm 35% tiền công, nhận +"+vnd(baristaDelta)+"!";
        }else if(pct<90){
          baristaDelta=Math.round(baseBarista*0.8);
          msg=" Đạt "+pct+"% (<90%): Giảm 20% tiền công, nhận +"+vnd(baristaDelta)+"!";
        }else{
          baristaDelta=baseBarista;
          msg="✨ Tuyệt hảo "+pct+"%! Nhận đủ 100% tiền công +"+vnd(baristaDelta)+"!";
        }

        MYSV[id]={n:od.n,q:pct,rf:customerRefund};
        const ks=Object.keys(MYSV);if(ks.length>8)delete MYSV[ks[0]];

        if(hostId===myPeer){
          const totalHostDelta=baristaDelta+hostCut;
          addMoney(totalHostDelta, msg+" (Chủ phòng +"+vnd(hostCut)+")");
        }else{
          addMoney(baristaDelta, msg);
          if(hostCut>0){
            const prev=MYPAY[hostId]||{seq:0,amt:0};
            MYPAY[hostId]={seq:prev.seq+1,amt:hostCut};
          }
        }
        pub();
      });
    });
  },

prac:v=>{closeModal();runSteps(DR[+v],q=>toast("Luyện tập xong: "+Math.round(q*100)+"% hoàn hảo"))},
mk:()=>{
const c="abcdefghjkmnpqrstuvwxyz23456789";
let id="";
for(let i=0;i<5;i++)id+=c[fl(R()*c.length)];
joinRoom(id).then(()=>{
if(RID)openModal([
"🎉 Đã tạo phòng riêng",
"ID phòng của bạn:",
"", esc(RID), "",
"Gửi ID này cho bạn bè: họ bấm 🔑 rồi nhập ID để vào cùng.",
"OK"
].join(""));
});
},
jn:()=>joinRoom($("#rid").value).then(()=>closeModal()),
lobby:()=>joinRoom("").then(()=>closeModal())
};
$("#mb").onclick=e=>{
const orderBtn=e.target.closest('[data-a="order"]');
if(orderBtn){
e.stopPropagation();
if(!orderBtn.disabled)act.order(orderBtn.dataset.v,orderBtn);
return;
}
const b=e.target.closest("[data-a]");
if(b&&!b.disabled)act[b.dataset.a](b.dataset.v,b);
};
$("#qx").onclick=()=>leaveStage();
$("#gear").onclick=()=>{if(started&&!BR&&!RG)settings()};
$("#vw").onclick=()=>{VIEW=1-VIEW};
$("#vt").onclick=()=>{const cp=curPerf();if(!cp||cp.w===ME)return;vk=vk==cp.w.id?null:cp.w.id;pub();hud()};
$("#rm").onclick=()=>{if(started&&!BR&&!RG)rooms()};
$("#nav").onclick=e=>{
const b=e.target.closest("[data-n]");
if(!b||!started||BR||RG)return;
const n=b.dataset.n;
if(n=="g")goSeat(-1);
else if(n=="b")goBar();
else if(n=="m")goStage();
else if(ME.r=="b")ordersList();
else menu();
};
function hud(){
if(!started)return;
const set=(id,t)=>{const e=$(id);if(e&&e.textContent!==t)e.textContent=t};
TOP=ALL.slice().sort((a,b)=>b.st-a.st).slice(0,4);
if(typeof vnd==="function")set("#mn","💰 "+vnd(S.money));
set("#sv","⭐ "+S.stars);
if(ENV){const hh=fl(ENV.h),mm=fl(ENV.h%1*60);set("#cl",(ENV.rn>.1?"🌧️":ENV.day<.3?"🌙":ENV.cd>.55?"⛅":"☀️")+" "+String(hh).padStart(2,"0")+":"+String(mm).padStart(2,"0"))}
set("#ro","🎭 "+ROLE[ME.r]);
set("#pp","👥 "+ALL.filter(r=>r.seat!=-1).length+"/20");
set("#rm","🔑 "+(RID||"Sảnh chung"));
const cp=curPerf();set("#tm",cp?"🎤 "+cp.w.nm+" "+fmt(cp.rem):"");$("#tm").style.display=cp?"":"none";
const vt=$("#vt"),sv2=cp&&cp.w!==ME;vt.style.display=sv2?"":"none";if(sv2)vt.textContent=(vk==cp.w.id?"✋ Rút phiếu ":"🗳 Đuổi ")+votesFor(cp.w.id)+"/"+need();
$("#vw").textContent=VIEW?"🗺":"📷";
$("#nv4").lastChild.textContent=ME.r=="b"?"Đơn hàng":"Gọi đồ";
set("#hint",ALL.length<2?"Phòng đang vắng – bấm 🔑 để tạo phòng riêng, hoặc lên sân khấu Biểu diễn kiếm tiền.":ME.r=="b"?"👆 Chạm khách có bong bóng để pha chế & bưng ra bàn · chạm bạn bè để tặng ⭐":"👆 Chạm vào khách xem để tặng ⭐ hoặc gọi đồ · chạm ghế trống để đổi chỗ");
}
cv.addEventListener("pointerdown",e=>{
if(RG||BR||!started)return;
const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)*W/r.width,y=(e.clientY-r.top)*H/r.height;
if(VIEW)return;
if(x>706&&x<792&&y>10&&y<98){ME.r=="b"?ordersList():menu();return}
let b=null,bd=34;
ALL.forEach(c=>{const d=Math.min(Math.hypot(c.x-x,c.y-38-y),c.od?Math.hypot(c.x-x,c.y-125-y)+10:99);if(d<bd){bd=d;b=c}});
if(b){if(ME.r=="b"&&b.od&&b!==ME&&!(MYSV[b.id]&&MYSV[b.id].n==b.od.n))act.make(b.id);else who(b);return}
const i=SE.findIndex((s,k)=>Math.hypot(s.x-x,s.y-y)<24&&!used().includes(k));
if(i>=0)goSeat(i);
});