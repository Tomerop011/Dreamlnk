```javascript
function g(i) { return document.getElementById(i); }

/* === ЦВЕТОВОЙ КРУГ И ПАЛИТРА === */
var curHue = 330, curColor = '#ec4899';
var cw = g('cwheel'), cwx = cw.getContext('2d');
for (var a = 0; a < 360; a++) {
  cwx.beginPath();
  cwx.moveTo(73, 73);
  cwx.arc(73, 73, 72, (a - 1) * Math.PI / 180, (a + 1) * Math.PI / 180);
  cwx.closePath();
  cwx.fillStyle = 'hsl(' + a + ',100%,50%)';
  cwx.fill();
}
cwx.beginPath(); cwx.arc(73, 73, 52, 0, 6.28); cwx.fillStyle = '#10163b'; cwx.fill();

function updateSvBox() {
  g('svbox').style.background = 'linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,hsl(' + curHue + ',100%,50%))';
}
updateSvBox();

function setActiveColor(hex) {
  curColor = hex;
  g('svbox').style.borderColor = hex;
}

cw.onclick = function(e) {
  var r = cw.getBoundingClientRect();
  var dx = e.clientX - r.left - 73, dy = e.clientY - r.top - 73;
  var ang = Math.atan2(dy, dx) * 180 / Math.PI;
  if (ang < 0) ang += 360;
  curHue = Math.round(ang);
  updateSvBox();
  setActiveColor('hsl(' + curHue + ',100%,50%)');
};

g('svbox').onclick = function(e) {
  var r = this.getBoundingClientRect();
  var sx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
  var sy = Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height));
  var l = Math.round(sy * (100 - sx * 50));
  setActiveColor('hsl(' + curHue + ',' + Math.round(sx * 100) + '%,' + l + '%)');
};

var presetCols = new Array('#ef4444','#f97316','#facc15','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#ffffff','#9ca3af','#4b5563','#000000');
presetCols.forEach(function(c) {
  var d = document.createElement('div');
  d.className = 'sw'; d.style.background = c;
  d.onclick = function() { setActiveColor(c); };
  g('swatches').appendChild(d);
});

/* === ДИНАМИЧЕСКИЕ ХОЛСТЫ ИГРОКОВ (сначала 1, при входе друга появляется 2-й) === */
var l1 = g('layer-1'), x1 = l1.getContext('2d');
var l2 = null, x2 = null, activeLayer = 1, friendJoined = false;

function selectLayer(n) {
  activeLayer = n;
  g('tab-1').classList.toggle('act', n == 1);
  if (g('tab-2')) g('tab-2').classList.toggle('act', n == 2);
}

function simulateFriendJoin() {
  if (friendJoined) return;
  friendJoined = true;
  g('sim-btn').style.display = 'none';

  var pTag = document.createElement('div');
  pTag.className = 'player-tag';
  pTag.innerHTML = '👤 <b>Друг (Холст 2)</b>';
  g('players-box').appendChild(pTag);

  l2 = document.createElement('canvas');
  l2.id = 'layer-2'; l2.width = 640; l2.height = 440;
  g('stage').insertBefore(l2, l1);
  x2 = l2.getContext('2d');

  var tab2 = document.createElement('button');
  tab2.className = 'layer-tab'; tab2.id = 'tab-2';
  tab2.textContent = '⬜ Холст 2 (друг)';
  tab2.onclick = function() { selectLayer(2); };
  g('layers-bar').insertBefore(tab2, g('tab-1'));

  var m = document.createElement('div'); m.className = 'cmsg';
  m.style.color = '#4ade80'; m.textContent = '✨ Друг зашёл в комнату и получил Холст 2!';
  g('cfeed').appendChild(m);
}

function clearMyLayer() {
  x1.clearRect(0, 0, 640, 440);
}

/* === ИНСТРУМЕНТЫ И РИСОВАНИЕ === */
var tool = 'brush', drawing = false, sx = 0, sy = 0;
g('sz').oninput = function() { g('szv').textContent = this.value; };
g('al').oninput = function() { g('alv').textContent = this.value + '%'; };
g('st').oninput = function() { g('stv').textContent = this.value + '%'; };

function setTool(t) {
  tool = t;
  document.querySelectorAll('.tools-grid .tbtn').forEach(function(b) { b.classList.remove('act'); });
  if (g('tb-' + t)) g('tb-' + t).classList.add('act');
}

function getPos(e) {
  var r = l1.getBoundingClientRect();
  var cx = e.touches ? e.touches.item(0).clientX : e.clientX;
  var cy = e.touches ? e.touches.item(0).clientY : e.clientY;
  return { x: (cx - r.left) * (640 / r.width), y: (cy - r.top) * (440 / r.height) };
}

l1.onmousedown = l1.ontouchstart = function(e) {
  if (activeLayer != 1) {
    alert('Это Холст 2 другого игрока! Переключись на свой «Холст 1», чтобы рисовать.');
    return;
  }
  var p = getPos(e);
  if (tool == 'fill') {
    x1.globalAlpha = g('al').value / 100;
    x1.globalCompositeOperation = 'source-over';
    x1.fillStyle = curColor;
    x1.fillRect(0, 0, 640, 440);
    x1.globalAlpha = 1;
    return;
  }
  if (tool == 'pick') {
    var d = x1.getImageData(Math.floor(p.x), Math.floor(p.y), 1, 1).data;
    if (d.at(3) > 0) setActiveColor('rgb(' + d.at(0) + ',' + d.at(1) + ',' + d.at(2) + ')');
    setTool('brush');
    return;
  }
  drawing = true; sx = p.x; sy = p.y;
};

l1.onmousemove = l1.ontouchmove = function(e) {
  if (!drawing) return;
  e.preventDefault();
  var p = getPos(e);
  var stab = g('st').value / 100;
  var nx = sx + (p.x - sx) * (1 - stab * 0.75);
  var ny = sy + (p.y - sy) * (1 - stab * 0.75);
  var size = g('sz').value;
  var alpha = g('al').value / 100;

  x1.lineCap = 'round';
  x1.lineJoin = 'round';
  x1.shadowBlur = 0;

  if (tool == 'erase') {
    x1.globalCompositeOperation = 'destination-out';
    x1.globalAlpha = 1;
    x1.lineWidth = size;
  } else {
    x1.globalCompositeOperation = 'source-over';
    x1.strokeStyle = curColor;
    x1.fillStyle = curColor;
    if (tool == 'spray') {
      x1.globalAlpha = alpha * 0.6;
      for (var i = 0; i < 22; i++) {
        x1.fillRect(nx + (Math.random() - 0.5) * size * 2, ny + (Math.random() - 0.5) * size * 2, 1.5, 1.5);
      }
      sx = nx; sy = ny; return;
    }
    if (tool == 'soft') { x1.shadowColor = curColor; x1.shadowBlur = size * 0.9; x1.globalAlpha = alpha * 0.45; }
    else if (tool == 'mark') { x1.lineCap = 'square'; x1.globalAlpha = alpha * 0.55; }
    else { x1.globalAlpha = alpha; }
    x1.lineWidth = size;
  }

  x1.beginPath();
  x1.moveTo(sx, sy);
  x1.lineTo(nx, ny);
  x1.stroke();
  sx = nx; sy = ny;
};

addEventListener('mouseup', function() { drawing = false; x1.globalAlpha = 1; x1.shadowBlur = 0; });
addEventListener('touchend', function() { drawing = false; x1.globalAlpha = 1; x1.shadowBlur = 0; });

/* === МАСШТАБ (+ / -) ДЛЯ СЕРЫХ ПОЛЗУНКОВ ПРОКРУТКИ === */
var zoom = 1;
function changeZoom(d) {
  zoom = Math.max(0.6, Math.min(2.2, zoom + d));
  var st = g('stage');
  st.style.width = Math.round(640 * zoom) + 'px';
  st.style.height = Math.round(440 * zoom) + 'px';
  g('zval').textContent = Math.round(zoom * 100) + '%';
}

function saveAll() {
  var tmp = document.createElement('canvas');
  tmp.width = 640; tmp.height = 440;
  var tx = tmp.getContext('2d');
  tx.fillStyle = '#ffffff'; tx.fillRect(0, 0, 640, 440);
  if (l2) tx.drawImage(l2, 0, 0);
  tx.drawImage(l1, 0, 0);
  var a = document.createElement('a'); a.download = 'dreamink-beta.png'; a.href = tmp.toDataURL(); a.click();
}

/* === ЧАТ КОМНАТЫ И СМАЙЛЫ === */
var banned = new Array('бля','сука','хуй','пизд','еба','секс','порно');
function sendChat() {
  var inp = g('cinp'), val = inp.value.trim();
  if (!val) return;
  for (var k = 0; k < banned.length; k++) {
    if (val.toLowerCase().indexOf(banned.at(k)) != -1) { alert('Запрещены мат и 18+ слова!'); return; }
  }
  var m = document.createElement('div'); m.className = 'cmsg'; m.textContent = '🌙 Ты: ' + val;
  g('cfeed').appendChild(m); inp.value = ''; g('cfeed').scrollTop = g('cfeed').scrollHeight;
}

function toggleDrawer() {
  var d = g('sdrawer');
  d.style.display = d.style.display == 'flex' ? 'none' : 'flex';
  d.innerHTML = '';
  var raw = localStorage.getItem('di_st');
  var arr = raw ? raw.split('|').filter(Boolean) : new Array();
  if (!arr.length) { d.textContent = 'Нарисуй смайл в меню!'; return; }
  arr.forEach(function(u) {
    var im = document.createElement('img'); im.src = u;
    im.onclick = function() {
      var m = document.createElement('div'); m.className = 'cmsg'; m.textContent = '🌙 Ты:';
      var pic = document.createElement('img'); pic.src = u; m.appendChild(pic);
      g('cfeed').appendChild(m); g('cfeed').scrollTop = g('cfeed').scrollHeight;
      d.style.display = 'none';
    };
    d.appendChild(im);
  });
}
