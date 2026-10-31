/* Tombol instal PWA (manifest statis: manifest.webmanifest) + pendaftaran service worker (offline) */
(function(){
/* Pembaruan otomatis: cek sw.js tiap 15 menit; bila ada versi baru, tampilkan tombol "Muat ulang" (jendela PWA desktop bisa terbuka berhari-hari) */
function note(){if(document.getElementById('upd'))return;var b=document.createElement('div');b.id='upd';b.setAttribute('role','status');
b.style.cssText='position:fixed;top:64px;right:16px;z-index:2147483000;display:flex;gap:12px;align-items:center;padding:10px 10px 10px 16px;border-radius:14px;background:#0f766e;color:#fff;font:600 14px system-ui,sans-serif;box-shadow:0 10px 30px #0006';
var t=document.createElement('span');t.textContent='Versi baru tersedia';var x=document.createElement('button');x.type='button';x.textContent='Muat ulang';
x.style.cssText='border:0;border-radius:10px;padding:7px 12px;background:#fff;color:#0f766e;font:700 13px system-ui,sans-serif;cursor:pointer';x.onclick=function(){location.reload()};
b.appendChild(t);b.appendChild(x);(document.body||document.documentElement).appendChild(b)}
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
var had=!!navigator.serviceWorker.controller;
navigator.serviceWorker.addEventListener('controllerchange',function(){if(!had){had=true;return}note()});
addEventListener('load',function(){navigator.serviceWorker.register('sw.js').then(function(r){setInterval(function(){r.update().catch(function(){})},15*60*1000)}).catch(function(){})})}
var g=function(i){return document.getElementById(i)},btn=g('inst'),ios=g('ios'),dp=null;
var standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
if(standalone)return;
addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;btn.style.display='flex'});
addEventListener('appinstalled',function(){dp=null;btn.style.display='none';ios.style.display='none'});
btn.addEventListener('click',function(){if(!dp)return;dp.prompt();dp.userChoice.finally(function(){dp=null;btn.style.display='none'})});
var ua=navigator.userAgent,isIOS=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
if(!isIOS&&/android/i.test(ua))setTimeout(function(){if(!dp&&ios.style.display!=='block'){ios.innerHTML='Untuk memasang: buka menu browser (<b>&#8942;</b> / <b>&#9776;</b>), lalu pilih <b>Instal aplikasi</b> atau <b>Tambahkan ke layar utama</b>. Setelah terpasang, buka dari ikon di layar utama agar tampil tanpa kolom alamat.';ios.style.display='block'}},3500);
if(isIOS){ios.innerHTML='Untuk memasang di iPhone/iPad: ketuk tombol <b>Bagikan</b> (kotak dengan panah), lalu pilih <b>Tambah ke Layar Utama</b>.';ios.style.display='block'}
else if(!/^https:|^http:\/\/localhost/.test(location.href.slice(0,17))&&location.protocol!=='https:'){/* instal butuh HTTPS */}
})();
