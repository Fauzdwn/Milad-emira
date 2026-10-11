const closedBook = document.getElementById('closedBook');
const openBook = document.getElementById('openBook');
const turnSheet = document.getElementById('turnSheet');
const sheetFront = document.getElementById('sheetFront');
const sheetBack = document.getElementById('sheetBack');
const leftContent = document.getElementById('leftContent');
const rightContent = document.getElementById('rightContent');
const leftStack = document.getElementById('leftStack');
const rightStack = document.getElementById('rightStack');
const gesture = document.getElementById('gesture');
const frontCoverHTML = '<span class="cover-decoration cover-photo-a"></span><span class="cover-decoration cover-photo-b"></span><span class="cover-tape"></span><span class="cover-main">memory<br>book</span><span class="cover-sub">happy birthday ♡</span><span class="nailong-sticker" aria-label="Karakter dinosaurus kuning lucu" role="img"><svg viewBox="0 0 140 150" aria-hidden="true"><ellipse cx="73" cy="133" rx="42" ry="8" fill="#3e29251f"/><path d="M36 89 Q17 81 22 61 Q28 47 43 58 L52 38 L65 48 L79 29 L91 49 Q113 48 120 69 Q126 91 109 108 L107 126 Q96 137 81 127 L64 127 Q49 139 38 126Z" fill="#ffd65c" stroke="#9b703b" stroke-width="3" stroke-linejoin="round"/><path d="M46 88 Q45 70 61 66 Q81 60 99 75 Q108 91 93 105 Q76 117 56 104Z" fill="#fff0b0"/><ellipse cx="56" cy="75" rx="7" ry="10" fill="#fff"/><ellipse cx="86" cy="73" rx="7" ry="10" fill="#fff"/><ellipse cx="58" cy="77" rx="3.5" ry="5" fill="#45332c"/><ellipse cx="87" cy="75" rx="3.5" ry="5" fill="#45332c"/><path d="M66 91 Q73 99 81 90" fill="none" stroke="#8d5544" stroke-width="3" stroke-linecap="round"/><circle cx="43" cy="88" r="6" fill="#f59b9b" opacity=".8"/><circle cx="99" cy="87" r="6" fill="#f59b9b" opacity=".8"/><path d="M36 106 Q24 112 32 123 Q43 130 53 119 M96 111 Q110 116 107 127 Q97 134 89 123" fill="#ffd65c" stroke="#9b703b" stroke-width="3" stroke-linecap="round"/><path d="M18 40 Q22 31 30 37 M112 29 Q121 25 125 35" fill="none" stroke="#f4c35a" stroke-width="4" stroke-linecap="round"/><path d="M110 48 C110 39 122 39 122 48 C122 55 110 62 110 62 C110 62 98 55 98 48 C98 39 110 39 110 48Z" fill="#e98c9b"/></svg></span>';
const backCoverHTML = `<span class="back-cover-content"><span class="back-title">a little love</span><span class="back-heart" aria-hidden="true">♡</span><span class="back-small">klik love nya.</span></span>`;

const pages = [
  `<span class="tape"></span><div class="polaroid photo-main"><img src="../public/g2_r.jpg"><span class="caption">our little memory</span></div><h2 class="hero-title">Happy Birthday!</h2><p class="hand hero-note">Semoga hari ini jadi awal dari banyak hal baik yang datang ke hidup kamu.</p><span class="stamp">SPECIAL<br>DAY</span>`,
  `<span class="label">A LITTLE LETTER</span><h2 class="script">For you ♡</h2><p>Selamat ulang tahun, <b>Raraa<3.</b><br><br>Semoga kamu selalu dikelilingi orang-orang yang tulus, diberikan kesehatan, dimudahkan semua urusannya, dan satu per satu impian kamu bisa jadi nyata.</p><div class="polaroid photo-small"><img src="../public/g1_2.jpg"><span class="caption">little moment</span></div>`,
  `<div class="memory-title">OUR LITTLE MEMORIES</div><div class="grid"><div class="polaroid"><img src="../public/g2_3.jpg"><span class="caption">one day...</span></div><div class="polaroid"><img src="../public/g1_4.jpg"><span class="caption">good memories</span></div><div class="polaroid"><img src="../public/g1.jpg"><span class="caption">always ♡</span></div><div class="polaroid"><img src="../public/Gsama.jpg"><span class="caption">us</span></div></div>`,
  `<span class="label">A LETTER FOR YOU</span><h2 class="script">Untuk kamu,</h2><p class="letter">Terima kasih sudah hadir dan membuat banyak hari terasa lebih berwarna. Aku mungkin nggak selalu pandai mengungkapkan semuanya, tapi aku harap kamu tahu kalau kamu itu berharga.<br>Jangan berhenti jadi versi terbaik dari diri kamu. Jalan pelan-pelan juga nggak apa-apa. Yang penting terus maju.</p><div class="signature">— dari Azii ♡</div>`,
  `<div class="final"><div class="stars">✦ ✧ ✦</div><div class="final-title">One more thing...</div><p class="final-note">Semoga ulang tahunmu kali ini menjadi salah satu hari yang paling kamu ingat.</p><div class="big-photo"><img src="../public/g2s.jpg"></div><div class="final-title">Happy Birthday ♡</div></div>`
];

