/* ===== MẶT TIỀN QUÁN CÀ PHÊ SỐ 32: VIỀN SÁNG DỊU MẮT & TỐI ƯU HIỆU NĂNG 60FPS ===== */

const _CAM_TRANS = {
  active: false,
  start: 0,
  dur: 850,
  toInside: true
};

let _lastFrontState = null;
function triggerSceneZoom(toInside) {
  _CAM_TRANS.active = true;
  _CAM_TRANS.start = performance.now();
  _CAM_TRANS.toInside = toInside;
}

function fp(r) {
  if (r.ent < 1.9) return { x: W + 30 - (W + 30 - 712) * (r.ent / 1.9), y: 488, s: 0.85, out: 1 };
  if (r.seat == 200) return { x: 188, y: 392, s: 0.68 };
  if (r.seat == 100) return { x: 470, y: 382, s: 0.68 };
  if (r.seat == 101) return { x: 565, y: 382, s: 0.68 };
  return { x: 80 + r.x * 0.6, y: cl(396 + (r.y - 270) * 0.14, 372, 426), s: 0.68 + cl((r.y - 270) / 850, -0.06, 0.14) };
}

function drawFront(t) {
  if (_lastFrontState === false) {
    triggerSceneZoom(false);
  }
  _lastFrontState = true;

  G = ctx;
  const x = ctx, E = ENV = env(), cp = curPerf();
  const dayFactor = cl(E.day || 0, 0, 1);
  const nightFactor = 1 - dayFactor;
  const rainFactor = cl(E.rn || 0, 0, 1);
  const sw = A.bt ? Math.max(0, 1 - (performance.now() - A.bt) / 1800) * Math.sin((performance.now() - A.bt) / 55) * 0.6 : 0;

  // Các hàm vẽ viền tối ưu hiệu năng cao (Không dùng shadowBlur, dùng screen blend dịu mắt)
  const drawRimHighlight = (x1, y1, x2, y2, lightX, lightY, maxRadius, mult = 1) => {
    const midX = (x1 + x2) * 0.5;
    const midY = (y1 + y2) * 0.5;
    const dist = Math.hypot(midX - lightX, midY - lightY);
    if (dist >= maxRadius) return;

    const intensity = (1 - dist / maxRadius) * (0.26 + nightFactor * 0.34) * mult;
    if (intensity <= 0.02) return;

    const grad = x.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, "rgba(255, 226, 155, 0)");
    grad.addColorStop(0.25, "rgba(255, 236, 180, " + intensity + ")");
    grad.addColorStop(0.75, "rgba(255, 236, 180, " + intensity + ")");
    grad.addColorStop(1, "rgba(255, 226, 155, 0)");

    x.strokeStyle = grad;
    x.lineWidth = 1.3;
    x.beginPath();
    x.moveTo(x1, y1);
    x.lineTo(x2, y2);
    x.stroke();
  };

  const drawArcRimHighlight = (cx, cy, r, startAng, endAng, colStr, alpha, lineWidth = 1.25) => {
    const a = alpha * 0.6;
    if (a <= 0.02) return;
    x.strokeStyle = `rgba(${colStr}, ${a})`;
    x.lineWidth = lineWidth;
    x.beginPath();
    x.arc(cx, cy, r, startAng, endAng);
    x.stroke();
  };

  const drawSkyRimHighlight = (x1, y1, x2, y2, strength = 1) => {
    const rainDim = 1 - cl(rainFactor * 0.35, 0, 0.35);
    const alpha = (0.24 + dayFactor * 0.2 + nightFactor * 0.16) * strength * rainDim;
    if (alpha <= 0.02) return;

    const rCol = Math.round(210 + dayFactor * 40);
    const gCol = Math.round(225 + dayFactor * 18);
    const bCol = Math.round(250 - dayFactor * 30);

    const grad = x.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, `rgba(${rCol}, ${gCol}, ${bCol}, 0)`);
    grad.addColorStop(0.2, `rgba(${rCol}, ${gCol}, ${bCol}, ${alpha})`);
    grad.addColorStop(0.8, `rgba(${rCol}, ${gCol}, ${bCol}, ${alpha})`);
    grad.addColorStop(1, `rgba(${rCol}, ${gCol}, ${bCol}, 0)`);

    x.strokeStyle = grad;
    x.lineWidth = 1.35;
    x.beginPath();
    x.moveTo(x1, y1);
    x.lineTo(x2, y2);
    x.stroke();
  };

  const drawGroundBounceRim = (x1, y1, x2, y2, colorStr, strength = 1) => {
    const wetBoost = 0.18 + rainFactor * 0.65;
    const alpha = wetBoost * (0.24 + nightFactor * 0.3) * strength;
    if (alpha <= 0.02) return;

    const grad = x.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, `rgba(${colorStr}, 0)`);
    grad.addColorStop(0.25, `rgba(${colorStr}, ${alpha})`);
    grad.addColorStop(0.75, `rgba(${colorStr}, ${alpha})`);
    grad.addColorStop(1, `rgba(${colorStr}, 0)`);

    x.strokeStyle = grad;
    x.lineWidth = 1.25;
    x.beginPath();
    x.moveTo(x1, y1);
    x.lineTo(x2, y2);
    x.stroke();
  };

  x.save();

  if (_CAM_TRANS.active && !_CAM_TRANS.toInside) {
    const p = cl((performance.now() - _CAM_TRANS.start) / _CAM_TRANS.dur, 0, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const sc = 2.1 - ease * 1.1;
    x.translate(350, 330);
    x.scale(sc, sc);
    x.translate(-350, -330);
    if (p >= 1) _CAM_TRANS.active = false;
  }

  x.globalCompositeOperation = "source-over";
  x.textAlign = "center";

  // 0. BẦU TRỜI THOÁNG Ở PHÍA TRÊN (y: 0 -> 130)
  const skyGrad = x.createLinearGradient(0, 0, 0, 130);
  skyGrad.addColorStop(0, E.top);
  skyGrad.addColorStop(1, E.bot);
  x.fillStyle = skyGrad;
  x.fillRect(0, 0, W, 135);

  if (E.star > 0.03) {
    for (let i = 0; i < 32; i++) {
      x.globalAlpha = E.star * (0.6 + 0.4 * Math.sin(t * 2 + i));
      x.fillStyle = "#fffbe8";
      x.fillRect(20 + (i * 67) % (W - 40), 10 + (i * 29) % 80, 1.8, 1.8);
    }
    x.globalAlpha = 1;
  }

  for (let ci = 0; ci < E.cl2.length; ci++) {
    const c = E.cl2.at(ci);
    if (c.on) {
      x.fillStyle = E.cc;
      const cx = (c.cx * 1.2) % W;
      const cy = 26 + (ci * 20) % 42;
      x.beginPath();
      x.ellipse(cx, cy, c.w * 0.75, c.w * 0.35, 0, 0, 2 * PI);
      x.ellipse(cx - c.w * 0.4, cy + 4, c.w * 0.45, c.w * 0.25, 0, 0, 2 * PI);
      x.ellipse(cx + c.w * 0.45, cy + 5, c.w * 0.5, c.w * 0.26, 0, 0, 2 * PI);
      x.fill();
    }
  }

  // 1. TRANG TRÍ NÓC QUÁN KIẾN TRÚC 3D
  const topRoofY = 104;
  const skyColStr = `${Math.round(210 + dayFactor * 40)}, ${Math.round(225 + dayFactor * 18)}, ${Math.round(250 - dayFactor * 30)}`;
  const skyRimAlpha = (0.35 + dayFactor * 0.25 + nightFactor * 0.2) * (1 - cl(rainFactor * 0.35, 0, 0.35));

  // Khối tum mái bê tông bên trái
  x.fillStyle = mx("#34394d", "#a69e94", dayFactor);
  rr(88, 72, 165, 34, 3);
  x.fillStyle = mx("#262a3b", "#8a8278", dayFactor);
  x.fillRect(88, 72, 165, 6);

  // Lan can sắt thanh mảnh chạy dọc sân thượng (x: 253 -> 596)
  x.strokeStyle = mx("#1e2230", "#4a453e", dayFactor);
  x.lineWidth = 1.6;
  x.beginPath();
  x.moveTo(253, 86);
  x.lineTo(598, 86);
  for (let rx = 262; rx < 596; rx += 14) {
    x.moveTo(rx, 86);
    x.lineTo(rx, 104);
  }
  x.stroke();

  // Bồn cây cảnh xanh mướt trên ban công sân thượng
  x.fillStyle = mx("#4f3826", "#8c6240", dayFactor);
  rr(275, 90, 96, 14, 2);
  rr(455, 90, 110, 14, 2);
  for (let bx = 285; bx <= 362; bx += 16) {
    x.fillStyle = bx % 32 === 0 ? mx("#3f6928", "#659e44", dayFactor) : mx("#528236", "#82bd5c", dayFactor);
    ci(bx, 86, 9);
  }
  for (let bx = 466; bx <= 556; bx += 16) {
    x.fillStyle = bx % 32 === 0 ? mx("#3f6928", "#659e44", dayFactor) : mx("#528236", "#82bd5c", dayFactor);
    ci(bx, 86, 9);
  }

  // Hai bức tường sáng hai bên (y: 104 -> H)
  const sideWallCol = mx("#2c3147", "#ebe3d5", dayFactor);
  x.fillStyle = sideWallCol;
  x.fillRect(0, topRoofY, W, H - topRoofY);

  // Gờ phào chỉ mái nổi 3D trên đỉnh hai cột tường bên
  x.fillStyle = mx("#434963", "#cfc6b8", dayFactor);
  x.fillRect(0, topRoofY - 4, 58, 9);
  x.fillRect(742, topRoofY - 4, 58, 9);

  if (dayFactor > 0.15) {
    const leftShadowGrad = x.createLinearGradient(0, topRoofY, 56, 380);
    leftShadowGrad.addColorStop(0, "rgba(45, 38, 32, " + (0.34 * dayFactor) + ")");
    leftShadowGrad.addColorStop(1, "rgba(45, 38, 32, " + (0.18 * dayFactor) + ")");
    x.fillStyle = leftShadowGrad;
    x.beginPath();
    x.moveTo(0, topRoofY);
    x.lineTo(56, topRoofY);
    x.lineTo(56, 380);
    x.lineTo(0, 250);
    x.closePath();
    x.fill();

    const rightShadowGrad = x.createLinearGradient(744, topRoofY, 800, 310);
    rightShadowGrad.addColorStop(0, "rgba(45, 38, 32, " + (0.34 * dayFactor) + ")");
    rightShadowGrad.addColorStop(1, "rgba(45, 38, 32, " + (0.18 * dayFactor) + ")");
    x.fillStyle = rightShadowGrad;
    x.beginPath();
    x.moveTo(744, topRoofY);
    x.lineTo(800, topRoofY);
    x.lineTo(800, 310);
    x.lineTo(744, 236);
    x.closePath();
    x.fill();
  }

  // Khối mặt tiền chính ở giữa (x: 56 -> 744, y: 104 -> H)
  x.fillStyle = mx("#101117", "#1e1c1b", dayFactor);
  x.fillRect(56, topRoofY, 688, H - topRoofY);

  // Gờ diềm mái bê tông nổi 3D phía trên bảng gỗ
  x.fillStyle = mx("#454b61", "#9e978e", dayFactor);
  x.fillRect(52, topRoofY - 3, 696, 22);
  x.fillStyle = "rgba(0, 0, 0, 0.35)";
  x.fillRect(52, topRoofY + 16, 696, 3);

  // 2. BIỂN HIỆU ỐP GỖ SỌC DỌC + CỤC NÓNG ĐIỀU HÒA (y: 120 -> 186)
  x.fillStyle = "#33302f";
  x.fillRect(50, 118, 556, 6);
  for (let rx = 50; rx < 606; rx += 8) {
    x.fillStyle = rx % 16 === 0 ? mx("#52586e", "#7d7772", dayFactor) : "#22201f";
    x.fillRect(rx, 118, 4, 5);
  }

  const woodSignGrad = x.createLinearGradient(0, 124, 0, 186);
  woodSignGrad.addColorStop(0, mx("#4a311e", "#875734", dayFactor));
  woodSignGrad.addColorStop(0.65, mx("#382416", "#664024", dayFactor));
  woodSignGrad.addColorStop(1, "#29180c");
  x.fillStyle = woodSignGrad;
  x.fillRect(56, 124, 546, 62);

  for (let wx = 60; wx < 600; wx += 13) {
    x.fillStyle = "rgba(255, 224, 185, " + (0.04 + dayFactor * 0.05) + ")";
    x.fillRect(wx, 124, 2, 62);
    x.fillStyle = "rgba(12, 6, 2, 0.34)";
    x.fillRect(wx + 11, 124, 2, 62);
  }
  x.strokeStyle = "#1f1107";
  x.lineWidth = 2;
  x.strokeRect(56, 124, 546, 62);

  // Bóng đổ dưới bảng gỗ
  x.fillStyle = "rgba(0, 0, 0, 0.48)";
  x.fillRect(56, 186, 546, 8);

  // Logo & chữ nổi "MUSIC CAFÉ"
  x.save();
  x.shadowColor = "rgba(255, 210, 120, " + (0.4 + nightFactor * 0.45) + ")";
  x.shadowBlur = 7 + nightFactor * 8;
  x.strokeStyle = mx("#ffe7ba", "#f7dcb0", dayFactor);
  x.lineWidth = 2.4;
  x.beginPath();
  x.arc(224, 155, 12, 0, 2 * PI);
  x.stroke();

  x.font = "400 44px 'VT323',monospace";
  x.fillStyle = "#1a0e06";
  x.fillText("MUSIC CAFÉ", 358, 168);
  x.fillStyle = mx("#fff0cf", "#fae0b6", dayFactor);
  x.fillText("MUSIC CAFÉ", 356, 166);
  x.restore();

  // Cục nóng điều hòa góc trên bên phải (y: 108 -> 186)
  x.fillStyle = mx("#585d6e", "#9c968e", dayFactor);
  rr(604, 108, 138, 78, 3);
  x.strokeStyle = "#33302c";
  x.lineWidth = 1.6;
  x.strokeRect(604, 108, 138, 78);
x.fillStyle = "#292724";
ci(652, 147, 29);
x.strokeStyle = "#524e49";
x.lineWidth = 1.4;
for (let r = 8; r <= 25; r += 7) {
x.beginPath();
x.arc(652, 147, r, 0, 2 * PI);
x.stroke();
}
x.fillStyle = "#403d39";
for (let vy = 117; vy <= 174; vy += 5.5) {
x.fillRect(700, vy, 32, 2.5);
}
// Mái tôn nhỏ dưới cục nóng điều hòa & bóng đèn dây tóc gọn gàng (y: 190 -> 222)
x.fillStyle = "#2b2827";
x.fillRect(598, 190, 152, 6);
for (let rx = 598; rx < 750; rx += 8) {
x.fillStyle = rx % 16 === 0 ? "#635f5c" : "#1f1d1c";
x.fillRect(rx, 190, 4, 5);
}
x.strokeStyle = "#111";
x.lineWidth = 1.5;
x.beginPath();
x.moveTo(684, 196);
x.lineTo(684, 214);
x.stroke();
x.save();
x.globalCompositeOperation = "screen";
const bulbGlow = x.createRadialGradient(684, 217, 1, 684, 217, 34 + nightFactor * 20);
bulbGlow.addColorStop(0, "rgba(255, 224, 145, " + (0.5 + nightFactor * 0.35) + ")");
bulbGlow.addColorStop(1, "rgba(255, 224, 145, 0)");
x.fillStyle = bulbGlow;
x.beginPath();
x.arc(684, 217, 34 + nightFactor * 20, 0, 2 * PI);
x.fill();
x.restore();
x.fillStyle = "#fff5cc";
el(684, 217, 2.5, 3.8);
// 3. BẬC THỀM ĐÁ XÁM, BỤC GỖ & PHẢN CHIẾU MẶT NƯỚC KHI TRỜI MƯA
x.fillStyle = mx("#383d4f", "#8a857e", dayFactor);
x.fillRect(0, 466, W, 34);
if (rainFactor > 0.03) {
x.save();
x.beginPath();
x.rect(0, 466, W, 34);
x.clip();
const wetFloorGrad = x.createLinearGradient(0, 466, 0, 500);
wetFloorGrad.addColorStop(0, "rgba(24, 30, 44, " + (0.45 * rainFactor) + ")");
wetFloorGrad.addColorStop(0.5, "rgba(42, 52, 72, " + (0.28 * rainFactor) + ")");
wetFloorGrad.addColorStop(1, "rgba(18, 22, 34, " + (0.52 * rainFactor) + ")");
x.fillStyle = wetFloorGrad;
x.fillRect(0, 466, W, 34);
x.globalCompositeOperation = "screen";
const reflections = Array.of(
{ rx: 26, rw: 44, col: "255, 218, 130", a: 0.45 },
{ rx: 98, rw: 36, col: "255, 210, 120", a: 0.32 },
{ rx: 235, rw: 76, col: "255, 222, 150", a: 0.36 },
{ rx: 355, rw: 84, col: "255, 222, 150", a: 0.4 },
{ rx: 475, rw: 76, col: "255, 222, 150", a: 0.36 },
{ rx: 604, rw: 36, col: "255, 210, 120", a: 0.32 },
{ rx: 684, rw: 52, col: "255, 224, 145", a: 0.42 }
);
for (let i = 0; i < reflections.length; i++) {
const ref = reflections.at(i);
const refAlpha = ref.a * rainFactor * (0.45 + nightFactor * 0.55);
const rGrad = x.createRadialGradient(ref.rx, 480, 2, ref.rx, 480, ref.rw);
rGrad.addColorStop(0, "rgba(" + ref.col + ", " + refAlpha + ")");
rGrad.addColorStop(1, "rgba(" + ref.col + ", 0)");
x.fillStyle = rGrad;
x.fillRect(ref.rx - ref.rw, 466, ref.rw * 2, 34);
for (let line = 0; line < 4; line++) {
const wy = 470 + line * 7;
const waveShift = Math.sin(t * 3.2 + i * 1.7 + line * 2.1) * 7;
const lineW = ref.rw * (0.65 - line * 0.1) + Math.cos(t * 4 + line) * 4;
x.fillStyle = "rgba(" + ref.col + ", " + (refAlpha * (0.75 - line * 0.12)) + ")";
x.fillRect(ref.rx - lineW / 2 + waveShift, wy, lineW, 1.5);
}
}
x.strokeStyle = "rgba(210, 228, 255, " + (0.28 * rainFactor) + ")";
x.lineWidth = 1;
for (let p = 0; p < 10; p++) {
const cycle = (t * 1.4 + p * 0.37) % 1;
const px = 45 + (p * 79) % (W - 90);
const py = 472 + (p * 19) % 22;
x.globalAlpha = (1 - cycle) * 0.45 * rainFactor;
x.beginPath();
x.ellipse(px, py, 2 + cycle * 11, 0.8 + cycle * 2.8, 0, 0, 2 * PI);
x.stroke();
}
x.globalAlpha = 1;
x.restore();
}
x.fillStyle = mx("#4b5166", "#aba59e", dayFactor);
x.fillRect(56, 458, 688, 9);
x.fillStyle = mx("#6b4222", "#ad6e3b", dayFactor);
x.fillRect(146, 448, 422, 10);
x.strokeStyle = "#3b2210";
x.lineWidth = 1.4;
x.strokeRect(146, 448, 422, 10);
// 4. SỐ NHÀ "32" PHÁT SÁNG, HÒM THƯ BẠC & 2 ĐÈN TƯỜNG CỔ ĐIỂN
x.save();
x.shadowColor = "rgba(255, 205, 90, " + (0.35 + nightFactor * 0.45) + ")";
x.shadowBlur = 6 + nightFactor * 6;
x.font = "800 20px 'Baloo 2',sans-serif";
x.fillStyle = "#ffd266";
x.fillText("32", 98, 316);
x.restore();
x.fillStyle = mx("#7c808c", "#dbd3c5", dayFactor);
rr(584, 298, 40, 46, 2);
x.strokeStyle = "#4a453e";
x.lineWidth = 1.4;
x.strokeRect(584, 298, 40, 46);
x.fillStyle = "#8c8478";
x.fillRect(590, 307, 28, 3);
for (const lx of Array.of(98, 604)) {
x.save();
x.globalCompositeOperation = "screen";
const coneAlpha = 0.22 + nightFactor * 0.42;
const coneG = x.createLinearGradient(lx, 258, lx, 355);
coneG.addColorStop(0, "rgba(255, 224, 145, " + coneAlpha + ")");
coneG.addColorStop(1, "rgba(255, 210, 120, 0)");
x.fillStyle = coneG;
x.beginPath();
x.moveTo(lx - 7, 260);
x.lineTo(lx + 7, 260);
x.lineTo(lx + 36, 355);
x.lineTo(lx - 36, 355);
x.closePath();
x.fill();
x.restore();
x.fillStyle = "#2b2928";
rr(lx - 3, 240, 6, 12, 2);
x.strokeStyle = "#0d0c0c";
x.lineWidth = 2.2;
x.beginPath();
x.moveTo(lx, 244);
x.lineTo(lx, 254);
x.stroke();
x.fillStyle = "#181616";
x.beginPath();
x.moveTo(lx - 11, 261);
x.lineTo(lx - 4, 251);
x.lineTo(lx + 4, 251);
x.lineTo(lx + 11, 261);
x.closePath();
x.fill();
x.fillStyle = "#ffe59e";
ci(lx, 262, 3);
}
// 5. CÁNH CỬA GỖ PANO NÂU BÊN PHẢI (y = 242 -> 458)
x.fillStyle = "#2b190e";
rr(642, 242, 84, 216, 3);
for (let i = 0; i < 6; i++) {
x.fillStyle = i % 2 ? mx("#4d2f1b", "#75482a", dayFactor) : mx("#3d2515", "#633c22", dayFactor);
x.fillRect(647 + i * 12.5, 247, 11.5, 206);
}
x.strokeStyle = "#2b170b";
x.lineWidth = 2;
x.strokeRect(652, 256, 64, 82);
x.strokeRect(652, 348, 64, 98);
x.fillStyle = "#e6bc53";
ci(714, 360, 3.5);
x.fillStyle = "#f6e7cf";
x.font = "400 15px 'VT323',monospace";
x.fillText("OPEN", 684, 280);
x.save();
x.translate(684, 238);
x.rotate(sw);
x.fillStyle = "#e9b84a";
x.beginPath();
x.arc(0, 6.5, 6, PI, 2 * PI);
x.fill();
x.fillRect(-6, 6.5, 12, 2.2);
x.restore();
// 6. CỬA KÍNH LỚN 3 CÁNH Ở GIỮA
x.fillStyle = "#0e0d0d";
rr(146, 228, 422, 220, 3);
x.save();
x.beginPath();
x.rect(152, 234, 410, 208);
x.clip();
g = x.createLinearGradient(0, 234, 0, 355);
g.addColorStop(0, mx("#59493a", "#e6d2ad", dayFactor));
g.addColorStop(1, mx("#45372b", "#d6b285", dayFactor));
x.fillStyle = g;
x.fillRect(152, 234, 410, 122);
x.fillStyle = mx("#523a26", "#9c7049", dayFactor);
x.fillRect(152, 354, 410, 88);
x.strokeStyle = "rgba(25, 14, 6, 0.28)";
x.lineWidth = 1;
for (let fx = 160; fx < 562; fx += 14) {
x.beginPath();
x.moveTo(fx, 354);
x.lineTo(fx, 442);
x.stroke();
}
for (const winX of Array.of(430, 488)) {
x.fillStyle = "#3a2516";
rr(winX - 2, 250, 46, 56, 2);
const wSky = x.createLinearGradient(0, 252, 0, 304);
wSky.addColorStop(0, E.top || "#1c263b");
wSky.addColorStop(1, E.bot || "#3c4b6e");
x.fillStyle = wSky;
x.fillRect(winX, 252, 42, 52);
if (winX === 430 && nightFactor > 0.2) {
x.fillStyle = "#fff6cc";
ci(winX + 27, 266, 5.5);
x.fillStyle = E.top || "#1c263b";
ci(winX + 24, 264, 5);
x.fillStyle = "#ffffff";
x.fillRect(winX + 11, 262, 1.5, 1.5);
x.fillRect(winX + 15, 275, 1.2, 1.2);
}
x.fillStyle = "#4a301d";
x.fillRect(winX + 20, 252, 2, 52);
x.fillRect(winX, 277, 42, 2);
}
const flagColors = Array.of("#e06c75", "#e5c07b", "#61afef", "#98c379", "#c678dd");
let flagIdx = 0;
for (let fx = 154; fx < 556; fx += 13) {
const sag = Math.sin(((fx - 154) / 402) * PI) * 5;
x.fillStyle = flagColors.at(flagIdx % flagColors.length);
x.beginPath();
x.moveTo(fx, 234);
x.lineTo(fx + 11, 234);
x.lineTo(fx + 5.5, 243 + sag);
x.closePath();
x.fill();
flagIdx++;
}
// Sân khấu bên trong
x.fillStyle = mx("#4f281b", "#7a3e2a", dayFactor);
x.fillRect(160, 248, 174, 102);
x.fillStyle = "rgba(25, 10, 5, 0.35)";
for (let by = 254; by < 346; by += 8) {
x.fillRect(162, by, 170, 1);
}
x.fillStyle = mx("#694124", "#996037", dayFactor);
x.fillRect(162, 248, 18, 102);
x.fillRect(314, 248, 18, 102);
x.fillStyle = "#7d5638";
rr(156, 350, 182, 14, 2);
x.fillStyle = "#b88150";
rr(156, 345, 182, 7, 2);
x.fillStyle = "#c9823b";
el(192, 336, 6, 8);
el(192, 327, 4.5, 5.5);
x.fillStyle = "#4a2c16";
x.fillRect(191, 314, 2, 12);
x.strokeStyle = "#2b2b2b";
x.lineWidth = 1.4;
x.beginPath();
x.moveTo(247, 345);
x.lineTo(247, 322);
x.stroke();
x.fillStyle = "#e0e0e0";
ci(247, 320, 2.2);
// Quầy pha chế bên trong
x.fillStyle = "#6b4a35";
rr(364, 314, 188, 38, 3);
rr(364, 304, 28, 48, 3);
x.fillStyle = "#c98f58";
rr(362, 308, 192, 9, 2);
rr(362, 299, 32, 9, 2);
x.fillStyle = "#f2eee6";
rr(424, 301, 10, 7, 2);
rr(486, 303, 5, 5, 1);
rr(494, 303, 5, 5, 1);
for (const barStoolX of Array.of(424, 486)) {
x.fillStyle = "#5c371a";
x.fillRect(barStoolX - 6, 353, 2.5, 8);
x.fillRect(barStoolX + 3.5, 353, 2.5, 8);
x.fillStyle = "#b87e4b";
rr(barStoolX - 9, 349, 18, 4.5, 2);
}
x.fillStyle = "#6b4a35";
rr(534, 250, 24, 32, 2);
x.fillStyle = "#2f4238";
rr(536, 252, 20, 28, 1);
x.fillStyle = mx("#6e6570", "#a89ca8", dayFactor);
rr(184, 368, 346, 68, 14);
x.strokeStyle = "rgba(45, 38, 48, 0.35)";
x.lineWidth = 1.5;
x.strokeRect(188, 371, 338, 62);
if (cp) {
const st = cp.w === ME ? IS.me : (IS[cp.w.id] || (IS[cp.w.id] = { V: {}, hd: {}, fr: 0, f0: 1, auto: 1 }));
const I = IN[cp.i], ver = I.f == "g" || I.f == "s";
x.save();
x.translate(ver ? 268 : I.f == "p" ? 236 : 254, ver ? 314 : 330);
x.scale(ver ? 0.36 : 0.32, ver ? 0.36 : 0.32);
drawI(I, st, t);
x.restore();
}
TBP.forEach(([a, b], idx) => {
const fx = 165 + a * 0.45, fy = cl(392 + (b - 270) * 0.13, 372, 424) + 10;
const isGreenCloth = idx === 1 || idx === 3 || idx === 5;
x.fillStyle = "rgba(10, 6, 20, 0.28)";
el(fx, fy + 2, 25, 3.2);
x.fillStyle = "#8a5634";
rr(fx - 26, fy - 11, 6, 11, 1.5);
rr(fx + 20, fy - 11, 6, 11, 1.5);
x.fillStyle = "#b87a4b";
rr(fx - 26, fy - 15, 3, 6, 1);
rr(fx + 23, fy - 15, 3, 6, 1);
x.fillStyle = "#7a4c2e";
rr(fx - 18, fy - 8, 36, 8, 2);
x.fillStyle = "#d9a066";
rr(fx - 20, fy - 12, 40, 4.5, 2);
x.fillStyle = isGreenCloth ? "#7fb88e" : "#dfa26b";
rr(fx - 15, fy - 12, 30, 7, 1.5);
x.fillStyle = "#fff2a6";
el(fx, fy - 14.5, 1.4, 2);
});
// Vẽ viền sáng nội thất bên trong bằng 1 lần bật screen blend
x.save();
x.globalCompositeOperation = "screen";
drawRimHighlight(158, 345.5, 336, 345.5, 235, 280, 160, 0.65);
drawRimHighlight(364, 308.5, 552, 308.5, 475, 280, 140, 0.7);
TBP.forEach(([a, b]) => {
const fx = 165 + a * 0.45, fy = cl(392 + (b - 270) * 0.13, 372, 424) + 10;
drawRimHighlight(fx - 18, fy - 12, fx + 18, fy - 12, 355, 280, 210, 0.6);
});
x.restore();
const R2 = ALL.map(r => ({ r, p: fp(r) })).filter(o => !o.p.out).sort((a, b) => a.p.y - b.p.y);
R2.forEach(o => pet(110 + o.p.x * 0.68, o.p.y, o.r.lk, t, 1, o.p.s * 0.82));
for (const lx of Array.of(235, 355, 475)) {
x.strokeStyle = "#2a1f1a";
x.lineWidth = 1.6;
x.beginPath();
x.moveTo(lx, 234);
x.lineTo(lx, 266);
x.stroke();
x.fillStyle = "#1c1512";
x.beginPath();
x.moveTo(lx - 11, 277);
x.lineTo(lx - 4, 266);
x.lineTo(lx + 4, 266);
x.lineTo(lx + 11, 277);
x.closePath();
x.fill();
x.fillStyle = mx("#ffe6a0", "#ffd584", dayFactor);
el(lx, 278, 6.5, 2);
}
x.save();
x.globalCompositeOperation = "screen";
for (const lx of Array.of(235, 355, 475)) {
g = x.createRadialGradient(lx, 280, 2, lx, 280, 90);
g.addColorStop(0, "rgba(255, 215, 135, " + (0.25 + nightFactor * 0.42) + ")");
g.addColorStop(1, "rgba(255, 215, 135, 0)");
x.fillStyle = g;
x.fillRect(lx - 90, 190, 180, 180);
}
x.restore();
x.fillStyle = "rgba(255,255,255,.07)";
x.beginPath();
x.moveTo(175, 234); x.lineTo(235, 234); x.lineTo(152, 330); x.lineTo(152, 286);
x.fill();
x.beginPath();
x.moveTo(360, 234); x.lineTo(410, 234); x.lineTo(300, 358); x.lineTo(290, 358);
x.fill();
x.restore();
// Hai thanh khung chia 3 cánh cửa kính
x.fillStyle = "#111010";
x.fillRect(286, 230, 7, 216);
x.fillRect(424, 230, 7, 216);
R2.forEach(o => tag(o.r, t, 110 + o.p.x * 0.68, o.p.y, o.p.s * 0.82));
// 7. HAI CHẬU CÂY XANH & GHẾ GỖ NHỎ TRƯỚC HIÊN
const drawPottedPlant = (px, py, isPalm) => {
x.fillStyle = "rgba(10, 8, 6, 0.45)";
el(px, py + 2, 18, 4);
const potGrad = x.createLinearGradient(px - 14, py - 32, px + 14, py);
potGrad.addColorStop(0, mx("#7d7870", "#c4bcb0", dayFactor));
potGrad.addColorStop(1, mx("#524e48", "#8a8277", dayFactor));
x.fillStyle = potGrad;
x.beginPath();
x.moveTo(px - 14, py - 32);
x.lineTo(px + 14, py - 32);
x.lineTo(px + 11, py);
x.lineTo(px - 11, py);
x.closePath();
x.fill();
x.strokeStyle = "#2b2623";
x.lineWidth = 1.4;
x.stroke();
if (isPalm) {
const palmAngles = Array.of(-1.1, -0.65, -0.2, 0.25, 0.7, 1.15);
for (let i = 0; i < palmAngles.length; i++) {
const ang = palmAngles.at(i);
x.save();
x.translate(px, py - 34);
x.rotate(ang);
x.fillStyle = i % 2 === 0 ? mx("#3f6928", "#659e44", dayFactor) : mx("#528236", "#82bd5c", dayFactor);
x.beginPath();
x.ellipse(0, -19, 4, 19, 0, 0, 2 * PI);
x.fill();
x.restore();
}
} else {
x.strokeStyle = "#4d331f";
x.lineWidth = 2.8;
x.beginPath();
x.moveTo(px, py - 32);
x.lineTo(px - 2, py - 66);
x.stroke();
const leafPos = Array.of(
Array.of(-10, -48, 9), Array.of(8, -52, 10), Array.of(-6, -64, 11),
Array.of(7, -66, 9), Array.of(0, -75, 11), Array.of(-12, -57, 8)
);
for (let i = 0; i < leafPos.length; i++) {
const lp = leafPos.at(i);
x.fillStyle = i % 2 === 0 ? mx("#426927", "#6aa343", dayFactor) : mx("#578736", "#89c75e", dayFactor);
ci(px + lp.at(0), py + lp.at(1), lp.at(2));
}
}
};
drawPottedPlant(114, 464, false);
drawPottedPlant(606, 464, true);
for (const sx of Array.of(220, 276)) {
x.fillStyle = mx("#5c371a", "#9c6030", dayFactor);
x.fillRect(sx - 12, 452, 4, 15);
x.fillRect(sx + 8, 452, 4, 15);
x.fillRect(sx - 10, 460, 20, 3);
x.fillStyle = mx("#855630", "#d99559", dayFactor);
rr(sx - 16, 447, 32, 5.5, 2);
}
// 8. TRANG TRÍ HAI BÊN RÌA NGOÀI
x.fillStyle = "#23252b";
x.fillRect(23, 224, 6, 242);
rr(16, 454, 20, 12, 3);
x.fillStyle = "#18191c";
x.beginPath();
x.moveTo(12, 224);
x.lineTo(40, 224);
x.lineTo(35, 206);
x.lineTo(17, 206);
x.closePath();
x.fill();
x.fillStyle = "#ffe299";
rr(18, 210, 16, 12, 2);
x.save();
x.globalCompositeOperation = "screen";
const streetLampGlow = x.createRadialGradient(26, 216, 2, 26, 216, 70);
streetLampGlow.addColorStop(0, "rgba(255, 222, 140, " + (0.3 + nightFactor * 0.5) + ")");
streetLampGlow.addColorStop(1, "rgba(255, 222, 140, 0)");
x.fillStyle = streetLampGlow;
x.beginPath();
x.arc(26, 216, 70, 0, 2 * PI);
x.fill();
x.restore();
// Dây leo xanh rủ nhẹ từ góc tường bên trái
x.strokeStyle = "#4d7c32";
x.lineWidth = 2;
x.beginPath();
x.moveTo(10, 104);
x.quadraticCurveTo(18, 150, 8, 198);
x.stroke();
for (let ly = 114; ly <= 192; ly += 16) {
x.fillStyle = ly % 32 === 0 ? "#6aa343" : "#548733";
el(12 + Math.sin(ly) * 4, ly, 5.5, 3.2);
}
// Xe đạp vintage bên phải
x.save();
x.strokeStyle = "#2d3038";
x.lineWidth = 2.6;
x.beginPath();
x.arc(778, 446, 22, 0, 2 * PI);
x.stroke();
x.lineWidth = 1;
for (let a = 0; a < 2 * PI; a += PI / 4) {
x.beginPath();
x.moveTo(778, 446);
x.lineTo(778 + Math.cos(a) * 21, 446 + Math.sin(a) * 21);
x.stroke();
}
x.strokeStyle = "#8c4632";
x.lineWidth = 3;
x.beginPath();
x.moveTo(778, 446);
x.lineTo(796, 422);
x.lineTo(805, 446);
x.moveTo(796, 422);
x.lineTo(784, 416);
x.stroke();
x.fillStyle = "#4a2c18";
rr(777, 413, 12, 4.5, 2);
x.restore();
// 9. GOM TOÀN BỘ VIỀN BẮT SÁNG MẶT TIỀN VÀO 1 LẦN VẼ DUY NHẤT (SIÊU MƯỢT & DỊU MẮT)
x.save();
x.globalCompositeOperation = "screen";
x.lineCap = "round";
// 9A. Viền bắt sáng trên nóc quán & cây sân thượng
drawSkyRimHighlight(88, 72, 253, 72, 0.95);
drawSkyRimHighlight(88, 74, 88, 104, 0.65);
drawSkyRimHighlight(253, 86, 598, 86, 0.7);
drawSkyRimHighlight(604, 108, 742, 108, 1.0);
drawSkyRimHighlight(742, 108, 742, 186, 0.7);
drawSkyRimHighlight(52, topRoofY - 3, 604, topRoofY - 3, 0.9);
drawSkyRimHighlight(0, topRoofY - 4, 58, topRoofY - 4, 0.8);
drawSkyRimHighlight(742, topRoofY - 4, 800, topRoofY - 4, 0.8);
for (let bx = 285; bx <= 362; bx += 16) drawArcRimHighlight(bx, 86, 9, PI * 1.15, PI * 1.85, skyColStr, skyRimAlpha * 0.75, 1.2);
for (let bx = 466; bx <= 556; bx += 16) drawArcRimHighlight(bx, 86, 9, PI * 1.15, PI * 1.85, skyColStr, skyRimAlpha * 0.75, 1.2);
// 9B. Viền bắt sáng từ đèn nhân tạo (mảnh, dịu nhẹ)
drawRimHighlight(56, 186, 160, 186, 98, 262, 145, 0.85);
drawRimHighlight(530, 186, 602, 186, 604, 262, 145, 0.85);
drawRimHighlight(604, 186, 742, 186, 684, 217, 110, 0.85);
drawRimHighlight(598, 196, 750, 196, 684, 217, 90, 0.75);
drawArcRimHighlight(652, 147, 29, PI * 0.15, PI * 0.85, "255, 224, 145", 0.2 + nightFactor * 0.25, 1.25);
drawRimHighlight(700, 174, 732, 174, 684, 217, 95, 0.65);
// Chao đèn tường & cột đèn đường
for (const lx of Array.of(98, 604)) drawRimHighlight(lx - 10, 261, lx + 10, 261, lx, 262, 40, 0.8);
drawSkyRimHighlight(17, 206, 35, 206, 0.75);
drawRimHighlight(12, 224, 40, 224, 26, 216, 45, 0.85);
drawRimHighlight(28.5, 226, 28.5, 454, 26, 216, 260, 0.65);
drawRimHighlight(16, 454, 36, 454, 26, 216, 280, 0.7);
// Tường & khung bao cửa kính
drawRimHighlight(56, 195, 56, 330, 26, 216, 130, 0.8);
drawRimHighlight(146, 228, 568, 228, 355, 280, 260, 0.6);
drawRimHighlight(146, 228, 146, 365, 98, 262, 135, 0.8);
drawRimHighlight(568, 228, 568, 365, 604, 262, 135, 0.8);
drawRimHighlight(286, 232, 286, 444, 235, 280, 140, 0.55);
drawRimHighlight(431, 232, 431, 444, 475, 280, 140, 0.55);
// Cửa gỗ OPEN & hòm thư
drawRimHighlight(642, 242, 642, 375, 604, 262, 135, 0.8);
drawRimHighlight(642, 242, 726, 242, 684, 217, 85, 0.85);
drawRimHighlight(652, 256, 716, 256, 684, 217, 90, 0.65);
drawRimHighlight(652, 348, 716, 348, 684, 217, 160, 0.55);
drawArcRimHighlight(714, 360, 3.6, PI * 1.1, PI * 1.9, "255, 235, 165", 0.3 + nightFactor * 0.3, 1.2);
drawRimHighlight(584, 298, 624, 298, 604, 262, 95, 0.8);
drawRimHighlight(584, 298, 584, 344, 604, 262, 105, 0.6);
// Chậu cây trái, cây cọ phải & tán lá
drawRimHighlight(100, 432, 128, 432, 98, 262, 215, 0.8);
drawRimHighlight(100, 432, 103, 464, 98, 262, 215, 0.6);
drawRimHighlight(128, 432, 125, 464, 98, 262, 215, 0.6);
const leafPos = Array.of(Array.of(-10, -48, 9), Array.of(8, -52, 10), Array.of(-6, -64, 11), Array.of(7, -66, 9), Array.of(0, -75, 11), Array.of(-12, -57, 8));
for (let i = 0; i < leafPos.length; i++) {
const lp = leafPos.at(i);
drawArcRimHighlight(114 + lp.at(0), 464 + lp.at(1), lp.at(2), PI * 1.1, PI * 1.85, "255, 232, 165", 0.25 + nightFactor * 0.28, 1.25);
}
drawRimHighlight(592, 432, 620, 432, 604, 262, 215, 0.8);
drawRimHighlight(592, 432, 595, 464, 604, 262, 215, 0.6);
drawRimHighlight(620, 432, 617, 464, 604, 262, 215, 0.6);
for (const ang of Array.of(-1.1, -0.65, -0.2, 0.25, 0.7, 1.15)) {
drawRimHighlight(606 + Math.sin(ang) * 14, 430 - Math.cos(ang) * 14, 606 + Math.sin(ang) * 32, 430 - Math.cos(ang) * 32, 604, 262, 240, 0.55);
}
// Hai ghế đẩu gỗ vỉa hè & bục gỗ
for (const sx of Array.of(220, 276)) {
drawRimHighlight(sx - 15, 447.2, sx + 15, 447.2, 235, 280, 250, 0.75);
drawRimHighlight(sx - 12, 453, sx - 12, 466, 235, 280, 250, 0.5);
}
drawRimHighlight(146, 448, 260, 448, 98, 262, 240, 0.75);
drawRimHighlight(480, 448, 568, 448, 604, 262, 240, 0.75);
// Dây leo bên trái & xe đạp bên phải
for (let ly = 114; ly <= 192; ly += 16) {
drawArcRimHighlight(12 + Math.sin(ly) * 4, ly, 4.5, PI * 1.15, PI * 1.85, skyColStr, skyRimAlpha * 0.65, 1.1);
}
drawArcRimHighlight(778, 446, 22.3, PI * 1.1, PI * 1.85, "255, 226, 155", 0.22 + nightFactor * 0.25, 1.3);
drawRimHighlight(778, 446, 796, 422, 684, 217, 290, 0.7);
drawRimHighlight(777, 413, 789, 413, 684, 217, 280, 0.75);
// 9C. Viền bắt sáng hắt ngược từ mặt nước mưa dưới đất lên chân vật thể
drawGroundBounceRim(0, 466, 65, 466, "255, 222, 145", 0.8);
drawGroundBounceRim(16, 454, 36, 454, "255, 228, 160", 0.85);
drawGroundBounceRim(103, 464, 125, 464, "255, 218, 135", 0.75);
drawGroundBounceRim(208, 466, 232, 466, "255, 222, 145", 0.65);
drawGroundBounceRim(264, 466, 288, 466, "255, 222, 145", 0.65);
drawGroundBounceRim(595, 464, 617, 464, "255, 218, 135", 0.75);
drawGroundBounceRim(146, 458, 568, 458, "255, 226, 155", 0.8);
drawGroundBounceRim(642, 458, 744, 458, "255, 224, 145", 0.75);
drawGroundBounceRim(756, 466, 800, 466, "255, 222, 145", 0.7);
x.restore();
ALL.map(r => ({ r, p: fp(r) })).filter(o => o.p.out).forEach(o => {
pet(o.p.x, o.p.y, o.r.lk, t, 1, o.p.s);
tag(o.r, t, o.p.x, o.p.y, o.p.s);
});
if (E.rn > 0.03) {
x.strokeStyle = "rgba(200,215,235," + (0.4 * E.rn) + ")";
x.lineWidth = 1;
x.beginPath();
for (let i = 0; i < 90; i++) {
const rx = (i * 89) % W, ry = (t * 420 + i * 47) % H;
x.moveTo(rx, ry);
x.lineTo(rx - 5, ry + 14);
}
x.stroke();
}
x.restore();
}