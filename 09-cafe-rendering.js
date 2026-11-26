function fit(s, mw, z, fam) {
  G.font = z + "px " + fam;
  while (z > 8 && G.measureText(s).width > mw) {
    z--;
    G.font = z + "px " + fam;
  }
}

function perspScale(y) {
  const depth = cl((y - 145) / (H - 165), 0, 1);
  return 0.78 + depth * 0.36;
}

function perspX(x, y) {
  const depth = cl((y - 145) / (H - 165), 0, 1);
  return 400 + (x - 400) * (0.91 + depth * 0.09);
}

function parseSkyRgb(colStr, fallback) {
  if (!colStr || typeof colStr !== "string") return fallback;
  const s = colStr.trim();
  if (s.startsWith("#")) {
    let hex = s.slice(1);
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    if (hex.length >= 6) {
      const num = parseInt(hex.slice(0, 6), 16);
      if (!isNaN(num)) return Array.of((num >> 16) & 255, (num >> 8) & 255, num & 255);
    }
  } else if (s.startsWith("rgb")) {
    const m = s.match(/[\d.]+/g);
    if (m && m.length >= 3) return Array.of(Number(m.at(0)), Number(m.at(1)), Number(m.at(2)));
  }
  return fallback;
}

function drawSoftRim(x, x1, y1, x2, y2, E, strength = 1, worldPos = null) {
  if (!E) return;
  const dayFactor = cl(E.day || 0, 0, 1);
  const rainDim = 1 - cl((E.rn || 0) * 0.3, 0, 0.3);

  const wx = worldPos ? worldPos.x : (x1 + x2) * 0.5;
  const wy = worldPos ? worldPos.y : (y1 + y2) * 0.5;

  const dWinL = Math.hypot(wx - 18, wy - 85);
  const dWinR1 = Math.hypot(wx - 505, wy - 65);
  const dWinR2 = Math.hypot(wx - 617, wy - 65);
  const minWinDist = Math.min(dWinL, dWinR1, dWinR2);

  const nearWindow = cl(1 - minWinDist / 310, 0, 1);
  const winReach = Math.pow(nearWindow, 1.25) * rainDim;

  const fallbackTop = dayFactor > 0.5 ? Array.of(145, 205, 255) : Array.of(65, 95, 165);
  const fallbackBot = dayFactor > 0.5 ? Array.of(255, 235, 185) : Array.of(110, 145, 210);
  const topRgb = parseSkyRgb(E.top, fallbackTop);
  const botRgb = parseSkyRgb(E.bot, fallbackBot);

  const rawEnvR = topRgb.at(0) * 0.4 + botRgb.at(0) * 0.6;
  const rawEnvG = topRgb.at(1) * 0.4 + botRgb.at(1) * 0.6;
  const rawEnvB = topRgb.at(2) * 0.4 + botRgb.at(2) * 0.6;

  const envR = cl(Math.round(rawEnvR * 0.62 + 108), 130, 255);
  const envG = cl(Math.round(rawEnvG * 0.62 + 112), 140, 255);
  const envB = cl(Math.round(rawEnvB * 0.62 + 124), 155, 255);

  let lampFactor = 0;
  if (Array.isArray(E.L)) {
    for (let i = 0; i < E.L.length; i++) {
      const lItem = E.L.at(i);
      const dist = Math.hypot(wx - lItem.at(0), wy - lItem.at(1));
      const rMax = lItem.at(3) * 1.05;
      if (dist < rMax) {
        lampFactor += (1 - dist / rMax) * lItem.at(2);
      }
    }
  }
  lampFactor = cl(lampFactor, 0, 1.2);

  const lampR = 255, lampG = 230, lampB = 175;
  const wEnv = winReach * (0.75 + dayFactor * 0.45);
  const wLamp = (0.35 + lampFactor * 0.65) * (1 - winReach * 0.65);
  const wTotal = Math.max(0.001, wEnv + wLamp);

  const rCol = Math.round((envR * wEnv + lampR * wLamp) / wTotal);
  const gCol = Math.round((envG * wEnv + lampG * wLamp) / wTotal);
  const bCol = Math.round((envB * wEnv + lampB * wLamp) / wTotal);
  const col = rCol + ", " + gCol + ", " + bCol;

  const baseIntensity = 0.42 + winReach * 0.25 + lampFactor * 0.22;
  const alpha = cl(baseIntensity * strength, 0.36, 0.62);

  x.save();
  x.globalCompositeOperation = "screen";
  const grad = x.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, "rgba(" + col + ", 0)");
  grad.addColorStop(0.2, "rgba(" + col + ", " + alpha + ")");
  grad.addColorStop(0.8, "rgba(" + col + ", " + alpha + ")");
  grad.addColorStop(1, "rgba(" + col + ", 0)");

  x.strokeStyle = grad;
  x.lineWidth = 1.4;
  x.lineCap = "round";

  x.beginPath();
  x.moveTo(x1, y1);
  x.lineTo(x2, y2);
  x.stroke();
  x.restore();
}

function board() {
  const x = G, bx = 336, by = 22, bw = 98, bh = 84, F2 = "'Baloo 2',system-ui,sans-serif";
  x.save();
  x.shadowColor = "rgba(20, 10, 5, 0.3)";
  x.shadowBlur = 6;
  x.shadowOffsetY = 3;
  x.strokeStyle = "rgba(62, 35, 18, 0.78)";
  x.lineWidth = 1.65;
  x.fillStyle = "#6b4a35";
  rr(bx, by, bw, bh, 6);
  x.beginPath();
  x.roundRect(bx, by, bw, bh, 6);
  x.stroke();
  x.restore();

  x.fillStyle = "#2b3d34";
  rr(bx + 5, by + 5, bw - 10, bh - 10, 4);
  x.save();
  x.beginPath();
  x.rect(bx + 5, by + 5, bw - 10, bh - 10);
  x.clip();
  x.fillStyle = "#ffda79";
  x.textAlign = "center";
  x.font = "800 12px " + F2;
  x.fillText("★ TOP SAO ★", bx + bw / 2, by + 20);

  x.fillStyle = "#f5ebd6";
  TOP.forEach((r, i) => {
    const st = "★" + r.st, y = by + 36 + i * 13;
    fit(st, 30, 11, F2);
    x.font = "700 11px " + F2;
    const sw = x.measureText(st).width;
    x.textAlign = "right";
    x.fillText(st, bx + bw - 9, y);
    const nm = (i + 1) + "." + r.nm;
    fit(nm, bw - 28 - sw, 11, F2);
    x.textAlign = "left";
    x.fillText(nm, bx + 9, y);
  });
  x.restore();
  x.textAlign = "center";
}

