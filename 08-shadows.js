/* ===== HỆ THỐNG ÁNH SÁNG & 2 BÓNG ĐỔ ĐỐI XỨNG CÂN BẰNG, TỰ NHIÊN ===== */

const _SIL_RAW = document.createElement("canvas");
_SIL_RAW.width = 150;
_SIL_RAW.height = 180;
const _rawCtx = _SIL_RAW.getContext("2d");

const _SIL_SOFT = document.createElement("canvas");
_SIL_SOFT.width = 150;
_SIL_SOFT.height = 180;
const _softCtx = _SIL_SOFT.getContext("2d");

const _BEAM_C = document.createElement("canvas");
const _beamCtx = _BEAM_C.getContext("2d");

function getSunVector(E) {
  const hour = E.h != null ? E.h : 11;
  const sunProgress = cl((hour - 6) / 12, 0, 1);
  const sunAlt = Math.sin(PI * sunProgress);

  const dirX = -0.38 - Math.cos(PI * sunProgress) * 0.52;
  const dirY = 0.65 + sunAlt * 0.35;
  const length = 1.25 - sunAlt * 0.55;

  return { hour, sunProgress, sunAlt, dirX, dirY, length };
}

/* ===== 1. BÓNG ĐỔ BÀN & GHẾ MỀM MẠI ===== */
function shadows(E, OB) {
  const sw = Math.round(W * 0.5);
  const sh = Math.round(H * 0.5);
  if (SHC.width !== sw || SHC.height !== sh) {
    SHC.width = sw;
    SHC.height = sh;
  }
  const c = shc;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.clearRect(0, 0, sw, sh);
  c.setTransform(0.5, 0, 0, 0.5, 0, 0);

  const dayFactor = cl(E.day || 0, 0, 1);
  const nightFactor = 1 - dayFactor;
  const hour = E.h != null ? E.h : 11;
  const sunsetFactor = cl(1 - Math.abs(hour - 17.2) / 2.2, 0, 1) * dayFactor;
  const shCol = sunsetFactor > 0.25 ? "64, 30, 56" : "24, 28, 54";
  const sun = getSunVector(E);

  for (let i = 0; i < OB.length; i++) {
    const o = OB.at(i);
    if (!o || o.hw > 100) continue;

    if (Array.isArray(o.legs)) {
      for (let li = 0; li < o.legs.length; li++) {
        const lg = o.legs.at(li);
        if (!lg || lg.length < 2) continue;
        const lx = o.x + lg.at(0), ly = o.y + lg.at(1);
        const g = c.createRadialGradient(lx, ly, 0.5, lx, ly, 8);
        g.addColorStop(0, "rgba(" + shCol + ", " + (0.55 + nightFactor * 0.16) + ")");
        g.addColorStop(0.55, "rgba(" + shCol + ", 0.22)");
        g.addColorStop(1, "rgba(" + shCol + ", 0)");
        c.fillStyle = g;
        c.beginPath();
        c.ellipse(lx, ly, 8, 3.8, 0, 0, 2 * PI);
        c.fill();
      }
    }

    const tX = cl((o.x - 80) / 640, 0, 1);
    const rx = o.hw * 1.12;
    const ry = o.hd * 1.25;

    const leftAlpha = (0.16 + tX * 0.28) * (0.7 + dayFactor * 0.3);
    c.save();
    c.translate(o.x - (8 + (1 - tX) * 12), o.y + 4 + sun.dirY * 6);
    c.scale(1, ry / rx);
    const bodyGrad = c.createRadialGradient(0, 0, rx * 0.12, 0, 0, rx);
    bodyGrad.addColorStop(0, "rgba(" + shCol + ", " + leftAlpha + ")");
    bodyGrad.addColorStop(0.6, "rgba(" + shCol + ", " + (leftAlpha * 0.45) + ")");
    bodyGrad.addColorStop(1, "rgba(" + shCol + ", 0)");
    c.fillStyle = bodyGrad;
    c.beginPath();
    c.arc(0, 0, rx, 0, 2 * PI);
    c.fill();
    c.restore();

    const rightAlpha = (0.16 + (1 - tX) * 0.28) * (0.7 + dayFactor * 0.3);
    c.save();
    c.translate(o.x + (10 + tX * 14), o.y + 3);
    c.scale(1, ry / rx);
    const rGrad = c.createRadialGradient(0, 0, rx * 0.12, 0, 0, rx);
    rGrad.addColorStop(0, "rgba(" + shCol + ", " + rightAlpha + ")");
    rGrad.addColorStop(0.6, "rgba(" + shCol + ", " + (rightAlpha * 0.45) + ")");
    rGrad.addColorStop(1, "rgba(" + shCol + ", 0)");
    c.fillStyle = rGrad;
    c.beginPath();
    c.arc(0, 0, rx, 0, 2 * PI);
    c.fill();
    c.restore();
  }

  ctx.drawImage(SHC, 0, 0, W, H);
}

