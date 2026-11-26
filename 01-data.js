/* ===== DỮ LIỆU ĐỒ UỐNG, QUY TRÌNH PHA CHẾ CHUẨN & BẢNG GIÁ MỚI ===== */
const SPN=["🐱 Mèo","🐺 Sói","🐰 Thỏ","🐻 Gấu","🦊 Cáo","🐶 Shiba"],ROLE={g:"Khách xem",b:"Pha chế",m:"Nhạc sĩ"},NN=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

const DR=[
  {
    n:"Cà phê đen",e:"☕",p:20000,
    desc:"Hạt Robusta rang mộc đậm đà, thơm lừng tỉnh táo.",
    ing:"🫘",ingName:"Hạt cà phê",pow:"🟤",powName:"Bột cà phê",liq:"#3b1e0e",
    s:[
      ["drag_grind","Kéo hạt cà phê vào máy xay"],
      ["grind","Ấn nút xay hạt cà phê"],
      ["brew_pour","Cho bột vào pha & rót ra ly"]
    ]
  },
  {
    n:"Latte",e:"🥛",p:35000,
    desc:"Espresso quyện sữa tươi đánh mịn cùng nghệ thuật Latte Art.",
    ing:"🫘",ingName:"Hạt cà phê",pow:"🟤",powName:"Bột cà phê mịn",liq:"#c9966b",
    s:[
      ["grind","Xay hạt cà phê (18–20g mịn cỡ muối tinh)"],
      ["zone","Nén bột (Tamping lực chuẩn 15kg)"],
      ["hold","Chiết xuất Espresso (25–30s thu 35–40ml crema)"],
      ["zone","Đánh nóng & sục bọt sữa mịn (microfoam 60–65°C)"],
      ["brew_pour","Rót & tạo hình Latte Art ra tách"]
    ]
  },
  {
    n:"Cappuccino",e:"☁️",p:40000,
    desc:"Cà phê Ý nồng nàn phủ lớp bọt sữa dày bồng bềnh.",
    ing:"🫘",ingName:"Hạt cà phê",pow:"🟤",powName:"Bột cà phê mịn",liq:"#d9ae84",
    s:[
      ["grind","Xay hạt cà phê (18–20g mịn cỡ muối tinh)"],
      ["zone","Nén bột (Tamping phẳng mặt bánh cà phê)"],
      ["hold","Chiết xuất Espresso (25–30s lấy cốt crema)"],
      ["hold","Sục khí đánh bọt sữa dày bồng bềnh (60–65°C)"],
      ["brew_pour","Rót sữa tạo bọt dày & hoàn thiện tách"]
    ]
  },
  {
    n:"Trà sữa",e:"🧋",p:25000,
    desc:"Hồng trà ủ đậm hòa sữa béo, lắc lạnh cùng trân châu dai.",
    ing:"🍂",ingName:"Lá trà đen",pow:"🟫",powName:"Nước cốt trà",liq:"#c68b59",
    s:[
      ["hold","Ủ 5g trà với 100ml nước nóng 90°C"],
      ["mix","Pha cốt trà với 20g bột sữa & 15ml sữa đặc"],
      ["zone","Thêm 15–20ml nước đường vừa vị"],
      ["shake","Cho đá vào bình lắc (Shaker) lắc mạnh 10–15s"],
      ["brew_pour","Rót trà sữa ra ly & thêm trân châu"]
    ]
  },
  {
    n:"Matcha",e:"🍵",p:28000,
    desc:"Bột matcha Uji đánh tan tạo tầng xanh - trắng thanh mát.",
    ing:"🍃",ingName:"Bột matcha",pow:"🟢",powName:"Matcha đánh mịn",liq:"#78a856",
    s:[
      ["mix","Rây 3g bột matcha & dùng chổi tre đánh hình chữ W"],
      ["zone","Thêm 15–20ml sữa đặc vào chén matcha"],
      ["hold","Đánh bọt mỏng 150ml sữa tươi"],
      ["brew_pour","Rót sữa & đổ matcha tạo tầng xanh - trắng"]
    ]
  },
  {
    n:"Chocolate",e:"🍫",p:25000,
    desc:"Ca cao nguyên chất hòa tan sánh mịn cùng sữa béo ngọt ngào.",
    ing:"🍫",ingName:"Bột ca cao",pow:"🟫",powName:"Ca cao hòa tan",liq:"#5c3317",
    s:[
      ["drag_grind","Cho 20g bột ca cao nguyên chất vào ly"],
      ["mix","Hòa tan ca cao với 40ml nước nóng 80°C"],
      ["zone","Rót 25ml sữa đặc & khuấy sánh mịn"],
      ["brew_pour","Rót 150ml sữa tươi vào ly & hoàn thành"]
    ]
  },
  {
    n:"Nước ép",e:"🍊",p:27000,
    desc:"Trái cây tươi ép nguyên chất giữ trọn vị ngọt thanh & vitamin.",
    ing:"🍊",ingName:"Trái cây tươi",pow:"🟡",powName:"Nước cốt ép",liq:"#f59b25",
    s:[
      ["drag_grind","Sơ chế & cho trái cây vào máy ép"],
      ["grind","Ép lấy nước cốt nguyên chất"],
      ["zone","Pha chế vị (thêm nước đường / mật ong)"],
      ["brew_pour","Thêm đá viên & rót nước ép ra ly"]
    ]
  }
];

const MIN_DRINK_PRICE=20000;

const TBP=[[200,270],[400,270],[600,270],[200,400],[400,400],[600,400]],SE=[];
TBP.forEach(([x,y])=>SE.push({x:x-56,y:y+22},{x:x+56,y:y+22},{x,y:y+68}));
const spot=i=>i>=0&&i<18?SE[i]:i==200?{x:175,y:132}:i==100?{x:540,y:106}:i==101?{x:690,y:106}:{x:830,y:440};
const LT=[[210,255,1,360],[590,255,1,360],[400,440,.7,230],[170,108,.9,175],[620,112,.9,165],[385,64,.85,130]];
