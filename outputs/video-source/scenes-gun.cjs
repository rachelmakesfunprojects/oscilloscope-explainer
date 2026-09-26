/* Original procedural electron-gun scenes. All motion is evaluated from time,
   so frames render identically in previews, serial renders, and worker renders. */
const {style}=require('./video-style.cjs');

function softBox(u,x,y,w,h,start,fill=u.C.soft){
  const p=u.reveal(start,.75);
  u.group(p*.8,()=>u.box(x,y,w,h,fill,fill,0));
  u.line([[x,y],[x+w,y+.8],[x+w-.6,y+h],[x,y+h-.5],[x,y]],u.C.ink,3.1,p);
}
function aperture(u,x,y,w,gap,h,start){
  softBox(u,x,y-gap-h,w,h,start);
  softBox(u,x,y+gap,w,h,start+.12);
}
function cathodePlate(u,x,y,start){
  softBox(u,x,y-76,25,152,start);
  u.line([[x+31,y-65],[x+31,y+65]],u.C.coral,7,u.reveal(start+.25));
}
function curved(u,points,color,width=2,p=1){
  const [a,b,c,d]=points,poly=[];
  for(let i=0;i<=50;i++){
    const q=i/50,r=1-q;
    poly.push([r*r*r*a[0]+3*r*r*q*b[0]+3*r*q*q*c[0]+q*q*q*d[0],r*r*r*a[1]+3*r*r*q*b[1]+3*r*q*q*c[1]+q*q*q*d[1]]);
  }
  u.line(poly,color,width,p);
}

function heaterScene(ctx,t,scene){
  const u=style(ctx,t,scene),{C}=u;
  const heater=u.at('the heater',.025),coat=u.at('coated cathode',.14);
  const roles=u.at('indirectly heated',.19),emit=u.at('Heat gives',.36);
  const term=u.at('thermionic emission',.48),existing=u.at('already in the material',.54);
  const supply=u.at('Electrons arriving',.65),vacuum=u.at('vacuum',.86);
  u.header('First, persuade a few electrons.','A separate heater warms an electron-emitting coating.');

  // The sleeve and heater have separate electrical paths.
  const outline=[[292,359],[529,359],[529,593],[292,593]];
  u.line(outline,C.ink,4,u.reveal(1.1,1.05));
  const wire=[[116,425],[315,425],[330,450],[344,414],[359,511],[374,417],[390,513],[406,419],[422,512],[438,421],[454,511],[470,450],[470,558],[116,558]];
  u.line(wire,C.coral,4,u.reveal(heater,.95));
  const warm=u.reveal(heater+.8,3.4);
  u.group(warm,()=>{
    u.line([[539,368],[539,584]],C.coral,11);
    // Rising heat marks are deliberately slow and never flash.
    for(let j=0;j<4;j++){
      const phase=((t-heater)*.24+j*.24)%1;
      const y=424-phase*56,x=345+j*37;
      const a=Math.sin(phase*Math.PI)*.55;
      u.group(a,()=>curved(u,[[x,y],[x-10,y-9],[x+10,y-17],[x,y-28]],C.coral,1.9));
    }
  });
  u.text('heater',153,315,39,C.coral,'left',u.reveal(heater+.5));
  u.arrow([[219,330],[327,402]],C.coral,2.4,u.reveal(heater+.8));
  u.text('coated cathode',431,289,39,C.ink,'left',u.reveal(coat),340);
  u.arrow([[548,306],[540,350]],C.ink,2.4,u.reveal(coat+.25));
  u.text('two heater leads',120,626,30,C.muted,'left',u.reveal(roles),250);

  // Thermal emission: particles leave the coating in a spread of directions.
  // Unlike the acceleration scene, these paths have no increasing forward speed.
  if(t>emit){
    const life=4.8,step=.35,last=Math.floor((t-emit)/step);
    for(let i=Math.max(0,last-16);i<=last;i++){
      const age=t-emit-i*step,p=age/life;
      if(p<0||p>1)continue;
      const seed=((i*73)%101)/100;
      const y0=405+seed*130;
      const x=549+p*(440+seed*80),y=y0+Math.sin(i*2.4)*p*80;
      const a=u.clamp(age/.22)*u.clamp((1-p)/.15);
      u.particle(x,y,8.5,a);
    }
  }
  const right=1125;
  u.text('thermionic',right,369,47,C.mint,'left',u.reveal(term),350);
  u.text('emission',right,415,47,C.mint,'left',u.reveal(term+.12),350);
  u.text('Heat frees electrons',right,478,32,C.ink,'left',u.reveal(emit+.5),350);
  u.text('already in the coating.',right,511,32,C.ink,'left',u.reveal(existing),350);

  // Replenishment travels along a separate lead connected to the cathode sleeve.
  const returnPath=[[279,685],[401,685],[401,593]];
  u.group(u.reveal(supply),()=>{
    softBox(u,89,650,190,69,supply,C.paper);
    u.text('power supply',184,694,34,C.ink,'center',1,170);
    u.line(returnPath,C.mint,2.5,u.reveal(supply+.3,.8));
    if(t>supply+.9)u.flow(returnPath,t-supply,{count:3,speed:.3,r:6,alpha:.9});
    u.text('replacement electrons',415,685,30,C.mint,'left',u.reveal(supply+.7),330);
  });
  u.group(u.reveal(vacuum),()=>{
    // A light glass envelope appears around the main emitting region.
    u.line([[276,337],[281,317],[1401,317],[1445,353],[1445,568],[1401,616],[565,616]],'#b9c7bd',1.6,u.reveal(vacuum,1.3));
    u.text('vacuum',1227,680,39,C.mint,'center',1);
    u.text('very few gas collisions',1227,717,29,C.muted,'center',1,355);
    u.arrow([[1240,646],[1300,610]],C.muted,1.8,u.reveal(vacuum+.5));
  });
  if(t<supply)u.note(t<existing?'The heater supplies warmth; the cathode supplies electrons.':'The heat adds energy. The electrons already exist.',C.ink,roles);
  else u.note('The supply replaces the electrons carried away by the beam.',C.ink,supply);
}