/* ===== 2. BÓNG NHÂN VẬT: DÁNG BẦU BĨNH TỰ NHIÊN, CHIẾU LÊN TƯỜNG SAU QUẦY BAR ===== */
function drawCharShadow(r, px, py, pSc, E, t, onStage) {
  const b = r.mv ? Math.abs(Math.sin(t * 10)) * 3 : Math.sin(t * 2 + r.x) * 0.7;

  _rawCtx.globalCompositeOperation = "source-over";
  _rawCtx.clearRect(0, 0, 150, 180);
  const oldG = G;
  G = _rawCtx;
  pet(75, 150 - b, r.lk, t, 1);
  G = oldG;

  const dayFactor = cl(E.day || 0, 0, 1);
  const hour = E.h != null ? E.h : 11;
  const sunsetFactor = cl(1 - Math.abs(hour - 17.2) / 2.2, 0, 1) * dayFactor;
  const shCol = onStage ? "20, 8, 4" : (sunsetFactor > 0.25 ? "54, 22, 46" : "22, 24, 48");

  _rawCtx.globalCompositeOperation = "source-in";
  _rawCtx.fillStyle = "rgba(" + shCol + ", 1)";
  _rawCtx.fillRect(0, 0, 150, 180);
  _rawCtx.globalCompositeOperation = "source-over";

  _softCtx.globalCompositeOperation = "source-over";
  _softCtx.clearRect(0, 0, 150, 180);
  _softCtx.globalAlpha = 0.52;
  _softCtx.drawImage(_SIL_RAW, 0, 0);
  _softCtx.globalAlpha = 0.24;
  _softCtx.drawImage(_SIL_RAW, -2.5, 0);
  _softCtx.drawImage(_SIL_RAW, 2.5, 0);
  _softCtx.drawImage(_SIL_RAW, 0, -2.5);
  _softCtx.drawImage(_SIL_RAW, 0, 2.5);
  _softCtx.globalAlpha = 1;

  // Nếu nhân vật đứng sau quầy pha chế (x > 438 && y < 185):
  // Chiếu bóng trực tiếp lên bức tường sau lưng (từ chân tường y = 150 hắt lên trên)
  if (px > 438 && py < 185) {
    ctx.save();
    // Giới hạn vùng bóng nằm gọn trên mặt tường sau quầy (không tràn sang tường bên phải)
    ctx.beginPath();
    ctx.rect(442, 18, 324, 134);
    ctx.clip();

    // Khoảng cách từ nhân vật tới tường sau (y = 150) càng gần thì bóng càng rõ và thấp
    const wallDist = Math.max(0, py - 150);
    const wallBlurShift = 4 + wallDist * 0.25;
    const wallAlpha = cl(0.42 - wallDist * 0.005, 0.2, 0.42);

    // 1. Bóng chính hắt nhẹ lên tường (nghiêng sang trái theo ánh đèn quầy)
    ctx.save();
    ctx.translate(px - wallBlurShift, 152);
    ctx.transform(1.08, 0, -0.16, 0.88, 0, 0);
    ctx.globalAlpha = wallAlpha;
    ctx.drawImage(_SIL_SOFT, -75 * pSc, -150 * pSc, 150 * pSc, 180 * pSc);
    ctx.restore();

    // 2. Lớp bóng tán xạ thứ hai mờ hơn tạo chiều sâu nguồn sáng kép
    ctx.save();
    ctx.translate(px + wallBlurShift * 0.8, 151);
    ctx.transform(1.14, 0, 0.14, 0.84, 0, 0);
    ctx.globalAlpha = wallAlpha * 0.55;
    ctx.drawImage(_SIL_SOFT, -75 * pSc, -150 * pSc, 150 * pSc, 180 * pSc);
    ctx.restore();

    ctx.restore();
    return;
  }

  if (onStage) {
    const ao = ctx.createRadialGradient(px, py + 1, 1, px, py + 1, 18 * pSc);
    ao.addColorStop(0, "rgba(20, 8, 4, 0.75)");
    ao.addColorStop(0.6, "rgba(20, 8, 4, 0.35)");
    ao.addColorStop(1, "rgba(20, 8, 4, 0)");
    ctx.fillStyle = ao;
    ctx.beginPath();
    ctx.ellipse(px, py + 1, 18 * pSc, 5.5 * pSc, 0, 0, 2 * PI);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(54, 18, 264, 76, 5);
    ctx.clip();
    ctx.translate(px - 10, 94);
    ctx.transform(1.06, 0, -0.14, 0.94, 0, 0);
    ctx.globalAlpha = 0.65;
    ctx.drawImage(_SIL_SOFT, -75 * pSc, -150 * pSc, 150 * pSc, 180 * pSc);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(54, 92);
    ctx.lineTo(318, 92);
    ctx.lineTo(332, 122);
    ctx.lineTo(40, 122);
    ctx.closePath();
    ctx.clip();
    ctx.translate(px, py + 1);
    ctx.transform(1.08, 0, -0.35, 0.42, 0, 0);
    ctx.globalAlpha = 0.5;
    ctx.drawImage(_SIL_SOFT, -75 * pSc, -150 * pSc, 150 * pSc, 180 * pSc);
    ctx.restore();
    return;
  }

  // Bóng tiếp xúc tròn mềm dưới chân
  const ao = ctx.createRadialGradient(px, py + 1, 1, px, py + 1, 18 * pSc);
  ao.addColorStop(0, "rgba(" + shCol + ", 0.64)");
  ao.addColorStop(0.55, "rgba(" + shCol + ", 0.28)");
  ao.addColorStop(1, "rgba(" + shCol + ", 0)");
  ctx.fillStyle = ao;
  ctx.beginPath();
  ctx.ellipse(px, py + 1, 18 * pSc, 6.5 * pSc, 0, 0, 2 * PI);
  ctx.fill();

  // Cắt vùng sàn hợp lệ: bóng chỉ trải trên sàn gỗ/thảm (y >= 150)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(34, 150);
  ctx.lineTo(W - 34, 150);
  ctx.lineTo(W, 236);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.lineTo(0, 236);
  ctx.closePath();
  ctx.clip();

  // Tính vị trí ngang đối xứng chuẩn quanh tâm phòng (x = 400 -> tX = 0.5)
  const tX = cl((px - 100) / 600, 0, 1);
  const proxLeft = 1 - tX;

  const alphaToLeft = 0.16 + tX * 0.46;
  const alphaToRight = 0.16 + proxLeft * 0.46;

  const scaleYLeft = 0.44 + proxLeft * 0.14;
  const skewToLeft = 0.85 + proxLeft * 0.38;

  const scaleYRight = 0.44 + tX * 0.14;
  const skewToRight = -(0.85 + tX * 0.38);

  // 1. BÓNG ĐỔ SANG TRÁI (từ 2 cửa sổ phải)
  ctx.save();
  ctx.translate(px - 3 * pSc, py + 1);
  ctx.transform(1.32, 0, skewToLeft, -scaleYLeft, 0, 0);
  ctx.globalAlpha = alphaToLeft;
  ctx.drawImage(_SIL_SOFT, -75 * pSc, -150 * pSc, 150 * pSc, 180 * pSc);
  ctx.restore();

  // 2. BÓNG ĐỔ SANG PHẢI (từ cửa sổ trái)
  ctx.save();
  ctx.translate(px + 3 * pSc, py + 1);
  ctx.transform(1.32, 0, skewToRight, -scaleYRight, 0, 0);
  ctx.globalAlpha = alphaToRight;
  ctx.drawImage(_SIL_SOFT, -75 * pSc, -150 * pSc, 150 * pSc, 180 * pSc);
  ctx.restore();

  ctx.restore();
}

