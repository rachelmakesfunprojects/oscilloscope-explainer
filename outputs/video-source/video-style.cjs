/* Shared procedural drawing primitives for the Caveat oscilloscope film. */
const path=require('path');
// Install the declared dependency in this directory: npm install
const lib=require('@napi-rs/canvas');
lib.GlobalFonts.registerFromPath(path.join(__dirname,'../font-assets/caveat/Caveat[wght].ttf'),'Caveat');
const C={bg:'#fdfcf8',paper:'#fffefa',ink:'#252d36',muted:'#757b82',coral:'#e26a53',mint:'#308c7d',soft:'#d0e9da',pale:'#e9eee8'};
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
const lerp=(a,b,p)=>a+(b-a)*p;
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
function sample(points,p){
 const lengths=points.slice(1).map((b,i)=>Math.hypot(b[0]-points[i][0],b[1]-points[i][1]));
 let d=clamp(p)*lengths.reduce((a,b)=>a+b,0);
 for(let i=0;i<lengths.length;i++){if(d<=lengths[i]){const q=lengths[i]?d/lengths[i]:0;return [lerp(points[i][0],points[i+1][0],q),lerp(points[i][1],points[i+1][1],q)];}d-=lengths[i];}
 return points.at(-1);
}
function style(ctx,t,scene={duration:20,words:[]}){
 const at=(phrase,fallback=.3)=>{
  const needle=phrase.split(/\s+/).map(norm).filter(Boolean),words=scene.words||[];
  for(let i=0;i<=words.length-needle.length;i++)if(needle.every((v,j)=>norm(words[i+j].word)===v))return words[i].start;
  return scene.duration*fallback;
 };
 const reveal=(start,d=.7)=>ease((t-start)/d);
 function group(alpha,fn){if(alpha<=0)return;ctx.save();ctx.globalAlpha*=clamp(alpha);fn();ctx.restore();}
 function text(s,x,y,size=32,color=C.ink,align='left',alpha=1,maxWidth){
  if(alpha<=0)return;ctx.save();ctx.globalAlpha*=clamp(alpha);ctx.fillStyle=color;ctx.textAlign=align;
  ctx.font=`500 ${size}px Caveat`;if(maxWidth){while(ctx.measureText(s).width>maxWidth&&size>16){size-=.5;ctx.font=`500 ${size}px Caveat`;}}
  ctx.fillText(s,x,y);ctx.restore();
 }
 function line(points,color=C.ink,width=3,progress=1){
  progress=clamp(progress);if(!progress)return;
  const lengths=points.slice(1).map((b,i)=>Math.hypot(b[0]-points[i][0],b[1]-points[i][1]));
  let budget=lengths.reduce((a,b)=>a+b,0)*progress;
  ctx.save();ctx.beginPath();ctx.moveTo(...points[0]);
  for(let i=0;i<lengths.length;i++){if(budget>=lengths[i]){ctx.lineTo(...points[i+1]);budget-=lengths[i];}else{const q=lengths[i]?budget/lengths[i]:0;ctx.lineTo(lerp(points[i][0],points[i+1][0],q),lerp(points[i][1],points[i+1][1],q));break;}}
  ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();ctx.restore();
 }
 function arrow(points,color=C.coral,width=2.5,progress=1){line(points,color,width,progress);if(progress<.98)return;const [a,b]=points.slice(-2),ang=Math.atan2(b[1]-a[1],b[0]-a[0]),r=12;line([[b[0]-r*Math.cos(ang-.43),b[1]-r*Math.sin(ang-.43)],b,[b[0]-r*Math.cos(ang+.43),b[1]-r*Math.sin(ang+.43)]],color,width);}
 function box(x,y,w,h,fill=C.paper,color=C.ink,width=3,p=1){group(p,()=>{if(fill){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);}line([[x,y],[x+w,y+.8],[x+w-.8,y+h],[x+.6,y+h-.6],[x,y]],color,width);});}
 function ellipse(x,y,rx,ry,color=C.ink,width=3,fill=null,p=1){group(p,()=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();});}
 function particle(x,y,r=7,alpha=1){group(alpha,()=>{ellipse(x,y,r,r,C.mint,1,C.mint);if(r>=8)line([[x-r*.45,y],[x+r*.45,y]],C.paper,1.5);});}
 function glow(x,y,r=7,alpha=1){group(alpha,()=>{ellipse(x,y,r*3,r*3,C.soft,0,C.soft);ellipse(x,y,r,r,C.mint,0,C.mint);for(let j=0;j<6;j++){const a=j*Math.PI/3;line([[x+Math.cos(a)*r*3.8,y+Math.sin(a)*r*3.8],[x+Math.cos(a)*r*5,y+Math.sin(a)*r*5]],C.mint,1.6);}});}
 function flow(points,time=t,{count=12,speed=.16,r=6,alpha=1}={}){for(let i=0;i<count;i++){const p=((i/count+time*speed)%1+1)%1;particle(...sample(points,p),r,alpha);}}
 function header(title,sub=''){text(title,76,145,76,C.ink,'left',reveal(.15,.8),1450);text(sub,80,195,34,C.muted,'left',reveal(.8,.8),1440);}
 function note(s,color=C.ink,start=0){text(s,800,798,36,color,'center',reveal(start),1430);}
 function grid(x,y,w,h){box(x,y,w,h,C.paper,C.ink,2.6);for(let j=1;j<8;j++)line([[x+w*j/8,y+10],[x+w*j/8,y+h-10]],'#ccd3cd',1);for(let j=1;j<5;j++)line([[x+10,y+h*j/5],[x+w-10,y+h*j/5]],'#ccd3cd',1);}
 function electrode(x,y,w=62,gap=45,height=64,color=C.soft){box(x,y-gap-height,w,height,color);box(x,y+gap,w,height,color);}
 return {ctx,t,scene,C,clamp,ease,lerp,sample,at,reveal,group,text,line,arrow,box,ellipse,particle,glow,flow,header,note,grid,electrode};
}
module.exports={style,C,clamp,ease,lerp,sample,lib};
