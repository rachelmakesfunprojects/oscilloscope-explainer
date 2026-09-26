/* Original procedural style frames. Run: node render-frames.cjs
   Dependency: @napi-rs/canvas (npm install @napi-rs/canvas).
   No photographs, stock artwork, or generated bitmap assets are used.
  Selected storyboard typography uses bundled, OFL-licensed Caveat.
  Historical explorations use local macOS faces. */
const fs = require('fs');
const path = require('path');
const canvasLib = require('@napi-rs/canvas');
const {createCanvas, GlobalFonts, SvgExportFlag, loadImage} = canvasLib;
const fontFiles = {
  Caveat:path.join(__dirname,'font-assets/caveat/Caveat[wght].ttf'),
  Hand:'/System/Library/Fonts/Supplemental/Bradley Hand Bold.ttf',
  Note:'/System/Library/Fonts/Noteworthy.ttc',
  Book:'/System/Library/Fonts/Supplemental/Baskerville.ttc',
  Chalk:'/System/Library/Fonts/Supplemental/Chalkduster.ttf',
  Smooth:'/System/Library/Fonts/Supplemental/Chalkboard.ttc',
  Mono:'/System/Library/Fonts/Menlo.ttc',
  Sans:'/System/Library/Fonts/Avenir Next.ttc'
};
for (const [name,file] of Object.entries(fontFiles)) if (fs.existsSync(file)) GlobalFonts.registerFromPath(file,name);
const W=1600,H=900;
let ctx, theme, seed;
function random(){ seed=(seed*1664525+1013904223)>>>0; return seed/4294967296; }
function jitter(n=1){return (random()-.5)*n*2;}
const themes = [
 {id:'a-notebook',name:'THE INVENTOR’S NOTEBOOK',bg:'#f6efdf',ink:'#29332e',muted:'#797d6b',accent:'#ca6737',beam:'#b97a1f',soft:'#ead5ad',paper:'#faf5e9',font:'Hand',rough:1.0,line:2.6},
 {id:'b-whiteboard',name:'THE WHITEBOARD DOODLE',bg:'#fdfcf8',ink:'#252d36',muted:'#757b82',accent:'#e26a53',beam:'#308c7d',soft:'#d0e9da',paper:'#fffefa',font:'Hand',rough:2.1,line:4.0},
 {id:'c-chalkboard',name:'THE CHALKBOARD LECTURE',bg:'#183a35',ink:'#edf0d9',muted:'#a8bcb0',accent:'#f1c77c',beam:'#b0e6a0',soft:'#29574b',paper:'#20443c',font:'Chalk',rough:1.0,line:2.5},
 {id:'d-engraving',name:'THE VINTAGE ENGRAVING',bg:'#f4f0e5',ink:'#2b3635',muted:'#6a7975',accent:'#286e68',beam:'#307e73',soft:'#dbe3d6',paper:'#f6f2e9',font:'Book',rough:.35,line:1.7}
];
function stroke(points,color=theme.ink,width=theme.line,rough=theme.rough,close=false,fill=null){
 const draw=(delta,alpha)=>{ctx.save();ctx.globalAlpha*=alpha;ctx.beginPath();points.forEach(([x,y],i)=>{const a=x+jitter(delta),b=y+jitter(delta);i?ctx.lineTo(a,b):ctx.moveTo(a,b);});if(close)ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}ctx.lineWidth=width;ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle=color;ctx.stroke();ctx.restore();};
 draw(rough,1);
 if(rough>1.5)draw(rough*.8,.23);
}
function line(x1,y1,x2,y2,color=theme.ink,width=theme.line,rough=theme.rough){
 const n=Math.max(2,Math.ceil(Math.hypot(x2-x1,y2-y1)/34));
 const p=Array.from({length:n+1},(_,i)=>[x1+(x2-x1)*i/n,y1+(y2-y1)*i/n]);stroke(p,color,width,rough);
}
function rect(x,y,w,h,fill=null,color=theme.ink,width=theme.line){stroke([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],color,width,theme.rough,true,fill);}
function ellipse(x,y,rx,ry,color=theme.ink,width=theme.line,fill=null){const p=Array.from({length:81},(_,i)=>[x+rx*Math.cos(i/80*Math.PI*2),y+ry*Math.sin(i/80*Math.PI*2)]);stroke(p,color,width,theme.rough*.45,true,fill);}
function bez(points,color=theme.ink,width=theme.line){const [a,b,c,d]=points,p=[];for(let i=0;i<=50;i++){let t=i/50,s=1-t;p.push([s*s*s*a[0]+3*s*s*t*b[0]+3*s*t*t*c[0]+t*t*t*d[0],s*s*s*a[1]+3*s*s*t*b[1]+3*s*t*t*c[1]+t*t*t*d[1]]);}stroke(p,color,width,theme.rough*.45);}
function text(s,x,y,size=28,font=theme.font,color=theme.ink,align='left',angle=0){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.font=`${font==='Caveat'?'500 ':''}${size}px "${font}", ${font==='Book'?'serif':'sans-serif'}`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(s,0,0);ctx.restore();}
function arrow(points,color=theme.ink,width=2){stroke(points,color,width,.7);const [a,b]=points.slice(-2),angle=Math.atan2(b[1]-a[1],b[0]-a[0]);const s=10;line(b[0],b[1],b[0]-s*Math.cos(angle-.45),b[1]-s*Math.sin(angle-.45),color,width,.4);line(b[0],b[1],b[0]-s*Math.cos(angle+.45),b[1]-s*Math.sin(angle+.45),color,width,.4);}
function hatch(x,y,w,h,space=9,color=theme.muted){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();for(let a=-h;a<w+h;a+=space)line(x+a,y+h,x+a+h,y,color,.7,.6);ctx.restore();}
function spark(x,y,r=16,color=theme.beam){for(let i=0;i<8;i++){const a=i*Math.PI/4;line(x+Math.cos(a)*r,y+Math.sin(a)*r,x+Math.cos(a)*(r+9),y+Math.sin(a)*(r+9),color,2,.4);}}
function background(){
 ctx.fillStyle=theme.bg;ctx.fillRect(0,0,W,H);
 // Seeded dots and short fibres are code geometry, not scanned textures.
 for(let i=0;i<4200;i++){ctx.fillStyle=(theme.id==='c-chalkboard')?'rgba(235,240,217,.035)':'rgba(81,66,42,.025)';ctx.fillRect(random()*W,random()*H,random()*1.7+.4,random()*1.0+.4);}
 if(theme.id==='a-notebook'){for(let y=240;y<820;y+=40)line(48,y,1552,y,'#b9c6b3',.5,0);line(121,220,121,810,'#d6afa0',1,0);}
 if(theme.id==='c-chalkboard'){for(let i=0;i<80;i++){ctx.globalAlpha=.015;ellipse(random()*W,random()*H,30+random()*130,3+random()*9,theme.ink,8);ctx.globalAlpha=1;}}
}
function header(letter,tag){text(letter,74,65,22,'Mono',theme.accent);text(theme.name,118,65,19,'Mono',theme.muted);text(tag,1522,65,18,'Mono',theme.muted,'right');}
function footer(n){line(74,840,1526,840,theme.muted,.9,0);text('VOLTAGE, MADE VISIBLE',74,873,16,'Mono',theme.muted);text('ORIGINAL CODE DRAWING  /  SCHEMATIC, NOT TO SCALE',800,873,13,'Mono',theme.muted,'center');text(n+' / 04',1526,873,16,'Mono',theme.muted,'right');}
function tube(x,y,s,engrave=false){
 ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 // Glass envelope in oblique cutaway. The face is a phosphor-coated ellipse.
 const body=[[0,-69],[315,-69],[382,-76],[442,-112],[510,-151],[680,-207],[879,-207]];
 stroke(body,theme.ink,theme.line,theme.rough);stroke(body.map(([a,b])=>[a,-b]),theme.ink,theme.line,theme.rough);
 bez([[0,-69],[-25,-72],[-27,68],[0,69]]);
 ellipse(879,0,65,207,theme.ink,theme.line,theme.paper);
 ellipse(876,0,52,192,theme.muted,1.2);
 // Far glass edge and a light reflection accent.
 stroke([[17,-79],[318,-79],[379,-88],[502,-160],[680,-218],[870,-218]],theme.muted,.8,.5);
 bez([[704,-184],[730,-190],[785,-192],[810,-189]],theme.muted,1.2);
 if(engrave){for(let i=0;i<15;i++)line(496+i*24,153+i*.25,514+i*24,170+i*.25,theme.muted,.8,.2);hatch(16,52,318,11,7);}
 // Rear electrical connections and heater/cathode.
 for(const yy of [-30,-10,12,33])line(-47,yy,-12,yy,theme.ink,1.8);
 stroke([[13,27],[13,9],[23,-13],[33,13],[43,-13],[53,13],[63,-10],[63,28]],theme.accent,2.9,.7);
 stroke([[67,-30],[87,-30],[87,30],[67,30]],theme.ink,3,theme.rough);
 line(73,-23,73,23,theme.accent,4,.3);
 // Control grid: opening in the middle of a negatively biased electrode.
 rect(111,-47,21,32,theme.soft);rect(111,15,21,32,theme.soft);
 // Focusing/accelerating electrodes, central apertures remain visible.
 for(const [xx,ww,hh] of [[164,42,43],[233,51,47]]){
   rect(xx,-hh,ww,hh-13,theme.paper);rect(xx,13,ww,hh-13,theme.paper);
   if(engrave){hatch(xx,-hh,ww,hh-13,5);hatch(xx,13,ww,hh-13,5);}
 }
 // Two orthogonal deflection pairs, separated for diagram readability.
 stroke([[345,-57],[433,-57],[452,-76],[364,-76]],theme.ink,2,theme.rough,true,theme.soft);
 stroke([[345,57],[433,57],[452,38],[364,38]],theme.ink,2,theme.rough,true,theme.soft);
 stroke([[492,-52],[554,-70],[554,39],[492,57]],theme.muted,1.7,theme.rough,true,theme.paper);
 text('Y',395,-93,21,'Mono',theme.accent,'center');
 text('X',555,-92,21,'Mono',theme.accent,'center');
 // Instantaneous beam trajectory: local bend, then straight to one screen spot.
 const p=[[88,0],[285,0],[343,0],[365,-2],[389,-6],[418,-14],[451,-25],[879,-126]];
 ctx.save();ctx.globalAlpha=.13;stroke(p,theme.beam,13,0);ctx.restore();stroke(p,theme.beam,3.2,0);
 for(const [px,py] of [[98,0],[144,0],[213,0],[297,0],[357,-1],[402,-10],[485,-33],[599,-60],[734,-92]])ellipse(px,py,2.2,2.2,theme.beam,1,theme.beam);
 arrow([[603,-61],[659,-74]],theme.beam,2.5);
 stroke([[524,-42],[584,-60],[584,48],[524,66]],theme.ink,2,theme.rough,true,null);
 // A visible spot is emitted at the phosphor screen.
 ctx.save();ctx.globalAlpha=.18;ellipse(879,-126,19,19,theme.beam,1,theme.beam);ctx.restore();ellipse(879,-126,6.5,6.5,theme.beam,2,theme.beam);spark(879,-126,14);
 // Bracket makes the electron gun assembly a clear unit.
 stroke([[1,97],[1,107],[287,107],[287,97]],theme.muted,1.2,.5);
 text('electron gun',144,137,theme.font==='Caveat'?30:25,theme.font,theme.muted,'center');
 ctx.restore();
}
function screen(x,y,w,h,caption=true){
 rect(x,y,w,h,theme.paper,theme.ink,2.3);
 for(let i=1;i<8;i++)line(x+w*i/8,y+12,x+w*i/8,y+h-12,theme.muted,.55,.1);
 for(let i=1;i<5;i++)line(x+12,y+h*i/5,x+w-12,y+h*i/5,theme.muted,.55,.1);
 let p=[];for(let i=0;i<=150;i++){let t=i/150;p.push([x+16+t*(w-32),y+h/2-Math.sin(t*Math.PI*2.5)*h*.3]);}
 stroke(p,theme.beam,3,0);ellipse(...p.at(-1),4.5,4.5,theme.beam,1,theme.beam);
 if(caption)text('front view: the trace',x+w/2,y+h+31,theme.font==='Caveat'?27:22,theme.font,theme.muted,'center');
}
function notebook(){
 header('A','INK + AMBER / 16:9');
 text('A rather brilliant little dot.',76,163,66,'Book');
 text('An electron gun. A glass tube. A small act of illumination.',79,207,27,'Hand',theme.muted);
 tube(205,484,1.10);
 text('heated cathode',178,302,28,'Hand',theme.accent,'left',-.04);arrow([[275,316],[286,362],[286,441]],theme.accent);
 text('focus + accelerate',398,712,29,'Hand',theme.ink,'center',-.025);arrow([[428,678],[430,617],[446,539]]);
 text('two pairs of steering plates',672,270,29,'Hand',theme.ink,'center',-.025);arrow([[706,285],[706,347],[720,388]]);
 text('phosphor',1280,552,31,'Hand',theme.accent,'left',-.045);text('screen',1282,589,31,'Hand',theme.accent,'left',-.045);arrow([[1303,524],[1270,486],[1235,446]],theme.accent);
 text('light!',1288,322,36,'Hand',theme.accent,'left',.06);arrow([[1272,330],[1215,342]],theme.accent);
 text('The beam path is drawn here so we can follow it.',80,798,26,'Hand',theme.muted);
 footer('01');
}
function whiteboard(){
 header('B','MARKER + COLOUR / 16:9');
 text('Meet the world’s tiniest pencil.',76,168,64,'Hand');
 line(790,192,1450,184,theme.accent,8,2);
 text('No lead. Just electrons.',83,216,27,'Hand',theme.muted);
 tube(140,485,1.04);
 // Numbered doodle badges and short leaders.
 ellipse(111,337,23,23,theme.ink,3,theme.soft);text('1',111,347,26,'Hand',theme.ink,'center');text('MAKE A BEAM',153,346,27,'Hand');arrow([[246,360],[222,416]],theme.accent,3);
 ellipse(585,251,23,23,theme.ink,3,theme.soft);text('2',585,261,26,'Hand',theme.ink,'center');text('GIVE IT A NUDGE',626,261,27,'Hand');arrow([[715,279],[668,362]],theme.accent,3);
 ellipse(1232,283,23,23,theme.ink,3,theme.soft);text('3',1232,293,26,'Hand',theme.ink,'center');text('DRAW!',1275,294,32,'Hand');
 screen(1235,376,260,190);
 arrow([[1123,355],[1185,350],[1243,373]],theme.accent,3);
 text('one moving spot',1358,663,28,'Hand',theme.ink,'center',-.04);text('becomes a line',1358,699,28,'Hand',theme.ink,'center',-.04);
 text('signal = up / down',160,756,31,'Hand',theme.beam);text('timebase = left / right',664,756,31,'Hand',theme.accent);
 footer('02');
}
function chalkboard(){
 header('C','CHALK + PHOSPHOR / 16:9');
 text('A beam. A nudge. A glow.',76,164,58,'Chalk');
 text('Let us make electricity visible.',81,220,29,'Hand',theme.muted);
 tube(148,496,1.05);
 text('warm cathode',111,327,25,'Chalk',theme.accent,'left',-.025);arrow([[245,343],[235,439]],theme.accent);
 text('electric fields steer it',540,280,24,'Chalk',theme.ink,'left',-.015);arrow([[696,299],[691,372]],theme.accent);
 text('electrons',680,536,28,'Hand',theme.beam,'left',-.08);arrow([[766,501],[809,466]],theme.beam);
 text('the screen remembers',1315,286,25,'Hand',theme.ink,'center');text('for a moment...',1315,319,25,'Hand',theme.accent,'center');
 screen(1210,380,290,208);
 text('Y = voltage',1220,675,29,'Hand',theme.accent);text('X = time',1220,713,29,'Hand',theme.accent);
 text('Very small particles. Rather lovely handwriting.',80,792,28,'Hand',theme.muted);
 footer('03');
}
function engraving(){
 header('D','FINE INK + HATCHING / 16:9');
 text('The art of persuading electrons.',800,155,65,'Book',theme.ink,'center');
 text('AN ANATOMY OF THE CATHODE-RAY OSCILLOSCOPE',800,203,20,'Mono',theme.muted,'center');
 line(80,227,1520,227,theme.muted,.9,0);
 tube(231,481,1.17,true);
 // Numbered annotations echo an engraved scientific plate.
 const marks=[[326,361,'1'],[377,358,'2'],[491,351,'3'],[710,302,'4'],[828,281,'5'],[1317,601,'6']];
 for(const [x,y,n] of marks){ellipse(x,y,16,16,theme.accent,1,theme.bg);text(n,x,y+7,20,'Book',theme.accent,'center');}
 line(326,378,321,427,theme.muted,1,.2);line(377,375,374,424,theme.muted,1,.2);line(491,368,491,417,theme.muted,1,.2);line(710,319,693,388,theme.muted,1,.2);line(828,299,855,411,theme.muted,1,.2);line(1317,583,1290,548,theme.muted,1,.2);
 text('Fig. 1',96,401,24,'Book',theme.muted);text('The tube,',96,436,22,'Book',theme.muted);text('laid bare.',96,463,22,'Book',theme.muted);
 text('a point of light',1394,325,25,'Book',theme.accent,'center');arrow([[1328,338],[1282,335]],theme.accent,1.5);
 const labels=[['1','Heated cathode'],['2','Control grid'],['3','Focus / acceleration'],['4','Vertical plates'],['5','Horizontal plates'],['6','Phosphor screen']];
 labels.forEach(([n,label],i)=>{const x=81+i*251; text(n,x,792,25,'Book',theme.accent);text(label,x+26,792,21,'Book',theme.ink);});
 footer('04');
}
const draws=[notebook,whiteboard,chalkboard,engraving];
async function main(){
 for(let i=0;i<themes.length;i++){
  theme=themes[i];
  for(const svg of [false,true]){
   seed=721+i*71;
   const canvas=svg?createCanvas(W,H,SvgExportFlag.ConvertTextToPaths):createCanvas(W,H);
   ctx=canvas.getContext('2d');background();draws[i]();
   fs.writeFileSync(path.join(__dirname,theme.id+(svg?'.svg':'.png')),svg?canvas.getContent():canvas.toBuffer('image/png'));
  }
 }
 const sheet=createCanvas(1648,980),c=sheet.getContext('2d');c.fillStyle='#deddd5';c.fillRect(0,0,1648,980);
 for(let i=0;i<themes.length;i++){const im=await loadImage(path.join(__dirname,themes[i].id+'.png'));c.drawImage(im,24+(i%2)*812,24+Math.floor(i/2)*478,788,443.25);}
 fs.writeFileSync(path.join(__dirname,'style-comparison.png'),sheet.toBuffer('image/png'));
 console.log('Rendered four 1600×900 PNGs, four editable SVGs, and style-comparison.png.');
}
function renderCustomFrame(customTheme, draw, basename) {
 theme=customTheme;
 for(const svg of [false,true]){
  seed=792;
  const canvas=svg?createCanvas(W,H,SvgExportFlag.ConvertTextToPaths):createCanvas(W,H);
  ctx=canvas.getContext('2d');background();draw();
  fs.writeFileSync(path.join(__dirname,basename+(svg?'.svg':'.png')),svg?canvas.getContent():canvas.toBuffer('image/png'));
 }
}
module.exports={renderCustomFrame,themes,text,line,arrow,tube,ellipse,stroke,screen,rect,bez};
if(require.main===module) main().catch(e=>{console.error(e);process.exitCode=1;});
