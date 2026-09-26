/* Moving vector/canvas scenes for the whiteboard oscilloscope film.
   All instructional lettering is Caveat. No stock imagery or baked frames.
   Scene timing is aligned to narrated words, with proportional fallbacks. */
const {style}=require('./video-style.cjs');

function dashed(u,points,color,width=2,dash=11){
 const {ctx}=u;ctx.save();ctx.setLineDash([dash,dash*.72]);u.line(points,color,width);ctx.restore();
}
function curve(fn,count=120){return Array.from({length:count+1},(_,i)=>fn(i/count));}
function mod(a,b){return ((a%b)+b)%b;}

function steering(ctx,t,scene){
 const u=style(ctx,t,scene),{C}=u;
 u.header('Give the beam a little nudge.','Two pairs of plates. Electric fields. A remarkably obedient spot.');
 const diagram=u.reveal(.9,1.2),negative=u.reveal(u.at('negative charge',.2)),vertical=u.reveal(u.at('One pair steers vertically',.43));
 const inputStart=u.at('The input signal',.6),moveStart=u.at('As that voltage',.79);
 const driveAt=time=>u.lerp(.84,Math.sin((time-moveStart)*Math.PI*2/5.6),u.ease((time-moveStart)/1.6));
 const strength=driveAt(t),bend=27*strength;
 const x0=350,x1=630,sx=1045,cy=475;
 const beam=curve(p=>{
  const x=155+p*(sx-155);
  const y=x<x0?cy:x<x1?cy-bend*((x-x0)/(x1-x0))**2:cy-bend-2*bend*(x-x1)/(x1-x0);
  return [x,y];
 });
 const screenY=beam.at(-1)[1];
 u.group(diagram,()=>{
  // The vertical plates are horizontal strips in this side view.
  u.box(348,366,286,19,C.soft,C.ink,3);
  u.box(348,585,286,19,C.soft,C.ink,3);
  // Orthogonal horizontal pair, shown in oblique projection.
  u.group(.9,()=>{
   u.line([[714,392],[754,373],[754,555],[714,574],[714,392]],C.muted,2.2);
   u.line([[754,414],[794,395],[794,577],[754,596],[754,414]],C.ink,2.6);
  });
  u.ellipse(sx,cy,37,154,C.ink,3.3,C.paper);
  u.ellipse(sx-3,cy,26,144,C.muted,1);
  // At each instant the trajectory is curved only within the Y-plate field.
  u.group(.12,()=>u.line(beam,C.mint,15));u.line(beam,C.mint,3.2);
  u.flow(beam,t,{count:12,speed:.38,r:5.4});
  u.glow(sx-2,screenY,6.5);
  u.text('electron beam',158,435,34,C.mint);
  u.text('Y plates',489,288,37,C.ink,'center');
  u.arrow([[491,304],[491,354]],C.ink,2.1);
  u.text('X plates',771,288,37,C.ink,'center');
  u.arrow([[773,304],[773,359],[757,382]],C.ink,2.1);
  u.text('phosphor screen',1003,683,33,C.coral,'center');
  u.arrow([[1003,650],[1035,615]],C.coral,2.1);
  u.text('side view',139,627,27,C.muted);
  // Positive and negative signs fade gently while polarity reverses.
  const signAlpha=.28+.72*Math.min(1,Math.abs(strength)*3.5);
  const positiveTop=strength>=0;
  u.text(positiveTop?'+':'−',665,380,48,C.coral,'center',negative*signAlpha);
  u.text(positiveTop?'−':'+',665,602,48,C.coral,'center',negative*signAlpha);
  u.group(negative,()=>{
   const force=cy-72*Math.sign(strength||1);
   u.arrow([[515,cy-5],[515,force]],C.coral,2.7,Math.min(1,Math.abs(strength)*2.5));
  });
  u.text('bends towards +',382,656,32,C.coral,'left',negative);
  u.group(vertical,()=>{
   u.grid(1197,324,298,300);
   u.text('front view',1346,287,34,C.ink,'center');
   u.line([[1346,337],[1346,611]],C.pale,1.8);
   u.glow(1346,screenY,6.4);
   u.text('up / down',1346,683,35,C.mint,'center');
  });
 });
 u.group(u.reveal(inputStart),()=>{
  // A live input waveform reinforces the voltage-to-height relationship.
  u.text('amplified input',170,719,31,C.mint);
  const px=418,py=705,pw=300;
  const p=curve(q=>[px+q*pw,py-18*driveAt(t-(1-q)*5.6)]);
  u.line(p,C.mint,2.5);u.particle(px+pw,py-18*strength,4.3);
  u.arrow([[742,705],[868,705]],C.coral,2.2);
  u.text('feeds the Y plates',884,714,31,C.ink);
 });
 const changing=u.reveal(moveStart,1);
 u.text('Negative electrons bend towards the more positive plate.',800,798,36,C.ink,'center',negative*(1-changing),1400);
 u.text('Input voltage sets height. The other pair steers left and right.',800,798,36,C.ink,'center',changing,1400);
}

