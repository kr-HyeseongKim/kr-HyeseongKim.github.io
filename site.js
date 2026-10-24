// Builds the page from content/data.json.
// The easiest way to change the content is the local editor (homepage-admin).

const ICONS = {
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  orcid: '<circle cx="12" cy="12" r="9"/><path d="M9 10v6M9 7.5v.01M12.5 16v-6h1.8a3 3 0 0 1 0 6z"/>',
  cv: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  scholar: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/>',
  github: '<path d="M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
};
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const STATUS = { submitted: 'Submitted', review: 'Under review' }; // published shows no badge

const $$ = (key) => document.querySelectorAll(`[data-site="${key}"]`);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// Adds a full stop unless the text already ends with punctuation.
const stop = (s) => (/[.?!]$/.test(s) ? s : `${s}.`);
const visible = (list) => (list || []).filter((x) => !x.hidden);

function linkHTML({ label, url, icon, detail }) {
  const external = /^https?:/.test(url) ? ' target="_blank" rel="noopener"' : '';
  const svg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[icon] || ICONS.link}</svg>`;
  // The detail sits outside the button so it can be selected and copied.
  const text = detail ? `<span class="detail">${esc(detail)}</span>` : '';
  return `<li><a href="${esc(url)}"${external}>${svg}<span>${esc(label)}</span></a>${text}</li>`;
}

// date.kind: range (start – end), single (one date), ongoing (start – present), none
function formatDate(d) {
  if (!d || d.kind === 'none') return '';
  const one = (p) => (p && p.year ? (p.month ? `${MONTHS[p.month - 1]} ${p.year}` : `${p.year}`) : '');
  if (d.kind === 'single') return one(d.start);
  if (d.kind === 'ongoing') return one(d.start) ? `${one(d.start)} – present` : '';
  return [one(d.start), one(d.end)].filter(Boolean).join(' – ');
}

const badge = (text) => (text ? ` <span class="badge">${esc(text)}</span>` : '');

function authorsHTML(authors, me) {
  const html = esc(authors);
  return me ? html.split(esc(me)).join(`<strong>${esc(me)}</strong>`) : html;
}

function entryHTML(item) {
  const date = formatDate(item.date);
  const title = date
    ? `<h3 class="dated"><span>${esc(item.title)}</span><time>${esc(date)}</time></h3>`
    : `<h3>${esc(item.title)}</h3>`;
  const subtitle = item.subtitle ? `<p class="subtitle">${esc(item.subtitle)}</p>` : '';
  const lines = (item.details || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const details = lines.length ? `<ul>${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : '';
  return `<div class="entry">${title}${subtitle}${details}</div>`;
}

function publicationHTML(p, me) {
  let html = authorsHTML(p.authors, me);
  if (p.year) html += ` (${esc(p.year)}).`;
  if (p.title) html += ` ${esc(stop(p.title))}`;
  if (p.journal) {
    let source = `<em>${esc(p.journal)}${p.volume ? `, ${esc(p.volume)}` : ''}</em>`;
    if (p.issue) source += `(${esc(p.issue)})`;
    if (p.pages) source += `, ${esc(p.pages)}`;
    html += ` ${source}.`;
  }
  if (p.doi) html += ` <a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">doi:${esc(p.doi)}</a>`;
  return `<li>${html}${badge(STATUS[p.status])}</li>`;
}

function presentationHTML(p, me) {
  let html = authorsHTML(p.authors, me);
  if (p.year) html += ` (${esc(p.year)}).`;
  if (p.title) html += ` <em>${esc(stop(p.title))}</em>`;
  if (p.venue) html += ` ${esc(stop(p.venue))}`;
  return `<li>${html}${badge(p.format)}</li>`;
}

function sectionBody(s, me) {
  const intro = s.intro ? `<p class="intro">${esc(s.intro)}</p>` : '';
  switch (s.type) {
    case 'text': return marked.parse(s.body || '');
    case 'entries': return intro + visible(s.items).map(entryHTML).join('');
    case 'publications': return `<ol>${visible(s.items).map((p) => publicationHTML(p, me)).join('')}</ol>`;
    case 'presentations': return `<ol>${visible(s.items).map((p) => presentationHTML(p, me)).join('')}</ol>`;
    default: return '';
  }
}

let pages = []; // ids of sections shown on their own page

