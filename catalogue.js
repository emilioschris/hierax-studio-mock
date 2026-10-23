/* =========================================================
   Buteo Studio · catalogue data and grid
   Used by index.html (all pieces, filtered by the category bar)
   and akamas.html (Akamas Collection only).
   ========================================================= */

/* ---------- Catalogue data: edit this ---------- */
// One entry per piece. Maps to a Shopify product:
//   name -> title, category -> product type, collection -> collection, species -> a variant option or metafield,
//   status "sold" -> sold out (no inventory), image -> featured image URL.
// Leave image empty to show a wood-toned placeholder.
const PIECES = [
  { id: 1,  name: 'The Bench',          category: 'Benches', species: 'White Oak',    collection: 'Akamas Collection', status: 'sold',      image: '' },
  { id: 2,  name: 'Low Coffee Table',   category: 'Tables',  species: 'Black Walnut', collection: 'Akamas Collection', status: 'sold',      image: '' },
  { id: 3,  name: 'Blanket Chest',      category: 'Storage', species: 'Cherry',       collection: 'Akamas Collection', status: 'sold',      image: '' },
  { id: 4,  name: 'Writing Desk',       category: 'Desks',   species: 'Hard Maple',   collection: 'Akamas Collection', status: 'available', image: '' },
  { id: 5,  name: 'Dining Chair',       category: 'Chairs',  species: 'White Oak',    collection: 'Akamas Collection', status: 'sold',      image: '' },
  { id: 6,  name: 'Serving Board',      category: 'Objects', species: 'Cherry',       collection: 'Akamas Collection', status: 'available', image: '' },
  { id: 7,  name: 'Entry Bench',        category: 'Benches', species: 'Black Walnut', collection: 'Akamas Collection', status: 'available', image: '' },
  { id: 8,  name: 'Dining Table',       category: 'Tables',  species: 'White Oak',    collection: 'Akamas Collection', status: 'sold',      image: '' },
  { id: 9,  name: 'Lounge Chair',       category: 'Chairs',  species: 'Black Walnut', collection: 'Akamas Collection', status: 'available', image: '' },
  { id: 10, name: 'Sideboard',          category: 'Storage', species: 'White Oak',    collection: '',                  status: 'sold',      image: '' },
  { id: 11, name: 'Standing Desk',      category: 'Desks',   species: 'Black Walnut', collection: '',                  status: 'available', image: '' },
  { id: 12, name: 'Candle Stand',       category: 'Objects', species: 'Hard Maple',   collection: '',                  status: 'sold',      image: '' },
  { id: 13, name: 'Garden Bench',       category: 'Benches', species: 'White Oak',    collection: '',                  status: 'sold',      image: '' },
  { id: 14, name: 'Side Table',         category: 'Tables',  species: 'Cherry',       collection: '',                  status: 'available', image: '' },
  { id: 15, name: 'Three-Leg Stool',    category: 'Chairs',  species: 'Hard Maple',   collection: '',                  status: 'sold',      image: '' },
  { id: 16, name: 'Wall Cabinet',       category: 'Storage', species: 'Cherry',       collection: '',                  status: 'available', image: '' },
  { id: 17, name: "Child's Desk",       category: 'Desks',   species: 'Hard Maple',   collection: '',                  status: 'sold',      image: '' },
  { id: 18, name: 'Turned Bowl',        category: 'Objects', species: 'Black Walnut', collection: '',                  status: 'available', image: '' },
  { id: 19, name: 'Bed-End Bench',      category: 'Benches', species: 'Cherry',       collection: '',                  status: 'available', image: '' },
  { id: 20, name: 'Console Table',      category: 'Tables',  species: 'Black Walnut', collection: '',                  status: 'sold',      image: '' },
  { id: 21, name: 'Rocking Chair',      category: 'Chairs',  species: 'Cherry',       collection: '',                  status: 'sold',      image: '' },
  { id: 22, name: 'Bookcase',           category: 'Storage', species: 'Hard Maple',   collection: '',                  status: 'available', image: '' },
  { id: 23, name: 'Partners Desk',      category: 'Desks',   species: 'White Oak',    collection: '',                  status: 'available', image: '' },
  { id: 24, name: 'Mirror Frame',       category: 'Objects', species: 'White Oak',    collection: '',                  status: 'sold',      image: '' },
  { id: 25, name: 'Kitchen Table',      category: 'Tables',  species: 'Hard Maple',   collection: '',                  status: 'available', image: '' },
  { id: 26, name: 'Wall Shelf',         category: 'Objects', species: 'Cherry',       collection: '',                  status: 'available', image: '' },
  { id: 27, name: 'Hall Chest',         category: 'Storage', species: 'Black Walnut', collection: '',                  status: 'sold',      image: '' },
];

const PAGE_SIZE = 9;

/* ---------- Grid with scroll loading ----------
   Needs #grid, #empty and #sentinel on the page.
   startCatalogue('All') shows everything; startCatalogue('Akamas Collection') shows one collection.
   Returns a function that switches the collection (used by the category bar). */
function startCatalogue(initialCollection) {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const sentinel = document.getElementById('sentinel');
  const WOOD = { 'White Oak': 'oak', 'Black Walnut': 'walnut', 'Cherry': 'cherry', 'Hard Maple': 'maple' };
  let active = initialCollection;
  let list = [];
  let shown = 0;

  const pad = n => String(n).padStart(2, '0');
  const tileHTML = p => `
    <li class="tile ${WOOD[p.species] || 'oak'}">
      ${p.image ? `<img src="${p.image}" alt="${p.name} in ${p.species}" loading="lazy">` : `<span class="tile__num" aria-hidden="true">No. ${pad(p.id)}</span>`}
      ${p.status === 'sold' ? '<span class="tile__sold caps">Sold</span>' : ''}
      <div class="tile__info">
        <span class="tile__name">${p.name}</span>
        <span class="tile__meta caps">${p.species} · ${p.category}</span>
      </div>
    </li>`;

  const observer = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) loadMore();
  }, { rootMargin: '0px 0px 300px 0px' });

  function loadMore() {
    const next = list.slice(shown, shown + PAGE_SIZE);
    grid.insertAdjacentHTML('beforeend', next.map(tileHTML).join(''));
    shown += next.length;
    // Re-observe so the observer checks again if the sentinel is still in view.
    observer.unobserve(sentinel);
    if (shown < list.length) observer.observe(sentinel);
  }

  function reset() {
    list = active === 'All' ? PIECES : PIECES.filter(p => p.collection === active);
    grid.innerHTML = '';
    shown = 0;
    empty.hidden = list.length > 0;
    loadMore();
  }

  reset();
  return c => { active = c; reset(); };
}