function menuBoard() {
  const x = G, bx = 668, by = 18, bw = 76, bh = 78, F2 = "'Baloo 2',system-ui,sans-serif";
  x.save();
  x.shadowColor = "rgba(20, 10, 5, 0.3)";
  x.shadowBlur = 6;
  x.shadowOffsetY = 3;
  x.strokeStyle = "rgba(62, 35, 18, 0.78)";
  x.lineWidth = 1.65;
  x.fillStyle = "#6b4a35";
  rr(bx, by, bw, bh, 5);
  x.beginPath();
  x.roundRect(bx, by, bw, bh, 5);
  x.stroke();
  x.restore();

  x.fillStyle = "#2b3d34";
  rr(bx + 4, by + 4, bw - 8, bh - 8, 3);
  x.save();
  x.beginPath();
  x.rect(bx + 4, by + 4, bw - 8, bh - 8);
  x.clip();
  x.fillStyle = "#ffda79";
  x.textAlign = "center";
  x.font = "800 11px " + F2;
  x.fillText("MENU", bx + bw / 2, by + 16);

  x.fillStyle = "#f5ebd6";
  x.textAlign = "left";
  DR.forEach((d, i) => {
    x.font = "600 9.5px " + F2;
    x.fillText(d.n, bx + 8, by + 28 + i * 8.5);
  });
  x.restore();
  x.textAlign = "center";
}

function chair(s, k, E) {
  const x = G;
  const sc = perspScale(s.y);
  const px = perspX(s.x, s.y);
  x.save();
  x.translate(px, s.y);
  x.scale(sc, sc);

  x.lineWidth = 1.35;
  x.strokeStyle = "rgba(56, 30, 14, 0.72)";
  x.lineJoin = "round";

  const legs = Array.of(Array.of(-12, 2, "#9c6032"), Array.of(7, 2, "#874f25"), Array.of(-10, -6, "#75421d"), Array.of(6, -6, "#663817"));
  for (let i = 0; i < 4; i++) {
    const lg = legs.at(i);
    x.fillStyle = lg.at(2);
    x.beginPath();
    x.roundRect(lg.at(0), lg.at(1), 5, 11, 2);
    x.fill();
    x.stroke();
  }

  const baseGrad = x.createLinearGradient(-15, -7, 15, 5);
  baseGrad.addColorStop(0, "#c7844c");
  baseGrad.addColorStop(1, "#8c5327");
  x.fillStyle = baseGrad;
  x.beginPath();
  x.roundRect(-15, -7, 30, 12, 6);
  x.fill();
  x.stroke();

  const cushGrad = x.createRadialGradient(-3, -9, 2, 0, -6, 16);
  if (k === 2) {
    cushGrad.addColorStop(0, "#a8cc93");
    cushGrad.addColorStop(1, "#6b8f59");
  } else {
    cushGrad.addColorStop(0, "#eda682");
    cushGrad.addColorStop(1, "#b86844");
  }
  x.fillStyle = cushGrad;
  x.beginPath();
  x.roundRect(-13, -11, 26, 12, 6);
  x.fill();
  x.stroke();

  x.save();
  x.beginPath();
  x.roundRect(-13, -11, 26, 12, 6);
  x.clip();
  x.fillStyle = "rgba(255, 248, 230, 0.25)";
  x.fillRect(-7, -11, 4, 12);
  x.fillRect(3, -11, 4, 12);
  x.fillRect(-13, -7, 26, 3);
  x.restore();

  const backGrad = x.createLinearGradient(-20, -25, 20, 0);
  backGrad.addColorStop(0, "#e3a76f");
  backGrad.addColorStop(1, "#9e6232");
  x.fillStyle = backGrad;
  x.beginPath();
  if (k === 0) x.roundRect(-19, -25, 8, 25, 4);
  else if (k === 1) x.roundRect(11, -25, 8, 25, 4);
  else x.roundRect(-14, 1, 28, 7, 4);
  x.fill();
  x.stroke();

  if (E) {
    const wp = { x: px, y: s.y };
    if (k === 0) {
      drawSoftRim(x, -18.5, -24, -18.5, -2, E, 0.95, wp);
      drawSoftRim(x, -18, -24.5, -11.5, -24.5, E, 0.85, wp);
      drawSoftRim(x, -9, -10.5, 10, -10.5, E, 0.8, wp);
    } else if (k === 1) {
      drawSoftRim(x, 18.5, -24, 18.5, -2, E, 0.95, wp);
      drawSoftRim(x, 11.5, -24.5, 18, -24.5, E, 0.85, wp);
      drawSoftRim(x, -10, -10.5, 9, -10.5, E, 0.8, wp);
    } else {
      drawSoftRim(x, -11, -10.5, 11, -10.5, E, 0.95, wp);
      drawSoftRim(x, -12, 1.5, 12, 1.5, E, 0.8, wp);
    }
  }

  x.restore();
}

