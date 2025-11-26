const state={reports:[],verified:0,aidSites:0,queue:[],id:null};
const el={
  alerts:document.getElementById('alerts'),
  reports:document.getElementById('statReports'),
  verified:document.getElementById('statVerified'),
  aid:document.getElementById('statAid'),
  riskBar:document.getElementById('riskBar'),
  modalReport:document.getElementById('modalReport'),
  modalID:document.getElementById('modalID'),
  openReport:document.getElementById('openReport'),
  closeReport:document.getElementById('closeReport'),
  openID:document.getElementById('openID'),
  closeID:document.getElementById('closeID'),
  reportForm:document.getElementById('reportForm'),
  incidentType:document.getElementById('incidentType'),
  incidentDesc:document.getElementById('incidentDesc'),
  incidentCoords:document.getElementById('incidentCoords'),
  transferForm:document.getElementById('transferForm'),
  recipient:document.getElementById('recipient'),
  amount:document.getElementById('amount'),
  transferQueue:document.getElementById('transferQueue'),
  idForm:document.getElementById('idForm'),
  idName:document.getElementById('idName'),
  idMedical:document.getElementById('idMedical'),
  idContact:document.getElementById('idContact'),
  idCard:document.getElementById('idCard'),
  idOutName:document.getElementById('idOutName'),
  idOutMedical:document.getElementById('idOutMedical'),
  idOutContact:document.getElementById('idOutContact'),
  idQR:document.getElementById('idQR'),
  downloadID:document.getElementById('downloadID'),
  saveLocalID:document.getElementById('saveLocalID'),
  toggleTheme:document.getElementById('toggleTheme'),
  installApp:document.getElementById('installApp'),
  shareLink:document.getElementById('shareLink'),
  clearData:document.getElementById('clearData')
};

let map,heatLayer,aidLayer,dangerLayer,routeLayer;

function loadScript(url){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url;s.async=true;s.onload=resolve;s.onerror=()=>reject(new Error('load-failed:'+url));document.head.appendChild(s)});} 
function loadCss(url){const l=document.createElement('link');l.rel='stylesheet';l.href=url;document.head.appendChild(l)}
async function ensureLeaflet(){
  if(window.L) return;
  ['https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css','https://unpkg.com/leaflet@1.9.4/dist/leaflet.css','https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'].forEach(loadCss);
  const candidates=['https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js','https://unpkg.com/leaflet@1.9.4/dist/leaflet.js','https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'];
  for(const u of candidates){try{await loadScript(u);if(window.L) return;}catch{}}
}
async function ensureHeat(){
  if(window.L && L.heatLayer) return;
  const candidates=['https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js','https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js','https://cdnjs.cloudflare.com/ajax/libs/leaflet.heat/0.2.0/leaflet-heat.js'];
  for(const u of candidates){try{await loadScript(u);if(window.L && L.heatLayer) return;}catch{}}
}

function initMap(){
  map=L.map('map',{zoomControl:true});
  const fallback=[31.5,34.45];
  map.setView(fallback,11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
  heatLayer=L.heatLayer([], {radius:25, blur:15, maxZoom:17});
  heatLayer.addTo(map);
  aidLayer=L.layerGroup().addTo(map);
  dangerLayer=L.layerGroup().addTo(map);
  routeLayer=L.layerGroup().addTo(map);
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(p=>{map.setView([p.coords.latitude,p.coords.longitude],13)});
  }
}

function addAidMarker(lat,lng,label){
  const m=L.circleMarker([lat,lng],{radius:8,color:'#7bd389',fillColor:'#7bd389',fillOpacity:0.8});
  m.bindPopup(label);
  aidLayer.addLayer(m);
  state.aidSites=aidLayer.getLayers().length;
  el.aid.textContent=state.aidSites;
}

function addDangerZone(lat,lng,label){
  const m=L.circleMarker([lat,lng],{radius:8,color:'#ff6b6b',fillColor:'#ff6b6b',fillOpacity:0.8});
  m.bindPopup(label);
  dangerLayer.addLayer(m);
}

function drawRoute(from,to){
  routeLayer.clearLayers();
  const line=L.polyline([from,to],{color:'#f7b500',weight:4});
  routeLayer.addLayer(line);
}

function pushHeat(lat,lng,intensity){
  const pts=heatLayer._latlngs||[];
  pts.push([lat,lng,intensity]);
  heatLayer.setLatLngs(pts);
}

function renderAlerts(){
  el.alerts.innerHTML='';
  state.reports.slice().reverse().forEach(r=>{
    const div=document.createElement('div');
    div.className='item';
    const a=document.createElement('div');
    const title=document.createElement('div');
    title.className='title';
    title.textContent=(r.type==='danger'?'Danger':'Aid')+' • '+r.desc;
    const desc=document.createElement('div');
    desc.className='desc';
    desc.textContent=r.coords.join(', ');
    a.appendChild(title);a.appendChild(desc);
    const badge=document.createElement('div');
    badge.className='badge'+(r.verified?'':' warn');
    badge.textContent=r.verified?'Verified':'Pending';
    div.appendChild(a);div.appendChild(badge);
    el.alerts.appendChild(div);
  });
}

