/* Selected direction: B whiteboard doodle with Caveat throughout.
   Original title/subtitle/content and detailed technical labels retained.
   Font source and OFL licence bundled in font-assets/caveat/.
   Run with Node.js + @napi-rs/canvas, alongside render-frames.cjs. */
const {renderCustomFrame,themes,text,line,arrow,tube,ellipse,screen}=require('./render-frames.cjs');
const t={...themes[1],id:'whiteboard-caveat-v4',font:'Caveat'};
const title=(s,x,y,size=30,color=t.ink,align='left')=>text(s,x,y,size,'Caveat',color,align);
function step(n,label,x){
 ellipse(x,263,21,21,t.ink,2.6,t.soft);
 title(n,x,272,25,t.ink,'center');
 title(label,x+37,272,31);
}
renderCustomFrame(t,()=>{
 text('B',74,65,22,'Mono',t.accent);
 text('THE WHITEBOARD DOODLE',118,65,19,'Mono',t.muted);
 text('CAVEAT / 16:9',1522,65,18,'Mono',t.muted,'right');
 text('Meet the world’s tiniest pencil.',76,163,89,'Caveat',t.ink);
 line(639,184,1024,178,t.accent,7,2);
 text('No lead. Just electrons.',81,213,38,'Caveat',t.muted);

 step('1','MAKE A BEAM',96);
 step('2','GIVE IT A NUDGE',592);
 step('3','DRAW!',1250);

 tube(125,510,1.03);
 title('heated cathode',117,351,34,t.accent);
 arrow([[254,367],[207,411],[207,471]],t.accent,2.3);

 title('two pairs of',520,336,32,t.ink,'center');
 title('steering plates',520,366,32,t.ink,'center');
 arrow([[570,383],[585,414],[565,448]],t.ink,2);
 arrow([[579,387],[641,407],[659,438]],t.ink,2);

 title('focus + accelerate',512,716,34,t.ink,'center');
 arrow([[489,686],[448,641],[421,584],[395,558]],t.ink,2);

 title('light!',1130,332,38,t.accent);
 arrow([[1090,378],[1171,353],[1227,377]],t.accent,2.8);

 screen(1225,377,274,185);
 title('phosphor',1117,652,32,t.accent);
 title('screen',1117,683,32,t.accent);
 arrow([[1141,625],[1111,596],[1092,559]],t.accent,2.3);
 title('one moving spot',1362,653,34,t.ink,'center');
 title('becomes a line',1362,686,34,t.ink,'center');

 title('signal = up / down',126,781,39,t.beam);
 title('timebase = left / right',664,781,39,t.accent);
 title('The beam path is drawn here so we can follow it.',800,822,29,t.muted,'center');
 line(74,840,1526,840,t.muted,.9,0);
 text('VOLTAGE, MADE VISIBLE',74,873,16,'Mono',t.muted);
 text('SCHEMATIC, NOT TO SCALE',800,873,13,'Mono',t.muted,'center');
 text('01 / 08',1526,873,16,'Mono',t.muted,'right');
},'whiteboard-caveat-v4');
console.log('Rendered whiteboard-caveat-v4.png and whiteboard-caveat-v4.svg');
