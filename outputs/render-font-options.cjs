/* Original code-drawn typography comparison.
   Run with Node.js + @napi-rs/canvas. Downloaded Google Fonts and their
   unmodified OFL licences are kept alongside this file in font-assets/.
   All diagram strokes and the entire layout are procedural geometry. */
const fs=require('fs'),path=require('path');
// Install dependency in this directory: npm install @napi-rs/canvas
const canvas=require('@napi-rs/canvas');
const {createCanvas,GlobalFonts}=canvas;
GlobalFonts.registerFromPath('/System/Library/Fonts/Avenir Next.ttc','Neutral');
const fonts=[
 {id:'caveat',name:'Caveat',file:'Caveat[wght].ttf',tag:'EXPRESSIVE TITLE',weight:500},
 {id:'patrickhand',name:'Patrick Hand',file:'PatrickHand-Regular.ttf',tag:'CLEAR LABELS',weight:400},
 {id:'kalam',name:'Kalam',file:'Kalam-Regular.ttf',tag:'WARM + ROUNDED',weight:400},
 {id:'handlee',name:'Handlee',file:'Handlee-Regular.ttf',tag:'LIGHT + AIRY',weight:400},
 {id:'architectsdaughter',name:'Architects Daughter',file:'ArchitectsDaughter-Regular.ttf',tag:'NEAT SKETCHBOOK',weight:400},
 {id:'indieflower',name:'Indie Flower',file:'IndieFlower-Regular.ttf',tag:'LOOSE + PLAYFUL',weight:400}
];
for(const f of fonts){const p=path.join(__dirname,'font-assets',f.id,f.file);if(!fs.existsSync(p))throw new Error('Missing font: '+p);GlobalFonts.registerFromPath(p,f.name);}
const C={bg:'#fdfcf8',card:'#fffefa',ink:'#252d36',muted:'#757b82',coral:'#e26a53',mint:'#308c7d',soft:'#d0e9da',border:'#dedfd7'};
let ctx;
function text(s,x,y,size,font='Neutral',color=C.ink,align='left',weight=400){ctx.save();ctx.font=`${weight} ${size}px "${font}"`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(s,x,y);ctx.restore();}
function fit(s,size,maxWidth,font,weight=400){ctx.font=`${weight} ${size}px "${font}"`;while(ctx.measureText(s).width>maxWidth&&size>14){size-=.25;ctx.font=`${weight} ${size}px "${font}"`;}return size;}
function stroke(points,color=C.ink,width=2){ctx.save();ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();ctx.restore();}
function line(x,y,x2,y2,color=C.ink,width=2){stroke([[x,y],[x2,y2]],color,width);}
function arrow(points,color=C.coral,width=1.6){stroke(points,color,width);const [a,b]=points.slice(-2),angle=Math.atan2(b[1]-a[1],b[0]-a[0]),r=7;stroke([[b[0]-r*Math.cos(angle-.45),b[1]-r*Math.sin(angle-.45)],b,[b[0]-r*Math.cos(angle+.45),b[1]-r*Math.sin(angle+.45)]],color,width);}
function oval(x,y,rx,ry,fill=null,color=C.ink,width=2){ctx.save();ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,2*Math.PI);if(fill){ctx.fillStyle=fill;ctx.fill();}ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();ctx.restore();}
function miniTube(){
 // Same diagram in every panel, to make letterform differences easy to compare.
 stroke([[88,248],[259,248],[320,217],[496,217]],C.ink,2.6);
 stroke([[88,309],[259,309],[320,340],[496,340]],C.ink,2.6);
 stroke([[88,248],[80,259],[78,293],[88,309]],C.ink,2.6);
 oval(496,278,20,61,C.card,C.ink,2.6);oval(496,278,15,54,null,C.muted,.8);
 line(66,268,79,268,C.ink,1.6);line(66,288,79,288,C.ink,1.6);
 stroke([[90,291],[92,271],[99,285],[107,271],[114,287],[121,271]],C.coral,2.1);
 stroke([[124,260],[136,260],[136,296],[124,296]],C.ink,2);
 line(128,266,128,290,C.coral,3);
 for(const [x,w] of [[160,16],[205,31],[259,31]]){
  stroke([[x,257],[x+w,257],[x+w,268],[x,268],[x,257]],C.ink,1.8);
  stroke([[x,289],[x+w,289],[x+w,300],[x,300],[x,289]],C.ink,1.8);
 }
 stroke([[325,249],[365,249],[375,242],[335,242],[325,249]],C.ink,1.7);
 stroke([[325,307],[365,307],[375,300],[335,300],[325,307]],C.ink,1.7);
 stroke([[390,253],[417,245],[417,299],[390,307],[390,253]],C.muted,1.6);
 stroke([[136,279],[304,279],[328,278],[346,275],[365,270],[496,239]],C.mint,3);
 arrow([[424,256],[451,250]],C.mint,2);
 oval(496,239,10,10,C.soft,C.soft,1);oval(496,239,3.8,3.8,C.mint,C.mint,1);
 for(let i=0;i<8;i++){let a=i*Math.PI/4;line(496+Math.cos(a)*14,239+Math.sin(a)*14,496+Math.cos(a)*19,239+Math.sin(a)*19,C.mint,1.3);}
}
function panel(f,i){
 ctx.fillStyle=C.card;ctx.fillRect(0,0,838,450);ctx.strokeStyle=C.border;ctx.lineWidth=1;ctx.strokeRect(.5,.5,837,449);
 oval(33,32,13,13,C.soft,C.soft,1);text(String(i+1),33,38,17,'Neutral',C.ink,'center',500);
 text(f.name,56,39,24,'Neutral',C.ink,'left',600);text(f.tag,809,37,14,'Neutral',C.muted,'right',500);
 const title='Meet the world’s tiniest pencil.';const titleSize=fit(title,54,760,f.name,f.weight);
 text(title,34,108,titleSize,f.name,C.ink,'left',f.weight);
 stroke([[363,121],[464,122],[551,119],[637,120]],C.coral,3.5);
 text('No lead. Just electrons.',38,159,32,f.name,C.muted,'left',f.weight);
 miniTube();
 text('heated cathode',49,205,27,f.name,C.coral,'left',f.weight);arrow([[151,213],[128,236],[129,255]],C.coral);
 text('focus + accelerate',262,372,27,f.name,C.ink,'center',f.weight);arrow([[262,345],[239,321],[231,304]],C.ink);
 text('phosphor screen',658,293,27,f.name,C.coral,'center',f.weight);arrow([[628,267],[563,242],[521,239]],C.coral);
 line(33,391,805,391,C.border,1);
 text('signal = up / down',41,428,31,f.name,C.mint,'left',f.weight);
 text('timebase = left / right',429,428,31,f.name,C.coral,'left',f.weight);
}
const sheet=createCanvas(1800,1590);ctx=sheet.getContext('2d');ctx.fillStyle=C.bg;ctx.fillRect(0,0,1800,1590);
text('Smooth handwriting, six ways.',55,59,40,'Neutral',C.ink,'left',600);
text('Same words. Same drawing. B’s whiteboard palette. No chalk texture.',57,94,24,'Neutral',C.muted);
for(let i=0;i<fonts.length;i++){
 ctx.save();ctx.translate(52+(i%2)*858,122+Math.floor(i/2)*476);panel(fonts[i],i);ctx.restore();
}
text('My starting point: Caveat for lively titles; Patrick Hand for detailed labels.',55,1563,24,'Neutral',C.ink);
fs.writeFileSync(path.join(__dirname,'handwritten-font-options.png'),sheet.toBuffer('image/png'));
for(let i=0;i<fonts.length;i++){
 const c=createCanvas(1676,900);ctx=c.getContext('2d');ctx.scale(2,2);panel(fonts[i],i);
 fs.writeFileSync(path.join(__dirname,`font-option-${String(i+1).padStart(2,'0')}-${fonts[i].id}.png`),c.toBuffer('image/png'));
}
console.log('Rendered comparison and six full-size font-option PNGs.');
