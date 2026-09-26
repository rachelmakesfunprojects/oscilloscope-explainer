/* Scene 5: an electrostatic lens brings an untidy electron beam to a focus.
   Everything is procedural Canvas geometry; timing follows narration words. */
const {style}=require('./video-style.cjs');

module.exports={5:(ctx,t,scene)=>{
 const u=style(ctx,t,scene),{C,clamp,ease,lerp}=u;
 const electrodesAt=u.at('Shaped electrodes',.17);
 const lensAt=u.at('electrostatic lens',.31);
 const bendAt=u.at('curved electric field',.39);
 const spotAt=u.at('small spot',.48);
 const glassAt=u.at('no piece of glass',.72);
 const knobAt=u.at('Turn the focus control',.82);
 const electrodes=u.reveal(electrodesAt,.9),field=u.reveal(lensAt,.85);
 const focus=u.reveal(bendAt,2.1),knob=u.reveal(knobAt,.8);
 const cy=474,screenX=1315;
 // A small deliberate adjustment briefly softens and then sharpens the spot.
 const adjustmentDuration=Math.min(2.4,Math.max(.8,scene.duration-knobAt-1.45));
 const adjustment=knob*Math.sin(Math.PI*clamp((t-knobAt-.7)/adjustmentDuration));
 const blur=lerp(90,4,focus)+adjustment*23;
 u.header('A sharp point makes a sharp picture.','An electric field brings the electron beam to a focus.');

 // The screen remains visible while the optical mechanism is introduced.
 u.group(u.reveal(.7),()=>{
  u.line([[screenX,302],[screenX+1,633]],C.ink,4);
  u.line([[screenX+8,307],[screenX+9,630]],C.soft,8);
  u.text('phosphor screen',screenX-3,280,31,C.ink,'center');
  // Broad initial glow contracts continuously into a precise spot.
  ctx.save();
  const glow=ctx.createRadialGradient(screenX,cy,2,screenX,cy,Math.max(12,blur));
  glow.addColorStop(0,'rgba(48,140,125,.85)');glow.addColorStop(.45,'rgba(48,140,125,.34)');glow.addColorStop(1,'rgba(48,140,125,0)');
  ctx.fillStyle=glow;ctx.beginPath();ctx.ellipse(screenX,cy,Math.max(15,blur*.46),Math.max(12,blur),0,0,Math.PI*2);ctx.fill();
  ctx.restore();
  u.ellipse(screenX,cy,3+blur*.04,3+blur*.16,C.mint,0,C.mint);
 });

 // The initial beam spreads out. Focusing turns the trajectories smoothly inward.
 function beamY(x,d){
  const q=(x-174)/(screenX-174);
  const unfocused=d*(24+q*66);
  let focused;
  if(x<553)focused=d*(24+(x-174)*.11);
  else if(x<863){
   const p=(x-553)/310;
   // Cubic Hermite curve changes the slope gradually through the electrode lens.
   const h00=2*p*p*p-3*p*p+1,h10=p*p*p-2*p*p+p,h01=-2*p*p*p+3*p*p,h11=p*p*p-p*p;
   focused=d*(h00*65.69+h10*34.1+h01*52+h11*(-35.7));
  }else focused=d*lerp(52,adjustment*23,(x-863)/(screenX-863));
  return cy+lerp(unfocused,focused,focus);
 }
 const rayD=[-1,-.5,0,.5,1];
 u.group(u.reveal(.55),()=>{
  u.text('electron beam',180,357,34,C.mint);
  u.arrow([[251,370],[294,421]],C.mint,2.2);
  for(const d of rayD){
   const points=[];for(let x=174;x<screenX;x+=15)points.push([x,beamY(x,d)]);points.push([screenX,beamY(screenX,d)]);
   u.line(points,d===0?C.mint:'#8ab8a7',d===0?2.5:1.7);
   for(let j=0;j<7;j++){
    const p=((j/7+t*.18+d*.037)%1+1)%1,x=174+p*(screenX-174);
    // Electron spacing is illustrative; this scene is about trajectory, not speed.
    u.particle(x,beamY(x,d),d===0?5.5:4.3,.94);
   }
  }
 });

 // A set of metal electrodes: the beam passes through their aligned openings.
 u.group(electrodes,()=>{
  for(const [x,w,depth] of [[510,65,64],[678,79,89],[858,65,64]]){
   const gap=98;
   const top=[[x,cy-gap-depth],[x+w,cy-gap-depth+1],[x+w,cy-gap-9],[x+w-14,cy-gap],[x+14,cy-gap],[x,cy-gap-9],[x,cy-gap-depth]];
   const bottom=top.map(([px,py])=>[px,2*cy-py]);
   for(const points of [top,bottom]){ctx.save();ctx.fillStyle=C.soft;ctx.beginPath();ctx.moveTo(...points[0]);for(const p of points.slice(1))ctx.lineTo(...p);ctx.fill();ctx.restore();u.line(points,C.ink,2.7);}
  }
  u.text('shaped electrodes + chosen voltages',715,260,35,C.ink,'center');
  u.arrow([[600,278],[548,303]],C.ink,2.2);
  u.arrow([[835,278],[887,303]],C.ink,2.2);
 });
 // Sparse bowed contours suggest the shaped field. The label says schematic.
 u.group(field*.72,()=>{
  ctx.save();ctx.setLineDash([5,8]);
  for(const [x,bow] of [[594,18],[631,12],[793,-12],[830,-18]]){
   const points=[];for(let j=0;j<=32;j++){const p=j/32;points.push([x+bow*Math.sin(Math.PI*p),cy-109+218*p]);}
   u.line(points,C.coral,1.7);
  }
  ctx.restore();
 });

 // A light joke is carried by the spot itself; captions change with the narration.
 // Clear the previous caption before revealing its replacement.
 u.group(u.reveal(.9)*(1-u.reveal(spotAt-.5,.45)),()=>{
  u.text('rather untidy',1442,436,28,C.muted,'center',1,190);
  u.text('splodge',1442,473,39,C.coral,'center');
  u.arrow([[1395,492],[1355,496]],C.coral,2);
 });
 u.group(u.reveal(spotAt,.8),()=>{
  u.text('small, sharp',1422,424,32,C.mint,'center',1,237);
  u.text('spot',1422,460,36,C.mint,'center');
  u.arrow([[1422,476],[1352,476]],C.mint,2.3);
  // Two understated spark marks celebrate the moment focus is achieved.
  const sparkle=Math.max(0,1-Math.abs((t-spotAt-1.1)/.9));
  u.line([[1340,cy-31],[1348,cy-43]],C.mint,2,sparkle);
  u.line([[1346,cy+27],[1356,cy+37]],C.mint,2,sparkle);
 });

 // The lens caption clears just before the focus-control cue, so the knob
 // enters on cue without crossfading two text blocks in the same space.
 const lensLabel=u.reveal(lensAt)*(1-u.reveal(knobAt-.5,.45));
 u.group(lensLabel,()=>{
  u.text('electrostatic lens',714,713,42,C.ink,'center');
  u.line([[548,673],[548,680],[895,680],[895,673]],C.muted,1.8);
  u.text('shaped field bends electron paths',715,750,30,C.muted,'center');
 });

 u.group(knob,()=>{
  const knobX=494,knobY=696;
  u.text('FOCUS',367,702,31,C.ink,'right');
  u.ellipse(knobX,knobY,40,40,C.ink,3,C.paper);
  u.ellipse(knobX,knobY,29,29,C.muted,1.5);
  const theta=-Math.PI/2+adjustment*.78;
  u.line([[knobX+Math.cos(theta)*14,knobY+Math.sin(theta)*14],[knobX+Math.cos(theta)*33,knobY+Math.sin(theta)*33]],C.coral,4);
  for(let j=0;j<7;j++){const a=-Math.PI*.9+j*Math.PI*.8/6;u.line([[knobX+Math.cos(a)*48,knobY+Math.sin(a)*48],[knobX+Math.cos(a)*54,knobY+Math.sin(a)*54]],C.muted,1.4);}
  u.arrow([[557,696],[646,696]],C.coral,2.4);
  u.text('adjust the lens voltage',678,703,37,C.ink);
  u.text('A small turn. A much sharper trace.',678,739,29,C.muted);
 });
 if(t<glassAt)u.note('Focusing brings the electron trajectories together.',C.ink,lensAt);
 else u.note('No glass required: this lens is made by an electric field.',C.ink,glassAt);
}};