const backCover = `<div class="back-cover-content"><button class="back-mark" type="button" aria-label="Buka halaman rahasia">♡</button><div class="back-title">a little love, just for you</div><div class="back-small">tap the heart to open a little secret</div></div>`;


let opened = false;
let index = 0; // index of the left page in the current two-page spread
let busy = false;
let touchX = 0;
let blankMode = false;
const FLIP_MS = 1050;

const pageTemplates = pages.map(html => {
  const t = document.createElement('template');
  t.innerHTML = html;
  return t;
});
const backTemplate = document.createElement('template');
backTemplate.innerHTML = backCover;

// Pre-render every page at book-page dimensions before the cover is opened.
const preRender = document.createElement('div');
preRender.className = 'pre-render';
preRender.setAttribute('aria-hidden', 'true');
pageTemplates.forEach((template, i) => {
  const page = document.createElement('div');
  page.className = 'pre-page paper texture';
  page.dataset.page = i;
  page.appendChild(template.content.cloneNode(true));
  preRender.appendChild(page);
});
const preBack = document.createElement('div');
preBack.className = 'pre-page paper texture';
preBack.appendChild(backTemplate.content.cloneNode(true));
preRender.appendChild(preBack);
document.body.appendChild(preRender);

function waitForImages(){
  const imgs = [...preRender.querySelectorAll('img')];
  return Promise.all(imgs.map(img => {
    if (img.complete) return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
    return new Promise(resolve => {
      img.addEventListener('load', resolve, {once:true});
      img.addEventListener('error', resolve, {once:true});
    });
  }));
}
function cloneContent(source){
  if (!source) return document.createDocumentFragment();
  if (source.content) return source.content.cloneNode(true);
  return source.cloneNode(true);
}
function mount(target, source){
  if (target) target.replaceChildren(cloneContent(source));
}
function fillBook(){
  // Render the two-page spread together. Blank mode is opened by the back-cover heart.
  if (blankMode) { mount(leftContent, null); mount(rightContent, null); updateStacks(); return; }
  mount(leftContent, index > 0 ? pageTemplates[index] : pageTemplates[0]);
  if (index === 0) {
    // The opening spread starts with page 1 on the left and page 2 on the right.
    mount(leftContent, pageTemplates[0]);
    mount(rightContent, pageTemplates[1]);
  } else if (index < pages.length) {
    mount(rightContent, index + 1 < pages.length ? pageTemplates[index + 1] : document.createDocumentFragment());
  } else {
    mount(rightContent, backTemplate);
  }
  updateStacks();
}
function updateStacks(){
  const remaining = Math.max(0, pages.length - index - 2);
  const previous = Math.max(0, index);
  rightStack.style.opacity = remaining > 0 ? '1' : '.55';
  leftStack.style.opacity = previous > 0 ? '1' : '.55';
  // Repeating edge lines read as many thin sheets, not two thick rectangles.
  rightStack.style.setProperty('--stack-count', Math.max(1, Math.ceil(remaining / 2)));
  leftStack.style.setProperty('--stack-count', Math.max(1, Math.ceil(previous / 2)));
  rightStack.style.width = `calc(50% - ${6 + remaining * .72}px)`;
  leftStack.style.width = `calc(50% - ${6 + previous * .72}px)`;
}
function setTurnFaces(front, back){ mount(sheetFront, front); mount(sheetBack, back); }
function animateSheet(direction, front, back){
  return new Promise(resolve => {
    setTurnFaces(front, back);
    turnSheet.classList.add('active');
    turnSheet.style.transition = 'none';
    turnSheet.style.transform = direction === 'next' ? 'rotateY(0deg)' : 'rotateY(-180deg)';
    turnSheet.style.setProperty('--flip-shadow', direction === 'next' ? '1' : '-1');
    // Force a single style flush, then use WAAPI for a consistent compositor animation.
    void turnSheet.offsetWidth;
    const from = direction === 'next' ? 0 : -180;
    const to = direction === 'next' ? -180 : 0;
    const animation = turnSheet.animate([
      { transform:`rotateY(${from}deg) translateZ(0px)`, filter:'drop-shadow(0 3px 3px #47372918)' },
      { offset:.48, transform:`rotateY(${(from+to)/2}deg) translateZ(1px)`, filter:'drop-shadow(0 11px 8px #47372932)' },
      { transform:`rotateY(${to}deg) translateZ(0px)`, filter:'drop-shadow(0 2px 3px #47372914)' }
    ], {duration:FLIP_MS, easing:'cubic-bezier(.42,0,.2,1)', fill:'forwards'});
    animation.onfinish = () => {
      animation.cancel();
      turnSheet.classList.remove('active');
      turnSheet.style.transform = '';
      turnSheet.style.transition = '';
      resolve();
    };
  });
}
async function openAlbum(openBlank = false){
  if (opened || busy) return;
  busy = true;
  await waitForImages();
  closedBook.classList.remove('is-back');
  closedBook.innerHTML = frontCoverHTML;
  opened = true; blankMode = openBlank; index = 0; fillBook();
  closedBook.classList.add('hide');
  openBook.setAttribute('aria-hidden','false');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    openBook.classList.add('open');
    busy = false;
  }));
  gesture.classList.remove('hide');
  gesture.textContent = 'geser untuk membalik halaman';
}
function closeToFrontCover(){
  if (!opened || busy) return;
  busy = true;
  opened = false;
  openBook.classList.remove('open');
  openBook.setAttribute('aria-hidden','true');
  closedBook.innerHTML = frontCoverHTML;
  closedBook.classList.remove('is-back','hide');
  index = 0;
  gesture.classList.add('hide');
  window.setTimeout(() => { busy = false; }, 650);
}
function closeToBackCover(){
  if (!opened) return;
  busy = true;
  opened = false;
  openBook.classList.remove('open');
  openBook.setAttribute('aria-hidden','true');
  closedBook.innerHTML = backCoverHTML;
  closedBook.classList.add('is-back');
  closedBook.classList.remove('hide');
  index = 0;
  gesture.classList.add('hide');
  window.setTimeout(() => { busy = false; }, 650);
}
async function nextPage(){
  if (!opened || busy) return;
  if (blankMode || index >= pages.length - 1) {
    closeToBackCover();
    return;
  }
  busy = true;
  const old = index;
  const front = pageTemplates[Math.min(old + 1, pages.length - 1)];
  const back = pageTemplates[Math.min(old + 2, pages.length - 1)];
  await animateSheet('next', front, back);
  index = Math.min(old + 2, pages.length - 1);
  fillBook();
  gesture.textContent = index >= pages.length - 1 ? 'geser lagi untuk menutup buku' : 'geser untuk membalik dua halaman';
  busy = false;
}
async function prevPage(){
  if (!opened || busy) return;
  if (index === 0) { closeToFrontCover(); return; }
  busy = true;
  const old = index;
  const front = pageTemplates[Math.min(old, pages.length - 1)];
  const back = pageTemplates[Math.max(0, old - 1)];
  await animateSheet('prev', front, back);
  index = Math.max(0, old - 2);
  fillBook();
  gesture.textContent = index === 0 ? 'halaman pertama' : 'geser untuk membalik dua halaman';
  busy = false;
}

closedBook.addEventListener('click', () => {
  if (closedBook.classList.contains('is-back')) {
    window.location.href = 'game.html';
    return;
  }
  openAlbum(false);
});
openBook.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; }, {passive:true});
openBook.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].screenX - touchX;
  if (Math.abs(dx) < 45) return;
  dx < 0 ? nextPage() : prevPage();
}, {passive:true});
openBook.addEventListener('click', e => {
  if (e.target.closest('button,a,input,textarea')) return;
  const rect = openBook.getBoundingClientRect();
  e.clientX - rect.left < rect.width / 2 ? prevPage() : nextPage();
});
document.addEventListener('keydown', e => {
  if (!opened) return;
  if (e.key === 'ArrowRight') nextPage();
  if (e.key === 'ArrowLeft') prevPage();
});
fillBook();
waitForImages();
