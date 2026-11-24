// The manifest contains only the photographs that exist in assets.
const categories = { portrait: 'Portraits', everyday: 'Everyday life', screen: 'On screen' };
const entries = [
  [1, 'A smile that stays', 'everyday'], [2, 'A role, a memory', 'screen'],
  [3, 'Portrait of a moment', 'portrait'], [4, 'In the limelight', 'screen'],
  [5, 'Behind the story', 'screen'], [6, 'In a patch of sunlight', 'portrait'],
  [7, 'Surrounded by love', 'everyday'], [8, 'A passing glance', 'portrait'],
  [9, 'The softest light', 'screen'], [10, 'When time stands still', 'screen'],
  [11, 'A moment of closeness', 'screen'], [12, 'Things left unsaid', 'screen'],
  [13, 'A scene to remember', 'screen'], [14, 'A still moment', 'portrait'],
  [15, 'Just one look', 'portrait'], [16, 'A lighter day', 'portrait'],
  [18, 'Through the leaves', 'everyday'], [19, 'Behind the camera', 'screen'],
  [20, 'Something sweet', 'everyday'], [21, 'An everyday meal', 'everyday'],
  [22, 'Between takes', 'everyday'], [24, 'Between ordinary days', 'portrait'],
  [25, 'Back to a scene', 'screen'], [27, 'A day on set', 'screen'],
  [28, 'Like a recollection', 'screen'], [29, 'A quiet moment', 'portrait'],
  [30, 'Sunlight at the window', 'everyday'], [31, 'An unhurried afternoon', 'everyday'],
  [32, 'A familiar corner', 'everyday'], [33, 'Through a quiet night', 'everyday'],
  [34, 'A day to remember', 'everyday']
];
const photos = entries.map(([id, title, category]) => ({ id, title, category, src: `assets/${String(id).padStart(3, '0')}.jpg` }));
const $ = selector => document.querySelector(selector);
const grid = $('#photoGrid');
const viewer = $('#viewer');
let filteredPhotos = photos;
let viewingPhotos = photos;
let current = 0;
let timer = null;
let returnFocus = null;

function renderCollection(category = 'all') {
  filteredPhotos = category === 'all' ? photos : photos.filter(photo => photo.category === category);
  grid.innerHTML = filteredPhotos.map(photo => `<button class="photo-card" data-photo="${photo.id}" aria-label="View photograph: ${photo.title}"><span class="photo-image-wrap"><img src="${photo.src}" alt="${photo.title} — 조찬현" loading="lazy" width="480" height="600"></span><span class="photo-label"><span>${photo.title}</span><i>${String(photo.id).padStart(3, '0')}</i></span><span class="photo-category">${categories[photo.category]}</span></button>`).join('');
  balanceRows();
  $('#filterStatus').textContent = `Showing ${filteredPhotos.length} photographs${category === 'all' ? '' : ` in ${categories[category]}`}.`;
}
function balanceRows() {
  const cards = [...grid.children];
  if (!cards.length) return;
  const columns = Number(getComputedStyle(grid).getPropertyValue('--columns')) || 6;
  const rows = Math.ceil(cards.length / columns);
  const base = Math.floor(cards.length / rows);
  const extra = cards.length % rows;
  let offset = 0;
  for (let row = 0; row < rows; row++) {
    const size = base + (row < extra ? 1 : 0);
    cards.slice(offset, offset + size).forEach(card => card.style.setProperty('--row-size', size));
    offset += size;
  }
}
new ResizeObserver(balanceRows).observe(grid);
renderCollection();
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  renderCollection(button.dataset.filter);
}));
function updatePhoto() {
  const photo = viewingPhotos[current];
  $('#viewerImage').src = photo.src;
  $('#viewerImage').alt = `${photo.title} — 조찬현`;
  $('#viewerCaption').textContent = `${photo.title} · ${categories[photo.category]}`;
  $('#viewerCount').textContent = `${String(current + 1).padStart(2, '0')} / ${String(viewingPhotos.length).padStart(2, '0')}`;
}
function openViewer(id, list = photos) {
  stopPlayback();
  viewingPhotos = list;
  current = Math.max(0, list.findIndex(photo => photo.id === id));
  returnFocus = document.activeElement;
  updatePhoto();
  viewer.showModal();
  document.body.classList.add('viewer-open');
  $('#closeViewer').focus();
}
function stopPlayback() {
  clearInterval(timer);
  timer = null;
  $('#togglePlay').textContent = 'Play slideshow';
  $('#togglePlay').setAttribute('aria-pressed', 'false');
}
function startPlayback() {
  stopPlayback();
  $('#togglePlay').textContent = 'Pause slideshow';
  $('#togglePlay').setAttribute('aria-pressed', 'true');
  timer = setInterval(() => {
    if (current === viewingPhotos.length - 1) { stopPlayback(); return; }
    current += 1;
    updatePhoto();
  }, 4000);
}
function movePhoto(step) {
  stopPlayback();
  current = (current + step + viewingPhotos.length) % viewingPhotos.length;
  updatePhoto();
}
document.addEventListener('click', event => {
  const card = event.target.closest('[data-photo]');
  if (card) openViewer(Number(card.dataset.photo), card.closest('#photoGrid') ? filteredPhotos : photos);
});
$('#closeViewer').addEventListener('click', () => viewer.close());
viewer.addEventListener('close', () => {
  stopPlayback();
  document.body.classList.remove('viewer-open');
  if (returnFocus?.isConnected) returnFocus.focus();
});
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); movePhoto(-1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); movePhoto(1); }
});
$('#prevPhoto').addEventListener('click', () => movePhoto(-1));
$('#nextPhoto').addEventListener('click', () => movePhoto(1));
$('#togglePlay').addEventListener('click', () => timer ? stopPlayback() : startPlayback());
$('#playCollection').addEventListener('click', () => {
  openViewer(filteredPhotos[0].id, filteredPhotos);
  startPlayback();
});


// The postcard opens into three short pages, preserving every letter paragraph.
const letterCard = document.querySelector('.postcard');
const letterSummary = letterCard.querySelector('summary');
const letterSheets = [...letterCard.querySelectorAll('.letter-sheet')];
let letterPage = 0;
function renderLetterPage(focusPage = false) {
  letterSheets.forEach((sheet, index) => { sheet.hidden = index !== letterPage; });
  $('#previousLetterPage').disabled = letterPage === 0;
  $('#nextLetterPage').disabled = letterPage === letterSheets.length - 1;
  $('#letterPageStatus').textContent = `Page ${letterPage + 1} of ${letterSheets.length}`;
  if (focusPage) letterSheets[letterPage].focus({ preventScroll: true });
}
letterCard.classList.add('paginated-letter');
$('#letterPagination').hidden = false;
$('#closeLetter').hidden = false;
renderLetterPage();
letterCard.addEventListener('toggle', () => {
  if (letterCard.open) {
    letterPage = 0;
    renderLetterPage();
    $('#closeLetter').focus({ preventScroll: true });
  } else {
    letterSummary.focus({ preventScroll: true });
  }
});
$('#previousLetterPage').addEventListener('click', () => {
  if (letterPage > 0) { letterPage -= 1; renderLetterPage(true); }
});
$('#nextLetterPage').addEventListener('click', () => {
  if (letterPage < letterSheets.length - 1) { letterPage += 1; renderLetterPage(true); }
});
$('#closeLetter').addEventListener('click', () => { letterCard.open = false; });
letterCard.addEventListener('keydown', event => {
  if (event.key === 'Escape' && letterCard.open) { event.preventDefault(); letterCard.open = false; }
});