function render(data) {
  const sections = visible(data.sections).map((s) => ({ ...s, id: slug(s.title) }));
  const main = sections.filter((s) => s.page !== 'separate');
  const separate = sections.filter((s) => s.page === 'separate');
  pages = separate.map((s) => s.id);

  document.title = data.name;
  $$('name').forEach((el) => (el.textContent = data.name));
  $$('tagline').forEach((el) => (el.textContent = data.tagline || ''));
  $$('photo').forEach((img) => {
    if (!data.photo) return (img.hidden = true);
    img.hidden = false;
    img.src = data.photo;
    img.alt = `Photo of ${data.name}`;
    img.onerror = () => (img.hidden = true);
  });
  $$('cv').forEach((a) => {
    a.hidden = !data.cv;
    if (data.cv) a.href = data.cv;
  });
  $$('links').forEach((ul) => (ul.innerHTML = (data.links || []).map(linkHTML).join('')));

  const navItem = (s) => `<li><a href="#${s.id}">${esc(s.title)}</a></li>`;
  $$('nav').forEach((ul) => (ul.innerHTML = main.map(navItem).join('')));
  $$('pages').forEach((ul) => {
    ul.innerHTML = separate.map(navItem).join('');
    ul.hidden = !separate.length;
  });

  const [year, month] = (data.updated || '').split('-').map(Number);
  $$('footer').forEach((el) => {
    el.textContent = `© ${year || new Date().getFullYear()} ${data.name}` +
      (month ? ` · Last updated ${MONTHS_LONG[month - 1]} ${year}` : '');
  });

  $$('sections')[0].innerHTML = sections
    .map((s) => `<section id="${s.id}" data-page="${s.page === 'separate' ? 'separate' : 'main'}">` +
      `<h2>${esc(s.title)}</h2><div class="md">${sectionBody(s, data.highlight)}</div></section>`)
    .join('');
  route(false);
}

// Main sections share one scrolling page; a "separate" section replaces it when its link is opened.
function route(scroll = true) {
  const id = decodeURIComponent(location.hash.slice(1));
  const page = pages.includes(id) ? id : null;
  document.body.classList.toggle('on-page', !!page);
  document.querySelectorAll('section[id]').forEach((s) => {
    s.hidden = page ? s.id !== page : s.dataset.page === 'separate';
  });
  if (page) {
    scrollTo(0, 0);
    setActive(page);
  } else if (scroll && id) {
    document.getElementById(id)?.scrollIntoView();
  }
  if (!page) updateActive();
}

// ----- Menu highlight for the section currently on screen -----
const navLinks = () => [...document.querySelectorAll('.nav a')];
const setActive = (id) => navLinks().forEach((a) => a.classList.toggle('active', a.hash === `#${id}`));

// A clicked menu item stays highlighted until the reader scrolls on their own,
// so short sections near the bottom of the page still light up when chosen.
let clicked = null;
function updateActive() {
  if (clicked || document.body.classList.contains('on-page')) return;
  const sections = [...document.querySelectorAll('section[data-page="main"]')];
  if (!sections.length) return;
  const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
  let current = sections[0];
  for (const s of sections) if (s.getBoundingClientRect().top <= innerHeight * 0.3) current = s;
  setActive(atBottom ? sections[sections.length - 1].id : current.id);
}
document.querySelector('.nav').addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;
  clicked = a.hash.slice(1);
  setActive(clicked);
});
['wheel', 'touchmove', 'keydown'].forEach((type) =>
  addEventListener(type, () => (clicked = null), { passive: true })
);
addEventListener('scroll', updateActive, { passive: true });
addEventListener('hashchange', () => route());

// ----- Mobile menu -----
const menuBtn = document.querySelector('.menu-btn');
const scrim = document.querySelector('.scrim');
function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-expanded', open);
  scrim.hidden = !open;
}
menuBtn.addEventListener('click', () => setMenu(true));
document.querySelector('.close-btn').addEventListener('click', () => setMenu(false));
scrim.addEventListener('click', () => setMenu(false));
document.querySelector('.sidebar').addEventListener('click', (e) => e.target.closest('.nav a') && setMenu(false));
document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

// ----- Live preview from the local editor (same origin only) -----
addEventListener('message', (e) => {
  if (e.origin !== location.origin || !e.data) return;
  if (e.data.type === 'preview') {
    const y = scrollY;
    render(e.data.data);
    scrollTo(0, y);
  } else if (e.data.type === 'goto') {
    clicked = null;
    location.hash = e.data.id;
    route();
  }
});

async function load() {
  const res = await fetch('content/data.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error(`content/data.json (${res.status})`);
  render(await res.json());
  // Content loads after the page, so jump to #section links once it's in place.
  if (location.hash) {
    await document.fonts.ready;
    requestAnimationFrame(() => route());
  }
}

load().catch((err) => {
  $$('sections')[0].innerHTML =
    `<p class="error">Could not load page content: ${esc(err.message)}.<br>` +
    'If you opened index.html directly from your computer, view it through a web server or on GitHub Pages instead.</p>';
  console.error(err);
});
