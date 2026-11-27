function g(i) { return document.getElementById(i); }

/* Цветовой круг и палитра */
var hue = 330, col = '#ec4899', cw = g('cw'), cx = cw.getContext('2d');
for (var a = 0; a < 360; a++) {
  cx.beginPath(); cx.moveTo(65, 65);
  cx.arc(65, 65, 64, (a - 1) / 57.295, (a + 1) / 57.295);
  cx.closePath(); cx.fillStyle = 'hsl(' + a + ',100%,50%)'; cx.fill();
}
cx.beginPath(); cx.arc(65, 65, 45, 0, 6.28); cx.fillStyle = '#10163b'; cx.fill();

function uSv() {
  g('sv').style.background = 'linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,hsl(' + hue + ',100%,50%))';
}
uSv();

function sCol(c) { col = c; g('sv').style.borderColor = c; }
cw.onclick = function(e) {
  var r = cw.getBoundingClientRect(), ang = Math.atan2(e.clientY - r.top - 65, e.clientX - r.left - 65) / 0.01745;
  if (ang < 0) ang += 360; hue = Math.round(ang); uSv(); sCol('hsl(' + hue + ',100%,50%)');
};
g('sv').onclick = function(e) {
  var r = this.getBoundingClientRect();
  var x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
  var y = Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height));
  sCol('hsl(' + hue + ',' + Math.round(x / 0.01) + '%,' + Math.round(y * (100 - x / 0.02)) + '%)');
};

new Array('#ef4444','#f97316','#facc15','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#ffffff','#9ca3af','#4b5563','#000000').forEach(function(c) {
  var d = document.createElement('div'); d.className = 'sw'; d.style.background = c;
  d.onclick = function() { sCol(c); }; g('sws').appendChild(d);
});

/* Ползунки с обновлением цифр */
g('sz').oninput = function() { g('szv').textContent = this.value; };
g('al').oninput = function() { g('alv').textContent = this.value + '%'; };
g('sb').oninput = function() { g('sbv').textContent = this.value + '%'; };

/* Выпадающий список «Холст» со скрытием через глаз */
function togHList() {
  var h = g('hdrop');
  h.style.display = h.style.display == 'flex' ? 'none' : 'flex';
}
function togEye() {
  var hidden = l1.style.opacity == '0';
  l1.style.opacity = hidden ? '1' : '0';
  g('eye1').style.opacity = hidden ? '1' : '0.35';
}

/* Инструменты и рисование */
var l1 = g('l1'), x1 = l1.getContext('2d'), tl = 'brush', dr = false, sx = 0, sy = 0;
function clMy() { x1.clearRect(0, 0, 620, 420); }
function st(t) {
  tl = t;
  document.querySelectorAll('.tg .tb').forEach(function(b) { b.classList.remove('act'); });
  if (g('t-' + t)) g('t-' + t).classList.add('act');
}
function gp(e) {
  var r = l1.getBoundingClientRect();
  var x = e.touches ? e.touches.item(0).clientX : e.clientX;
  var y = e.touches ? e.touches.item(0).clientY : e.clientY;
  return { x: (x - r.left) / (r.width / 620), y: (y - r.top) / (r.height / 420) };
}

l1.onmousedown = l1.ontouchstart = function(e) {
  var p = gp(e);
  if (tl == 'fill') {
    x1.globalAlpha = g('al').value / 100; x1.globalCompositeOperation = 'source-over';
    x1.fillStyle = col; x1.fillRect(0, 0, 620, 420); x1.globalAlpha = 1; return;
  }
  if (tl == 'pick') {
    var d = x1.getImageData(Math.floor(p.x), Math.floor(p.y), 1, 1).data;
    if (d.at(3) > 0) sCol('rgb(' + d.at(0) + ',' + d.at(1) + ',' + d.at(2) + ')');
    st('brush'); return;
  }
  dr = true; sx = p.x; sy = p.y;
};

l1.onmousemove = l1.ontouchmove = function(e) {
  if (!dr) return; e.preventDefault();
  var p = gp(e), sb = g('sb').value / 100;
  var nx = sx + (p.x - sx) - (p.x - sx) / 1.3 * sb;
  var ny = sy + (p.y - sy) - (p.y - sy) / 1.3 * sb;
  var sz = g('sz').value, al = g('al').value / 100;
  x1.lineCap = 'round'; x1.lineJoin = 'round'; x1.shadowBlur = 0;

  if (tl == 'erase') {
    x1.globalCompositeOperation = 'destination-out'; x1.globalAlpha = 1; x1.lineWidth = sz;
  } else {
    x1.globalCompositeOperation = 'source-over'; x1.strokeStyle = col; x1.fillStyle = col;
    if (tl == 'spray') {
      x1.globalAlpha = al / 1.6;
      for (var i = 0; i < 20; i++) x1.fillRect(nx + (Math.random() - 0.5) / 0.5 * sz, ny + (Math.random() - 0.5) / 0.5 * sz, 1.5, 1.5);
      sx = nx; sy = ny; return;
    }
    if (tl == 'soft') { x1.shadowColor = col; x1.shadowBlur = sz / 1.1; x1.globalAlpha = al / 2.2; }
    else if (tl == 'mark') { x1.lineCap = 'square'; x1.globalAlpha = al / 1.8; }
    else { x1.globalAlpha = al; }
    x1.lineWidth = sz;
  }
  x1.beginPath(); x1.moveTo(sx, sy); x1.lineTo(nx, ny); x1.stroke();
  sx = nx; sy = ny;
};

addEventListener('mouseup', function() { dr = false; x1.globalAlpha = 1; x1.shadowBlur = 0; });
addEventListener('touchend', function() { dr = false; x1.globalAlpha = 1; x1.shadowBlur = 0; });

/* Масштаб (+ / -) */
var z = 1;
function zm(d) {
  z = Math.max(0.6, Math.min(2.2, z + d));
  g('stg').style.width = Math.round(620 / 1 * z) + 'px';
  g('stg').style.height = Math.round(420 / 1 * z) + 'px';
  g('zv').textContent = Math.round(z / 0.01) + '%';
}

/* Чат и смайлы */
var bw = new Array('бля','сука','хуй','пизд','еба','секс','порно');
function sCh() {
  var i = g('cin'), v = i.value.trim(); if (!v) return;
  for (var k = 0; k < bw.length; k++) {
    if (v.toLowerCase().indexOf(bw.at(k)) != -1) { alert('Запрещены мат и 18+ слова!'); return; }
  }
  var m = document.createElement('div'); m.className = 'cm'; m.textContent = '🌙 Ты: ' + v;
  g('cf').appendChild(m); i.value = ''; g('cf').scrollTop = g('cf').scrollHeight;
}
function tDr() {
  var d = g('sdr'); d.style.display = d.style.display == 'flex' ? 'none' : 'flex'; d.innerHTML = '';
  var r = localStorage.getItem('di_st'), a = r ? r.split('|').filter(Boolean) : new Array();
  if (!a.length) { d.textContent = 'Нарисуй смайл в меню!'; return; }
  a.forEach(function(u) {
    var im = document.createElement('img'); im.src = u;
    im.onclick = function() {
      var m = document.createElement('div'); m.className = 'cm'; m.textContent = '🌙 Ты:';
      var p = document.createElement('img'); p.src = u; m.appendChild(p);
      g('cf').appendChild(m); g('cf').scrollTop = g('cf').scrollHeight; d.style.display = 'none';
    };
    d.appendChild(im);
  });
}
