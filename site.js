// Builds the page from content/site.yml and the Markdown files it lists.
// To change what the page says, edit the files in the content folder.

const ICONS = {
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  orcid: '<circle cx="12" cy="12" r="9"/><path d="M9 10v6M9 7.5v.01M12.5 16v-6h1.8a3 3 0 0 1 0 6z"/>',
  cv: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  scholar: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/>',
  github: '<path d="M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
};

const $$ = (key) => document.querySelectorAll(`[data-site="${key}"]`);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const fetchText = async (path) => {
  const res = await fetch(path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${path} (${res.status})`);
  return res.text();
};

function linkHTML({ label, url, icon }) {
  const external = /^https?:/.test(url) ? ' target="_blank" rel="noopener"' : '';
  const svg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[icon] || ICONS.link}</svg>`;
  return `<li><a href="${url}"${external}>${svg}<span>${label}</span></a></li>`;
}

// "### Title | Date" in Markdown becomes a title with the date on the right.
function splitDates(root) {
  root.querySelectorAll('h3').forEach((h3) => {
    const i = h3.innerHTML.lastIndexOf(' | ');
    if (i < 0) return;
    h3.innerHTML = `<span>${h3.innerHTML.slice(0, i)}</span><time>${h3.innerHTML.slice(i + 3)}</time>`;
    h3.classList.add('dated');
  });
}

async function build() {
  const site = jsyaml.load(await fetchText('content/site.yml'));
  const sections = await Promise.all(
    site.sections.map(async (s) => ({ ...s, id: slug(s.title), md: await fetchText(`content/${s.file}`) }))
  );

  document.title = site.name;
  $$('name').forEach((el) => (el.textContent = site.name));
  $$('tagline').forEach((el) => (el.textContent = site.tagline || ''));
  $$('footer').forEach((el) => (el.textContent = site.footer || ''));
  $$('photo').forEach((img) => {
    if (!site.photo) return img.remove();
    img.src = site.photo;
    img.alt = `Photo of ${site.name}`;
    img.onerror = () => img.remove();
  });
  $$('links').forEach((ul) => (ul.innerHTML = (site.links || []).map(linkHTML).join('')));
  $$('nav').forEach((ul) => {
    ul.innerHTML = sections.map((s) => `<li><a href="#${s.id}">${s.title}</a></li>`).join('');
  });

  const container = $$('sections')[0];
  container.innerHTML = sections
    .map((s) => `<section id="${s.id}"><h2>${s.title}</h2><div class="md">${marked.parse(s.md)}</div></section>`)
    .join('');
  splitDates(container);

  // Content loads after the page, so jump to #section links once it's in place.
  if (location.hash) {
    await document.fonts.ready;
    requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
  }
  watchActiveSection();
}

// Highlight the menu item for the section currently on screen.
function watchActiveSection() {
  const links = [...document.querySelectorAll('.nav a')];
  const setActive = (id) => links.forEach((a) => a.classList.toggle('active', a.hash === `#${id}`));
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
    { rootMargin: '-20% 0px -70% 0px' }
  );
  document.querySelectorAll('section[id]').forEach((s) => observer.observe(s));
}

// Mobile menu
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

build().catch((err) => {
  $$('sections')[0].innerHTML =
    `<p class="error">Could not load page content: ${err.message}.<br>` +
    'If you opened index.html directly from your computer, view it through a web server or on GitHub Pages instead.</p>';
  console.error(err);
});