function table(tx, ty, k, t, E) {
  const x = G;
  const sc = perspScale(ty);
  const px = perspX(tx, ty);
  x.save();
  x.translate(px, ty);
  x.scale(sc, sc);

  const ol = "rgba(56, 30, 14, 0.72)";
  x.lineWidth = 1.45;
  x.strokeStyle = ol;
  x.lineJoin = "round";

  const tLegs = Array.of(Array.of(-28, 6, "#9e6132"), Array.of(21, 6, "#854e24"), Array.of(-24, -4, "#73411b"), Array.of(17, -4, "#613514"));
  for (let i = 0; i < 4; i++) {
    const leg = tLegs.at(i);
    x.fillStyle = leg.at(2);
    x.beginPath();
    x.roundRect(leg.at(0), leg.at(1), 7, 18, 3);
    x.fill();
    x.stroke();
  }

  x.fillStyle = "#7a4923";
  x.beginPath();
  x.roundRect(-32, -8, 64, 18, 6);
  x.fill();
  x.stroke();

  const skirtGrad = x.createLinearGradient(-36, -16, 36, 8);
  if (k % 2 === 0) {
    skirtGrad.addColorStop(0, "#f29d72");
    skirtGrad.addColorStop(0.5, "#df7e50");
    skirtGrad.addColorStop(1, "#b85c32");
  } else {
    skirtGrad.addColorStop(0, "#a3c78d");
    skirtGrad.addColorStop(0.5, "#82a86c");
    skirtGrad.addColorStop(1, "#61854d");
  }
  x.fillStyle = skirtGrad;
  x.beginPath();
  x.moveTo(-36, -16);
  x.lineTo(36, -16);
  x.lineTo(36, 4);
  for (let wx = 36; wx > -36; wx -= 12) x.quadraticCurveTo(wx - 6, 11, wx - 12, 4);
  x.closePath();
  x.fill();
  x.stroke();

  x.save();
  x.clip();
  x.fillStyle = "rgba(255, 248, 232, 0.28)";
  for (let sx = -32; sx < 36; sx += 14) x.fillRect(sx, -16, 6, 28);
  x.fillStyle = "rgba(42, 20, 10, 0.14)";
  x.fillRect(-36, -4, 72, 16);
  x.restore();

  x.beginPath();
  x.moveTo(-36, -16);
  x.lineTo(36, -16);
  x.lineTo(36, 4);
  for (let wx = 36; wx > -36; wx -= 12) x.quadraticCurveTo(wx - 6, 11, wx - 12, 4);
  x.closePath();
  x.stroke();

  const topGrad = x.createRadialGradient(-6, -18, 4, 0, -15, 42);
if (k % 2 === 0) {
topGrad.addColorStop(0, "#ffe0c7");
topGrad.addColorStop(1, "#eba881");
} else {
topGrad.addColorStop(0, "#e3f2d5");
topGrad.addColorStop(1, "#adc997");
}
x.fillStyle = topGrad;
x.beginPath();
x.roundRect(-36, -27, 72, 24, 10);
x.fill();
x.stroke();
x.strokeStyle = "rgba(255, 252, 242, 0.65)";
x.lineWidth = 1.25;
x.beginPath();
x.roundRect(-31, -23, 62, 16, 7);
x.stroke();
x.strokeStyle = ol;
x.lineWidth = 1.3;
x.fillStyle = "#fffaf0";
x.beginPath();
x.ellipse(0, -14, 6.5, 3.5, 0, 0, 2 * PI);
x.fill();
x.stroke();
x.fillStyle = "#f4ead2";
x.fillRect(-2, -21, 4, 7);
x.strokeRect(-2, -21, 4, 7);
const flicker = 1 + Math.sin(t * 8 + k) * 0.08;
const glow = x.createRadialGradient(0, -18, 1, 0, -15, 34 * flicker);
glow.addColorStop(0, "rgba(255, 230, 140, 0.48)");
glow.addColorStop(0.5, "rgba(255, 200, 100, 0.18)");
glow.addColorStop(1, "rgba(255, 200, 100, 0)");
x.fillStyle = glow;
x.beginPath();
x.ellipse(0, -15, 34 * flicker, 16 * flicker, 0, 0, 2 * PI);
x.fill();
x.fillStyle = "#ffcf5a";
el(0, -24 + Math.sin(t * 9 + k) * 0.6, 2.2, 3.4);
if (E) {
const wp = { x: px, y: ty };
drawSoftRim(x, -30, -26.5, 30, -26.5, E, 1.05, wp);
drawSoftRim(x, -28, -3.5, 28, -3.5, E, 0.85, wp);
drawSoftRim(x, -35.5, -21, -35.5, -7, E, 0.9, wp);
drawSoftRim(x, 35.5, -21, 35.5, -7, E, 0.9, wp);
}
for (let j = 0; j < 3; j++) {
const r = ALL.find(r => r.seat == k * 3 + j);
if (r && r.dr != null) {
x.font = "18px serif";
x.fillStyle = "#000";
x.fillText(DR.at(r.dr).e, Array.of(-20, 20, 0).at(j), Array.of(-10, -10, -4).at(j));
}
}
x.restore();
}
/* ===== BÀN PHA CHẾ ===== */
function counter(E, t = 0) {
const x = G;
const ol = "rgba(52, 28, 12, 0.72)";
x.save();
x.lineWidth = 1.3;
x.strokeStyle = ol;
x.lineJoin = "round";
x.fillStyle = "rgba(20, 10, 4, 0.35)";
x.beginPath();
x.moveTo(438, 193);
x.lineTo(470, 209);
x.lineTo(762, 209);
x.lineTo(762, 214);
x.lineTo(468, 214);
x.lineTo(436, 197);
x.closePath();
x.fill();
const sideGrad = x.createLinearGradient(440, 158, 470, 208);
sideGrad.addColorStop(0, "#9e6334");
sideGrad.addColorStop(1, "#70421e");
x.fillStyle = sideGrad;
x.beginPath();
x.moveTo(440, 158);
x.lineTo(470, 168);
x.lineTo(470, 208);
x.lineTo(440, 192);
x.closePath();
x.fill();
x.stroke();
x.fillStyle = "#4d2b13";
x.beginPath();
x.moveTo(440, 188);
x.lineTo(470, 203);
x.lineTo(470, 208);
x.lineTo(440, 192);
x.closePath();
x.fill();
x.stroke();
x.fillStyle = "#613718";
x.beginPath();
x.moveTo(445, 166);
x.lineTo(465, 173);
x.lineTo(465, 195);
x.lineTo(445, 185);
x.closePath();
x.fill();
x.stroke();
const frontGrad = x.createLinearGradient(470, 168, 760, 208);
frontGrad.addColorStop(0, "#bc7c4a");
frontGrad.addColorStop(1, "#91572b");
x.fillStyle = frontGrad;
x.beginPath();
x.moveTo(470, 168);
x.lineTo(760, 168);
x.lineTo(760, 208);
x.lineTo(470, 208);
x.closePath();
x.fill();
x.stroke();
x.fillStyle = "#4d2b13";
x.fillRect(470, 203, 290, 5);
x.strokeRect(470, 203, 290, 5);
for (let px = 480; px <= 700; px += 55) {
x.fillStyle = "#824d25";
x.beginPath();
x.roundRect(px, 173, 45, 25, 3);
x.fill();
x.stroke();
x.strokeStyle = "rgba(255, 224, 185, 0.25)";
x.lineWidth = 1.0;
x.beginPath();
x.roundRect(px + 2, 175, 41, 21, 2);
x.stroke();
x.strokeStyle = ol;
x.lineWidth = 1.3;
}
x.fillStyle = "#b57642";
x.beginPath();
x.moveTo(438, 153);
x.lineTo(470, 163);
x.lineTo(470, 169);
x.lineTo(438, 158);
x.closePath();
x.fill();
x.stroke();
x.fillStyle = "#cc8a52";
x.fillRect(470, 163, 290, 6);
x.strokeRect(470, 163, 290, 6);
const topGrad = x.createLinearGradient(438, 146, 760, 163);
topGrad.addColorStop(0, "#eec296");
topGrad.addColorStop(0.5, "#e0a56e");
topGrad.addColorStop(1, "#c98850");
x.fillStyle = topGrad;
x.beginPath();
x.moveTo(460, 146);
x.lineTo(750, 146);
x.lineTo(760, 163);
x.lineTo(470, 163);
x.lineTo(438, 153);
x.closePath();
x.fill();
x.stroke();
x.fillStyle = "#faf2e1";
x.beginPath();
x.moveTo(506, 149);
x.lineTo(566, 149);
x.lineTo(573, 160);
x.lineTo(499, 160);
x.closePath();
x.fill();
x.stroke();
x.fillStyle = "#a86939";
x.beginPath();
x.roundRect(656, 148, 46, 11, 2.5);
x.fill();
x.stroke();
x.fillStyle = "#fffdf7";
x.beginPath();
x.roundRect(665, 143, 8.5, 9.5, 1.5);
x.roundRect(681, 143, 8.5, 9.5, 1.5);
x.fill();
x.stroke();
x.fillStyle = "#efe0c4";
x.beginPath();
x.arc(536, 152, 7, 0, 2 * PI);
x.fill();
x.stroke();
x.beginPath();
x.arc(544, 152, 3.2, -PI * 0.45, PI * 0.45);
x.stroke();
x.fillStyle = "#c97a4b";
x.beginPath();
x.roundRect(531, 143, 10, 3, 1.5);
x.fill();
x.stroke();
ALL.forEach(r => {
if (r.r === "b" && r.br != null && !r.mv) {
const bx = perspX(r.x, r.y);
const bType = r.br % 4;
x.save();
if (bType === 1) {
for (let i = 0; i < 4; i++) {
const ang = t * 8 + i * 1.57;
const dist = 5 + ((t * 15 + i * 3) % 8);
x.fillStyle = "rgba(255, 255, 255, 0.75)";
x.beginPath();
x.arc(bx + Math.cos(ang) * dist, 149 + Math.sin(ang) * 3, 1.6, 0, 2 * PI);
x.fill();
}
} else {
for (let i = 0; i < 3; i++) {
const off = (t * 16 + i * 7) % 20;
const al = (1 - off / 20) * 0.75;
x.fillStyle = bType === 2 ? "rgba(180, 240, 165, " + al + ")" : "rgba(255, 250, 240, " + al + ")";
x.beginPath();
x.arc(bx + Math.sin(t * 4 + i * 2) * 5, 148 - off, 2.2 + off * 0.08, 0, 2 * PI);
x.fill();
}
}
x.restore();
}
});
if (E) {
drawSoftRim(x, 462, 146.4, 748, 146.4, E, 1.0, { x: 605, y: 146 });
drawSoftRim(x, 471, 163.3, 615, 163.3, E, 1.05, { x: 540, y: 150 });
drawSoftRim(x, 615, 163.3, 759, 163.3, E, 1.0, { x: 685, y: 150 });
drawSoftRim(x, 439, 153.3, 470, 163.3, E, 1.05, { x: 454, y: 158 });
drawSoftRim(x, 440.3, 158, 440.3, 192, E, 0.9, { x: 440, y: 175 });
}
const stools = Array.of(Array.of(522, 216), Array.of(636, 216));
for (let si = 0; si < 2; si++) {
const sx = stools.at(si).at(0), sy = stools.at(si).at(1);
x.fillStyle = "#6e3e1b";
x.beginPath();
x.roundRect(sx - 8, sy - 3, 3.5, 11, 1.5);
x.roundRect(sx + 4.5, sy - 3, 3.5, 11, 1.5);
x.fill();
x.stroke();
x.fillStyle = "#8f5529";
x.beginPath();
x.roundRect(sx - 11, sy - 1, 4, 12, 1.5);
x.roundRect(sx + 7, sy - 1, 4, 12, 1.5);
x.fill();
x.stroke();
x.fillRect(sx - 9, sy + 5, 18, 2.5);
x.fillStyle = "#b0703c";
x.beginPath();
x.ellipse(sx, sy - 3, 14, 7, 0, 0, 2 * PI);
x.fill();
x.stroke();
const stoolTop = x.createRadialGradient(sx - 3, sy - 6, 1, sx, sy - 5, 14);
stoolTop.addColorStop(0, "#f2c494");
stoolTop.addColorStop(1, "#cf8e55");
x.fillStyle = stoolTop;
x.beginPath();
x.ellipse(sx, sy - 5, 14, 6.5, 0, 0, 2 * PI);
x.fill();
x.stroke();
if (E) {
drawSoftRim(x, sx - 11, sy - 11.2, sx + 11, sy - 11.2, E, 0.95, { x: sx, y: sy });
}
}
x.restore();
}
function person(r, t, E) {
const cp = curPerf();
const onStage = cp && cp.w === r;
const rawX = onStage ? 176 : r.x;
const rawY = onStage ? 166 : r.y;
const dx = r._lx == null ? 0 : rawX - r._lx;
const dy = r._ly == null ? 0 : rawY - r._ly;
r._lx = rawX;
r._ly = rawY;
const isWalking = !onStage && (r.mv || Math.hypot(dx, dy) > 0.15);
if (isWalking && Math.hypot(dx, dy) > 0.08) {
if (Math.abs(dy) > Math.abs(dx) * 1.15) {
r._dir = dy < 0 ? 1 : 0;
} else {
r._dir = dx < 0 ? -1 : 2;
}
} else if (!isWalking) {
r._dir = 0;
}
const pSc = onStage ? 0.78 : perspScale(rawY);
const px = onStage ? 176 : perspX(rawX, rawY);
drawCharShadow(r, px, rawY, pSc, E, t, onStage);
const c = spr;
c.clearRect(0, 0, 130, 160);
G = c;
const isBarista = (r.r === "b" || r.seat == 100 || r.seat == 101);
const brewDrink = (!isWalking && !onStage && isBarista && r.br != null && DR[r.br]) ? r.br : null;
const dlvDrink = (!onStage && isBarista && r.dlv != null && DR[r.dlv]) ? r.dlv : null;
pet(65, 140, r.lk, t, 1, 1, r._dir || 0, isWalking ? 1 : 0, brewDrink, dlvDrink);
G = ctx;
let k = E.day * 0.45, vx = 0, vy = 0;
for (const item of E.L) {
const ldx = item.at(0) - px, ldy = item.at(1) - rawY, d = Math.hypot(ldx, ldy) + 1;
const f = item.at(2) / (1 + d * d / (item.at(3) * item.at(3) * 0.4));
k += f;
vx += ldx / d * f;
vy += ldy / d * f;
}
k = cl(k, 0, 1.15);
const a = Math.atan2(vy, vx), nx = Math.cos(a) * 40, ny = Math.sin(a) * 30;
c.globalCompositeOperation = "source-atop";
const g = c.createLinearGradient(65 - nx, 100 - ny, 65 + nx, 100 + ny);
g.addColorStop(0, "rgba(8,6,30," + (0.48 * (1 - k * 0.55)) + ")");
g.addColorStop(0.5, "rgba(8,6,30,0)");
g.addColorStop(1, "rgba(255,214,140," + (0.36 * k) + ")");
c.fillStyle = g;
c.fillRect(0, 0, 130, 160);
c.globalCompositeOperation = "source-over";
ctx.drawImage(SPR, px - 65 * pSc, rawY - 140 * pSc, 130 * pSc, 160 * pSc);
}
function tag(r, t, px0, py0, sc) {
const x = G;
const cpTag = curPerf();
const onStageTag = cpTag && cpTag.w === r && px0 == null;
const useX = onStageTag ? 176 : r.x;
const useY = onStageTag ? 166 : r.y;
const pSc = sc || (onStageTag ? 0.78 : perspScale(useY));
const T = r.lk.at(7) / 100;
const h2 = r.lk.at(1) == 2 ? (r.lk.at(0) == 4 ? 9 : 0) : (r.lk.at(0) == 2 ? 16 : r.lk.at(0) == 1 ? 6 : 0);
const X = px0 == null ? (onStageTag ? 176 : perspX(useX, useY)) : px0;
const Y0 = py0 == null ? useY : py0;
const y = Y0 - (40 * T + 42 + h2) * pSc;
const s = r.nm + "  ★" + r.st;
x.font = "700 12px 'Baloo 2',system-ui,sans-serif";
x.textAlign = "center";
const w = x.measureText(s).width + 14;
x.fillStyle = "rgba(28, 16, 10, 0.85)";
rr(X - w / 2, y - 16, w, 17, 8.5);
if (r === ME) {
x.strokeStyle = "rgba(255, 202, 87, 0.85)";
x.lineWidth = 1.5;
x.beginPath();
x.roundRect(X - w / 2, y - 16, w, 17, 8.5);
x.stroke();
}
x.fillStyle = "#fff8eb";
x.fillText(s, X, y - 3.5);
const cp = curPerf();
if (cp && cp.w === r) {
const s2 = "🗳 " + votesFor(r === ME ? myPeer : r.id) + "/" + need();
const w2 = x.measureText(s2).width + 12;
x.fillStyle = "rgba(150,40,50,.9)";
rr(X - w2 / 2, y - 36, w2, 16, 8);
x.fillStyle = "#fff";
x.fillText(s2, X, y - 24);
}
const isBarista = (r.r === "b" || r.seat == 100 || r.seat == 101);
if (!isBarista && !onStageTag && r.od && DR[r.od.d]) {
const p = 1 + Math.sin(t * 6) * 0.03;
x.save();
x.translate(X, y - 40);
x.scale(p, p);
x.fillStyle = "#fffdf6";
x.strokeStyle = "rgba(60,35,25,.65)";
x.lineWidth = 1.5;
rr(-17, -15, 34, 30, 9, 1);
x.beginPath();
x.moveTo(-4, 14);
x.lineTo(0, 21);
x.lineTo(4, 14);
x.fill();
x.font = "20px serif";
x.fillStyle = "#000";
x.fillText(DR[r.od.d].e, 0, 6);
x.restore();
} else if (isBarista && !r.mv && r.br != null && DR[r.br]) {
const p = 1 + Math.sin(t * 8) * 0.05;
x.save();
x.translate(X, y - 40);
x.scale(p, p);
x.fillStyle = "#fff9eb";
x.strokeStyle = "rgba(217, 138, 60, 0.85)";
x.lineWidth = 1.5;
rr(-20, -15, 40, 30, 9, 1);
x.beginPath();
x.moveTo(-4, 14);
x.lineTo(0, 21);
x.lineTo(4, 14);
x.fill();
x.font = "18px serif";
x.fillStyle = "#000";
x.fillText(DR[r.br].e, 0, 6);
x.restore();
}
}
function draw(t) {
G = ctx;
const x = ctx, cp = curPerf(), E = ENV = env();
E.L = mkL(E, cp);
x.imageSmoothingEnabled = true;
x.imageSmoothingQuality = "high";
x.globalCompositeOperation = "source-over";
x.textAlign = "center";
if (typeof _lastFrontState !== "undefined" && _lastFrontState === true) {
triggerSceneZoom(true);
}
_lastFrontState = false;
x.save();
if (typeof _CAM_TRANS !== "undefined" && _CAM_TRANS.active && _CAM_TRANS.toInside) {
const p = cl((performance.now() - _CAM_TRANS.start) / _CAM_TRANS.dur, 0, 1);
const ease = 1 - Math.pow(1 - p, 3);
const sc = 1.65 - ease * 0.65;
x.translate(W * 0.5, H * 0.5);
x.scale(sc, sc);
x.translate(-W * 0.5, -H * 0.5);
if (p >= 1) _CAM_TRANS.active = false;
}
let g = x.createLinearGradient(0, 0, 0, 150);
g.addColorStop(0, "#ebd9bc");
g.addColorStop(1, "#cfb48a");
x.fillStyle = g;
x.fillRect(0, 0, W, 150);
x.fillStyle = "rgba(125, 86, 56, 0.055)";
for (let wx = 34; wx < W - 34; wx += 18) x.fillRect(wx, 0, 6, 116);
x.fillStyle = "#7d5638";
x.fillRect(32, 116, W - 64, 34);
x.fillStyle = "#9c6e4b";
x.fillRect(32, 116, W - 64, 4);
x.fillStyle = "rgba(0,0,0,.15)";
for (let i = 38; i < W - 38; i += 40) x.fillRect(i, 124, 2, 26);
let curY = 150, rowIdx = 0;
const floorSpan = H - 150;
while (curY < H) {
const rowH = 11 + ((curY - 150) / floorSpan) * 14;
x.fillStyle = rowIdx % 2 ? "#bd8c5e" : "#b08054";
x.fillRect(0, curY, W, rowH + 0.6);
x.fillStyle = "rgba(255, 240, 215, 0.06)";
x.fillRect(0, curY + 1, W, 2);
x.strokeStyle = "rgba(58, 32, 16, 0.22)";
x.lineWidth = 1.25;
x.beginPath();
x.moveTo(0, curY);
x.lineTo(W, curY);
x.stroke();
curY += rowH;
rowIdx++;
}
x.strokeStyle = "rgba(58, 32, 16, 0.2)";
x.lineWidth = 1.25;
for (let vx = -160; vx <= 960; vx += 64) {
const topX = 400 + (vx - 400) * 0.72;
x.beginPath();
x.moveTo(topX, 150);
x.lineTo(vx, H);
x.stroke();
}
g = x.createLinearGradient(0, 150, 0, 180);
g.addColorStop(0, "rgba(18, 9, 28, 0.3)");
g.addColorStop(0.55, "rgba(18, 9, 28, 0.1)");
g.addColorStop(1, "rgba(18, 9, 28, 0)");
x.fillStyle = g;
x.fillRect(0, 150, W, 30);
const leftWallGrad = x.createLinearGradient(0, 0, 34, 0);
leftWallGrad.addColorStop(0
, "#b89668");
leftWallGrad.addColorStop(1, "#d9be96");
x.fillStyle = leftWallGrad;
x.beginPath();
x.moveTo(-1, -1);
x.lineTo(34, -1);
x.lineTo(34, 150);
x.lineTo(-1, 236);
x.closePath();
x.fill();
x.strokeStyle = "rgba(62, 35, 18, 0.72)";
x.lineWidth = 1.45;
x.stroke();
x.fillStyle = "#69462c";
x.beginPath();
x.moveTo(-1, 202);
x.lineTo(34, 116);
x.lineTo(34, 150);
x.lineTo(-1, 236);
x.closePath();
x.fill();
x.stroke();
drawSoftRim(x, 0, 201.5, 33.5, 116.5, E, 1.0, { x: 16, y: 158 });
x.save();
x.fillStyle = "#6b4a35";
x.beginPath();
x.moveTo(6, 54);
x.lineTo(27, 26);
x.lineTo(27, 86);
x.lineTo(6, 118);
x.closePath();
x.fill();
x.strokeStyle = "rgba(52, 28, 12, 0.75)";
x.lineWidth = 1.45;
x.stroke();
x.save();
x.beginPath();
x.moveTo(8, 56);
x.lineTo(25, 30);
x.lineTo(25, 83);
x.lineTo(8, 112);
x.closePath();
x.clip();
const leftSkyGrad = x.createLinearGradient(0, 30, 0, 112);
leftSkyGrad.addColorStop(0, E.top);
leftSkyGrad.addColorStop(1, E.bot);
x.fillStyle = leftSkyGrad;
x.fillRect(4, 26, 26, 92);
x.fillStyle = "rgba(255, 255, 255, 0.14)";
x.beginPath();
x.moveTo(8, 56);
x.lineTo(20, 38);
x.lineTo(8, 82);
x.closePath();
x.fill();
x.restore();
x.strokeStyle = "#6b4a35";
x.lineWidth = 2.4;
x.beginPath();
x.moveTo(16.5, 43);
x.lineTo(16.5, 97.5);
x.moveTo(8, 84);
x.lineTo(25, 56.5);
x.stroke();
drawSoftRim(x, 8, 56, 25, 30, E, 1.0, { x: 16, y: 45 });
drawSoftRim(x, 8, 112, 25, 83, E, 1.0, { x: 16, y: 96 });
x.restore();
const rightWallGrad = x.createLinearGradient(W, 0, W - 34, 0);
rightWallGrad.addColorStop(0, "#b89668");
rightWallGrad.addColorStop(1, "#d9be96");
x.fillStyle = rightWallGrad;
x.beginPath();
x.moveTo(W + 1, -1);
x.lineTo(W - 34, -1);
x.lineTo(W - 34, 150);
x.lineTo(W + 1, 236);
x.closePath();
x.fill();
x.strokeStyle = "rgba(62, 35, 18, 0.72)";
x.lineWidth = 1.45;
x.stroke();
x.fillStyle = "#69462c";
x.beginPath();
x.moveTo(W + 1, 202);
x.lineTo(W - 34, 116);
x.lineTo(W - 34, 150);
x.lineTo(W + 1, 236);
x.closePath();
x.fill();
x.stroke();
drawSoftRim(x, W, 201.5, W - 33.5, 116.5, E, 0.95, { x: W - 16, y: 158 });
drawSoftRim(x, 34, 116.3, W - 34, 116.3, E, 0.9, { x: 520, y: 116 });
x.save();
x.fillStyle = "#d6b0aa";
x.strokeStyle = "rgba(95, 56, 48, 0.68)";
x.lineWidth = 1.9;
x.beginPath();
x.moveTo(156, 214);
x.lineTo(644, 214);
x.quadraticCurveTo(664, 214, 670, 234);
x.lineTo(760, H + 45);
x.lineTo(40, H + 45);
x.lineTo(130, 234);
x.quadraticCurveTo(136, 214, 156, 214);
x.closePath();
x.fill();
x.stroke();
x.clip();
x.strokeStyle = "rgba(255, 248, 242, 0.16)";
x.lineWidth = 1.25;
for (let ry = 220; ry < H; ry += 10) {
x.beginPath();
x.moveTo(40, ry);
x.lineTo(760, ry);
x.stroke();
}
x.restore();
patch(E);
const OB = [];
SE.forEach(s => {
const sc = perspScale(s.y);
const px = perspX(s.x, s.y);
OB.push({
x: px,
y: s.y + 8 * sc,
hw: 13 * sc,
hd: 7 * sc,
h: 16 * sc,
top: 0.9,
z: 0,
legs: Array.of(Array.of(-10 * sc, 4 * sc), Array.of(9 * sc, 4 * sc), Array.of(-8 * sc, -4 * sc), Array.of(8 * sc, -4 * sc))
});
});
TBP.forEach((pt, k) => {
const a = pt.at(0), b = pt.at(1), sc = perspScale(b), px = perspX(a, b);
OB.push({
x: px,
y: b + 16 * sc,
hw: 33 * sc,
hd: 13 * sc,
h: 24 * sc,
top: 0.95,
z: 0,
legs: Array.of(Array.of(-25 * sc, 7 * sc), Array.of(24 * sc, 7 * sc), Array.of(-21 * sc, -3 * sc), Array.of(20 * sc, -3 * sc))
});
for (let j = 0; j < 3; j++) {
const r = ALL.find(r => r.seat == k * 3 + j);
if (r && r.dr != null) {
OB.push({
x: px + Array.of(-20, 20, 0).at(j) * sc,
y: b + Array.of(-10, -10, -4).at(j) * sc,
hw: 6 * sc,
hd: 4 * sc,
h: 12 * sc,
top: 0.85,
z: 22 * sc
});
}
}
});
OB.push({ x: 522, y: 223, hw: 13, hd: 6, h: 14, top: 0.9, z: 0 });
OB.push({ x: 636, y: 223, hw: 13, hd: 6, h: 14, top: 0.9, z: 0 });
shadows(E, OB);
const winList = Array.of(474, 586);
for (let wi = 0; wi < 2; wi++) {
const wx = winList.at(wi);
x.fillStyle = "#6b4a35";
rr(wx - 4, 20, 70, 80, 4);
x.strokeStyle = "rgba(52, 28, 12, 0.72)";
x.lineWidth = 1.4;
x.beginPath();
x.roundRect(wx - 4, 20, 70, 80, 4);
x.stroke();
x.save();
x.beginPath();
x.rect(wx, 24, 62, 72);
x.clip();
sky(E, t);
x.restore();
x.fillStyle = "#6b4a35";
x.fillRect(wx + 29, 24, 4, 72);
x.fillRect(wx, 56, 62, 4);
x.fillStyle = "rgba(255,255,255,.12)";
x.beginPath();
x.moveTo(wx, 24);
x.lineTo(wx + 22, 24);
x.lineTo(wx, 60);
x.fill();
drawSoftRim(x, wx - 2, 99, wx + 64, 99, E, 1.05, { x: wx + 31, y: 85 });
}
x.strokeStyle = "rgba(62, 35, 18, 0.65)";
x.lineWidth = 1.5;
x.beginPath();
for (let i = 1; i < 20; i++) {
const bx = i * 40, by = 5 + Math.sin(i * 0.75) * 6;
if (i === 1) x.moveTo(bx - 12, by);
else x.lineTo(bx, by);
}
x.stroke();
const flagCols = Array.of("#e9a24c", "#4fb3c8", "#f0cf6a", "#e8656b");
for (let i = 1; i < 20; i++) {
const bx = i * 40, by = 5 + Math.sin(i * 0.75) * 6;
x.fillStyle = flagCols.at(i % 4);
x.beginPath();
x.moveTo(bx - 12, by);
x.lineTo(bx + 12, by);
x.lineTo(bx, by + 22);
x.closePath();
x.fill();
}
x.save();
x.save();
x.beginPath();
x.roundRect(54, 18, 264, 132, 5);
x.clip();
const brickBg = x.createLinearGradient(54, 18, 54, 150);
brickBg.addColorStop(0, "#381d14");
brickBg.addColorStop(1, "#5c3020");
x.fillStyle = brickBg;
x.fillRect(54, 18, 264, 132);
const brickCols = Array.of("#783f2b", "#633120", "#874832", "#542719");
for (let row = 0; row < 14; row++) {
const by = 18 + row * 9.5;
const offset = (row % 2) * 11;
for (let col = 0; col < 14; col++) {
const bx = 50 + col * 22 + offset;
x.fillStyle = brickCols.at((row * 3 + col) % 4);
x.fillRect(bx, by, 20, 7.5);
x.fillStyle = "rgba(255, 210, 170, 0.08)";
x.fillRect(bx, by, 20, 1.5);
}
}
const draw3DAcousticPanel = (px, pw) => {
x.fillStyle = "rgba(15, 6, 2, 0.45)";
x.fillRect(px + 4, 21, pw, 129);
x.fillStyle = "#2b170c";
x.fillRect(px, 20, pw, 130);
for (let sx = px + 3; sx < px + pw - 2; sx += 5) {
x.fillStyle = "#965e36";
x.fillRect(sx, 21, 2.5, 128);
x.fillStyle = "rgba(255, 225, 185, 0.25)";
x.fillRect(sx, 21, 0.8, 128);
}
const upGlow = x.createLinearGradient(0, 150, 0, 55);
upGlow.addColorStop(0, "rgba(255, 175, 85, 0.32)");
upGlow.addColorStop(1, "rgba(255, 175, 85, 0)");
x.fillStyle = upGlow;
x.fillRect(px, 20, pw, 130);
};
draw3DAcousticPanel(60, 42);
draw3DAcousticPanel(270, 42);
const wallAo = x.createLinearGradient(0, 134, 0, 150);
wallAo.addColorStop(0, "rgba(15, 6, 2, 0)");
wallAo.addColorStop(1, "rgba(15, 6, 2, 0.55)");
x.fillStyle = wallAo;
x.fillRect(54, 134, 264, 16);
x.fillStyle = "#1a1715";
x.fillRect(54, 18, 264, 4);
const spotX = Array.of(92, 154, 218, 280);
const spotTilt = Array.of(24, 8, -8, -24);
for (let si = 0; si < 4; si++) {
const sx = spotX.at(si);
const tilt = spotTilt.at(si);
const beamAlpha = cp ? 0.28 : 0.16;
const beamGrad = x.createLinearGradient(sx, 24, sx + tilt, 150);
beamGrad.addColorStop(0, "rgba(255, 232, 165, " + beamAlpha + ")");
beamGrad.addColorStop(1, "rgba(255, 210, 120, 0)");
x.save();
x.globalCompositeOperation = "lighter";
x.fillStyle = beamGrad;
x.beginPath();
x.moveTo(sx - 4, 24);
x.lineTo(sx + 4, 24);
x.lineTo(sx + tilt + 36, 150);
x.lineTo(sx + tilt - 36, 150);
x.closePath();
x.fill();
x.restore();
x.fillStyle = "#1f1d1b";
rr(sx - 5, 20, 10, 7, 2);
x.fillStyle = cp ? "#fff2bd" : "#ffd584";
el(sx, 27, 4.2, 2);
}
x.restore();
x.strokeStyle = "rgba(38, 18, 8, 0.72)";
x.lineWidth = 1.35;
x.beginPath();
x.roundRect(54, 18, 264, 132, 5);
x.stroke();
x.fillStyle = "rgba(20, 10, 4, 0.42)";
rr(32, 204, 308, 12, 5);
const frontStageGrad = x.createLinearGradient(36, 180, 36, 208);
frontStageGrad.addColorStop(0, "#633b20");
frontStageGrad.addColorStop(1, "#452714");
x.fillStyle = frontStageGrad;
x.beginPath();
x.moveTo(36, 180);
x.lineTo(336, 180);
x.lineTo(336, 208);
x.lineTo(36, 208);
x.closePath();
x.fill();
x.strokeStyle = "rgba(38, 18, 8, 0.75)";
x.lineWidth = 1.35;
x.stroke();
x.strokeStyle = "rgba(30, 14, 5, 0.35)";
x.lineWidth = 1.15;
for (let px = 62; px <= 312; px += 50) {
x.beginPath();
x.moveTo(px, 183);
x.lineTo(px, 206);
x.stroke();
}
const floorStageGrad = x.createLinearGradient(0, 150, 0, 180);
floorStageGrad.addColorStop(0, "#8f5d36");
floorStageGrad.addColorStop(1, "#b57b4c");
x.fillStyle = floorStageGrad;
x.beginPath();
x.moveTo(54, 150);
x.lineTo(318, 150);
x.lineTo(336, 180);
x.lineTo(36, 180);
x.closePath();
x.fill();
x.strokeStyle = "rgba(44, 22, 10, 0.75)";
x.lineWidth = 1.35;
x.stroke();
x.strokeStyle = "rgba(48, 24, 10, 0.32)";
x.lineWidth = 1.1;
for (let i = 1; i < 8; i++) {
const ratio = i / 8;
const topX = 54 + (318 - 54) * ratio;
const botX = 36 + (336 - 36) * ratio;
x.beginPath();
x.moveTo(topX, 150);
x.lineTo(botX, 180);
x.stroke();
}
x.fillStyle = "#d49b6a";
x.fillRect(36, 179, 300, 2.5);
x.fillStyle = "rgba(15, 6, 2, 0.42)";
x.fillRect(36, 181.5, 300, 4);
x.fillStyle = "#e3cfb2";
x.beginPath();
x.moveTo(116, 155);
x.lineTo(256, 155);
x.lineTo(270, 175);
x.lineTo(102, 175);
x.closePath();
x.fill();
x.strokeStyle = "rgba(120, 62, 30, 0.72)";
x.lineWidth = 1.25;
x.stroke();
x.strokeStyle = "#b85d35";
x.beginPath();
x.moveTo(112, 159); x.lineTo(260, 159);
x.moveTo(107, 171); x.lineTo(265, 171);
x.stroke();
x.fillStyle = "rgba(20, 10, 4, 0.35)";
rr(126, 209, 120, 7, 3);
x.fillStyle = "#a36d42";
x.beginPath();
x.moveTo(136, 199);
x.lineTo(236, 199);
x.lineTo(242, 205);
x.lineTo(130, 205);
x.closePath();
x.fill();
x.strokeStyle = "rgba(38, 18, 8, 0.75)";
x.lineWidth = 1.35;
x.stroke();
x.fillStyle = "#5c361d";
x.fillRect(130, 205, 112, 7);
x.strokeRect(130, 205, 112, 7);
const stageBoost = cp ? 1.1 : 0.95;
drawSoftRim(x, 54, 22, 54, 150, E, 1.0, { x: 45, y: 85 });
drawSoftRim(x, 54, 150, 36, 180, E, 1.05, { x: 42, y: 165 });
drawSoftRim(x, 36.3, 180, 36.3, 208, E, 0.9, { x: 36, y: 194 });
drawSoftRim(x, 38, 179.3, 334, 179.3, E, stageBoost, { x: 186, y: 179 });
drawSoftRim(x, 136, 199.2, 236, 199.2, E, stageBoost, { x: 186, y: 199 });
x.fillStyle = "rgba(20, 10, 4, 0.38)";
el(82, 166, 10, 3.5);
x.strokeStyle = "rgba(38, 18, 8, 0.78)";
x.lineWidth = 1.35;
x.beginPath();
x.moveTo(76, 166); x.lineTo(82, 148); x.lineTo(88, 166);
x.stroke();
x.fillStyle = "#e09142";
x.beginPath();
x.ellipse(82, 152, 7.5, 9, -0.15, 0, 2 * PI);
x.fill();
x.stroke();
x.beginPath();
x.ellipse(80, 142, 5.5, 6.5, -0.15, 0, 2 * PI);
x.fill();
x.stroke();
x.fillStyle = "#3b1f0e";
ci(81, 146, 2.2);
x.fillStyle = "#5c3317";
x.fillRect(76, 121, 3, 18);
drawSoftRim(x, 75, 138, 74, 156, E, stageBoost, { x: 74, y: 147 });
x.fillStyle = "rgba(20, 10, 4, 0.42)";
el(290, 168, 13, 4);
x.fillStyle = "#252529";
x.beginPath();
x.moveTo(278, 167);
x.lineTo(296, 156);
x.lineTo(304, 167);
x.closePath();
x.fill();
x.strokeStyle = "rgba(17, 17, 17, 0.78)";
x.lineWidth = 1.35;
x.stroke();
x.fillStyle = "#3b3b42";
x.beginPath();
x.moveTo(278, 167);
x.lineTo(285, 155);
x.lineTo(296, 156);
x.closePath();
x.fill();
x.stroke();
drawSoftRim(x, 285, 155, 296, 156, E, stageBoost, { x: 290, y: 155 });
if (!cp) {
x.fillStyle = "rgba(20, 10, 4, 0.35)";
el(182, 164, 8, 3);
x.fillStyle = "#262626";
el(182, 163, 6.5, 2.5);
x.strokeStyle = "#333";
x.lineWidth = 2.1;
x.beginPath();
x.moveTo(182, 163); x.lineTo(182, 126);
x.stroke();
x.fillStyle = "#d9d9d9";
rr(179.5, 119, 5, 8, 2.5);
x.fillStyle = "rgba(20, 10, 4, 0.35)";
el(218, 164, 10, 3.5);
x.strokeStyle = "rgba(62, 35, 18, 0.78)";
x.lineWidth = 1.4;
x.beginPath();
x.moveTo(212, 145); x.lineTo(208, 164);
x.moveTo(224, 145); x.lineTo(228, 164);
x.moveTo(210, 155); x.lineTo(226, 155);
x.stroke();
x.fillStyle = "#b5723f";
el(218, 144, 9, 3);
}
if (cp) {
x.save();
x.globalCompositeOperation = "lighter";
const stageSpot = x.createRadialGradient(186, 163, 5, 186, 163, 72);
stageSpot.addColorStop(0, "rgba(255, 236, 175, 0.28)");
stageSpot.addColorStop(1, "rgba(255, 236, 175, 0)");
x.fillStyle = stageSpot;
x.beginPath();
x.ellipse(186, 163, 72, 24, 0, 0, 2 * PI);
x.fill();
x.restore();
const st = cp.w === ME ? IS.me : (IS[cp.w.id] || (IS[cp.w.id] = { V: {}, hd: {}, fr: 0, f0: 1, auto: 1 }));
const I = IN.at(cp.i);
const ver = I.f == "g" || I.f == "s";
const s = ver ? 0.5 : I.f == "p" ? 0.45 : 0.5;
x.save();
x.translate(ver ? 245 : I.f == "p" ? 205 : 225, ver ? 114 : 154);
x.scale(s, s);
drawI(I, st, t);
x.restore();
x.font = "20px serif";
x.fillStyle = "#ffe38f";
for (let i = 0; i < 3; i++) {
x.fillText("♪", 130 + i * 28 + Math.sin(t * 2 + i) * 6, 148 - ((t * 30 + i * 20) % 60));
}
}
x.restore();
const it = [];
SE.forEach((s, i) => it.push(Array.of(s.y - 3, () => chair(s, i % 3, E))));
TBP.forEach((pt, k) => it.push(Array.of(pt.at(1) + 24, () => table(pt.at(0), pt.at(1), k, t, E))));
it.push(Array.of(210, () => counter(E, t)));
ALL.forEach(r => it.push(Array.of(r.y, () => person(r, t, E))));
it.sort((a, b) => a.at(0) - b.at(0)).forEach(a => a.at(1)());
lights(E, E.L);
x.fillStyle = "rgba(255,244,210," + (0.15 + 0.45 * Math.min(1, E.pI * 2)) + ")";
P.forEach(p => ci(p.x, p.y, p.r));
ALL.forEach(r => tag(r, t));
x.font = "700 15px 'Baloo 2',system-ui,sans-serif";
x.lineWidth = 2.2;
x.strokeStyle = "#fff";
F.forEach(f => {
x.globalAlpha = cl(f.t, 0, 1);
x.strokeText(f.s, f.x, f.y);
x.fillStyle = "#4a2c1a";
x.fillText(f.s, f.x, f.y);
});
x.globalAlpha = 1;
x.restore();
}