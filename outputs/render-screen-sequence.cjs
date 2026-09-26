/* Original procedural storyboard artwork: no raster reference artwork.
   Run with Node.js; shares the reviewed whiteboard rendering primitives. */
const {renderCustomFrame,themes,text,line,arrow,ellipse,stroke,rect,bez}=require('./render-frames.cjs');
const t={...themes[1],id:'storyboard',font:'Caveat'};
const ink=t.ink, mint=t.beam, coral=t.accent, muted=t.muted;
// Caveat has a smaller handwritten body; enlarge it for screen legibility.
function tx(s,x,y,size=28,color=ink,align='left',angle=0){text(s,x,y,size*1.3,'Caveat',color,align,angle);}
function header(n,title,sub){
 text('B',74,65,22,'Mono',coral);text('THE WHITEBOARD DOODLE',118,65,19,'Mono',muted);text('STORYBOARD / '+n,1526,65,18,'Mono',muted,'right');
 tx(title,76,157,60);tx(sub,80,213,27,muted);
}
function footer(n,note='SCHEMATIC, NOT TO SCALE'){
 line(74,840,1526,840,muted,.9,0);text('VOLTAGE, MADE VISIBLE',74,873,16,'Mono',muted);text(note,800,873,13,'Mono',muted,'center');text(n+' / 08',1526,873,16,'Mono',muted,'right');
}
function dashed(x1,y1,x2,y2,color=muted,width=2,step=18){const len=Math.hypot(x2-x1,y2-y1);for(let d=0;d<len;d+=step){const e=Math.min(len,d+step*.48);line(x1+(x2-x1)*d/len,y1+(y2-y1)*d/len,x1+(x2-x1)*e/len,y1+(y2-y1)*e/len,color,width,.1);}}
function grid(x,y,w,h){rect(x,y,w,h,t.paper,ink,3);for(let j=1;j<8;j++)line(x+w*j/8,y+10,x+w*j/8,y+h-10,'#c3c8c7',.8,.1);for(let j=1;j<5;j++)line(x+10,y+h*j/5,x+w-10,y+h*j/5,'#c3c8c7',.8,.1);}
function glow(x,y){ellipse(x,y,18,18,'#d0e9da',2,'#d0e9da');ellipse(x,y,6,6,mint,2,mint);for(let j=0;j<8;j++){let a=j*Math.PI/4;line(x+Math.cos(a)*23,y+Math.sin(a)*23,x+Math.cos(a)*31,y+Math.sin(a)*31,mint,2,.3);}}
function steering(){
 header('06','Give the beam a little nudge.','An electric field changes the direction of the moving electrons.');
 // Parallel plates, with a curved trajectory only in their local field.
 tx('+',611,302,46,coral,'center');tx('more positive plate',665,299,27,coral);
 rect(405,338,440,24,t.soft,ink,3);
 rect(405,625,440,24,t.soft,ink,3);
 line(598,675,627,675,coral,4,.5);tx('more negative plate',665,684,27,coral);
 tx('electron beam',167,481,27,mint);line(163,530,405,530,mint,5,.25);arrow([[215,530],[289,530]],mint,3);
 let bend=[];for(let i=0;i<=50;i++){let u=i/50;bend.push([405+440*u,530-75*u*u]);}stroke(bend,mint,5,.1);
 line(845,455,1290,303.3,mint,5,.2);arrow([[1000,402.2],[1080,374.9]],mint,3);
 [185,316,475,625,795,975,1160].forEach(x=>{let y=x<405?530:x<845?530-75*((x-405)/440)**2:455-(x-845)*150/440;ellipse(x,y,4,4,mint,1,mint);});
 arrow([[720,480],[720,397]],coral,3);tx('negative electrons',450,390,24);tx('bend towards +',450,420,24);
 tx('straight again',1018,534,28,ink,'center');tx('after the plates',1018,569,26,muted,'center');arrow([[1018,501],[1039,427]],ink,2);
 line(1306,269,1306,634,ink,5,.6);line(1295,269,1295,634,mint,5,.6);glow(1295,301);
 tx('phosphor',1352,450,27,coral);tx('screen',1352,485,27,coral);arrow([[1380,502],[1380,566],[1313,566]],coral,2);
 tx('The input amplifier drives the vertical plates: up / down.',125,756,29,mint);
 tx('A second pair, at right angles, steers left / right.',125,800,27,coral);
 footer('06','PLATE POLARITIES SHOWN RELATIVE TO ONE ANOTHER');
}
function sweep(){
 header('07','A dot with excellent timing.','The signal moves it up and down. The timebase carries it across.');
 const x=180,y=315,w=690,h=325;grid(x,y,w,h);
 let wave=[];for(let i=0;i<=180;i++){let u=i/180*.86;wave.push([x+24+u*(w-48),y+h/2-Math.sin(u*Math.PI*4)*100]);}
 stroke(wave,'#bbddcd',11,0);stroke(wave,mint,3.2,.1);const p=wave.at(-1);glow(...p);
 tx('front of the phosphor screen',525,283,27,ink,'center');
 arrow([[131,624],[131,329]],mint,3);tx('voltage',100,480,28,mint,'center',-Math.PI/2);
 arrow([[195,687],[857,687]],coral,3);tx('time',525,726,28,coral,'center');
 tx('The spot excites the phosphor.',178,775,27);tx('Its brief afterglow helps the trace remain visible.',178,812,24,muted);
 // One complete sweep and the beginning of the next ramp.
 tx('Inside the timebase',1220,287,31,ink,'center');
 arrow([[1014,556],[1486,556]],muted,1.8);arrow([[1014,556],[1014,328]],muted,1.8);
 tx('horizontal drive',1021,320,22,muted);
 line(1040,528,1361,362,coral,4,.6);arrow([[1160,466],[1220,435]],coral,3);
 dashed(1361,362,1380,528,muted,3,19);arrow([[1380,488],[1380,523]],muted,2);
 line(1380,528,1463,485,coral,4,.5);
 tx('time',1484,594,22,muted,'right');
 tx('steady ramp',1145,373,25,coral);tx('rapid return',1430,644,25,muted,'right');arrow([[1385,612],[1380,548]],muted,1.8);
 tx('Sweep: the beam is on.',1030,699,26,coral);
 tx('Return: the beam is blanked.',1030,740,26,muted);
 tx('So no return line is drawn.',1030,785,24,muted);
 footer('07','THE BEAM STRIKES ONE POINT AT ANY INSTANT');
}
function trigger(){
 header('08','The secret of a steady picture.','Triggering starts each sweep at the same point in the signal’s cycle.');
 const ly=323,lx=126,rx=878,w=592,h=302;
 tx('Without a stable trigger',422,282,30,ink,'center');tx('With an upward trigger',1174,282,30,ink,'center');grid(lx,ly,w,h);grid(rx,ly,w,h);
 // An accumulation of successive misaligned sweeps at different phases.
 for(const [phase,col] of [[-.50,'#d4ddd7'],[.23,'#9ebeb0'],[.98,mint]]){let p=[];for(let i=0;i<=200;i++){let u=i/200;p.push([lx+20+u*(w-40),ly+h/2-Math.sin(u*Math.PI*3.2+phase)*99]);}stroke(p,col,phase===.98?3.8:3,.1);}
 // A level of +0.35 and rising slope selects the same phase every cycle.
 let p=[];const start=Math.asin(.35);for(let i=0;i<=200;i++){let u=i/200;p.push([rx+20+u*(w-40),ly+h/2-Math.sin(start+u*Math.PI*3.2)*99]);}
 stroke(p,'#cde6d7',11,0);stroke(p,mint,3.7,.1);
 const threshold=ly+h/2-.35*99;dashed(rx+13,threshold,rx+w-14,threshold,coral,1.7,17);
 tx('chosen trigger level',1438,359,22,coral,'right');
 arrow([[1433,371],[1450,403],[1450,threshold-5]],coral,1.6);
 ellipse(rx+20,threshold,10,10,coral,2,t.paper);arrow([[rx+20,threshold+57],[rx+20,threshold+14]],coral,3);
 tx('same crossing, same start',1174,685,26,coral,'center');arrow([[1038,666],[936,587],[909,threshold+21]],coral,2);
 tx('The cycles land in different places.',422,685,25,muted,'center');
 tx('Each sweep follows the same rising crossing.',1174,748,25,ink,'center');
 tx('Repeated sweeps lie on top of one another.',1174,787,24,muted,'center');
 tx('The picture seems to wander.',422,748,26,ink,'center');
 tx('Awfully difficult to take measurements.',422,787,24,muted,'center');
 footer('08','SIMPLIFIED TRIGGER: SELECTED LEVEL + RISING SLOPE');
}
for(const [name,draw] of [['06-steering',steering],['07-sweep',sweep],['08-trigger',trigger]])renderCustomFrame(t,draw,name);
console.log('Rendered 06-steering, 07-sweep, and 08-trigger as PNG + SVG.');