function gridScene(ctx,t,scene){
  const u=style(ctx,t,scene),{C}=u;
  const negative=u.at('negative relative',.18),field=u.at('electric field',.25);
  const less=u.at('Make it less negative',.38),more=u.at('Make it more negative',.55);
  const cutoff=u.at('At cutoff',.65),fixed=u.at('Nothing has to slide shut',.72);
  const blank=u.at('blank the beam',.83);
  u.header('A gatekeeper, with no moving parts.','The control grid regulates the number of electrons in the beam.');
  const gate=q=>{
    if(q<less)return .34;
    if(q<more)return u.lerp(.34,1,u.ease((q-less)/1));
    if(q<cutoff)return u.lerp(1,.15,u.ease((q-more)/1));
    if(q<blank)return u.lerp(.15,0,u.ease((q-cutoff)/.6));
    const phase=(q-blank)%5.2;
    return phase<3.2?u.ease(phase/.45):1-u.ease((phase-3.2)/.45);
  };
  cathodePlate(u,330,472,1.1);
  aperture(u,657,472,85,54,68,u.at('control grid',.03));
  u.line([[1285,323],[1285,618]],C.ink,3,u.reveal(1.8,.9));
  u.text('cathode',348,304,35,C.muted,'center',u.reveal(1.5));
  u.text('control grid',701,280,38,C.ink,'center',u.reveal(1.1));
  u.text('phosphor screen',1285,288,35,C.muted,'center',u.reveal(1.8),300);
  u.text('negative relative to the cathode',817,347,34,C.coral,'center',u.reveal(negative),650);
  u.group(u.reveal(negative),()=>{
    u.line([[682,382],[717,382]],C.coral,3);
    u.line([[682,559],[717,559]],C.coral,3);
  });
  u.group(u.reveal(field),()=>{
    // Curves suggest the electric barrier, never a physically moving shutter.
    for(let k=0;k<3;k++){
      const x=618-k*19,offset=Math.sin(t*.8+k)*2;
      u.group((1-gate(t))*.26+.09,()=>curved(u,[[x+offset,406],[x-30,449],[x-30,496],[x+offset,540]],C.coral,1.6));
    }
  });
  u.group(u.reveal(1.8),()=>u.line([[363,472],[1284,472]],C.soft,3));

  // Gate decisions happen when each electron reaches the grid. Previously
  // transmitted particles continue on their way even after cutoff is applied.
  const birthStart=1.6,interval=.225,v=230,travel=(657-368)/v;
  const last=Math.floor((t-birthStart)/interval);
  for(let i=Math.max(0,last-23);i<=last;i++){
    const born=birthStart+i*interval,age=t-born,passTime=born+travel;
    if(age<0)continue;
    const fraction=((i*7)%17)/17,passed=fraction<gate(passTime);
    if(age<=travel||passed){
      const x=368+v*age;
      if(x<=1285)u.particle(x,472,7.3,u.clamp(age/.16));
    }else{
      const back=age-travel;
      if(back<.7)u.particle(650-back*145,472+Math.sin(back*Math.PI/.7)*16,6.5,.65*(1-back/.7));
    }
  }
  const intensity=gate(Math.max(0,t-(1285-657)/v));
  if(t>birthStart+(1285-368)/v)u.glow(1285,472,4+intensity*7,intensity);
  const bias=gate(t);
  // The spot responds when the already-travelling electrons reach the screen.
  // Its label follows that delayed brightness, not the instantaneous grid bias.
  let state=intensity>.6?'brighter':intensity>.03?'dim':'dark';
  u.text(state,1371,482,39,intensity>.03?C.mint:C.muted,'left',u.reveal(negative),170);
  if(t>=cutoff&&t<blank)u.text('cut off',701,319,31,C.coral,'center',u.reveal(cutoff,.3));
  else if(t>=blank)u.text(bias>.5?'beam on':'blanking',701,319,31,bias>.5?C.mint:C.coral,'center',u.reveal(blank,.3));

  // A bias slider makes the variation visible while the aperture stays fixed.
  u.group(u.reveal(less-.5),()=>{
    u.text('grid bias',300,665,35,C.ink,'center',1);
    u.line([[459,655],[1070,655]],C.muted,2.4);
    u.ellipse(u.lerp(463,1066,bias),655,12,12,C.coral,2,C.coral);
    u.text('more negative',456,703,30,C.coral,'left',1);
    u.text('less negative',1069,703,30,C.coral,'right',1);
  });
  u.text('same physical opening',951,593,29,C.muted,'center',u.reveal(fixed),330);
  u.arrow([[811,568],[756,518]],C.muted,1.7,u.reveal(fixed+.25));
  if(t<fixed)u.note('An electric field controls how many electrons pass through.',C.ink,field);
  else if(t<blank)u.note('The opening stays put. Nothing has to slide shut.',C.ink,fixed);
  else u.note('The grid can blank the beam between sweeps.',C.ink,blank);
}

