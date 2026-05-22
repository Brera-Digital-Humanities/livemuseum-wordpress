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

> 🚧 **In sviluppo.** Variante "piatta" del carousel per la home page, senza ingrandimento centrale. Stessa sorgente post e logica di navigazione del [Carousel Featured](#1-carousel-featured-livemuseumcarousel-featured), grafica diversa. Documentazione completata quando il blocco sarà implementato.

---

### 3. Related Carousel (`livemuseum/related-carousel`)

> 🚧 **In sviluppo.** Carousel "articoli correlati" per la single. Sorgente derivata dall'articolo corrente con criterio di corrispondenza selezionabile: stesse categorie, stessi tag, o entrambi.

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
