# LiveMuseum

Child theme WordPress di **Twenty Twenty-Five** per il sito LiveMuseum: catalogo di post organizzati per categorie. Aggiunge cinque blocchi Gutenberg custom — due caroselli (uno 3D, uno piatto con due varianti), una griglia post con infinite scroll, un header di sezione standalone e una barra di ricerca (in costruzione) — server-rendered in PHP, con interattività via **WordPress Interactivity API** dove serve.

[![License: GPL v2+](https://img.shields.io/badge/License-GPL%20v2%2B-blue.svg)](LICENSE)

Rilasciato sotto **GPL-2.0-or-later** ([LICENSE](LICENSE)): come child theme eredita la GPL per derivazione.

---

## Requisiti

- WordPress 6.5+
- Parent theme: **Twenty Twenty-Five**
- Node.js 24 e npm (versione in `.nvmrc`)

Nessun plugin obbligatorio: i blocchi usano solo dati nativi di WordPress (post, categorie, tag, featured image, estratto).

---

## Struttura del progetto

```
livemuseum/
├── src/
│   ├── carousel-featured/       # Carousel 3D — slide centrale ingrandita
│   ├── carousel-flat/           # Carousel piatto — card unificate
│   ├── post-grid/               # Griglia post con infinite scroll
│   ├── section-header/          # Header di sezione standalone
│   ├── search-bar/              # Barra di ricerca (placeholder, in costruzione)
│   ├── shared/                  # Logica condivisa fra blocchi (carousel-nav)
│   └── style/                   # Stile globale del child theme (SCSS)
│       ├── style.scss           # Entry point — @use dei parziali
│       ├── _variables.scss      # Alias delle CSS custom properties di TT5
│       ├── _typography.scss
│       ├── _layout.scss
│       ├── _main-navbar.scss
│       ├── _blocks.scss         # Override blocchi core
│       ├── _section-header.scss # Componente condiviso (header sezione)
│       └── _search-bar.scss
├── build/                       # File compilati — versionati nel repo (vedi sotto)
├── .github/workflows/           # CI + release GitHub Actions
├── functions.php
├── style.css                    # Header child theme (regole reali in src/style/)
├── webpack.config.js            # Estende wp-scripts con l'entry SCSS globale
├── package.json
├── .nvmrc
├── LICENSE
├── SECURITY.md
└── README.md
```

---

## Setup git

```bash
git init
git add .
git commit -m "chore: scaffolding iniziale"
```

`node_modules/` è escluso via `.gitignore`; `build/` è invece versionata (vedi Build).

---

## Build

```bash
nvm use
npm install
npm run build      # produzione
npm run start      # watch mode
```

`webpack.config.js` estende la config di `@wordpress/scripts` aggiungendo l'entry globale `src/style/style.scss` → `build/style/style-style.css`. `--experimental-modules` abilita i moduli ES6; `--blocks-manifest` genera `build/blocks-manifest.php`.

> La cartella `build/` è **versionata**: permette di installare il tema da `git clone` senza `npm install && npm run build` sul server. In sviluppo, committare `build/` insieme alle sorgenti dopo modifiche rilevanti.

---

## Test

```bash
nvm use
npm run test:unit   # wp-scripts test-unit-js (Jest + jsdom)
```

Ogni blocco interattivo isola la logica di calcolo in un `logic.js` (funzioni pure, niente DOM) accanto al `view.js`, che la usa per gli effetti DOM. I test esercitano `logic.js` in isolamento; la logica condivisa sta in `src/shared/`. `wp-scripts` rileva automaticamente i `*.test.js` sotto `src/`.

Suite presenti: `carousel-featured`, `carousel-flat`, `post-grid` (una `logic.test.js` per blocco).

---

## Stile globale

L'entry `src/style/style.scss` (`@use` di `variables`, `typography`, `layout`, `main-navbar`, `blocks`, `section-header`, `search-bar`) compila in `build/style/style-style.css`. `functions.php` lo enqueua come dipendente di `twentytwentyfive-style`, con versione `filemtime()` per cache busting. Il `style.css` alla radice resta solo come header child theme: tutte le regole vivono nei parziali.

**Compatibilità con TT5.** `_variables.scss` **aliasa** le CSS custom properties di TT5 senza ridefinirle:

```scss
$font-primary:   var(--wp--preset--font-family--instrument-sans, sans-serif);
$color-contrast: var(--wp--preset--color--contrast, #221919);
$fs-label:       var(--wp--preset--font-size--small,    0.875rem); // ~14px
$fs-body:        var(--wp--preset--font-size--medium,   1rem);     // ~16px
$fs-title:       var(--wp--preset--font-size--x-large,  1.5rem);   // ~24px
$fs-title-small: var(--wp--preset--font-size--large,    1.3rem);   // ~21px
```

Così modifiche a palette/scala tipografica nel Site Editor o in `theme.json` si propagano all'SCSS senza ricompilare. Il font **Instrument Sans** va registrato dal Site Editor (Stili → Tipografia) con slug `instrument-sans`.

---

## Componenti SCSS condivisi

### `.lm-section-header`

Header di sezione riutilizzabile (bordo superiore tratteggiato via `repeating-linear-gradient`, titolo con quadratino accent, link "scopri di più" opzionale).

```html
<header class="lm-section-header">
  <h2 class="lm-section-header__title">Mostre ed eventi</h2>
  <a class="lm-section-header__link" href="…">Scopri di più</a>
</header>
```

Per usarlo in un blocco: `@use '../style/section-header';` nel suo SCSS, così l'anteprima del Site Editor ne ha lo stile.

---

## Blocchi custom

> Tutti i blocchi usano solo dati nativi WordPress: titolo, estratto, featured image, categorie, tag, permalink. Post renderizzati server-side in PHP; il JS controlla la sola posizione/visibilità via `transform` e classi.

### 1. Carousel Featured (`livemuseum/carousel-featured`)

Carousel con due rail orizzontali (immagini + box dettagli) sincronizzati su `currentIndex`, wrap circolare. Slide centrale 900×600 ingrandita, laterali 450×450; 3 slide visibili, il resto `opacity: 0`. Box dettagli (425px) con titolo, excerpt e tag linkati. Frecce + swipe touch (soglia 50px). Lazy-load delle thumbnail visibili. Su mobile (≤768px): una slide full-width per volta (override delle custom property, logica invariata).

Click: immagine laterale → la porta al centro; immagine centrale → apre il permalink. Il box è cliccabile solo sul link del titolo.

| Attributo | Tipo | Default | Descrizione |
|---|---|---|---|
| `heading` | string | "Mostre ed eventi" | Titolo in alto a sx |
| `linkLabel` / `linkUrl` | string | "Scopri di più" / "" | Link in alto a dx (vuoto = nascosto) |
| `postSource` | `all` \| `current_category` \| `fixed_categories` | `all` | Sorgente post (vedi nota sotto) |
| `categoryIds` | int[] | `[]` | Solo con `fixed_categories` |
| `postCount` | number | 20 | Numero massimo di slide |

**Architettura.** Ogni rail è un **CSS grid 1×1** (tutte le slide in `grid-row/column: 1`); `logic.js` ritorna numeri (`offset`, `opacity`, `zIndex`), il CSS calcola `translateX(offset * gap)` con i gap come custom property. `grid-template-columns: minmax(0, 1fr)` evita l'overflow orizzontale dell'immagine featured. Snap istantaneo (`transition: none` + reflow) al primo render dei box e quando una slide fa wrap da un lato all'altro. Le coordinate touch (stato non-reattivo) stanno in una `WeakMap` keyed by `ctx`, fuori dal context Interactivity (altrimenti `data-wp-watch` rifirerebbe). `block.json` usa `viewScriptModule` per il caricamento come ES module.

### 2. Carousel Flat (`livemuseum/carousel-flat`)

Carousel orizzontale con **card unificate** (immagine + meta + titolo overlay), per la home (selezione categoria) o per la sezione "related" nella single (stessi tag / categorie). Carousel **infinito left-anchored**: la prima card parte a sinistra, si scorre un articolo per volta; se le card entrano tutte, niente scroll. Frecce + swipe (50px), lazy-load, zoom immagine in hover. Il link avvolge **solo l'immagine** (meta-bar esclusa). Su mobile: una card per volta a `calc(100vw - 3rem)`, centrata.

La card ha una barra meta in alto (categorie linkate a sinistra, data a destra) e titolo overlay su sfondo bianco in basso sull'immagine. Quali categorie mostrare: con `current_category`/`fixed_categories` solo quelle del filtro; con `all` o le modalità related, tutte le categorie del post.

| Variante (`variant`) | Card | Immagine | Note |
|---|---|---|---|
| `arch` (default) | 445×515 | 445×435, `border-radius: 50% 50% 0 0` (arco) | Variante home |
| `square` | 445×500 | 445×420, senza arrotondamenti | Variante quadrata |

| Attributo | Tipo | Default | Descrizione |
|---|---|---|---|
| `heading` | string | "News" | Titolo testata |
| `linkLabel` / `linkUrl` | string | "Scopri di più" / "" | Link opzionale |
| `variant` | `arch` \| `square` | `arch` | Variante grafica |
| `postSource` | enum (6 valori) | `all` | Sorgente — vedi sotto |
| `categoryIds` | int[] | `[]` | Solo con `fixed_categories` |
| `postCount` | number | 20 | Massimo numero di card |

**Valori di `postSource`:** `all`, `current_category` (post della categoria visualizzata, fuori contesto → tutti), `fixed_categories` (filtro su `categoryIds`), `same_tags` / `same_categories` / `same_tags_or_categories` (related al post corrente, solo in single, fuori → tutti). Nelle modalità related il post corrente è escluso (`post__not_in`).

**Architettura.** Grid 1×1 con `justify-self: start`; JS scrive `--lm-cfl-pos`, CSS calcola `translateX(pos * card-step)`. `logic.js` espone `visibleCount`, `clampIndex`, `trackOffset` (con wrap, la posizione più lontana diventa `-1` = buffer off-screen dove la card ricicla). Lo snap (`transition: none`) al riciclo avviene fuori schermo, quindi non è mai visibile.

### 3. Post Grid (`livemuseum/post-grid`)

Griglia di post con **infinite scroll** o **numero fisso**. Card identica al box quadrato del Carousel Flat. Layout via **flex-wrap**: ogni card occupa il 25% scontando il gap (`flex-basis: calc((100% - 3 * gap) / 4)` → 4 per riga), con `--lm-pg-columns` ridotta a 3 (≤1024px), 2 (≤768px), 1 (≤480px). Testata `.lm-section-header` opzionale, **disattivata di default** (`showHeader: false`).

| Attributo | Tipo | Default | Descrizione |
|---|---|---|---|
| `showHeader` | boolean | `false` | Mostra la testata |
| `heading` / `linkLabel` / `linkUrl` | string | `""` | Testata opzionale (solo se `showHeader`) |
| `postSource` | `all` \| `current_category` \| `fixed_categories` | `all` | Stessa semantica del carousel-flat |
| `categoryIds` | int[] | `[]` | Solo con `fixed_categories` |
| `paginationMode` | `infinite` \| `fixed` | `infinite` | `fixed` = mostra esattamente `maxPosts`, niente scroll |
| `initialCount` | number | 12 | Card al primo render (solo `infinite`) |
| `batchSize` | number | 12 | Card aggiunte per trigger di scroll (solo `infinite`) |
| `maxPosts` | number | 200 | `infinite`: max post server-rendered. `fixed`: numero esatto mostrato |

**Infinite scroll.** Tutti i post (fino a `maxPosts`) sono renderizzati lato server; il JS nasconde con `is-hidden` le card oltre `visibleCount`. Una sentinel dopo la grid è osservata da `IntersectionObserver` (`rootMargin: 300px`): al trigger `visibleCount` cresce di `batchSize`, e `loadMore()` si rilancia in `requestAnimationFrame` se la sentinel resta intersecata. Lazy-load delle thumbnail visibili (`data-src` → `src`, fade-in al `load`). In modalità `fixed`: niente sentinel né observer.

### 4. Section Header (`livemuseum/section-header`)

Blocco statico (solo PHP) che renderizza il componente `.lm-section-header` standalone, per intestare sezioni custom. Se sia `heading` sia `linkUrl` sono vuoti, non emette markup.

| Attributo | Tipo | Default | Descrizione |
|---|---|---|---|
| `heading` | string | "Titolo sezione" | Testo a sinistra |
| `linkLabel` | string | "Scopri di più" | Etichetta del link a destra |
| `linkUrl` | string | "" | URL del link; vuoto = nascosto |

### 5. Search Bar (`livemuseum/search-bar`) — _in costruzione_

> ⚠️ **Blocco placeholder.** Campo di ricerca + bottone squadrati che inviano la query a un URL provvisorio (`actionUrl`, default `https://app.livemuseum/`). Solo markup statico, nessuna logica di ricerca reale: da completare quando il backend di ricerca sarà disponibile.

| Attributo | Tipo | Default | Descrizione |
|---|---|---|---|
| `placeholder` | string | "Cerca…" | Placeholder del campo |
| `buttonLabel` | string | "Cerca" | Etichetta del bottone |
| `actionUrl` | string | `https://app.livemuseum/` | URL di destinazione (provvisorio) |
| `paramName` | string | `q` | Chiave query string |

---

## Tecnologie

- **WordPress Interactivity API** (`@wordpress/interactivity`) — stato reattivo e binding dichiarativo
- **wp-scripts 32** — build toolchain (Webpack, SCSS, ESM modules)

---

## Sicurezza

Per segnalare una vulnerabilità: vedi [SECURITY.md](SECURITY.md). Non aprire issue pubbliche.

- Escape sistematico in output PHP (`esc_html()`, `esc_url()`, `esc_attr()`, `esc_*__()`).
- I JSON per la Interactivity API passano da `wp_json_encode()` + `get_block_wrapper_attributes()` (che li `esc_attr`-a).
- `register_block_type()` solo su sottocartelle di `build/` con `block.json` valido.
- Filtro `style_loader_src` / `script_loader_src`: `filemtime()` solo su path sotto `/build/`.

---

## CI/CD

GitHub Actions in `.github/workflows/`:

- **CI** (`ci.yml`) — `npm install && npm run build && npm run test:unit` su push a `main` e su PR.
- **Release** (`release.yml`) — su tag `v*`: build + `npm run plugin-zip` + GitHub Release.

```bash
git tag v1.0.1
git push origin v1.0.1
```
