/* ===== KẾT NỐI FIREBASE MULTIPLAYER (HỖ TRỢ TỐI ĐA 100 NGƯỜI) ===== */
(function(){
  const u1 = "https://www.gstatic" + ".com/firebasejs/10.12.0/firebase-app-compat.js";
  const u2 = "https://www.gstatic" + ".com/firebasejs/10.12.0/firebase-database-compat.js";
  const s1 = document.createElement("script"); s1.src = u1;
  const s2 = document.createElement("script"); s2.src = u2;
  s1.onload = () => { document.head.appendChild(s2); };
  s2.onload = () => {
    firebase.initializeApp({
      apiKey: "AIzaSyAU_Lk82YOu8061kyywbsc-s6BrPDh8hI",
      authDomain: "game-peak-4ce93" + ".firebaseapp.com",
      databaseURL: "https://game-peak-4ce93-default-rtdb" + ".firebaseio.com",
      projectId: "game-peak-4ce93",
      storageBucket: "game-peak-4ce93.firebasestorage.app",
      messagingSenderId: "1006307414723",
      appId: "1:1006307414723:web:ca4d4c53857d3b0a0c0876"
    });
    const db = firebase.database(), myId = "p_" + Math.random().toString(36).slice(2, 9);
    function mkFbRoom(rName){
      const ref = db.ref("rooms/" + rName), myRef = ref.child(myId);
      let peersData = {}, cbs = [];
      myRef.onDisconnect().remove();
      const listener = ref.on("value", snap => {
        const val = snap.val() || {}, now = Date.now();
        peersData = {};
        for(const k in val){
          if(val[k] && now - (val[k].ts || 0) < 15000){
            peersData[k] = { peer: k, kind: "viewer", isMe: k === myId, sameTab: k === myId, presence: val[k].p || {} };
          }
        }
        cbs.forEach(fn => { try{ fn(); }catch(e){} });
      });
      const hb = setInterval(() => { if(ME) myRef.update({ ts: Date.now() }); }, 4000);
      return {
        presence: d => myRef.set({ ts: Date.now(), p: d }),
        peers: () => Object.values(peersData),
        onPeers: fn => { cbs.push(fn); return () => { cbs = cbs.filter(f => f !== fn); }; },
        leave: () => { clearInterval(hb); ref.off("value", listener); myRef.remove(); }
      };
    }
    ROOT = {
      ...mkFbRoom("lobby"),
      join: async id => mkFbRoom(id)
    };
    setRoom(ROOT, "");
  };
  document.head.appendChild(s1);
})();
function rooms(){openModal(`<h3>🔑 Phòng</h3><p>Đang ở: <b>${RID?"phòng riêng "+esc(RID):"Sảnh chung"}</b></p><button class="b big" data-a="mk">✨ Tạo phòng riêng mới</button><b>Vào phòng bằng ID</b><input class="in" id="rid" maxlength="12" placeholder="Nhập ID phòng"><button class="b g big" data-a="jn">Vào phòng</button><button class="b g big" data-a="lobby">Về sảnh chung</button><p><small>Ai có ID và được mời mở trang này đều vào được. ID không phải mật khẩu.</small></p><button class="b big" data-a="close">Đóng</button>`)}

