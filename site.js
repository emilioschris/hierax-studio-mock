/* =========================================================
   Buteo Studio · shared script for every page
   Name, social links, phone menu, category bar.
   ========================================================= */

/* ---------- Settings: edit these ---------- */
const STUDIO_NAME = 'Buteo Studio';

// Paste the real profile links here.
const SOCIAL = { instagram: '#', facebook: '#', youtube: '#' };

// The filter bar. Each name (except All) matches a piece's "collection" in index.html.
const COLLECTIONS = ['All', 'Akamas Collection'];

/* ---------- Name and year ---------- */
document.querySelectorAll('[data-studio-name]').forEach(el => { el.textContent = STUDIO_NAME; });
document.title = document.title.replace('Buteo Studio', STUDIO_NAME);
document.querySelectorAll('.wordmark').forEach(el => el.setAttribute('aria-label', STUDIO_NAME + ', by Emilios C. Christodoulou'));
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

/* ---------- Social icons ---------- */
const ICONS = {
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
  facebook:  '<path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z"/>',
  youtube:   '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.5v5l4.5-2.5z"/>',
};
const SOCIAL_LABELS = { instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube' };
document.querySelectorAll('[data-social-list]').forEach(list => {
  list.innerHTML = Object.entries(SOCIAL).map(([key, url]) =>
    `<li><a href="${url}" aria-label="${SOCIAL_LABELS[key]}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[key]}</svg></a></li>`
  ).join('');
});

/* ---------- Phone menu ---------- */
const menuBtn = document.getElementById('menu-btn');
const drawer = document.getElementById('drawer');
const setMenu = open => {
  drawer.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
menuBtn.addEventListener('click', () => setMenu(!drawer.classList.contains('is-open')));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* ---------- Category bar ----------
   On the catalogue page (body data-page="catalogue") it filters the grid in place.
   A collection page (body data-collection="...") shows its own button as selected.
   On any other page it goes to the catalogue with that collection chosen. */
const BUTEO = {
  collection: new URLSearchParams(location.search).get('collection') || 'All',
  onFilter: null,
};
if (!COLLECTIONS.includes(BUTEO.collection)) BUTEO.collection = 'All';

const catList = document.getElementById('categories');
const isCatalogue = document.body.dataset.page === 'catalogue';
const pageCollection = document.body.dataset.collection || null;
const selected = isCatalogue ? BUTEO.collection : pageCollection;
catList.innerHTML = COLLECTIONS.map(c =>
  `<li><button class="categories__btn caps" type="button" data-cat="${c}" aria-pressed="${c === selected}">${c}</button></li>`
).join('');
catList.addEventListener('click', e => {
  const btn = e.target.closest('button[data-cat]');
  if (!btn) return;
  const c = btn.dataset.cat;
  const query = c === 'All' ? '' : '?collection=' + encodeURIComponent(c);
  if (!isCatalogue) { if (c !== pageCollection) location.href = 'index.html' + query; return; }
  if (c === BUTEO.collection) return;
  BUTEO.collection = c;
  catList.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b === btn));
  history.replaceState(null, '', location.pathname + query);
  if (BUTEO.onFilter) BUTEO.onFilter(c);
});