function sweep(ctx,t,scene){
 const u=style(ctx,t,scene),{C}=u;
 u.header('A dot with excellent timing.','A steady sweep turns changing voltage into a picture across time.');
 const begin=u.at('a ramp voltage',.13),blankStart=u.at('rapid return',.31),phosphor=u.at('phosphor coating',.57);
 const shown=u.reveal(.9,1),local=Math.max(0,t-begin);
 const firstForward=Math.max(2,blankStart-begin),returnTime=.9,firstPeriod=firstForward+returnTime;
 // The first return begins on the spoken cue. Later sweeps use the standard
 // demonstration tempo; this same time map also reconstructs the light trail.
 function sweepAt(elapsed){
  const first=elapsed<firstPeriod;
  const forward=first?firstForward:5.9,period=forward+returnTime;
  const afterFirst=Math.max(0,elapsed-firstPeriod);
  const cycle=first?0:1+Math.floor(afterFirst/period);
  const phase=first?Math.max(0,elapsed):mod(afterFirst,period);
  const flyback=phase>=forward;
  const p=flyback?1-(phase-forward)/returnTime:phase/forward;
  return {forward,period,cycle,phase,flyback,p};
 }
 const {forward,period,phase,flyback,p}=sweepAt(local);
 const x=156,y=304,w=806,h=363,padx=22;
 const point=(q)=>[x+padx+q*(w-padx*2),y+h/2-112*Math.sin(q*Math.PI*3.4-.3)];
 u.group(shown,()=>{
  u.text('phosphor screen',558,273,37,C.ink,'center');u.grid(x,y,w,h);
  u.arrow([[113,647],[113,328]],C.mint,2.6);
  ctx.save();ctx.translate(77,489);ctx.rotate(-Math.PI/2);u.text('voltage',0,0,34,C.mint,'center');ctx.restore();
  u.arrow([[175,695],[942,695]],C.coral,2.6);u.text('time',559,733,35,C.coral,'center');
  // Light is left only by past beam impacts during forward sweeps. No return
  // segment or flyback spot is drawn; the existing phosphor glow just decays.
  const tail=5.0,step=.027;
  for(let age=tail;age>=0;age-=step){
   const past=local-age;if(past<0)continue;
   const before=sweepAt(past),after=sweepAt(Math.min(local,past+step));
   if(before.flyback||after.flyback||before.cycle!==after.cycle)continue;
   const a=point(before.p),b=point(after.p),alpha=Math.exp(-age/1.48)*.93;
   u.group(alpha*.22,()=>u.line([a,b],C.mint,11));u.group(alpha,()=>u.line([a,b],C.mint,3.8));
  }
  if(!flyback&&t>=begin)u.glow(...point(p),6.2);
  // A timebase graph runs in synchrony with the actual moving screen spot.
  const rx=1079,ry=534,rw=362,rh=169,peak=rx+rw*(forward/period);
  u.text('timebase ramp',1263,295,38,C.coral,'center');
  u.arrow([[1051,567],[1490,567]],C.muted,1.8);u.arrow([[1051,567],[1051,337]],C.muted,1.8);
  u.text('horizontal drive',1057,331,28,C.muted);
  u.line([[rx,ry],[peak,ry-rh]],C.coral,3.6);
  dashed(u,[[peak,ry-rh],[rx+rw,ry]],C.muted,2.2,9);
  u.text('time',1479,605,28,C.muted,'right');
  const mx=rx+rw*phase/period,my=ry-rh*p;
  u.line([[mx,562],[mx,my]],C.pale,1.7);
  u.ellipse(mx,my,6,6,flyback?C.muted:C.coral,1,flyback?C.muted:C.coral);
  u.text('steady forward sweep',1265,643,32,C.coral,'center');
  u.text('rapid return: beam blanked',1265,683,32,C.muted,'center',u.reveal(blankStart));
  u.text(flyback?'beam OFF for flyback':'beam ON for the sweep',1265,735,34,flyback?C.muted:C.mint,'center',u.reveal(begin));
 });
 const noteStart=u.at('Our drawn beam path',.83),last=u.reveal(noteStart);
 u.text('The phosphor emits light, then its afterglow fades.',800,798,36,C.ink,'center',u.reveal(phosphor)*(1-last),1430);
 u.text('The beam path is an illustration. The light appears at the screen.',800,798,36,C.ink,'center',last,1430);
}

