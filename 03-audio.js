/* ===== ÂM THANH: mỗi nhạc cụ một cách tổng hợp riêng, chung một bus có hồi âm phòng ===== */
const A={ac:null,v:.7,
init(){try{if(!this.ac){const a=this.ac=new(window.AudioContext||window.webkitAudioContext)(),c=a.createDynamicsCompressor();this.o=a.createGain();this.o.connect(c);c.connect(a.destination);
const b=a.createBuffer(1,a.sampleRate,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=R()*2-1;this.nz=b;this.kc={};
const wc=new Float32Array(256),tn=Math.tanh(2.4);for(let i=0;i<256;i++)wc[i]=Math.tanh((i/128-1)*2.4)/tn;this.ws=wc;
const n=Math.round(a.sampleRate*1.6),ir=a.createBuffer(2,n,a.sampleRate);for(let k=0;k<2;k++){const e=ir.getChannelData(k);for(let i=0;i<n;i++)e[i]=(R()*2-1)*Math.pow(1-i/n,3)}
const rv=a.createConvolver(),sg=a.createGain();rv.buffer=ir;sg.gain.value=.2;this.pb=a.createGain();this.pb.connect(this.o);this.pb.connect(sg);sg.connect(rv);rv.connect(this.o);
const rs=a.createBufferSource(),rf=a.createBiquadFilter();rs.buffer=b;rs.loop=true;rf.type="bandpass";rf.frequency.value=2200;rf.Q.value=.4;this.rn=a.createGain();this.rn.gain.value=0;rs.connect(rf);rf.connect(this.rn);this.rn.connect(this.o);rs.start()}
this.ac.resume();this.o.gain.value=this.v}catch(e){this.ac=null}},
rain(v){if(this.ac&&this.rn)this.rn.gain.setTargetAtTime(v*.05,this.ac.currentTime,.8)},
tone(f,t,d,w,v,f2){const a=this.ac,o=a.createOscillator(),g=a.createGain();o.type=w||"sine";o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v||.1,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(this.pb);o.start(t);o.stop(t+d+.05)},
noise(t,d,fr,ty,v){const a=this.ac,s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=this.nz;f.type=ty;f.frequency.value=fr;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(g);g.connect(this.pb);s.start(t);s.stop(t+d+.05)},
// dây đàn: Karplus-Strong, kích thích mềm (lọc thấp) + khoét lược theo vị trí gảy; thời gian ngân theo loại dây
ks(f,ty){const a=this.ac,sr=a.sampleRate,k=ty+Math.round(f*10);if(this.kc[k])return this.kc[k];
const c={nylon:[.82,.18,2.4],steel:[.58,.13,3.2],elec:[.64,.1,3.4],bass:[.88,.2,3.2]}[ty],sm=c[0],T=c[2],N=Math.max(3,Math.round(sr/f)),L=Math.round(sr*T),b=a.createBuffer(1,L,sr),d=b.getChannelData(0),dm=Math.exp(-1/(f*T*.9)),e=new Float32Array(N);
let p=0;for(let i=0;i<N;i++){p=p*sm+(R()*2-1)*(1-sm);e[i]=p}
for(let i=1;i<N;i++)e[i]=.5*(e[i]+e[i-1]);
const k0=Math.max(1,Math.round(N*c[1]));for(let i=N-1;i>=k0;i--)e[i]-=.9*e[i-k0];
let pk=0;for(let i=0;i<N;i++)pk=Math.max(pk,Math.abs(e[i]));for(let i=0;i<N;i++)d[i]=e[i]/(pk||1)*.8;
for(let i=N;i<L;i++)d[i]=dm*.5*(d[i-N]+(i>N?d[i-N-1]:d[i-N]));return this.kc[k]=b},
// thân đàn: bộ lọc cộng hưởng (hộp đàn), nylon ấm/tối, thép sáng + 2 dây lệch nhẹ, điện có pickup + méo nhẹ, bass trầm
pluck(ty,f){const a=this.ac,t=a.currentTime,T={nylon:2.4,steel:3.2,elec:3.4,bass:3.2}[ty],c={nylon:{lp:2800,pk:[[95,6,4],[190,3,3]],g:2.6},steel:{lp:5200,pk:[[100,5,4],[220,4,3],[3200,2,1.5]],g:1.3},elec:{lp:3800,pk:[[2400,5,1.3]],g:.55},bass:{lp:800,pk:[[85,5,3]],g:2.8}}[ty],o=a.createGain(),
bq=(y,fr,g,q)=>{const x=a.createBiquadFilter();x.type=y;x.frequency.value=fr;if(g!=null)x.gain.value=g;if(q)x.Q.value=q;return x},ch=[bq("highpass",ty=="bass"?35:75)];
o.gain.setValueAtTime(0,t);o.gain.linearRampToValueAtTime(c.g*Math.min(1,560/(f+280)),t+.004);o.gain.setTargetAtTime(0,t+T-.5,.15);
c.pk.forEach(p=>ch.push(bq("peaking",p[0],p[1],p[2])));if(ty=="elec"){const w=a.createWaveShaper();w.curve=this.ws;ch.push(w)}ch.push(bq("lowpass",c.lp,null,.7));
for(let i=0;i<ch.length-1;i++)ch[i].connect(ch[i+1]);ch[ch.length-1].connect(o);o.connect(this.pb);
for(const fk of ty=="steel"?[f,f*1.0022]:[f]){const s=a.createBufferSource();s.buffer=this.ks(fk,ty);s.connect(ch[0]);s.start(t);s.stop(t+T+.2)}},
bell(){const a=this.ac;if(!a)return;this.bt=performance.now();const t=a.currentTime;[[2093,0],[2637,.17]].forEach(([f,d])=>{this.tone(f,t+d,1.3,"sine",.1);this.tone(f*2.76,t+d,.7,"sine",.035);this.tone(f*5.4,t+d,.3,"sine",.015)})},
piano(m){const t=this.ac.currentTime,f=fq(m),d=2.6-(m-60)*.035;this.tone(f,t,d,"triangle",.24);this.tone(f*2,t,d*.7,"sine",.1);this.tone(f*3,t,d*.45,"sine",.05);this.tone(f*5.02,t,.25,"sine",.025)},
// kèn sax: sóng răng cưa + vuông, lọc formant, rung (vibrato) và hơi thở; giữ phím = kéo dài nốt
sax(m){const a=this.ac,t=a.currentTime,f=fq(m),o1=a.createOscillator(),o2=a.createOscillator(),lf=a.createOscillator(),lg=a.createGain(),g=a.createGain(),lp=a.createBiquadFilter(),pk=a.createBiquadFilter(),ns=a.createBufferSource(),ng=a.createGain(),nb=a.createBiquadFilter();
o1.type="sawtooth";o2.type="square";o1.frequency.value=f;o2.frequency.value=f;o2.detune.value=6;lp.type="lowpass";lp.frequency.value=2300;lp.Q.value=2;pk.type="peaking";pk.frequency.value=1100;pk.gain.value=7;
lf.frequency.value=5.5;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(14,t+.5);lf.connect(lg);lg.connect(o1.detune);lg.connect(o2.detune);
ns.buffer=this.nz;ns.loop=true;nb.type="bandpass";nb.frequency.value=2600;ng.gain.value=.03;ns.connect(nb);nb.connect(ng);ng.connect(pk);
g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.15,t+.07);o1.connect(lp);o2.connect(lp);lp.connect(pk);pk.connect(g);g.connect(this.pb);const all=[o1,o2,lf,ns];all.forEach(n=>n.start(t));
return()=>{const e=a.currentTime;g.gain.cancelScheduledValues(e);g.gain.setValueAtTime(Math.max(g.gain.value,.0002),e);g.gain.linearRampToValueAtTime(.0001,e+.12);all.forEach(n=>n.stop(e+.15))}},
drum(id){const t=this.ac.currentTime;
if(id==5)this.tone(150,t,.25,"sine",.9,45);
else if(id==4){this.noise(t,.2,1800,"bandpass",.6);this.tone(190,t,.1,"triangle",.3,120)}
else if(id==1)this.noise(t,.07,7000,"highpass",.35);
else if(id==0)this.noise(t,1.1,4500,"highpass",.5);
else if(id==2)this.tone(210,t,.3,"sine",.7,110);
else this.tone(150,t,.35,"sine",.7,80)}};

