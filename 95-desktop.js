/* Tata letak desktop (layar >= 1200 px): menu kiri dipasang permanen, sisi kanan langsung menampilkan halaman.
   Beranda (daftar bab yang sama dengan menu) tidak ditampilkan lagi; halaman terakhir dibaca (atau halaman pertama) dibuka langsung.
   HP/tablet tidak berubah. Hanya tampilan; logika pembaca tidak diubah. */
(()=>{
const d=document,B=d.body,g=id=>d.getElementById(id);
const dr=g('dr'),nv=g('nv');
if(!dr||!nv||typeof render!=='function'||typeof home!=='function')return;
/* Semua modul tambahan digabung dalam satu lingkup, sehingga nama seperti cur/D/st/esc bisa tertimpa modul lain.
   Variabel milik pembaca (reader.js) karena itu dibaca lewat eval global, bukan lewat nama langsung. */
const G=s=>(0,eval)(s);

const css=d.createElement('style');
css.textContent=`
:root{--swo:clamp(300px,22vw,360px)}
@media(min-width:1200px){
  body.dk{--sw:var(--swo);padding-left:var(--sw);transition:padding-left .24s cubic-bezier(.2,.8,.2,1),padding-right .24s cubic-bezier(.2,.8,.2,1)}
  body.dk.dkc{--sw:0px}
  html body.dk #dr{position:fixed;inset:0 auto 0 0;width:var(--swo);z-index:100001;transition:transform .24s cubic-bezier(.2,.8,.2,1),visibility 0s}
  html body.dk.dkc #dr{transform:translateX(-100%);visibility:hidden;transition:transform .24s cubic-bezier(.2,.8,.2,1),visibility 0s .24s}
  #dktg{position:fixed;top:50%;left:calc(var(--sw) - 1px);transform:translateY(-50%);z-index:100003;width:22px;height:64px;padding:0;display:grid;place-items:center;border:1px solid var(--line);border-left:0;border-radius:0 12px 12px 0;background:var(--pkbg,var(--bg));color:var(--acc);cursor:pointer;box-shadow:4px 0 14px #0b223014;transition:left .24s cubic-bezier(.2,.8,.2,1),background .15s}
  #dktg:hover{background:var(--chip)}
  #dktg svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;transition:transform .24s}
  body.dk.dkc #dktg svg{transform:rotate(180deg)}
  body.dk .ov{display:none}
  html body.dk #nv{position:absolute;inset:0;width:auto;max-width:none;box-shadow:none;border-right:1px solid var(--line);-webkit-backdrop-filter:none;backdrop-filter:none}
  body.dk #hb,body.dk #nvx,html body.dk #bk[hidden]{display:none}
  html body.dk .fab{left:calc(var(--sw) + (100% - var(--sw))/2)!important}
  html body.dk.pnl .fab{left:calc(var(--sw) + (100% - var(--sw) - var(--pw))/2)!important}
  html body.dk #rp{left:calc(var(--sw) + (100% - var(--sw))/2)}
  html body.dk.pnl #rp{left:calc(var(--sw) + (100% - var(--sw) - var(--pw))/2)}
  #dkbm{margin:0 0 12px;padding:6px 6px 4px;border:1px solid var(--line);border-radius:16px;background:var(--card)}
  #dkbm[hidden]{display:none}
  #dkbm p{margin:4px 8px 2px;font:700 11.5px var(--sans,system-ui);letter-spacing:.04em;color:var(--mut)}
  #dkbm .s{border-top:0;padding:8px;border-radius:10px;font-size:13.5px;line-height:1.35}
  #dkbm .s:hover{background:var(--chip)}
}
#dktg{display:none}
body.dk #dktg{display:grid}
@media print{#dktg,#dr{display:none!important}body.dk{padding-left:0!important}}
`;
d.head.appendChild(css);

const mq=matchMedia('(min-width:1200px)'),desk=()=>mq.matches;

/* beranda -> langsung halaman (terakhir dibaca / halaman pertama) */
const _home=window.home,_render=window.render;
window.home=function(){
  if(!desk())return _home();
  const l=G("LS.get('sun_last',null)"),Pg=G('P'),Dc=G('D');
  const p=l&&Pg[l.p]?l.p:Dc[0].secs[0].p;
  G('cur={k:"read",p:'+p+',t:'+p+'}');
  _render(G('cur'));
};

/* penanda: di desktop tidak ada beranda, jadi ditampilkan di atas menu kiri */
const bmBox=()=>{let b=g('dkbm');if(!b){b=d.createElement('div');b.id='dkbm';b.hidden=true;const t=nv.querySelector('.nvt');t?t.after(b):nv.prepend(b)}return b};
const dkbm=()=>{if(!desk()||!G('D')||!G('P'))return;
  const Pg=G('P'),esc=G('esc'),KK=G('KK'),l=G('bms()').filter(x=>Pg[x.p]),b=bmBox();b.hidden=!l.length;
  b.innerHTML=l.length?'<p>\u2605 PENANDA</p>'+l.map(x=>`<div class="s" tabindex="0" role="button" data-m="${x.p}"><span class="t">${esc(KK(x.k))} - ${esc(x.t)}</span></div>`).join(''):''};

window.render=function(s){
  _render(s);
  if(!desk())return;
  g('bk').hidden=!G('stack').length;  /* tombol Kembali hanya bila ada riwayat */
  try{G('markNv()')}catch(e){}        /* sorot seksi aktif di menu kiri */
  dkbm();
};
g('st').addEventListener('click',()=>setTimeout(dkbm,0));

/* panah sembunyikan/tampilkan menu kiri (tersimpan di perangkat) */
const tg=d.createElement('button');tg.id='dktg';tg.type='button';
tg.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
const setC=(c,save)=>{B.classList.toggle('dkc',c);tg.setAttribute('aria-expanded',!c);
  tg.setAttribute('aria-label',c?'Tampilkan menu kiri':'Sembunyikan menu kiri');tg.title=tg.getAttribute('aria-label');
  if(save)try{G("LS.set('sun_dkc',"+(c?'true':'false')+")")}catch(e){}};
tg.onclick=()=>setC(!B.classList.contains('dkc'),true);
d.body.appendChild(tg);
try{setC(!!G("LS.get('sun_dkc',false)"),false)}catch(e){setC(false,false)}

/* menu kiri selalu terbuka di desktop */
let was=false;
const apply=()=>{
  const on=desk();B.classList.toggle('dk',on);
  if(on){if(dr.hidden)dr.hidden=false;
    if(G('D')){if(G('cur').k==='home')window.render(G('cur'));else{dkbm();try{G('markNv()')}catch(e){}}}}
  else if(was){dr.hidden=true}
  was=on};
new MutationObserver(()=>{if(desk()&&dr.hidden)dr.hidden=false}).observe(dr,{attributes:true,attributeFilter:['hidden']});
mq.addEventListener('change',apply);
apply();
})();
