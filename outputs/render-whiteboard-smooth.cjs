/* Run: node render-whiteboard-smooth.cjs
   Keep render-frames.cjs alongside this file. Dependency: @napi-rs/canvas.
   Revision 3: original B content with smooth Chalkboard lettering and A's labels.
   Drawings are procedural; the font is locally installed, without chalk texture. */
const {renderCustomFrame,themes,text,line,arrow,tube,ellipse,screen}=require('./render-frames.cjs');
const t={...themes[1],id:'whiteboard-smooth-v3',font:'Smooth'};
const title=(s,x,y,size=26,color=t.ink,align='left')=>text(s,x,y,size,'Smooth',color,align);
function step(n,label,x){
 ellipse(x,263,21,21,t.ink,2.6,t.soft);
 title(n,x,272,25,t.ink,'center');
 title(label,x+37,272,25);
}
renderCustomFrame(t,()=>{
 text('B',74,65,22,'Mono',t.accent);
 text('THE WHITEBOARD DOODLE',118,65,19,'Mono',t.muted);
 text('SMOOTH LETTERING / 16:9',1522,65,18,'Mono',t.muted,'right');
 title('Meet the world’s tiniest pencil.',76,160,72);
 line(693,184,1100,178,t.accent,7,2);
 title('No lead. Just electrons.',81,211,29,t.muted);

 step('1','MAKE A BEAM',96);
 step('2','GIVE IT A NUDGE',592);
 step('3','DRAW!',1250);

 tube(125,510,1.03);
 title('heated cathode',117,351,25,t.accent);
 arrow([[254,367],[207,411],[207,471]],t.accent,2.3);

 title('two pairs of',520,336,24,t.ink,'center');
 title('steering plates',520,366,24,t.ink,'center');
 arrow([[570,383],[585,414],[565,448]],t.ink,2);
 arrow([[579,387],[641,407],[659,438]],t.ink,2);

 title('focus + accelerate',512,716,25,t.ink,'center');
 arrow([[489,686],[448,641],[421,584],[395,558]],t.ink,2);

 title('light!',1130,332,28,t.accent);
 arrow([[1090,378],[1171,353],[1227,377]],t.accent,2.8);

 screen(1225,377,274,185);
 title('phosphor',1117,652,23,t.accent);
 title('screen',1117,681,23,t.accent);
 arrow([[1141,625],[1111,596],[1092,559]],t.accent,2.3);
 title('one moving spot',1362,653,25,t.ink,'center');
 title('becomes a line',1362,686,25,t.ink,'center');

 title('signal = up / down',126,781,29,t.beam);
 title('timebase = left / right',664,781,29,t.accent);
 title('The beam path is drawn here so we can follow it.',800,822,21,t.muted,'center');
 line(74,840,1526,840,t.muted,.9,0);
 text('VOLTAGE, MADE VISIBLE',74,873,16,'Mono',t.muted);
 text('SCHEMATIC, NOT TO SCALE',800,873,13,'Mono',t.muted,'center');
 text('REVISION 03',1526,873,16,'Mono',t.muted,'right');
},'whiteboard-smooth-v3');
console.log('Rendered whiteboard-smooth-v3.png and whiteboard-smooth-v3.svg');
