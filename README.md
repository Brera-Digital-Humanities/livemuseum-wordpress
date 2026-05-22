# LiveMuseum

Child theme WordPress di **Twenty Twenty-Five** per il sito LiveMuseum: catalogo/archivio di post WordPress standard organizzati per categorie, con caroselli interattivi in home page e correlati nella scheda articolo. Il tema integra blocchi Gutenberg custom basati sulla **WordPress Interactivity API**.

[![License: GPL v2+](https://img.shields.io/badge/License-GPL%20v2%2B-blue.svg)](LICENSE)

Rilasciato sotto **GNU General Public License v2 o successiva** ([GPL-2.0-or-later](LICENSE)) — in quanto child theme di WordPress eredita la licenza GPL per derivazione: ogni redistribuzione e opera derivata deve mantenere termini compatibili con la GPL.

---

## Requisiti

- WordPress 6.5+
- Parent theme: **Twenty Twenty-Five**
- Node.js 24 e npm (versione fissata in `.nvmrc`)

Nessun plugin obbligatorio: i blocchi del tema usano solo dati nativi di WordPress (post, categorie, tag, featured image, estratto).

---

## Struttura del progetto

```
livemuseum/
├── src/
│   ├── carousel-featured/       # Carousel home — slide centrale ingrandita 3D
│   ├── carousel-flat/           # Carousel home/related — card unificate
│   ├── post-grid/               # Griglia post con infinite scroll
│   ├── section-header/          # Header di sezione standalone
│   ├── shared/                  # Logica condivisa fra blocchi (carousel-nav)
│   └── style/                   # Stile globale del child theme (SCSS)
│       ├── style.scss           # Entry point — @use dei parziali
│       ├── _variables.scss      # Alias delle CSS custom properties di TT5
│       ├── _typography.scss
│       ├── _layout.scss
│       ├── _main-navbar.scss
│       ├── _blocks.scss
│       └── _section-header.scss # Componente condiviso (header sezione)
├── build/                       # File compilati (non versionati)
├── .github/workflows/           # CI + release GitHub Actions
├── functions.php
├── style.css                    # Header child theme (regole reali in src/style/)
├── webpack.config.js            # Estende wp-scripts con l'entry SCSS globale
├── package.json
├── .nvmrc
├── .gitignore
├── LICENSE
├── SECURITY.md
└── README.md
```

---

## Setup git

Il repository non è inizializzato di default:

```bash
git init
git add .
git commit -m "chore: scaffolding iniziale"
```

`build/` e `node_modules/` sono già esclusi via `.gitignore`.

---

## Build

```bash
nvm use
npm install
npm run build      # produzione
npm run start      # watch mode
```

`--experimental-modules` abilita i moduli ES6; `--blocks-manifest` genera `build/blocks-manifest.php`.

`webpack.config.js` estende la default di `@wordpress/scripts` aggiungendo l'entry globale `src/style/style.scss` → `build/style/style-style.css`. Con `--experimental-modules` la config di default è un array `[scripts, modules]`: l'entry SCSS viene aggiunta alla "scripts".

> La cartella `build/` è **versionata** nel repository (commit ad ogni rebuild rilevante). Questo permette di installare il tema direttamente da `git clone` senza dover eseguire `npm install && npm run build` sul server di destinazione. In sviluppo: ricordarsi di committare `build/` insieme alle sorgenti dopo modifiche significative.

---

## Test

`wp-scripts test-unit-js` (Jest + jsdom, già nelle devDependencies):

```bash
nvm use
npm run test:unit
```

**Architettura.** Ogni blocco interattivo isola la logica di calcolo in un file `logic.js` accanto al `view.js`. `logic.js` esporta funzioni pure (niente DOM, niente `@wordpress/interactivity`); `view.js` le importa e le usa per gli effetti DOM. I test esercitano `logic.js` in isolamento. Logica condivisa fra più blocchi va in `src/shared/` con i propri test.

**Suite presenti:**

| Suite | File testato | Cosa copre |
|---|---|---|
| `src/carousel-featured/__tests__/logic.test.js` | `src/carousel-featured/logic.js` | `nextIndex`/`prevIndex` (wrap circolare), `slideOffset` (percorso più corto), `slideTransform` (offset/opacity/zIndex/pointer-events su centro, adiacente, oltre visibilità), `boxTransform`, `visibleIndices` |
| `src/carousel-flat/__tests__/logic.test.js` | `src/carousel-flat/logic.js` | Re-export della navigazione circolare condivisa + `cardTransform` (offset preservato, opacity sempre 1) |
| `src/post-grid/__tests__/logic.test.js` | `src/post-grid/logic.js` | `isCardVisible` (index vs visibleCount), `nextCount` (incremento con saturazione al totale), `hasMore` |

`wp-scripts test-unit-js` rileva automaticamente i `*.test.js` sotto `src/` — nessuna configurazione.

---

## Stile globale

```
src/style/
├── style.scss           # Entry — @use 'variables', 'typography', 'layout',
│                        #          'main-navbar', 'blocks', 'section-header'
├── _variables.scss      # Alias delle CSS custom properties di TT5
├── _typography.scss
├── _layout.scss
├── _main-navbar.scss
├── _blocks.scss         # Override blocchi core
└── _section-header.scss # Componente riutilizzabile — vedi sotto
```

L'entry `style.scss` viene compilato in `build/style/style-style.css` (convenzione di `mini-css-extract-plugin`: `<entry>-style.css`). `functions.php` lo enqueua come dipendente di `twentytwentyfive-style`, con versione `filemtime()` per cache busting.

Il file alla radice `style.css` resta solo come header child theme richiesto da WordPress: tutte le regole vivono nei parziali.

**Compatibilità con TT5.** `_variables.scss` **aliasa** le CSS custom properties di TT5 senza ridefinirle:

```scss
$font-primary:   var(--wp--preset--font-family--instrument-sans, sans-serif);
$color-contrast: var(--wp--preset--color--contrast, #221919);
$fs-label: var(--wp--preset--font-size--small,    0.875rem);
$fs-body:  var(--wp--preset--font-size--medium,   1rem);
$fs-title: var(--wp--preset--font-size--large,    1.5rem);
```

Modifiche a palette/scala tipografica nel Site Editor o in `theme.json` si propagano all'SCSS senza ricompilare.

**Font Instrument Sans.** Va registrato dal Site Editor (Stili → Tipografia → Font) con slug `instrument-sans`.

---

## Componenti SCSS condivisi

### `.lm-section-header`

Header di sezione riutilizzabile in più blocchi e template part. Bordo superiore tratteggiato (dashes 2,8 realizzato con `repeating-linear-gradient` perché `border-style: dashed` non controlla il pattern), titolo a sinistra con quadratino accent (13×13, `--wp--preset--color--accent-1`), link "scopri di più" a destra opzionale.

**HTML:**

```html
<header class="lm-section-header">
  <h2 class="lm-section-header__title">Mostre ed eventi</h2>
  <a class="lm-section-header__link" href="…">Scopri di più</a>
</header>
```

**Uso in un blocco custom:** `@use '../style/section-header';` nello SCSS del blocco. Le ~30 righe vengono incluse anche nel bundle del blocco così l'anteprima Site Editor mostra lo stile.

---

## Blocchi custom

> Tutti i blocchi del tema usano solo dati nativi WordPress: titolo, estratto, featured image, categorie, tag, permalink. Nessun campo ACF, nessuna tassonomia custom.

### 1. Carousel Featured (`livemuseum/carousel-featured`)

Carousel con due rail orizzontali sincronizzati su `currentIndex` e wrap circolare.

**Rail immagini:**
- Slide centrale 900×600 ("in evidenza"), slide laterali 450×450 square.
- Gap edge-to-edge centro→laterale: 75px (= 750px center-to-center).
- 3 slide visibili (centro + 1 per lato), il resto `opacity: 0`.
- Allineamento verticale al centro; altezza riga fissa a 600px (no salto durante l'animazione di resize centrale↔laterale).
- Lazy-load thumbnail (`data-src` → `src` su `data-wp-watch`, fade-in CSS).

**Rail box dettagli:**
- Larghezza fissa 425px, gap 25px (= 450px center-to-center).
- Visibili tanti quanti ne entrano nello schermo (overflow:hidden della section taglia i fuori-viewport).
- Altezza riga auto: cresce con il box più alto.
- Layout: titolo, excerpt, tag (categoria/tag WordPress nativi).
- Al primo render: fade-in dopo posizionamento (no "fan-out" dal centro).

**Frecce in basso** distanziate 50px dalla riga box. Stesso SVG (`width: 26 height: 25`), `.--prev` ribaltata con `scaleX(-1)`.

**Interazione:** frecce, tastiera `←`/`→`, swipe touch (soglia 50px, `touch-action: pan-y`), wheel orizzontale, click su slide laterale per portarla al centro, click sulla centrale per aprire il permalink.

**Mobile (≤ 768px):** una slide per volta a full-width. Slider semplice — le custom properties vengono override-ate (`--lm-cf-image-gap: 100%`, `--lm-cf-box-w: calc(100% - 3rem)`, ecc.), tutta la logica JS/CSS resta identica.

**Attributi blocco:**

| Attributo | Tipo | Default | Descrizione |
|---|---|---|---|
| `heading` | string | "Mostre ed eventi" | Titolo in alto a sx |
| `linkLabel` | string | "Scopri di più" | Etichetta link in alto a dx |
| `linkUrl` | string | "" | URL del link (vuoto = link nascosto) |
| `postSource` | `all` \| `current_category` \| `fixed_categories` | `all` | Sorgente post. `current_category` usa il termine queried (template archivio categoria); fuori da quel contesto degrada a "tutti i post". `fixed_categories` filtra su `categoryIds` |
| `categoryIds` | int[] | `[]` | Categorie WP (usato solo se `postSource = fixed_categories`) |
| `postCount` | number | 20 | Numero massimo di slide |

**Interactivity API — store `livemuseum/carousel-featured`:**

| Elemento | Descrizione |
|---|---|
| context `currentIndex` | Indice della slide centrale |
| context `total` | Numero totale di slide |
| action `next` / `prev` | Avanza/indietreggia (wrap circolare) |
| action `onSlideClick` | Click su slide: laterale → goTo; centrale → segue link titolo |
| action `onKeyDown` | `←` / `→` |
| action `onWheel` | Wheel orizzontale (solo se delta-x domina, non ruba lo scroll verticale) |
| action `onTouchStart` / `onTouchEnd` | Swipe con soglia 50px |
| callback `applyTransforms` | Scrive `--lm-cf-offset` su ogni slide, gestisce snap (primo render + wrap) e lazy-load immagini. Eseguito su `data-wp-init` e `data-wp-watch` |

**Architettura:**
- Post renderizzati server-side in PHP; JS controlla la posizione visiva via `transform`.
- `logic.js` ritorna numeri (`offset`, `opacity`, `zIndex`, `pointerEvents`); CSS calcola `translateX(offset * gap)` con i gap come custom properties.
- Ogni rail è un **CSS grid 1×1** (tutte le slide in `grid-row: 1; grid-column: 1`): la cella unica auto-fitta l'altezza al box più alto e il `justify-self: center` centra ogni slide; `translateX` la sposta in base all'offset.
- `grid-template-columns: minmax(0, 1fr)` vincola la colonna al container — senza questo, l'immagine intrinseca della featured potrebbe far esplodere il grid causando overflow orizzontale.
- **Snap istantaneo (transition: none + reflow) in due casi:** primo render del rail box (no "fan-out"); wrap di una slide che salta da un lato all'altro del carousel (offset cambiato di >1 in uno step).
- Stato non-reattivo (touch coords): tenuto in una `WeakMap` keyed by `ctx`, **fuori** dal context Interactivity — altrimenti `data-wp-watch` rifirerebbe ad ogni scrittura.
- `viewScriptModule` (non `viewScript`) in `block.json`: necessario per il caricamento come ES module e la risoluzione dell'import map `@wordpress/interactivity`.

---

### 2. Carousel Flat (`livemuseum/carousel-flat`)

Carousel orizzontale con **card unificate** (immagine + meta + titolo overlay come singolo blocco), pensato sia per la home page (con selezione categoria) sia per la sezione "related" nella single (con scelta tra stessi tag / stesse categorie). Stessa intestazione `.lm-section-header` del featured.

**Layout della card:**
- Barra meta in alto: categoria (badge nero su sfondo bianco) a sinistra, data a destra. Bordo orizzontale superiore come separatore con la card adiacente (no gap tra card).
- Immagine sotto la barra meta.
- Titolo overlay con sfondo bianco e bordo, posizionato a `bottom: -1.25rem` in modo da sporgere leggermente sotto l'immagine.

**Due varianti grafiche (attributo `variant`):**

| Variante | Card | Immagine | Note |
|---|---|---|---|
| `arch` (default) | 445×480 | 445×435 con `border-radius: 50% 50% 0 0` (arco) | Variante home page principale |
| `square` | 445×470 | 445×420 senza arrotondamenti | Variante quadrata |

**Attributi blocco:**

| Attributo | Tipo | Default | Descrizione |
|---|---|---|---|
| `heading` | string | "News" | Titolo testata |
| `linkLabel` / `linkUrl` | string | "Scopri di più" / "" | Link "scopri di più" opzionale |
| `variant` | `arch` \| `square` | `arch` | Variante grafica |
| `postSource` | enum (6 valori) | `all` | Sorgente — vedi sotto |
| `categoryIds` | int[] | `[]` | Usato solo con `postSource = fixed_categories` |
| `postCount` | number | 20 | Massimo numero di card |

**Valori di `postSource`:**

| Valore | Comportamento |
|---|---|
| `all` | Tutti i post |
| `current_category` | Solo i post della categoria visualizzata (template archivio); fuori contesto → tutti i post |
| `fixed_categories` | Filtro su `categoryIds` |
| `same_tags` | Related: stessi tag del post corrente (solo in single, fuori → tutti) |
| `same_categories` | Related: stesse categorie del post corrente (solo in single) |
| `same_tags_or_categories` | Related: stessi tag OR stesse categorie (`tax_query` con `relation: OR`) |

Nelle modalità related il post corrente viene escluso (`post__not_in`).

**Interattività:** frecce navigazione (in basso, ai lati con `justify-content: space-between`), tastiera `←`/`→`, swipe touch (soglia 50px, `touch-action: pan-y`). Lazy-load thumbnail nelle card vicine (range ±2 dal `currentIndex`). Stesso pattern del featured per snap istantaneo al primo render + wrap-detection.

**Mobile (≤ 768px):** card a full-width (`calc(100% - 3rem)` con 1.5rem di margin dal bordo), una per volta.

**Architettura:** stesso pattern del rail box di carousel-featured — CSS grid 1×1 con tutte le card nella stessa cella, JS setta `--lm-cfl-offset`, CSS calcola `translateX(offset * card-step)`. La navigazione circolare è in `src/shared/carousel-nav.js`, riutilizzata da entrambi i blocchi.

---

### 3. Post Grid (`livemuseum/post-grid`)

Griglia di post con **infinite scroll**. Card identica al box quadrato del [Carousel Flat](#2-carousel-flat-livemuseumcarousel-flat) (445×470, immagine 420 senza arrotondamento, titolo overlay con sfondo bianco). Layout responsive via CSS grid `auto-fill` con gap 10px.

**Attributi blocco:**

| Attributo | Tipo | Default | Descrizione |
|---|---|---|---|
| `heading` / `linkLabel` / `linkUrl` | string | `""` | Testata opzionale (omessa se `heading` e `linkUrl` sono vuoti) |
| `postSource` | `all` \| `current_category` \| `fixed_categories` | `all` | Sorgente — stessa semantica del carousel-flat |
| `categoryIds` | int[] | `[]` | Usato solo con `postSource = fixed_categories` |
| `initialCount` | number | 12 | Card visibili al primo render |
| `batchSize` | number | 12 | Quante card aggiungere ad ogni trigger di scroll |
| `maxPosts` | number | 200 | Limite massimo di post renderizzati dal server |

**Infinite scroll:**

- Tutti i post (fino a `maxPosts`) sono renderizzati lato server. Il JS controlla la visibilità via classe `is-hidden` sui card con `index >= visibleCount`.
- Un `<div class="lm-post-grid__sentinel">` posizionato dopo la grid è osservato da `IntersectionObserver` con `rootMargin: 300px`. Al rilevamento, `visibleCount` cresce di `batchSize`.
- Se la sentinel resta intersecata anche dopo l'incremento (viewport tall / pochi post), `loadMore()` si rilancia ricorsivamente in `requestAnimationFrame` finché esce dal trigger area o `visibleCount === total`.
- Lazy-load delle thumbnail: le `<img>` partono con `data-src`, il callback `applyVisibility` setta `src = dataset.src` solo per le card visibili e rimuove `data-src` al `load`/`error` per innescare il fade-in CSS.

**Stato (Interactivity API):**

| Context | Descrizione |
|---|---|
| `visibleCount` | Numero di card attualmente visibili |
| `total` | Totale dei post server-rendered |
| `batchSize` | Incremento per ogni step |

**Callback:**

| Callback | Trigger | Cosa fa |
|---|---|---|
| `init` | `data-wp-init` | Applica visibilità iniziale + lazy-load + setup `IntersectionObserver` sulla sentinel |
| `applyVisibility` | `data-wp-watch` (al cambio di `visibleCount`) | Aggiorna le classi `is-hidden`/`is-loading`, carica le nuove thumbnail, mostra il messaggio "fine risultati" quando esaurito |

---

### 4. Section Header (`livemuseum/section-header`)

Blocco statico che renderizza il componente `.lm-section-header` (dashed top border + titolo con quadratino accent + link "scopri di più" opzionale) come blocco standalone, utile per intestare sezioni custom senza dover incorporare un carousel.

Solo PHP, nessuna runtime JS. Se sia `heading` sia `linkUrl` sono vuoti, il blocco non emette markup.

| Attributo | Tipo | Default | Descrizione |
|---|---|---|---|
| `heading` | string | "Titolo sezione" | Testo a sinistra |
| `linkLabel` | string | "Scopri di più" | Etichetta del link a destra |
| `linkUrl` | string | "" | URL del link; vuoto = link nascosto |

---

## Tecnologie

- **WordPress Interactivity API** (`@wordpress/interactivity`) — stato reattivo e binding dichiarativo
- **wp-scripts 32** — build toolchain (Webpack, SCSS, ESM modules, `--experimental-modules`)

---

## Sicurezza

Per segnalare una vulnerabilità: vedi [SECURITY.md](SECURITY.md). Non aprire issue pubbliche su GitHub.

Pratiche adottate:
- Escape sistematico in output PHP: `esc_html()`, `esc_url()`, `esc_attr()`, `esc_attr__()` / `esc_html__()`. `wp_kses_post()` per contenuti HTML/WYSIWYG (quando entreranno in gioco).
- I JSON inviati alla Interactivity API via `data-wp-context` sono prodotti da `wp_json_encode()` e passati a `get_block_wrapper_attributes()` che li `esc_attr`-a.
- `register_block_type()` solo su sottocartelle di `build/` con un `block.json` valido.
- Filtro `style_loader_src` / `script_loader_src` che applica `filemtime()` solo a path sotto `/build/` del tema.

---

## CI/CD

GitHub Actions in `.github/workflows/`:

- **CI** (`ci.yml`) — `npm install && npm run build && npm run test:unit` su push a `master` e su PR.
- **Release** (`release.yml`) — su tag `v*`: build + `npm run plugin-zip` + GitHub Release con note generate automaticamente.

```bash
git tag v1.0.1
git push origin v1.0.1
```