function updateStats(){
  el.reports.textContent=state.reports.length;
  el.verified.textContent=state.verified;
}

function seedDemo(){
  const seeds=[
    {type:'danger',desc:'Shelling reported',coords:[31.524,34.453],intensity:.9},
    {type:'aid',desc:'Mobile clinic',coords:[31.508,34.442],intensity:.4},
    {type:'danger',desc:'Roadblock',coords:[31.49,34.47],intensity:.6},
    {type:'aid',desc:'Water distribution',coords:[31.515,34.48],intensity:.3}
  ];
  seeds.forEach(s=>{
    if(s.type==='aid') addAidMarker(s.coords[0],s.coords[1],s.desc);
    if(s.type==='danger') addDangerZone(s.coords[0],s.coords[1],s.desc);
    pushHeat(s.coords[0],s.coords[1],s.intensity);
    state.reports.push({type:s.type,desc:s.desc,coords:s.coords,verified:Math.random()>0.4});
  });
  state.verified=state.reports.filter(r=>r.verified).length;
  updateStats();
  renderAlerts();
  drawRoute([31.508,34.442],[31.515,34.48]);
  renderRiskBar();
}

function renderRiskBar(){
  el.riskBar.innerHTML='';
  const total=12;
  const v=state.reports.filter(r=>r.type==='danger').length;
  const level=Math.min(total,Math.max(1,Math.round((v+1)/2)));
  for(let i=0;i<total;i++){
    const p=document.createElement('div');
    p.className='pill '+(i<level?'hot':i<level+2?'mid':'cool');
    el.riskBar.appendChild(p);
  }
}

function asCoords(str){
  const parts=str.split(',').map(x=>parseFloat(x.trim()));
  if(parts.length!==2||parts.some(Number.isNaN)) return null;
  return parts;
}

function handleReportSubmit(e){
  e.preventDefault();
  const type=el.incidentType.value;
  const desc=el.incidentDesc.value.trim();
  const c=asCoords(el.incidentCoords.value);
  if(!c) return;
  state.reports.push({type,desc,coords:c,verified:false});
  if(type==='aid') addAidMarker(c[0],c[1],desc); else addDangerZone(c[0],c[1],desc);
  pushHeat(c[0],c[1],type==='danger'?0.7:0.3);
  updateStats();
  renderAlerts();
  renderRiskBar();
  el.modalReport.classList.add('hidden');
  el.reportForm.reset();
}

function handleTransfer(e){
  e.preventDefault();
  const rec=el.recipient.value.trim();
  const amt=parseFloat(el.amount.value);
  if(!rec||Number.isNaN(amt)||amt<=0) return;
  const tx={id:String(Date.now()),recipient:rec,amount:amt,status:'queued'};
  state.queue.push(tx);
  localStorage.setItem('wasl.queue',JSON.stringify(state.queue));
  renderQueue();
  el.transferForm.reset();
}

function renderQueue(){
  el.transferQueue.innerHTML='';
  state.queue.forEach(q=>{
    const div=document.createElement('div');
    div.className='item';
    const a=document.createElement('div');
    const title=document.createElement('div');
    title.className='title';
    title.textContent='Transfer • '+q.recipient;
    const desc=document.createElement('div');
    desc.className='desc';
    desc.textContent=q.amount+' credits';
    a.appendChild(title);a.appendChild(desc);
    const badge=document.createElement('div');
    badge.className='badge'+(q.status==='queued'?' warn':'');
    badge.textContent=q.status==='queued'?'Queued':'Sent';
    div.appendChild(a);div.appendChild(badge);
    el.transferQueue.appendChild(div);
  });
}

function pumpNetwork(){
  const online=navigator.onLine;
  if(online){
    state.queue=state.queue.map(q=>({...q,status:'sent'}));
    localStorage.setItem('wasl.queue',JSON.stringify(state.queue));
    renderQueue();
  }
}

function updateOverlayFlag(){
  const anyOpen=!el.modalReport.classList.contains('hidden')||!el.modalID.classList.contains('hidden');
  document.body.classList.toggle('overlay-open',anyOpen);
}
function showReport(){el.modalReport.classList.remove('hidden');updateOverlayFlag()}
function hideReport(){el.modalReport.classList.add('hidden');updateOverlayFlag()}
function showID(){el.modalID.classList.remove('hidden');updateOverlayFlag()}
function hideID(){el.modalID.classList.add('hidden');updateOverlayFlag()}