function trigger(ctx,t,scene){
 const u=style(ctx,t,scene),{C}=u;
 u.header('The secret of a steady picture.','Wait for the same event, then start the next sweep.');
 const levelStart=u.at('selected voltage',.22),lockStart=u.at('Each sweep',.39),heightStart=u.at('Height tells us voltage',.64),finish=u.at('An electron gun',.78);
 const locked=u.reveal(lockStart,1.2),level=u.reveal(levelStart),axes=u.reveal(heightStart),last=u.reveal(finish);
 const lx=126,rx=878,y=342,w=594,h=291,cy=y+h/2,amp=99,threshold=cy-.35*amp,phase0=Math.asin(.35);
 const period=5.2,sweepTime=4.7,phaseAdvance=.76;
 const path=(x,phase,end=1)=>curve(p=>[x+20+p*end*(w-40),cy-amp*Math.sin(phase+p*end*Math.PI*3.15)],140);
 u.group(u.reveal(.9,1),()=>{
  u.text('without a stable trigger',lx+w/2,289,39,C.ink,'center');
  u.text('wait for a rising crossing',rx+w/2,289,39,C.ink,'center');
  u.grid(lx,y,w,h);u.grid(rx,y,w,h);
  // Each emitted trace has a phase fixed at its own sweep start. Older
  // phosphor impacts stay put and fade according to their actual impact age.
  // Only the next sweep shifts phase: already-lit points never slide.
  function history(x,epoch,stopTime,phaseForCycle,alpha=1,drawHead=true){
   if(stopTime<epoch||alpha<=0)return;
   const cycle=Math.floor((stopTime-epoch)/period);
   for(let k=Math.max(0,cycle-3);k<=cycle;k++){
    const start=epoch+k*period,end=u.clamp((stopTime-start)/sweepTime);
    if(end<=0)continue;
    const fixedPhase=phaseForCycle(k),points=path(x,fixedPhase,end);
    // One smooth gradient stroke avoids seams from alpha-blended segments.
    const glow=ctx.createLinearGradient(points[0][0],0,points.at(-1)[0],0);
    for(let j=0;j<=24;j++){
     const position=j/24*end,age=Math.max(0,t-(start+position*sweepTime));
     glow.addColorStop(j/24,`rgba(48,140,125,${alpha*Math.exp(-age/4.0)})`);
    }
    u.line(points,glow,3.8);
   }
   const inCycle=mod(stopTime-epoch,period);
   if(drawHead&&inCycle<sweepTime){
    const end=inCycle/sweepTime;
    u.glow(...path(x,phaseForCycle(cycle),end).at(-1),4.7,alpha);
   }
  }
  history(lx,0,t,k=>k*phaseAdvance);
  // On the exact 'Each sweep' cue a new sweep starts at the chosen crossing.
  // The unfinished old sweep is frozen at its real stopping point and fades;
  // all new sweeps start at phase0 and build from left to right in the same place.
  const hasLocked=t>=lockStart;
  if(hasLocked){
   history(rx,0,lockStart,k=>phase0+k*phaseAdvance,1-locked,false);
   history(rx,lockStart,t,()=>phase0);
  }else{
   history(rx,0,t,k=>phase0+k*phaseAdvance);
  }
  u.group(level,()=>{
   dashed(u,[[rx+12,threshold],[rx+w-12,threshold]],C.coral,1.8,11);
   u.text('chosen level',1451,326,30,C.coral,'right');
   u.arrow([[1451,333],[1451,threshold-10]],C.coral,1.8);
   u.ellipse(rx+20,threshold,10+1.5*Math.sin(t*2),10+1.5*Math.sin(t*2),C.coral,2.1,C.paper);
   u.arrow([[rx+20,threshold+60],[rx+20,threshold+15]],C.coral,2.6);
  });
  u.text('different starts, a wandering picture',lx+w/2,703,33,C.muted,'center');
  u.text('same crossing, same start',rx+w/2,703,35,C.coral,'center',locked*(1-axes));
  u.group(axes,()=>{
   u.arrow([[837,611],[837,361]],C.mint,2.4);
   ctx.save();ctx.translate(800,489);ctx.rotate(-Math.PI/2);u.text('voltage',0,0,33,C.mint,'center');ctx.restore();
   u.arrow([[901,678],[1445,678]],C.coral,2.4);
   u.text('time',1175,719,35,C.coral,'center');
  });
 });
 u.text('A rising threshold crossing gives every sweep the same beginning.',800,798,36,C.ink,'center',level*(1-last),1420);
 u.text('An electron gun. Some careful steering. Rather lovely handwriting.',800,798,38,C.ink,'center',last,1420);
}

module.exports={6:steering,7:sweep,8:trigger};
