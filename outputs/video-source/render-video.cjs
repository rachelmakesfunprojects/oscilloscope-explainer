/* All frames are generated from Canvas geometry. No storyboard images are used.
   Node.js >=20, @napi-rs/canvas and FFmpeg are required. */
const fs=require('fs'),path=require('path'),{spawn}=require('child_process'),{once}=require('events');
const {lib,C,style,clamp,ease}=require('./video-style.cjs');
const scenes={...require('./scene-overview.cjs'),...require('./scenes-gun.cjs'),...require('./scene-focus.cjs'),...require('./scenes-screen.cjs')};
const ROOT=path.resolve(__dirname,'..'),WORK=path.resolve(ROOT,'../work/video');
const titles=['The tiniest pencil','Heater and cathode','Control grid','Acceleration','Focusing','Deflection','Timebase and phosphor','Trigger'];
const timeline=JSON.parse(fs.readFileSync(path.join(__dirname,'timeline.json'),'utf8'));
const FPS=24, W=1920,H=1080,END=5;
const duration=timeline.totalDuration+END;
const canvas=lib.createCanvas(W,H),ctx=canvas.getContext('2d');
const bg=lib.createCanvas(W,H),b=bg.getContext('2d');b.fillStyle=C.bg;b.fillRect(0,0,W,H);
let seed=271828;for(let i=0;i<2800;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed/2**32*W;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const y=seed/2**32*H;b.fillStyle='rgba(81,66,42,.019)';b.fillRect(x,y,.8,.8);}

function endCard(t){
 const u=style(ctx,t,{duration:END,words:[]});
 u.text('Voltage, made visible.',800,230,97,C.ink,'center',ease(t/.8));
 u.text('A rather civilised arrangement.',800,303,43,C.muted,'center',ease((t-.4)/.8));
 const points=[];for(let i=0;i<=200;i++){let p=i/200;points.push([350+p*900,473-85*Math.sin(p*Math.PI*4)]);}
 u.line(points,C.soft,12,clamp((t-.4)/2));u.line(points,C.mint,3.8,clamp((t-.4)/2));
 if(t>.4&&t<2.4)u.glow(...u.sample(points,clamp((t-.4)/2)),6);
 u.text('Height = voltage',506,648,45,C.mint,'center',ease((t-.8)/.7));
 u.text('Across = time',1094,648,45,C.coral,'center',ease((t-1.2)/.7));
 u.text('Original code-drawn animation  •  Caveat lettering',800,776,30,C.muted,'center');
 u.text('Narration: Christopher / ElevenLabs',800,818,30,C.muted,'center');
}
function frame(time){
 ctx.resetTransform();ctx.globalAlpha=1;ctx.drawImage(bg,0,0);ctx.save();ctx.scale(W/1600,H/900);
 if(time>=timeline.totalDuration){endCard(time-timeline.totalDuration);}
 else {
  let scene=timeline.scenes.find(s=>time>=s.start&&time<s.start+s.duration)||timeline.scenes.at(-1);
  let local=time-scene.start;
  ctx.save();ctx.globalAlpha=ease(local/.32)*ease((scene.duration-local)/.28);
  scenes[scene.id](ctx,local,scene);ctx.restore();
  const u=style(ctx,local,scene);
  u.text(String(scene.id).padStart(2,'0')+' / 08',75,48,27,C.coral);
  u.text(titles[scene.id-1],182,48,27,C.muted);
  u.text('VOLTAGE, MADE VISIBLE',1525,48,26,C.muted,'right');
  // A quiet eight-part progress line makes the structure easy to follow.
  const gap=9,part=(1450-7*gap)/8;
  for(let i=0;i<8;i++){
   const x=75+i*(part+gap),s=timeline.scenes[i];
   u.line([[x,854],[x+part,854]],'#dde4dd',3);
   if(time>s.start)u.line([[x,854],[x+part,854]],C.mint,3,clamp((time-s.start)/s.duration));
  }
  u.text('Schematic • electron motion slowed for explanation',75,884,22,C.muted);
  u.text('Electron paths shown as explanatory overlays',1525,884,22,C.muted,'right');
 }
 ctx.restore();return canvas;
}
async function main(){
 fs.mkdirSync(WORK,{recursive:true});
 const mode=process.argv[2]||'render';
 if(mode==='stills'){
  for(const scene of timeline.scenes){for(const q of [.2,.53,.84]){
   const time=scene.start+scene.duration*q;
   frame(time);fs.writeFileSync(path.join(WORK,`scene-${scene.id}-${Math.round(q*100)}.png`),canvas.toBuffer('image/png'));
  }}
  frame(timeline.totalDuration+2.8);fs.writeFileSync(path.join(WORK,'end-card.png'),canvas.toBuffer('image/png'));
  console.log('Rendered 25 visual QA stills.');return;
 }
 if(mode==='frame'){
  const t=Number(process.argv[3]||10);frame(t);fs.writeFileSync(process.argv[4]||path.join(WORK,'frame.png'),canvas.toBuffer('image/png'));return;
 }
 const ffmpeg=process.env.FFMPEG_PATH||'ffmpeg';
 const output=mode==='preview'?path.join(WORK,'preview.mp4'):path.join(ROOT,'oscilloscope-how-it-works.mp4');
 const audio=path.join(ROOT,'video-narration.wav'),srt=path.join(ROOT,'oscilloscope-captions.srt');
 const args=['-hide_banner','-y','-f','rawvideo','-pixel_format','rgba','-video_size',`${W}x${H}`,'-framerate',String(FPS),'-i','pipe:0','-i',audio,'-i',srt,'-i',path.join(__dirname,'chapters.ffmetadata'),
  '-map','0:v:0','-map','1:a:0','-map','2:s:0','-map_metadata','3','-map_chapters','3','-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-af',`apad=whole_dur=${duration}`,
  '-c:s','mov_text','-disposition:s:0','0','-metadata:s:s:0','language=eng','-metadata','title=Meet the world’s tiniest pencil — How an analog oscilloscope works','-metadata','artist=Original code-drawn animation; ElevenLabs Christopher narration',
  '-movflags','+faststart','-t',String(duration),output];
 const log=fs.openSync(path.join(WORK,'ffmpeg-render.log'),'w');
 const ff=spawn(ffmpeg,args,{stdio:['pipe','ignore',log]});
 let failed;ff.on('error',e=>failed=e);ff.stdin.on('error',e=>failed=e);
 const total=Math.ceil(duration*FPS);
 for(let i=0;i<total;i++){
  if(failed)throw failed;
  frame(i/FPS);
  if(!ff.stdin.write(canvas.data()))await once(ff.stdin,'drain');
  if(i%(FPS*10)===0)console.log(`Rendered ${Math.round(i/FPS)} / ${duration.toFixed(1)} seconds`,{pct:Math.round(i/total*100)});
 }
 ff.stdin.end();const [code]=await once(ff,'close');fs.closeSync(log);
 if(code!==0)throw new Error(`FFmpeg exited ${code}; see work/video/ffmpeg-render.log`);
 console.log(`Completed ${output}`);
}
module.exports={frame,duration,timeline,FPS};
if(require.main===module)main().catch(e=>{console.error(e);process.exit(1);});