/* ===== 3. LUỒNG NẮNG VÀNG ẤM QUA 3 CỬA SỔ ===== */
function patch(E) {
  const dayFactor = cl(E.day || 0, 0, 1);
  if (dayFactor < 0.25) return;

  const sun = getSunVector(E);
  const sunsetFactor = cl(1 - Math.abs(sun.hour - 17.0) / 2.4, 0, 1);

  const bw = Math.round(W * 0.5);
  const bh = Math.round(H * 0.5);
  if (_BEAM_C.width !== bw || _BEAM_C.height !== bh) {
    _BEAM_C.width = bw;
    _BEAM_C.height = bh;
  }

  const bc = _beamCtx;
  bc.setTransform(1, 0, 0, 1, 0, 0);
  bc.clearRect(0, 0, bw, bh);
  bc.setTransform(0.5, 0, 0, 0.5, 0, 0);
  if ("filter" in bc) bc.filter = "blur(6.5px)";

  const reachDist = 270 + sunsetFactor * 80 + sun.sunAlt * 45;
  const slantX = sun.dirX * reachDist;
  const reachY = 96 + reachDist * 0.8;

  const makeGoldenBeam = (xStart, yStart, xEnd, yEnd, boost) => {
    const g = bc.createLinearGradient(xStart, yStart, xEnd, yEnd);
    if (sunsetFactor > 0.25) {
      g.addColorStop(0, "rgba(255, 200, 115, " + (0.52 * dayFactor * boost) + ")");
      g.addColorStop(0.5, "rgba(255, 155, 90, " + (0.28 * dayFactor * boost) + ")");
      g.addColorStop(1, "rgba(220, 130, 160, 0)");
    } else {
      g.addColorStop(0, "rgba(255, 238, 165, " + (0.52 * dayFactor * boost) + ")");
      g.addColorStop(0.55, "rgba(255, 222, 135, " + (0.26 * dayFactor * boost) + ")");
      g.addColorStop(1, "rgba(255, 210, 120, 0)");
    }
return g;
};
const leftPanes = Array.of(
Array.of(Array.of(8, 56), Array.of(15.2, 44.5), Array.of(15.2, 71), Array.of(8, 82.5)),
Array.of(Array.of(17.8, 40.5), Array.of(25, 30), Array.of(25, 55), Array.of(17.8, 67)),
Array.of(Array.of(8, 85.5), Array.of(15.2, 74), Array.of(15.2, 99.5), Array.of(8, 112)),
Array.of(Array.of(17.8, 70), Array.of(25, 58), Array.of(25, 83), Array.of(17.8, 95.5))
);
for (let i = 0; i < 4; i++) {
const p = leftPanes.at(i);
const isTopRow = i < 2;
const dxBeam = isTopRow ? 175 : 130;
const dyBeam = isTopRow ? 235 : 185;
bc.fillStyle = makeGoldenBeam(p.at(0).at(0), p.at(0).at(1), p.at(0).at(0) + dxBeam, p.at(0).at(1) + dyBeam, 0.95);
bc.beginPath();
bc.moveTo(p.at(0).at(0), p.at(0).at(1));
bc.lineTo(p.at(1).at(0), p.at(1).at(1));
bc.lineTo(p.at(2).at(0) + dxBeam, p.at(2).at(1) + dyBeam);
bc.lineTo(p.at(3).at(0) + dxBeam * 0.88, p.at(3).at(1) + dyBeam);
bc.closePath();
bc.fill();
}
const winStarts = Array.of(474, 586);
const rowOffsets = Array.of(
{ y1: 25, y2: 54, reachMult: 1.0, alphaMult: 1.0 },
{ y1: 61, y2: 94, reachMult: 0.74, alphaMult: 0.9 }
);
for (let wi = 0; wi < 2; wi++) {
const wx = winStarts.at(wi);
const cols = Array.of(Array.of(wx + 2, wx + 27), Array.of(wx + 35, wx + 60));
for (let ri = 0; ri < 2; ri++) {
const row = rowOffsets.at(ri);
const curSlantX = slantX * row.reachMult;
const curReachY = row.y2 + (reachY - 96) * row.reachMult;
for (let ci = 0; ci < 2; ci++) {
const x1 = cols.at(ci).at(0);
const x2 = cols.at(ci).at(1);
bc.fillStyle = makeGoldenBeam(x1, row.y1, x1 + curSlantX, curReachY, row.alphaMult);
bc.beginPath();
bc.moveTo(x1, row.y1);
bc.lineTo(x2, row.y1);
bc.lineTo(x2 + curSlantX * 1.18, curReachY);
bc.lineTo(x1 + curSlantX * 0.95, curReachY);
bc.closePath();
bc.fill();
}
}
}
ctx.save();
ctx.globalCompositeOperation = "screen";
ctx.drawImage(_BEAM_C, 0, 0, W, H);
const sunHalo = ctx.createRadialGradient(555, 80, 15, 510, 165, 390);
sunHalo.addColorStop(0, "rgba(255, 236, 168, " + (0.3 * dayFactor) + ")");
sunHalo.addColorStop(0.55, "rgba(255, 218, 138, " + (0.13 * dayFactor) + ")");
sunHalo.addColorStop(1, "rgba(255, 210, 130, 0)");
ctx.fillStyle = sunHalo;
ctx.fillRect(0, 0, W, H);
ctx.restore();
}
/* ===== 4. LỚP PHỦ TỐI SANG TRỌNG ===== */
function lights(E, L) {
const l = lm;
const dayFactor = cl(E.day || 0, 0, 1);
const nightFactor = 1 - dayFactor;
l.globalCompositeOperation = "source-over";
l.clearRect(0, 0, W, H);
const darkness = cl(0.28 + nightFactor * 0.28, 0.26, 0.56);
l.fillStyle = nightFactor > 0.45
? "rgba(18, 25, 52, " + darkness + ")"
: "rgba(32, 26, 46, " + darkness + ")";
l.fillRect(0, 0, W, H);
l.globalCompositeOperation = "destination-out";
const punchLight = (cx, cy, radius, intensity) => {
if (intensity <= 0.01) return;
const g = l.createRadialGradient(cx, cy, 0, cx, cy, radius);
g.addColorStop(0, "rgba(0,0,0," + Math.min(0.95, intensity) + ")");
g.addColorStop(0.45, "rgba(0,0,0," + (intensity * 0.65) + ")");
g.addColorStop(0.8, "rgba(0,0,0," + (intensity * 0.25) + ")");
g.addColorStop(1, "rgba(0,0,0,0)");
l.fillStyle = g;
l.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
};
l.fillStyle = "rgba(0,0,0,0.95)";
l.fillRect(470, 20, 70, 80);
l.fillRect(582, 20, 70, 80);
l.beginPath();
l.moveTo(6, 54);
l.lineTo(27, 26);
l.lineTo(27, 86);
l.lineTo(6, 118);
l.closePath();
l.fill();
punchLight(545, 145, 220, 0.78);
punchLight(115, 160, 165, 0.65);
if (Array.isArray(TBP)) {
for (let ti = 0; ti < TBP.length; ti++) {
const pt = TBP.at(ti);
const tx = perspX(pt.at(0), pt.at(1));
const ty = pt.at(1) - 10;
punchLight(tx, ty, 125, 0.85);
}
}
const stageLightPower = curPerf() ? 0.92 : 0.78;
const stageLightRadius = curPerf() ? 175 : 155;
punchLight(186, 82, stageLightRadius, stageLightPower);
ctx.drawImage(LM, 0, 0, W, H);
const vigAlpha = 0.12 + nightFactor * 0.16;
const vig = ctx.createRadialGradient(W * 0.5, H * 0.48, W * 0.3, W * 0.5, H * 0.5, W * 0.75);
vig.addColorStop(0, "rgba(14, 18, 40, 0)");
vig.addColorStop(0.65, "rgba(14, 18, 40, " + (vigAlpha * 0.45) + ")");
vig.addColorStop(1, "rgba(14, 18, 40, " + vigAlpha + ")");
ctx.fillStyle = vig;
ctx.fillRect(0, 0, W, H);
ctx.globalCompositeOperation = "screen";
const stageGlowAlpha = curPerf() ? 0.24 : 0.16;
const sg = ctx.createRadialGradient(186, 85, 8, 186, 85, 145);
sg.addColorStop(0, "rgba(255, 226, 160, " + stageGlowAlpha + ")");
sg.addColorStop(0.55, "rgba(255, 198, 120, " + (stageGlowAlpha * 0.45) + ")");
sg.addColorStop(1, "rgba(255, 185, 105, 0)");
ctx.fillStyle = sg;
ctx.fillRect(46, 0, 280, 225);
if (nightFactor > 0.35 && Array.isArray(TBP)) {
for (let ti = 0; ti < TBP.length; ti++) {
const pt = TBP.at(ti);
const tx = perspX(pt.at(0), pt.at(1));
const ty = pt.at(1) - 16;
const g = ctx.createRadialGradient(tx, ty, 0, tx, ty, 64);
g.addColorStop(0, "rgba(255, 226, 165, " + (0.16 * nightFactor) + ")");
g.addColorStop(0.45, "rgba(255, 200, 125, " + (0.07 * nightFactor) + ")");
g.addColorStop(1, "rgba(255, 185, 110, 0)");
ctx.fillStyle = g;
ctx.fillRect(tx - 64, ty - 64, 128, 128);
}
}
if (nightFactor > 0.55) {
const moonStrength = (nightFactor - 0.55) / 0.45;
const bw = Math.round(W * 0.5);
const bh = Math.round(H * 0.5);
if (_BEAM_C.width !== bw || _BEAM_C.height !== bh) {
_BEAM_C.width = bw;
_BEAM_C.height = bh;
}
const bc = _beamCtx;
bc.setTransform(1, 0, 0, 1, 0, 0);
bc.clearRect(0, 0, bw, bh);
bc.setTransform(0.5, 0, 0, 0.5, 0, 0);
if ("filter" in bc) bc.filter = "blur(5px)";
const leftPanes = Array.of(
Array.of(Array.of(8, 56), Array.of(15.2, 44.5), Array.of(15.2, 71), Array.of(8, 82.5)),
Array.of(Array.of(17.8, 40.5), Array.of(25, 30), Array.of(25, 55), Array.of(17.8, 67)),
Array.of(Array.of(8, 85.5), Array.of(15.2, 74), Array.of(15.2, 99.5), Array.of(8, 112)),
Array.of(Array.of(17.8, 70), Array.of(25, 58), Array.of(25, 83), Array.of(17.8, 95.5))
);
for (let i = 0; i < 4; i++) {
const p = leftPanes.at(i);
const isTopRow = i < 2;
const dxBeam = isTopRow ? 140 : 105;
const dyBeam = isTopRow ? 205 : 160;
const g = bc.createLinearGradient(p.at(0).at(0), p.at(0).at(1), p.at(0).at(0) + dxBeam, p.at(0).at(1) + dyBeam);
g.addColorStop(0, "rgba(195, 228, 255, " + (0.2 * moonStrength) + ")");
g.addColorStop(0.6, "rgba(165, 205, 250, " + (0.08 * moonStrength) + ")");
g.addColorStop(1, "rgba(165, 205, 250, 0)");
bc.fillStyle = g;
bc.beginPath();
bc.moveTo(p.at(0).at(0), p.at(0).at(1));
bc.lineTo(p.at(1).at(0), p.at(1).at(1));
bc.lineTo(p.at(2).at(0) + dxBeam, p.at(2).at(1) + dyBeam);
bc.lineTo(p.at(3).at(0) + dxBeam * 0.88, p.at(3).at(1) + dyBeam);
bc.closePath();
bc.fill();
}
const winStarts = Array.of(474, 586);
const rowOffsets = Array.of(
{ y1: 25, y2: 54, reachMult: 1.0 },
{ y1: 61, y2: 94, reachMult: 0.72 }
);
for (let wi = 0; wi < 2; wi++) {
const wx = winStarts.at(wi);
const cols = Array.of(Array.of(wx + 2, wx + 27), Array.of(wx + 35, wx + 60));
for (let ri = 0; ri < 2; ri++) {
const row = rowOffsets.at(ri);
const curSlantX = -75 * row.reachMult;
const curReachY = row.y2 + 150 * row.reachMult;
for (let ci = 0; ci < 2; ci++) {
const x1 = cols.at(ci).at(0);
const x2 = cols.at(ci).at(1);
const moonBeam = bc.createLinearGradient(x1, row.y1, x1 + curSlantX, curReachY);
moonBeam.addColorStop(0, "rgba(195, 228, 255, " + (0.22 * moonStrength) + ")");
moonBeam.addColorStop(0.6, "rgba(165, 205, 250, " + (0.08 * moonStrength) + ")");
moonBeam.addColorStop(1, "rgba(165, 205, 250, 0)");
bc.fillStyle = moonBeam;
bc.beginPath();
bc.moveTo(x1, row.y1);
bc.lineTo(x2, row.y1);
bc.lineTo(x2 + curSlantX * 1.15, curReachY);
bc.lineTo(x1 + curSlantX * 0.95, curReachY);
bc.closePath();
bc.fill();
}
}
}
ctx.drawImage(_BEAM_C, 0, 0, W, H);
}
ctx.globalCompositeOperation = "source-over";
}
function sky(E, t) {
const x = G, g = x.createLinearGradient(0, 24, 0, 96);
g.addColorStop(0, E.top);
g.addColorStop(1, E.bot);
x.fillStyle = g;
x.fillRect(440, 20, 260, 80);
if (E.star > 0.03) {
for (let i = 0; i < 26; i++) {
x.globalAlpha = E.star * (0.6 + 0.4 * Math.sin(t * 2 + i));
x.fillStyle = "#fffbe8";
x.fillRect(450 + (i * 53) % 240, 26 + (i * 37) % 50, 1.6, 1.6);
}
}
x.globalAlpha = 1;
const orb = (p, r, col, glow) => {
const px = p.at(0), py = p.at(1);
const gg = x.createRadialGradient(px, py, 0, px, py, r * 3.2);
gg.addColorStop(0, glow);
gg.addColorStop(1, "rgba(255,255,255,0)");
x.fillStyle = gg;
x.fillRect(px - r * 3.2, py - r * 3.2, r * 6.4, r * 6.4);
x.fillStyle = col;
x.beginPath();
x.arc(px, py, r, 0, 2 * PI);
x.fill();
};
if (E.sunP && E.day > 0.02) orb(E.sunP, 7, mx("#ff7a3a", "#fff2b0", sm(0.05, 0.6, Math.sin(PI * cl((E.h - 6) / 12, 0, 1)))), "rgba(255,220,150," + (0.55 * (1 - E.rn)) + ")");
if (E.moonP && E.day < 0.9) {
orb(E.moonP, 6, "#f4f1e0", "rgba(190,205,255,.35)");
x.fillStyle = E.top;
x.beginPath();
x.arc(E.moonP.at(0) + 3, E.moonP.at(1) - 1, 5.2, 0, 2 * PI);
x.fill();
}
const puffs = Array.of(Array.of(0, 0, 1), Array.of(-0.7, 0.15, 0.7), Array.of(0.7, 0.2, 0.75), Array.of(0.1, -0.35, 0.8));
for (let ci = 0; ci < E.cl2.length; ci++) {
const c = E.cl2.at(ci);
if (c.on) {
x.fillStyle = E.cc;
for (let pi = 0; pi < 4; pi++) {
const pf = puffs.at(pi);
x.beginPath();
x.ellipse(c.cx + pf.at(0) * c.w * 0.6, c.y + pf.at(1) * c.w * 0.4, c.w * 0.5 * pf.at(2), c.w * 0.3 * pf.at(2), 0, 0, 2 * PI);
x.fill();
}
}
}
x.fillStyle = E.sil;
x.beginPath();
x.moveTo(440, 100);
for (let i = 0; i <= 13; i++) x.lineTo(440 + i * 20, 90 - ((i * 7) % 4) * 4 - ((i * 3) % 2) * 3);
x.lineTo(700, 100);
x.fill();
if (E.rn > 0.03) {
x.strokeStyle = "rgba(200,215,235," + (0.45 * E.rn) + ")";
x.lineWidth = 1;
x.beginPath();
for (let i = 0; i < 46; i++) {
const rx = 450 + (i * 37) % 240, ry = (t * 160 + i * 23) % 90;
x.moveTo(rx, 20 + ry);
x.lineTo(rx - 3, 28 + ry);
}
x.stroke();
}
}