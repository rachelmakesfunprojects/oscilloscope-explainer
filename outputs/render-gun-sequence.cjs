/* Original code-drawn electron-gun storyboard.
   Run: node render-gun-sequence.cjs (keep render-frames.cjs alongside).
   Dependency: @napi-rs/canvas; bundled Caveat font registered by render-frames.cjs. */
const {renderCustomFrame,themes,text,line,arrow,ellipse,stroke,rect,bez}=require('./render-frames.cjs');
const t={...themes[1],id:'gun-storyboard',font:'Caveat'};
// Caveat's smaller letter bodies need a larger nominal size than Chalkboard.
const txt=(s,x,y,size=27,color=t.ink,align='left')=>text(s,x,y,size*1.22,'Caveat',color,align);
function page(n,heading,sub){
 text(n,74,65,22,'Mono',t.accent);text('INSIDE THE ELECTRON GUN',122,65,19,'Mono',t.muted);
 text('VOLTAGE, MADE VISIBLE',1522,65,18,'Mono',t.muted,'right');
 txt(heading,77,158,59);txt(sub,80,213,28,t.muted);
}
function foot(n,note){
 txt(note,800,795,25,t.ink,'center');line(74,840,1526,840,t.muted,.9,0);
 text('ORIGINAL CODE DRAWING',74,873,15,'Mono',t.muted);
 text('SCHEMATIC • ELECTRONS AND FIELDS ARE EXPLANATORY OVERLAYS',800,873,12,'Mono',t.muted,'center');
 text(n+' / 08',1526,873,16,'Mono',t.muted,'right');
}
function electron(x,y,r=10,color=t.beam){ellipse(x,y,r,r,color,1.5,color);if(r>7)line(x-r*.42,y,x+r*.42,y,t.paper,1.7,0);}
function ring(x,y,w=67,hole=63){rect(x,y-hole-60,w,60,t.soft);rect(x,y+hole,w,60,t.soft);}
function cathode(){
 page('02','First, persuade a few electrons.','A separate heater warms an electron-emitting coating.');
 // Indirectly heated metal cathode sleeve, open at the rear, coating at front.
 stroke([[273,391],[530,391],[530,596],[273,596]],t.ink,4.4,2.1);
 line(539,402,539,585,t.accent,12,.6);
 stroke([[166,455],[306,455],[322,484],[337,448],[353,521],[369,449],[385,522],[401,450],[417,520],[433,451],[448,522],[464,451],[479,493],[479,550],[166,550]],t.accent,4,1.7);
 txt('heater',169,328,29,t.accent);arrow([[229,344],[322,423]],t.accent,2.3);
 txt('coated cathode',471,306,29);arrow([[551,323],[539,382]],t.ink,2.3);
 txt('two heater leads',157,630,24,t.muted);arrow([[236,601],[176,558]],t.muted,1.8);
 // Short heat marks stay inside the sleeve, away from the electron cloud.
 for(const xx of [340,392,442])bez([[xx,430],[xx-14,417],[xx+12,411],[xx,399]],t.accent,1.5);
 for(const [x,y] of [[601,452],[621,518],[661,395],[676,566],[706,474],[755,418],[769,534],[827,371],[839,482],[884,568],[926,421],[961,514]])electron(x,y,10);
 arrow([[568,457],[594,444]],t.beam,2);arrow([[568,531],[601,543]],t.beam,2);
 txt('thermionic',1126,402,35,t.beam);txt('emission',1126,445,35,t.beam);
 txt('Heat frees electrons',1126,503,25);txt('already in the coating.',1126,537,25);
 txt('vacuum',866,637,27,t.muted);arrow([[910,611],[951,555]],t.muted,1.8);
 txt('The surrounding vacuum gives them room to travel.',800,724,25,t.muted,'center');
 foot('02','The power supply replenishes the electrons that leave the cathode.');
}
function grid(){
 page('03','A gatekeeper, with no moving parts.','The control grid regulates the number of electrons in the beam.');
 txt('cathode',418,307,25,t.muted,'center');txt('control grid',762,307,25,t.muted,'center');txt('phosphor spot',1328,307,25,t.muted,'center');
 line(1331,352,1331,708,t.ink,3,1);
 for(const [y,isBright] of [[432,false],[630,true]]){
  txt(isBright?'LESS NEGATIVE':'MORE NEGATIVE',87,y-15,23,t.accent);txt('than the cathode',87,y+20,20,t.muted);
  rect(405,y-38,18,76,t.soft);line(425,y-29,425,y+29,t.accent,5,.5);
  ring(729,y,66,26);
  line(753,y-59,771,y-59,t.accent,2.5,0);line(753,y+62,771,y+62,t.accent,2.5,0);
  line(435,y,1327,y,t.soft,3,0);
  for(const dx of [456,502,548,594,640,686])electron(dx,y,7);
  const positions=isBright?[835,888,941,994,1047,1100,1153,1206,1259]:[878,1077,1276];
  for(const dx of positions)electron(dx,y,isBright?8:6);
  arrow([[1150,y-20],[1215,y-20]],t.beam,2);
  ellipse(1331,y,isBright?22:15,isBright?22:15,t.soft,2,t.soft);
  ellipse(1331,y,isBright?11:5,isBright?11:5,isBright?t.beam:t.muted,1,isBright?t.beam:t.muted);
  txt(isBright?'brighter':'dim',1410,y+9,26,isBright?t.beam:t.muted);
 }
 txt('The aperture stays the same size.',548,749,24,t.muted,'center');
 foot('03','Make the grid negative enough and the beam is cut off.');
}
function accelerate(){
 page('04','Now give them some speed.','Electrodes more positive than the cathode accelerate the electrons.');
 txt('cathode',226,331,28,t.accent,'center');
 rect(203,405,28,180,t.soft);line(237,419,237,570,t.accent,6,.5);
 for(const x of [562,925])ring(x,496,81,65);
 txt('accelerating electrodes',785,304,31,t.ink,'center');
 arrow([[704,324],[604,359]],t.ink,2);arrow([[888,326],[963,359]],t.ink,2);
 txt('+500 V',604,407,19,t.accent,'center');txt('+1000 V',965,407,18,t.accent,'center');
 txt('+500 V',604,608,19,t.accent,'center');txt('+1000 V',965,608,18,t.accent,'center');
 line(241,496,1413,496,t.soft,6,0);
 for(const [x,r] of [[275,9],[327,9],[397,9],[487,9],[654,9],[790,9],[1085,9],[1348,9]])electron(x,496,r);
 arrow([[330,457],[373,457]],t.beam,3);arrow([[690,457],[775,457]],t.beam,3);arrow([[1209,457],[1343,457]],t.beam,3);
 txt('speed',333,426,24,t.beam);txt('more speed',692,426,24,t.beam);txt('faster still',1210,426,24,t.beam);
 txt('Illustrative voltages, measured relative to the cathode.',800,682,26,t.muted,'center');
 txt('electrical energy',534,734,31,t.accent,'center');arrow([[704,724],[867,724]],t.ink,2.7);txt('kinetic energy',1067,734,31,t.beam,'center');
 foot('04','A larger accelerating voltage gives each electron more energy.');
}
function focus(){
 page('05','A sharp point makes a sharp picture.','Shaped electric fields bring the beam to a small spot.');
 for(const x of [512,681,850])ring(x,476,65,103);
 txt('shaped electrodes + chosen voltages',711,268,28,t.ink,'center');
 arrow([[574,282],[545,301]],t.ink,2);arrow([[859,282],[883,302]],t.ink,2);
 // A family of trajectories bends gradually through the lens, then converges.
 for(const d of [-1,-.5,0,.5,1]){
  const y0=476+d*37, y1=476+d*86, y2=476+d*56;
  line(176,y0,486,y1,t.beam,d===0?3:1.9,0);
  bez([[486,y1],[620,476+d*105],[808,476+d*91],[925,y2]],t.beam,d===0?3:1.9);
  line(925,y2,1346,476,t.beam,d===0?3:1.9,0);
 }
 line(1347,316,1347,622,t.ink,3,1);ellipse(1347,476,17,17,t.soft,1,t.soft);ellipse(1347,476,6,6,t.beam,1,t.beam);
 txt('small spot',1397,455,26,t.beam);arrow([[1421,469],[1364,476]],t.beam,2);
 txt('electrostatic lens',707,683,33,t.ink,'center');
 txt('The focus control adjusts a lens-electrode voltage.',800,730,27,t.muted,'center');
 foot('05','Acceleration sets the energy; focusing brings the trajectories together.');
}
for(const [name,draw] of [['02-cathode',cathode],['03-control-grid',grid],['04-acceleration',accelerate],['05-focusing',focus]]){
 renderCustomFrame(t,draw,name);console.log('Rendered '+name+'.png and .svg');
}
