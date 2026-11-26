/* ===== NHÂN VẬT CHIBI CAO CẤP: TÓC NHIỀU LỚP, KHỚP GỐI, 4 HƯỚNG, PHA CHẾ & BƯNG ĐỒ ===== */
const rr=(x,y,w,h,r,s)=>{G.beginPath();G.roundRect(x,y,w,h,r);G.fill();if(s)G.stroke()};
const el=(x,y,a,b,r)=>{G.beginPath();G.ellipse(x,y,a,b,r||0,0,2*PI);G.fill()};
const ci=(x,y,r,s)=>{G.beginPath();G.arc(x,y,r,0,2*PI);G.fill();if(s)G.stroke()};
const sh=(h,a)=>{const n=parseInt(h.slice(1),16),f=v=>Math.round(cl(a<0?v*(1+a):v+(255-v)*a,0,255));return"rgb("+f(n>>16)+","+f(n>>8&255)+","+f(n&255)+")"};
const TE=[[8,"#f4a3b5"],[9,"#3b2f3a"],0,0,[9,"#f6e6cf"],[7,"#f6e6cf"]];
const HAIR=["Ngắn","Bob","Dài","Đuôi ngựa","Búi","Xoăn"];
const votesFor=id=>Object.values(RP).filter(p=>p.vk==id).length+(vk==id?1:0);

