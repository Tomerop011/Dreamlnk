/* Аватарка: перетаскивание + тап чтобы спрятать в угол или вернуть на доску */
var ava = g('pava'), dragAva = false, avaMoved = false, ax = 0, ay = 0, avaDocked = false, savedX = 120, savedY = 120;
ava.onpointerdown = function(e) {
  e.stopPropagation();
  ava.setPointerCapture(e.pointerId);
  dragAva = true; avaMoved = false;
  ax = e.clientX - ava.offsetLeft;
  ay = e.clientY - ava.offsetTop;
};
ava.onpointermove = function(e) {
  if (!dragAva) return;
  var nx = Math.max(0, Math.min(575, e.clientX - ax));
  var ny = Math.max(0, Math.min(375, e.clientY - ay));
  if (Math.hypot(nx - ava.offsetLeft, ny - ava.offsetTop) > 14) {
    avaMoved = true;
    avaDocked = false;
    ava.style.opacity = '1';
    ava.style.transform = 'scale(1)';
  }
  if (avaMoved) {
    ava.style.left = nx + 'px';
    ava.style.top = ny + 'px';
  }
};
ava.onpointerup = function(e) {
  if (!dragAva) return;
  dragAva = false;
  if (!avaMoved) {
    if (!avaDocked) {
      savedX = ava.offsetLeft; savedY = ava.offsetTop;
      ava.style.left = '6px'; ava.style.top = '6px';
      ava.style.opacity = '0.55'; ava.style.transform = 'scale(0.75)';
      avaDocked = true;
    } else {
      ava.style.left = savedX + 'px'; ava.style.top = savedY + 'px';
      ava.style.opacity = '1'; ava.style.transform = 'scale(1)';
      avaDocked = false;
    }
  }
};
