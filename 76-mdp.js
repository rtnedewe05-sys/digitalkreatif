/* MDP 2024 (Manual Desain Perkerasan Jalan): lapisan ketiga. Data di mdp.js: MDPS (daftar bab) + MZ (teks per halaman PDF). */
const MDK=(()=>{
const MS=typeof MDPS!=='undefined'?MDPS:[],byId={};MS.forEach(s=>byId[s.id]=s);
const GN=['MDP 2024 - Pembuka','Bagian I - Struktur Perkerasan Baru','Bagian II - Rehabilitasi Perkerasan'],GB=['M','I','II'];
const E=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
let PG=null,PGP=null,mEl=null,ST={id:'',q:'',shown:15,focus:0,hl:[]},PEND=null;
const load=()=>PGP||(PGP=(async()=>{const b=Uint8Array.from(atob(MZ),c=>c.charCodeAt(0));const s=new Blob([b]).stream().pipeThrough(new DecompressionStream('deflate'));PG=JSON.parse(await new Response(s).text());return PG})());
const st=document.createElement('style');
st.textContent=`.mdb{display:flex;gap:8px;margin:0 0 12px}.mdb input{flex:1;min-width:0;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink);font:15px system-ui,sans-serif}
.mdh{margin:0 0 10px}.mdh h2{font:700 18px/1.3 system-ui,sans-serif;margin:0 0 4px;color:var(--ink)}.mdh small{color:var(--mut);font:13px system-ui,sans-serif}
.mdn{display:flex;gap:8px;margin:12px 0}.mdn .mv{flex:1;padding:10px;border-radius:10px;border:1px solid var(--acc);background:transparent;color:var(--acc);font:600 13px system-ui,sans-serif;cursor:pointer;text-align:center}.mdn .mv[aria-disabled=true]{opacity:.35;pointer-events:none}
.mdp{margin:0 0 14px;border:1px solid var(--line);border-radius:12px;background:var(--card);overflow:hidden}.mdp .pn{padding:6px 12px;font:600 12px system-ui,sans-serif;color:var(--mut);background:var(--chip);border-bottom:1px solid var(--line)}
.mdp pre{margin:0;padding:12px;white-space:pre-wrap;overflow-wrap:anywhere;font:12.5px/1.55 'JetBrains Mono',ui-monospace,monospace;color:var(--ink)}
.mdp mark{background:#ffd54f88;color:inherit;border-radius:3px}.mdp.f{outline:2px solid var(--acc)}
.mdr{padding:11px 12px;border:1px solid var(--line);border-radius:10px;margin:0 0 8px;background:var(--card);cursor:pointer}.mdr b{display:block;font:600 13px system-ui,sans-serif;color:var(--acc);margin-bottom:3px}.mdr span{font:13px/1.45 system-ui,sans-serif;color:var(--ink);overflow-wrap:anywhere}.mdr mark{background:#ffd54f88;color:inherit}
.mdm{display:block;width:100%;padding:11px;margin:4px 0 16px;border-radius:10px;border:1px solid var(--acc);background:transparent;color:var(--acc);font:600 14px system-ui,sans-serif;cursor:pointer}`;
document.head.appendChild(st);
const words=q=>q.toLowerCase().split(/\s+/).filter(w=>w.length>1);
const hlt=(s,ws)=>{let h=E(s);for(const w of ws){const r=new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');h=h.replace(r,'<mark>$1</mark>')}return h};
const secOfPg=n=>{let r=null;for(const s of MS)if(n>=s.a&&n<=s.b){r=s;break}return r};
const lbl=s=>s?(s.l?'Lampiran '+s.k:s.g===0?s.t:'Bab '+s.k)+' - '+s.t:'MDP 2024';
function cards(){
  let h='';
  for(let g=0;g<3;g++){const L=MS.filter(s=>s.g===g);
    h+=`<details><summary><span class="no">${GB[g]}</span><span class="nm">${E(GN[g])}<small>${L.length} bagian - hlm. PDF ${L[0].a}-${L[L.length-1].b}</small></span></summary>`;
    for(const s of L)h+=`<div class="s" tabindex="0" role="button" data-mdp="${s.id}"><span class="k${s.l?' kl':''}">${E(s.k)}</span><span class="t">${E(s.t)}<span class="pg">hlm. PDF ${s.a}-${s.b}</span></span></div>`;
    h+='</details>'}
  return h+'<p class="pg tkn">Teks diekstrak dari PDF resmi. Gambar, bagan desain, dan tabel rumit paling akurat di PDF asli; gunakan tombol Unduh PDF bila tersedia.</p>'}
function results(q,P){
  const ws=words(q);if(!ws.length)return '';const out=[];
  for(let n=1;n<=MS[MS.length-1].b&&out.length<60;n++){const t=P[n];if(!t)continue;const lo=t.toLowerCase();if(!ws.every(w=>lo.includes(w)))continue;
    const i=lo.indexOf(ws[0]),a=Math.max(0,i-80),sn=t.slice(a,i+160).replace(/\s+/g,' ');
    out.push(`<div class="mdr" tabindex="0" role="button" data-pgo="${n}"><b>${E(lbl(secOfPg(n)))} - hlm. PDF ${n}</b><span>${a>0?'... ':''}${hlt(sn,ws)} ...</span></div>`)}
  return `<p class="pg">${out.length?out.length+(out.length>=60?'+':'')+' halaman cocok untuk "'+E(q)+'"':'Tidak ada halaman yang memuat semua kata "'+E(q)+'"'}</p>`+out.join('')}
function section(s,P){
  const i=MS.indexOf(s),pv=MS[i-1],nx=MS[i+1];
  const nav=`<div class="mdn"><span class="mv" role="button" tabindex="0" ${pv?`data-mdp="${pv.id}"`:'aria-disabled="true"'}>&laquo; ${pv?E(pv.l?'Lampiran '+pv.k:pv.g===0?'Pembuka':'Bab '+pv.k):''}</span><span class="mv" role="button" tabindex="0" ${nx?`data-mdp="${nx.id}"`:'aria-disabled="true"'}>${nx?E(nx.l?'Lampiran '+nx.k:'Bab '+nx.k):''} &raquo;</span></div>`;
  let h=`<div class="mdh"><h2>${E(lbl(s))}</h2><small>hlm. PDF ${s.a}-${s.b} (${s.b-s.a+1} halaman)</small></div>`+nav;
  let end=Math.min(s.b,s.a+ST.shown-1);if(ST.focus&&ST.focus>=s.a&&ST.focus<=s.b)end=Math.max(end,Math.min(s.b,ST.focus+3));
  for(let n=s.a;n<=end;n++)h+=`<div class="mdp${n===ST.focus?' f':''}" id="mdp-pg-${n}"><div class="pn">Halaman PDF ${n}</div><pre>${hlt(P[n]||'',ST.hl)}</pre></div>`;
  if(end<s.b)h+=`<button type="button" class="mdm" data-more="1">Muat halaman berikutnya (${s.b-end} lagi)</button>`;
  return h+nav}
async function draw(){
  const m=mEl;if(!m)return;m.innerHTML='<p class="empty">Memuat MDP 2024...</p>';
  let P;try{P=await load()}catch(e){m.innerHTML='<p class="empty">Gagal memuat data MDP: '+E(e.message)+'</p>';return}
  if(mEl!==m)return;const s=byId[ST.id];
  let h=`<div class="mdb"><input id="mdq" type="search" placeholder="Cari di MDP 2024, mis. CBR tanah dasar" value="${E(ST.q)}" enterkeyhint="search" aria-label="Cari di MDP 2024"></div>`;
  h+=ST.q?results(ST.q,P):s?section(s,P):'<div class="mdh"><h2>MDP 2024</h2><small>Manual Desain Perkerasan Jalan, Mei 2024</small></div>'+cards();
  m.innerHTML=h;
  if(ST.focus&&!ST.q){const e=document.getElementById('mdp-pg-'+ST.focus);if(e)e.scrollIntoView({block:'start'})}else scrollTo(0,0);
}
function mount(m,id){
  mEl=m;const p=PEND;PEND=null;
  ST={id:byId[id]?id:'',q:'',shown:15,focus:p?p.focus:0,hl:p?p.hl:[]};
  if(!m.__mdb){m.__mdb=1;
    m.addEventListener('keydown',e=>{if(e.target.id==='mdq'&&e.key==='Enter'&&mEl===m){ST.q=e.target.value.trim();ST.focus=0;ST.hl=[];draw()}});
    m.addEventListener('click',e=>{if(mEl!==m)return;
      const mo=e.target.closest('[data-more]');if(mo){ST.shown+=15;const y=scrollY;draw().then(()=>scrollTo(0,y));return}
      const r=e.target.closest('[data-pgo]');if(r){const n=+r.dataset.pgo,s=secOfPg(n);if(s){const ws=words(ST.q);ST.q='';ST.id=s.id;ST.focus=n;ST.hl=ws;ST.shown=15;draw()}}})}
  draw()}
window.__MDP={secs:MS,cards,mount,unmount(){mEl=null},sub:()=>MS.length+' bab dan lampiran',isOpen:()=>!!mEl};
window.dispatchEvent(new Event('mdp-ready'));
})();