function pet(px,py,lk,tm,m,sc=1,dir=0,walk=0,brew=null,dlv=null){
  const[sp,hf,fu,sk,cb,ac,w,t]=lk,hu=hf==2,c=G;
  const W2=w/100,T=t/100;
  const isDlv=dlv!=null;
  const isBrew=!walk&&!isDlv&&brew!=null;
  const spd=walk?tm*11:(isBrew?tm*9:tm*2.2);
  const bob=walk?Math.abs(Math.cos(spd))*2.4:(isBrew?Math.abs(Math.sin(tm*6))*1.6:Math.sin(tm*2.2)*0.7);
  const brewSway=isBrew?Math.sin(tm*5)*1.8:0;
  const shW=9.5*(0.85+0.15*W2), hipW=12.5*Math.pow(W2,1.25)+(sp==3&&!hu?2:0);
  const lg=15*T, bh=25*T;
  const bt=-(lg+bh)+bob;
  const hr=15.5*(0.9+0.1*T), hy=bt-hr+2.5;
  const fc=hf?sk:fu, dk=sh(fu,-0.32), hHi=sh(fu,0.28), cbDk=sh(cb,-0.25), cbHi=sh(cb,0.22);
  const OL="rgba(58, 36, 26, 0.72)";
  const back=(dir===1), side=(dir===-1||dir===2), flipX=(dir===-1?-1:1);

  c.save();
  c.translate(px+brewSway,py);
  c.scale(sc*flipX,sc);
  c.lineWidth=0.9;
  c.strokeStyle=OL;
  c.lineJoin=c.lineCap="round";

  c.fillStyle="rgba(42,22,14,0.16)";
  el(-brewSway,1.5,hipW*1.15,3.8);

  const drawLeg=(sideSign,phase)=>{
    const hipX=side?sideSign*1.5:sideSign*(hipW*0.46);
    const hipY=-lg+1;
    const lift=walk?Math.max(0,Math.sin(phase))*5.2:0;
    const swing=walk?Math.cos(phase)*(side?7.5:4.5):0;
    const kneeX=hipX+swing*0.65+(side?2.2:sideSign*0.6);
    const kneeY=hipY+lg*0.52-lift*0.75;
    const footX=hipX+swing+(side?1.5:0);
    const footY=-lift*0.55;
    const footTilt=walk?-Math.sin(phase)*0.32:0;

    c.strokeStyle=OL;
    c.lineWidth=5.8*(0.88+0.12*W2);
    c.beginPath();c.moveTo(hipX,hipY);c.quadraticCurveTo(kneeX,kneeY,footX,footY-2.5);c.stroke();
    c.strokeStyle=hf?cbDk:fu;
    c.lineWidth=4.2*(0.88+0.12*W2);
    c.beginPath();c.moveTo(hipX,hipY);c.quadraticCurveTo(kneeX,kneeY,footX,footY-2.5);c.stroke();

    c.save();
    c.translate(footX+(side?2:sideSign*1.2),footY-1.2);
    c.rotate(footTilt);
    c.fillStyle=hf?"#4a3226":dk;
    c.strokeStyle=OL;
    c.lineWidth=0.85;
    c.beginPath();
    c.roundRect(-4.5,-2.5,9.5,4.8,2.5);
    c.fill();c.stroke();
    c.fillStyle="#e8dcc8";
    c.fillRect(-3.8,1.1,8,1.2);
    c.restore();
  };

  const drawArm=(sideSign,phase)=>{
    const sx=side?0:sideSign*(shW+1.2);
    const sy=bt+4.5;
    let ex,ey,hx,hy;

    if(isDlv){
      // Tư thế hai tay nâng khay đồ uống ổn định khi bước đi
      const carryBob=Math.sin(spd)*0.8;
      if(side){
        ex=sx+6.5;
        ey=sy+5.5*T;
        hx=sx+12.5;
        hy=sy+3.5*T+carryBob;
      }else{
        ex=sx+sideSign*3.5;
        ey=sy+5.5*T;
        hx=sideSign*5.5;
        hy=sy+4.5*T+carryBob;
      }
    }else if(isBrew&&!side&&!back){
      const bType=brew%4;
      if(bType===1){
        const shk=Math.sin(tm*16)*6.5;
        ex=sx+sideSign*4.5;
        ey=sy+3.5*T+shk*0.4;
        hx=sideSign*3.2;
        hy=sy-1.5+shk;
      }else if(bType===2){
        const ang=tm*9+(sideSign>0?0:1.2);
        ex=sx+sideSign*5;
        ey=sy+5*T;
        hx=sideSign*4.5+Math.cos(ang)*3.5;
        hy=sy+5.5*T+Math.sin(ang)*2.2;
      }else{
        const wave=Math.sin(tm*7+sideSign)*3.5;
        ex=sx+sideSign*5.2;
        ey=sy+4.5*T+wave*0.3;
        hx=sideSign*5.5;
        hy=sy+3.5*T+wave;
      }
    }else{
      const swA=walk?Math.cos(phase)*5.5:Math.sin(tm*2+sideSign)*1.2;
      ex=sx+(side?swA*0.6:sideSign*3.2);
      ey=sy+8.5*T;
      hx=sx+(side?swA:sideSign*4.2);
      hy=sy+16.5*T-Math.abs(swA)*0.25;
    }

    c.strokeStyle=OL;c.lineWidth=5.2;
    c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(ex,ey,hx,hy);c.stroke();
    c.strokeStyle=cb;c.lineWidth=3.6;
    c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(ex,ey,hx,hy);c.stroke();

    c.fillStyle=fc;c.strokeStyle=OL;c.lineWidth=0.85;
    ci(hx,hy,3.6,1);
    return{hx,hy};
  };

  const drawServingTray=(hR)=>{
    if(!isDlv||back||!hR)return;
    const tx=side?hR.hx+2:0;
    const ty=hR.hy-2;
    c.save();
    c.translate(tx,ty);
    // Khay phục vụ viền vàng
    c.fillStyle="#7a4923";c.strokeStyle=OL;c.lineWidth=0.9;
    rr(-11,-2,22,4,2,1);
    c.fillStyle="#f5b942";
    c.fillRect(-9.5,-1,19,1.4);
    // Ly đồ uống trên khay
    if(typeof DR!=="undefined"&&DR[dlv]){
      c.save();
      if(flipX===-1)c.scale(-1,1);
      c.font="14px serif";
      c.textAlign="center";
      c.fillStyle="#000";
      c.fillText(DR[dlv].e,0,-3);
      c.restore();
    }
    c.restore();
  };

  const drawBrewProp=(hL,hR)=>{
    if(!isBrew||side||back||!hL||!hR)return;
    const bType=brew%4;
    const mx=(hL.hx+hR.hx)/2,my=(hL.hy+hR.hy)/2;
    c.save();
    if(bType===1){
      c.translate(mx,my-2);
      c.rotate(Math.sin(tm*16)*0.28);
      c.fillStyle="#dce4ec";c.strokeStyle=OL;c.lineWidth=0.85;
      rr(-4.5,-8,9,15,2.5,1);
      c.fillStyle="#9aa8b8";
      rr(-3,-11,6,3.5,1.2,1);
    }else if(bType===2){
      c.translate(hR.hx,hR.hy);
      c.fillStyle="#d4a359";c.strokeStyle=OL;c.lineWidth=0.8;
      rr(-2,-6,4,8,1,1);
      c.fillStyle="#e8c882";
      rr(-3.2,1,6.4,5,1.5,1);
    }else{
      c.translate(hR.hx-2,hR.hy-3);
      c.rotate(-0.35+Math.sin(tm*7)*0.12);
      c.fillStyle="#c97a4b";c.strokeStyle=OL;c.lineWidth=0.85;
      ci(0,0,5.2,1);
      c.beginPath();c.moveTo(-4,0);c.quadraticCurveTo(-9,-2,-10,-6);c.stroke();
    }
    c.restore();
  };

  const drawTail=()=>{
    if(hu)return;
    const tx=side?-hipW*0.75:(back?0:hipW*0.65);
    const ty=-lg-2;
    const wag=Math.sin(tm*3.5+(walk||isBrew?tm*5:0))*3.5;
    c.save();c.translate(tx,ty);
    if(side)c.scale(-1,1);
    c.fillStyle=fu;c.strokeStyle=OL;c.lineWidth=0.9;
    if(sp==0||sp==5){
      c.lineWidth=5.0;c.beginPath();
      if(sp==0){c.moveTo(0,0);c.quadraticCurveTo(15,-2+wag,9,-18)}
      else c.arc(4,-7,5.5,0.4,5.9);
      c.stroke();c.strokeStyle=fu;c.lineWidth=3.4;c.stroke();
    }else if(sp==1||sp==4){
      c.beginPath();c.ellipse(7,-2+wag*0.5,12,6.2,0.65,0,2*PI);c.fill();c.stroke();
      c.fillStyle="#fff8ee";el(12,3+wag*0.5,4.8,3.2,0.65);
    }else{
      c.fillStyle=sp==2?"#fff":fu;ci(1,-2,sp==2?6:4.2,1);
    }
    c.restore();
  };

  const drawBackHair=()=>{
    c.fillStyle=fu;c.strokeStyle=OL;c.lineWidth=0.9;
    if(!hu&&!back)return;
    if(sp==1){
      c.beginPath();
      c.arc(0,hy,hr+2.5,2.67,6.75);
      c.quadraticCurveTo(hr+4,hy+hr*0.75,hr*0.6,hy+hr*0.85);
      c.lineTo(-hr*0.6,hy+hr*0.85);
      c.quadraticCurveTo(-hr-4,hy+hr*0.75,-hr-2.5,hy);
      c.closePath();c.fill();c.stroke();
    }else if(sp==2){
      c.beginPath();
      c.moveTo(-hr-1,hy-4);
      c.quadraticCurveTo(-hr-5,hy+hr+10,-hr+2,hy+hr+15);
      c.quadraticCurveTo(-hr*0.4,hy+hr+11,0,hy+hr+16);
      c.quadraticCurveTo(hr*0.4,hy+hr+11,hr-2,hy+hr+15);
      c.quadraticCurveTo(hr+5,hy+hr+10,hr+1,hy-4);
      c.closePath();c.fill();c.stroke();
    }else if(sp==5){
      const puffs=[
        [-hr-1.5,hy+4,6.2],[-hr-2.5,hy-3.5,6.8],[-hr*0.68,hy-hr*0.82,7.2],
        [0,hy-hr-1.5,7.6],[hr*0.68,hy-hr*0.82,7.2],[hr+2.5,hy-3.5,6.8],[hr+1.5,hy+4,6.2]
      ];
      c.strokeStyle=OL;c.lineWidth=1.7;
      for(const[px2,py2,pr]of puffs){c.beginPath();c.arc(px2,py2,pr,0,6.283);c.stroke()}
      c.fillStyle=fu;
      for(const[px2,py2,pr]of puffs){c.beginPath();c.arc(px2,py2,pr,0,6.283);c.fill()}
      c.strokeStyle=dk;c.lineWidth=0.8;
      for(const[px2,py2,pr]of puffs){c.beginPath();c.arc(px2,py2,pr*0.62,0.47,2.67);c.stroke()}
    }else if(sp==3){
      const px2=side?-hr-3:(back?0:hr+3);
      c.beginPath();c.ellipse(px2,hy+6,4.5,11,side?-0.35:0.25,0,6.283);c.fill();c.stroke();
      c.fillStyle=ac;ci(px2*0.85,hy-1,3.2,1);
    }else if(sp==4){
      ci(side?-hr*0.6:0,hy-hr-3.5,6.2,1);
      c.fillStyle=ac;rr((side?-hr*0.6:0)-4,hy-hr+1,8,2.6,1.2,1);
    }else if(back){
      c.beginPath();c.arc(0,hy,hr+1.5,0,6.283);c.fill();c.stroke();
    }
  };

  if(side)drawArm(-1,spd);
  if(!back)drawTail();
  drawLeg(-1,spd);
  drawLeg(1,spd+PI);

  const bodyW=side?hipW*0.78:hipW;
  const topW=side?shW*0.72:shW;
  c.fillStyle=cb;c.strokeStyle=OL;c.lineWidth=0.9;
  c.beginPath();
  c.moveTo(-topW,bt+2);
  c.quadraticCurveTo(-bodyW*1.06,bt+bh*0.65,-bodyW*0.92,bt+bh+2);
  c.quadraticCurveTo(0,bt+bh+5,bodyW*0.92,bt+bh+2);
  c.quadraticCurveTo(bodyW*1.06,bt+bh*0.65,topW,bt+2);
  c.closePath();c.fill();c.stroke();

  c.fillStyle=cbHi;
  el(-bodyW*0.28,bt+bh*0.42,bodyW*0.24,bh*0.28,-0.15);
  c.strokeStyle=cbDk;c.lineWidth=0.8;
  c.beginPath();c.moveTo(0,bt+6);c.lineTo(0,bt+bh);c.stroke();

  c.fillStyle=ac;c.strokeStyle=OL;c.lineWidth=0.85;
  rr(-topW-1,bt-2.5,topW*2+2,5.8,3,1);
  const scarfSwing=walk?Math.sin(spd)*3.5:Math.sin(tm*2)*1;
  c.beginPath();
  c.roundRect((side?-2:topW-5)+scarfSwing*0.3,bt+2,4.5,10,2);
  c.fill();c.stroke();

  let hL=null,hR=null;
  if(!side){
    hL=drawArm(-1,spd);
    hR=drawArm(1,spd+PI);
    drawBrewProp(hL,hR);
    drawServingTray(hR);
  }

  drawBackHair();

  if(!hu){
    const drawEar=d=>{
      const ex=side?d*2:d*(hr-4);
      if(sp==2){
        c.fillStyle=fu;c.beginPath();c.ellipse(ex,hy-hr-8,4.6,13,d*0.12,0,6.283);c.fill();c.stroke();
        c.fillStyle="#f4a3b5";c.beginPath();c.ellipse(ex,hy-hr-7,2.2,9,d*0.12,0,6.283);c.fill();
      }else if(sp==3){
        c.fillStyle=fu;ci(ex,hy-hr+3,6.2,1);
        c.fillStyle=hHi;ci(ex,hy-hr+3,3.2);
      }else{
        const[h2,ic]=TE[sp],B=hy-hr+5;
c.fillStyle=fu;c.beginPath();c.moveTo(d*3,B);c.quadraticCurveTo(d*4.5,B-h2*1.5,d*(hr-3.5),B-h2);c.quadraticCurveTo(d*(hr+1),B-h2*0.2,d*(hr+0.5),B+4);c.closePath();c.fill();c.stroke();
c.fillStyle=ic;c.beginPath();c.moveTo(d*5.5,B);c.quadraticCurveTo(d*6,B-h2*1.1,d*(hr-5.5),B-h2*0.7);c.quadraticCurveTo(d*(hr-2),B-h2*0.2,d*(hr-2),B+2);c.closePath();c.fill();

}
};
drawEar(-1);drawEar(1);
}
c.fillStyle=fc;c.strokeStyle=OL;c.lineWidth=0.9;
c.beginPath();
c.moveTo(0,hy-hr);
c.bezierCurveTo(hr*1.05,hy-hr,hr*1.08,hy+hr*0.85,0,hy+hr*0.96);
c.bezierCurveTo(-hr*1.08,hy+hr*0.85,-hr*1.05,hy-hr,0,hy-hr);

c.fill();c.stroke();
if(hu&&!back){
c.fillStyle=sk;
if(!side){el(-hr,hy+2.5,2.4,3.4);el(hr,hy+2.5,2.4,3.4)}
else el(-2,hy+2.5,2.6,3.5);
}
if(!back){
const faceShift=side?4.2:0;
const bl=tm%4<0.12,ey=hy-0.5;
c.save();c.translate(faceShift,0);
if(!hf){
c.fillStyle=sh(fu,0.55);
if(sp==0){el(0,hy+5.2,5.6,3.8);c.fillStyle="#f08fa5";c.beginPath();c.moveTo(-1.8,hy+3);c.lineTo(1.8,hy+3);c.lineTo(0,hy+5);c.fill()}
else if(sp==1||sp==4){el(0,hy+6.5,6.2,5.2);c.fillStyle="#fff";ci(-6.5,hy+6,4.2);ci(6.5,hy+6,4.2);c.fillStyle="#3a2c36";el(0,hy+9.2,2.4,1.8)}
else if(sp==2){c.fillStyle="#fff";el(0,hy+5.2,5.2,3.8);c.fillStyle="#f08fa5";ci(0,hy+3.5,1.8);c.fillStyle="#fff";rr(-1.7,hy+8.5,3.4,3.2,1,1)}
else if(sp==3){c.fillStyle="#e6c9a0";el(0,hy+5.8,7.8,6.2);c.fillStyle="#1b1218";el(0,hy+3.4,3.2,2.4)}
else{c.fillStyle="#f6e6cf";ci(-7.5,hy+5.5,4.8);ci(7.5,hy+5.5,4.8);el(0,hy+6.2,6,4.6);c.fillStyle="#1b1218";el(0,hy+4.5,2.4,1.9)}
}
c.fillStyle="#2e1d16";
if(bl){
c.fillRect(-7.2,ey,4.2,1.2);if(!side)c.fillRect(3,ey,4.2,1.2);
}else{
el(-4.8,ey,2.4,3.1);if(!side)el(4.8,ey,2.4,3.1);
c.fillStyle="#fff";
el(-4.1,ey-1.1,1,1);if(!side)el(5.5,ey-1.1,1,1);
}
c.fillStyle="rgba(255,115,115,0.32)";
el(-7.5,hy+5.5,2.8,1.8);if(!side)el(7.5,hy+5.5,2.8,1.8);
const my=hf?hy+8.5:hy+9.5;
c.strokeStyle=OL;c.lineWidth=1.0;c.beginPath();
if(m>0||isBrew||isDlv)c.arc(0,my-2,3,0.56,2.58);
else if(!m){c.moveTo(-2.6,my);c.lineTo(2.6,my)}
else c.arc(0,my+1.5,2.6,3.77,5.65);
c.stroke();
c.restore();
}
if(hf||back){
c.fillStyle=fu;c.strokeStyle=OL;c.lineWidth=0.9;
if(back){
c.beginPath();
c.arc(0,hy,hr+1.5,2.76,6.66);
c.lineTo(hr/1.4,hy+6);c.lineTo(hr/4,hy+3);c.lineTo(0,hy+7);c.lineTo(-hr/4,hy+3);c.lineTo(-hr/1.4,hy+6);
c.closePath();c.fill();c.stroke();
}else if(hu&&sp==5){
const bangs=[[-hr/1.22,hy-4.5,4.8],[-hr/2.78,hy-hr/1.38,5.4],[hr/4.5,hy-hr/1.35,5.6],[hr/1.28,hy-4.8,4.8]];
c.strokeStyle=OL;c.lineWidth=1.6;
for(const[bx,by,br]of bangs){c.beginPath();c.arc(bx,by,br,0,6.283);c.stroke()}
c.fillStyle=fu;
for(const[bx,by,br]of bangs){c.beginPath();c.arc(bx,by,br,0,6.283);c.fill()}
c.strokeStyle=hHi;c.lineWidth=1.1;
c.beginPath();c.arc(-hr/2.78,hy-hr/1.38,3.1,3.61,5.5);c.stroke();
c.beginPath();c.arc(hr/4.5,hy-hr/1.35,3.3,3.61,5.5);c.stroke();
}else{
c.beginPath();
c.arc(0,hy,hr+1.4,2.98,6.44);
c.lineTo(hr+1.2,hy+7);
c.quadraticCurveTo(hr-1.5,hy+5,hr/1.54,hy-1);
c.lineTo(hr/2.85,hy-5.5);
c.lineTo(hr/12.5,hy-1.2);
c.lineTo(-hr/5.5,hy-6);
c.lineTo(-hr/1.8,hy-1);
c.quadraticCurveTo(-hr+1.5,hy+5,-hr-1.2,hy+7);
c.closePath();c.fill();c.stroke();
c.strokeStyle=hHi;c.lineWidth=1.5;
c.beginPath();c.arc(0,hy-1.5,hr/1.39,3.83,4.65);c.stroke();
c.beginPath();c.arc(0,hy-1.5,hr/1.39,4.9,5.47);c.stroke();
}
}
if(side){
hR=drawArm(1,spd+PI);
drawServingTray(hR);
}
if(back)drawTail();
c.restore();
}