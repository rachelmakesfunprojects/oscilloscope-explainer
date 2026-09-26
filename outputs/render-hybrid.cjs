/* Run: node render-hybrid.cjs
   Uses render-frames.cjs alongside this file and @napi-rs/canvas.
   Revision 2: B's whiteboard, C's Chalkduster lettering, A's content. */
const {renderCustomFrame,themes,text,line,arrow,tube}=require('./render-frames.cjs');
const t={...themes[1],id:'whiteboard-chalk-v2',name:'THE WHITEBOARD DOODLE',font:'Chalk'};
renderCustomFrame(t,()=>{
 text('B',74,65,22,'Mono',t.accent);
 text('THE WHITEBOARD DOODLE',118,65,19,'Mono',t.muted);
 text('CHALK LETTERING / 16:9',1522,65,18,'Mono',t.muted,'right');
 text('A rather brilliant little dot.',76,161,58,'Chalk');
 text('An electron gun. A glass tube. A small act of illumination.',80,212,27,'Hand',t.muted);
 line(652,184,993,179,t.accent,7,2);
 tube(190,485,1.10);
 text('heated cathode',137,308,26,'Chalk',t.accent,'left',-.025);
 arrow([[262,326],[278,365],[278,450]],t.accent,2.5);
 text('focus + accelerate',411,718,26,'Chalk',t.ink,'center',-.02);
 arrow([[494,676],[548,637],[548,586],[491,543]],t.ink,2.2);
 text('two pairs of',638,263,25,'Chalk',t.ink,'center',-.02);
 text('steering plates',638,299,25,'Chalk',t.ink,'center',-.02);
 arrow([[675,315],[699,355],[685,398]],t.ink,2.2);
 text('phosphor',1273,550,28,'Chalk',t.accent,'left',-.03);
 text('screen',1275,590,28,'Chalk',t.accent,'left',-.03);
 arrow([[1290,521],[1249,489],[1220,450]],t.accent,2.5);
 text('light!',1280,324,34,'Chalk',t.accent,'left',.04);
 arrow([[1264,337],[1200,348]],t.accent,2.5);
 text('The beam path is drawn here so we can follow it.',80,799,26,'Hand',t.muted);
 line(74,840,1526,840,t.muted,.9,0);
 text('VOLTAGE, MADE VISIBLE',74,873,16,'Mono',t.muted);
 text('SCHEMATIC, NOT TO SCALE',800,873,13,'Mono',t.muted,'center');
 text('REVISION 02',1526,873,16,'Mono',t.muted,'right');
},'whiteboard-chalk-v2');
console.log('Rendered whiteboard-chalk-v2.png and whiteboard-chalk-v2.svg');
