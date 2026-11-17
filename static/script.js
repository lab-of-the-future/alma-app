// =========================================================
// ALMA website script
// =========================================================

// 1) Video slots: show each video once its file exists, otherwise keep the illustration.
document.querySelectorAll('.video-slot video').forEach(function (video) {
  var slot = video.closest('.video-slot');
  function show() { slot.classList.add('has-video'); }
  if (video.readyState >= 1) show();
  video.addEventListener('loadedmetadata', show);
});

// 2) 96-well plate illustration.
//    Edit FILLED and CURRENT to change which wells are shown as done / in progress.
var FILLED = function (row, col) {
  // row: 0 = A ... 7 = H, col: 1 ... 12
  return row < 2 || (row === 2 && col <= 6);   // rows A–B and C1–C6
};
var CURRENT = 'C7';

var plate = document.querySelector('[data-plate]');
if (plate) {
  var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  var html = '<div class="plate-row" aria-hidden="true"><span></span>';
  for (var c = 1; c <= 12; c++) html += '<span>' + c + '</span>';
  html += '</div>';

  letters.forEach(function (letter, r) {
    html += '<div class="plate-row" aria-hidden="true"><span>' + letter + '</span>';
    for (var col = 1; col <= 12; col++) {
      var id = letter + col;
      var cls = id === CURRENT ? 'well current' : FILLED(r, col) ? 'well filled' : 'well';
      html += '<span class="' + cls + '"></span>';
    }
    html += '</div>';
  });
  plate.innerHTML = html;
}