function accelerationScene(ctx,t,scene){
  const u=style(ctx,t,scene),{C}=u;
  const anodes=u.at('called anodes',.1),positive=u.at('more positive',.17);
  const motion=u.at('forward speed',.3),relative=u.at('relative to the cathode',.49);
  const ground=u.at('relative to ground',.63),power=u.at('power supply',.70);
  const final=u.at('heater releases',.79);
  u.header('Now give them some speed.','Voltage differences give the electrons kinetic energy.');
  cathodePlate(u,220,471,1);
  u.text('cathode',236,299,37,C.coral,'center',u.reveal(1.2));
  aperture(u,610,471,82,64,70,anodes);
  aperture(u,950,471,82,64,70,anodes+.4);
  u.text('accelerating anodes',822,272,40,C.ink,'center',u.reveal(anodes));
  u.arrow([[717,291],[651,324]],C.ink,2.2,u.reveal(anodes+.4));
  u.arrow([[913,290],[990,324]],C.ink,2.2,u.reveal(anodes+.6));
  u.group(u.reveal(positive),()=>{
    for(const y of [380,580]){
      u.text('+500 V',651,y,29,C.coral,'center',1,76);
      u.text('+1000 V',991,y,27,C.coral,'center',1,76);
    }
  });
  u.line([[253,471],[1430,471]],C.soft,4,u.reveal(1.7,1));
  const start=Math.min(motion,positive+1.4),v0=76,a=100,d1=396,d2=340;
  const q1=(Math.sqrt(v0*v0+2*a*d1)-v0)/a,v1=v0+a*q1;
  const a2=112,q2=(Math.sqrt(v1*v1+2*a2*d2)-v1)/a2,v2=v1+a2*q2;
  const position=age=>{
    if(age<q1)return 254+v0*age+.5*a*age*age;
    age-=q1;
    if(age<q2)return 650+v1*age+.5*a2*age*age;
    return 990+v2*(age-q2);
  };
  const interval=.4,last=Math.floor((t-start)/interval);
  for(let i=Math.max(0,last-15);i<=last;i++){
    const age=t-start-i*interval,x=position(age);
    if(age>=0&&x<=1430)u.particle(x,471,8,u.clamp(age/.15)*u.clamp((1430-x)/35));
  }
  u.group(u.reveal(motion),()=>{
    for(const [x,w,label] of [[328,44,'speed'],[746,91,'more speed'],[1175,145,'faster still']]){
      u.arrow([[x,426],[x+w,426]],C.mint,2.8);
      u.text(label,x,401,33,C.mint,'left',1,210);
    }
  });
  u.text('Illustrative voltages, measured from the cathode.',805,641,32,C.muted,'center',u.reveal(positive+.7),1260);
  u.group(u.reveal(relative),()=>{
    u.text('our 0 V reference',236,623,31,C.coral,'center',1,275);
    u.arrow([[239,592],[239,560]],C.coral,2,u.reveal(relative+.3));
  });
  u.group(u.reveal(power),()=>{
    u.text('electrical energy',499,718,41,C.coral,'center',1,390);
    u.arrow([[727,703],[874,703]],C.ink,2.6,u.reveal(power+.3));
    u.text('kinetic energy',1103,718,41,C.mint,'center',u.reveal(power+.5),380);
  });
  if(t<ground)u.note('Increasing potential gives each electron more energy.',C.ink,motion);
  else if(t<final)u.note('Positive relative to the cathode — not necessarily to ground.',C.ink,ground);
  else u.note('Heat releases them; voltage differences accelerate them.',C.ink,final);
}

module.exports={2:heaterScene,3:gridScene,4:accelerationScene};