function handleIDSubmit(e){
  e.preventDefault();
  const id={
    name:el.idName.value.trim(),
    medical:el.idMedical.value.trim(),
    contact:el.idContact.value.trim(),
    ts:Date.now()
  };
  state.id=id;
  el.idOutName.textContent=id.name;
  el.idOutMedical.textContent=id.medical;
  el.idOutContact.textContent=id.contact;
  el.idCard.classList.remove('hidden');
  const payload=JSON.stringify(id);
  if(typeof QRCode!=='undefined' && QRCode.toCanvas){
    QRCode.toCanvas(el.idQR,payload,{width:144});
  }else{
    const ctx=el.idQR.getContext('2d');
    el.idQR.width=200;el.idQR.height=200;
    ctx.fillStyle='#0b1220';ctx.fillRect(0,0,200,200);
    ctx.fillStyle='#4fd1c5';ctx.font='12px Inter';
    ctx.fillText('ID',10,20);
    ctx.fillStyle='#e6e8eb';
    wrapText(ctx,payload,10,40,180,16);
  }
}

function downloadID(){
  if(!state.id) return;
  const blob=new Blob([JSON.stringify(state.id,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='wasl-id.json';a.click();
  URL.revokeObjectURL(url);
}

function saveLocalID(){
  if(!state.id) return;
  localStorage.setItem('wasl.id',JSON.stringify(state.id));
}

function restore(){
  try{
    const q=localStorage.getItem('wasl.queue');
    state.queue=q?JSON.parse(q):[];
    const savedID=localStorage.getItem('wasl.id');
    if(savedID){
      state.id=JSON.parse(savedID);
      el.idOutName.textContent=state.id.name;
      el.idOutMedical.textContent=state.id.medical;
      el.idOutContact.textContent=state.id.contact;
      el.idCard.classList.remove('hidden');
      const payload=JSON.stringify(state.id);
      if(typeof QRCode!=='undefined' && QRCode.toCanvas){
        QRCode.toCanvas(el.idQR,payload,{width:144});
      }else{
        const ctx=el.idQR.getContext('2d');
        el.idQR.width=200;el.idQR.height=200;
        ctx.fillStyle='#0b1220';ctx.fillRect(0,0,200,200);
        ctx.fillStyle='#4fd1c5';ctx.font='12px Inter';
        ctx.fillText('ID',10,20);
        ctx.fillStyle='#e6e8eb';
        wrapText(ctx,payload,10,40,180,16);
      }
    }
    renderQueue();
  }catch{}
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e});
el.installApp.addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();});

el.toggleTheme.addEventListener('click',()=>{
  const dark=getComputedStyle(document.documentElement).getPropertyValue('--bg');
  const isDark=dark.trim()==='#0b1220';
  const root=document.documentElement.style;
  if(isDark){
    root.setProperty('--bg','#f8fafc');
    root.setProperty('--bg2','#eef2f7');
    root.setProperty('--text','#111827');
    root.setProperty('--muted','#475569');
    root.setProperty('--card','#ffffff');
    root.setProperty('--border','#e5e7eb');
  }else{
    root.setProperty('--bg','#0b1220');
    root.setProperty('--bg2','#0e1626');
    root.setProperty('--text','#e6e8eb');
    root.setProperty('--muted','#a9b0bb');
    root.setProperty('--card','#121a2b');
    root.setProperty('--border','#1e2840');
  }
});

el.shareLink.addEventListener('click',async e=>{e.preventDefault();const url=location.href;const text='Wasl crisis-response demo';if(navigator.share){await navigator.share({title:'Wasl',text,url});}else{navigator.clipboard.writeText(url)}});
el.clearData.addEventListener('click',e=>{e.preventDefault();localStorage.clear();state.queue=[];state.id=null;renderQueue();if(el.idCard)el.idCard.classList.add('hidden')});

el.openReport.addEventListener('click',showReport);el.closeReport.addEventListener('click',hideReport);
el.openID.addEventListener('click',showID);el.closeID.addEventListener('click',hideID);
el.reportForm.addEventListener('submit',handleReportSubmit);
el.transferForm.addEventListener('submit',handleTransfer);
el.idForm.addEventListener('submit',handleIDSubmit);
el.downloadID.addEventListener('click',downloadID);
el.saveLocalID.addEventListener('click',saveLocalID);

async function boot(){
  await ensureLeaflet();
  await ensureHeat();
  if(!window.L){
    const m=document.getElementById('map');
    if(m){m.style.display='grid';m.style.placeItems='center';m.textContent='Map unavailable. Network blocked or CDN unreachable.'}
    return;
  }
  initMap();
  seedDemo();
  restore();
  setInterval(()=>pumpNetwork(),3000);
}
boot();
function wrapText(ctx,text,x,y,maxWidth,lineHeight){
  const words=text.split(' ');
  let line='';
  for(let n=0;n<words.length;n++){
    const testLine=line+words[n]+' ';
    const metrics=ctx.measureText(testLine);
    const testWidth=metrics.width;
    if(testWidth>maxWidth && n>0){
      ctx.fillText(line,x,y);
      line=words[n]+' ';
      y+=lineHeight;
    }else{
      line=testLine;
    }
  }
  ctx.fillText(line,x,y);
}
