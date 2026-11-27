function g(i) { return document.getElementById(i); }

function mw() {
  var p = g('mp'); p.style.opacity = '1';
  setTimeout(function() { p.style.opacity = '0'; }, 900);
  var a = new (AudioContext || webkitAudioContext)(), o = a.createOscillator(), n = a.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(520, a.currentTime);
  o.frequency.exponentialRampToValueAtTime(880, a.currentTime + 0.14);
  o.frequency.exponentialRampToValueAtTime(440, a.currentTime + 0.34);
  n.gain.setValueAtTime(0.22, a.currentTime);
  n.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.35);
  o.connect(n); n.connect(a.destination); o.start(); o.stop(a.currentTime + 0.35);
}

function om(i, t, x) { g('st').textContent = t; g('sx').textContent = x; g(i).style.display = 'flex'; }
function cm(i) { g(i).style.display = 'none'; }

var rf0 = localStorage.getItem('di_fr');
var fr = rf0 ? rf0.split('|').filter(Boolean) : new Array();

function rf() {
  var b = g('fl'); b.innerHTML = '';
  if (!fr.length) {
    var e = document.createElement('div');
    e.style.cssText = 'font-size:12px;color:#94a3b8;text-align:center;padding:6px 0';
    e.textContent = 'Пока никого нет. Нажми +';
    b.appendChild(e); return;
  }
  fr.forEach(function(n) {
    var r = document.createElement('div'); r.className = 'fr';
    var s = document.createElement('span'); s.textContent = '🌙 ' + n;
    var bt = document.createElement('button'); bt.className = 'db'; bt.textContent = '•••';
    bt.onclick = function() { oc(n); };
    r.appendChild(s); r.appendChild(bt); b.appendChild(r);
  });
}
rf();

function af() {
  var n = prompt('Введи ник друга:');
  if (n && n.trim()) { fr.push(n.trim()); localStorage.setItem('di_fr', fr.join('|')); rf(); }
}

var bw = new Array('бля', 'сука', 'хуй', 'пизд', 'еба', 'секс', 'порно');
function oc(n) { g('cf').textContent = 'Чат: ' + n; g('db').innerHTML = ''; g('cm').style.display = 'flex'; rs(); }

function sd() {
  var i = g('di'), v = i.value.trim();
  if (!v) return;
  for (var k = 0; k < bw.length; k++) {
    if (v.toLowerCase().indexOf(bw.at(k)) != -1) { alert('Запрещены мат и 18+ слова!'); return; }
  }
  var d = document.createElement('div'); d.className = 'bb'; d.textContent = v;
  var b = g('db'); b.appendChild(d); i.value = ''; b.scrollTop = b.scrollHeight;
}

var sk = g('sc'), kx = sk.getContext('2d'), dr = false;
function cs() { kx.fillStyle = '#fff'; kx.fillRect(0, 0, 110, 110); }
cs();

function ts() { var m = g('sm'); m.style.display = m.style.display == 'flex' ? 'none' : 'flex'; rs(); }
function gp(e) {
  var r = sk.getBoundingClientRect();
  var x = e.touches ? e.touches.item(0).clientX : e.clientX;
  var y = e.touches ? e.touches.item(0).clientY : e.clientY;
  return { x: x - r.left, y: y - r.top };
}

sk.onmousedown = sk.ontouchstart = function(e) { dr = true; var p = gp(e); kx.beginPath(); kx.moveTo(p.x, p.y); };
sk.onmousemove = sk.ontouchmove = function(e) {
  if (!dr) return; e.preventDefault();
  var p = gp(e); kx.strokeStyle = g('kc').value; kx.lineWidth = 4; kx.lineCap = 'round';
  kx.lineTo(p.x, p.y); kx.stroke();
};
addEventListener('mouseup', function() { dr = false; });
addEventListener('touchend', function() { dr = false; });

var rs0 = localStorage.getItem('di_st');
var ms = rs0 ? rs0.split('|').filter(Boolean) : new Array();

function rs() {
  var l = g('sl'); l.innerHTML = '';
  if (!ms.length) {
    var s = document.createElement('span');
    s.style.cssText = 'font-size:11px;color:#64748b';
    s.textContent = 'Пусто — нарисуй ниже и сохрани!';
    l.appendChild(s); return;
  }
  ms.forEach(function(u) {
    var im = document.createElement('img'); im.src = u; im.className = 'si';
    im.onclick = function() { sn(u); }; l.appendChild(im);
  });
}

function ss() { var u = sk.toDataURL(); ms.push(u); localStorage.setItem('di_st', ms.join('|')); cs(); rs(); }
function sn(u) {
  var d = document.createElement('div'); d.className = 'bb';
  var im = document.createElement('img'); im.src = u; d.appendChild(im);
  var b = g('db'); b.appendChild(d); b.scrollTop = b.scrollHeight; ts();
}
