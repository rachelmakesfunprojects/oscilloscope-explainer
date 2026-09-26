const {style}=require('./video-style.cjs');
module.exports={1:(ctx,t,scene)=>{
 const u=style(ctx,t,scene),{C}=u;
 u.text('Meet the world’s tiniest pencil.',76,145,88,C.ink,'left',u.reveal(.15,1.1),1440);
 u.line([[638,165],[815,168],[1024,163]],C.coral,6,u.reveal(1.7,1));
 u.text('No lead. Just electrons.',80,202,39,C.muted,'left',u.reveal(u.at('No lead',.12),.6));
 const start=u.at('A classic analog',.22),inside=u.at('Inside its glass',.44);
 const scan=((t-start)*.23%1+1)%1;
 const body=u.reveal(start,2.3);
 u.group(body,()=>{
  // Slightly uneven contours retain the chosen whiteboard character.
  u.line([[151,398],[485,397],[580,355],[802,282],[1030,284]],C.ink,4,body);
  u.line([[151,561],[485,563],[581,607],[802,679],[1030,677]],C.ink,4,body);
  u.line([[151,398],[137,409],[132,525],[138,551],[151,561]],C.ink,4);
  u.ellipse(1030,480,61,197,C.ink,4,C.paper);
  u.ellipse(1030,480,48,185,C.muted,1);
 });
 u.group(u.reveal(start+.9),()=>{
  u.grid(1210,378,306,206);
  const p=scan,points=[];
  for(let k=0;k<110;k++){let q=k/109;points.push([1228+q*270,481-Math.sin(q*2.6*Math.PI)*63]);}
  u.line(points,C.soft,5,u.clamp((t-start-1.1)/1.8));
  for(let k=0;k<48;k++){let q=p-k*.006;if(q>=0){u.particle(1228+q*270,481-Math.sin(q*2.6*Math.PI)*63,2,1-k/50);}}
  u.glow(1228+p*270,481-Math.sin(p*2.6*Math.PI)*63,4);
  u.text('front view: the trace',1363,620,29,C.muted,'center');
 });
 const parts=u.reveal(inside,.85);
 u.group(parts,()=>{
  u.line([[121,448],[178,448],[187,472],[198,441],[212,485],[227,440],[241,482],[254,443],[263,472],[263,517],[121,517]],C.coral,3.5);
  u.line([[276,431],[291,431],[291,526],[277,526]],C.ink,3);
  u.line([[280,439],[280,518]],C.coral,5);
  [319,395,469].forEach((x,i)=>u.electrode(x,480,i?45:23,i?19:18,i?42:34));
  u.line([[615,377],[714,377],[736,358],[637,358],[615,377]],C.ink,3);
  u.line([[615,584],[714,584],[736,566],[637,566],[615,584]],C.ink,3);
  u.box(760,406,46,148,C.paper,C.muted,2);
  u.line([[299,580],[299,594],[522,594],[522,580]],C.muted,1.8);
  u.text('electron gun',411,630,32,C.muted,'center');
  u.text('heated cathode',176,322,33,C.coral);
  u.arrow([[284,334],[283,416]],C.coral,2,u.reveal(inside+1.1));
  u.text('steering plates',673,247,33,C.ink,'center');
  u.arrow([[672,265],[673,345]],C.ink,2);
  u.text('phosphor screen',1114,691,33,C.coral);
  u.arrow([[1126,662],[1098,627],[1083,586]],C.coral,2);
 });
 const beamAt=inside+1.2;
 u.group(u.reveal(beamAt),()=>{
  const hit=480-130*Math.sin(scan*2.6*Math.PI),bend=(480-hit)/(1+2*(1030-766)/150);
  const p=[[291,480],[616,480]];
  for(let i=1;i<=28;i++){let q=i/28;p.push([616+150*q,480-bend*q*q]);}
  p.push([1030,hit]);
  u.line(p,C.soft,11,u.reveal(beamAt,1.6));u.line(p,C.mint,2.7,u.reveal(beamAt,1.6));
  u.flow(p,t-beamAt,{count:15,speed:.21,r:4});u.glow(1030,hit,6);
 });
 const items=[['releases','release',245],['controls','control',605],['accelerates','accelerate',965],['focuses','focus',1325]];
 items.forEach(([phrase,label,x],i)=>{
  const onset=u.at(phrase,.67+i*.055),a=u.reveal(onset,.45);
  u.group(a,()=>{u.ellipse(x-76,738,18,18,C.mint,2,C.soft);u.text(String(i+1),x-76,747,26,C.ink,'center');u.text(label,x-44,748,36,C.ink);});
 });
 u.note('Voltage, made visible.',C.mint,u.at('Let us follow',.9));
}};
