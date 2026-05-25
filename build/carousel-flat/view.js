import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ "./src/carousel-flat/logic.js"
/*!************************************!*\
  !*** ./src/carousel-flat/logic.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clampIndex: () => (/* binding */ clampIndex),
/* harmony export */   nextIndex: () => (/* reexport safe */ _shared_carousel_nav__WEBPACK_IMPORTED_MODULE_0__.nextIndex),
/* harmony export */   prevIndex: () => (/* reexport safe */ _shared_carousel_nav__WEBPACK_IMPORTED_MODULE_0__.prevIndex),
/* harmony export */   trackOffset: () => (/* binding */ trackOffset),
/* harmony export */   visibleCount: () => (/* binding */ visibleCount)
/* harmony export */ });
/* harmony import */ var _shared_carousel_nav__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/carousel-nav */ "./src/shared/carousel-nav.js");
// Logica pura del carousel "flat": track left-anchored infinito.
// nextIndex/prevIndex (circolari) sono condivisi con il featured.



// Quante card entrano nel viewport dato il passo (card + gap) in px.
function visibleCount(viewportWidth, cardStep) {
  if (cardStep <= 0 || viewportWidth <= 0) {
    return 1;
  }
  return Math.max(1, Math.floor(viewportWidth / cardStep));
}

// Indice vincolato a [0, total - visible]: usato quando le card entrano tutte
// (niente scroll infinito, niente wrap).
function clampIndex(index, total, visible) {
  const max = Math.max(0, total - visible);
  return Math.min(Math.max(index, 0), max);
}

// Offset di display left-anchored: offset 0 = card al bordo sinistro.
// Con wrap, la posizione più lontana (total-1) diventa -1 → la card finisce
// nel buffer off-screen a sinistra, pronta a riciclarsi senza salto visibile.
function trackOffset(index, currentIndex, total, wrap) {
  if (total <= 0) {
    return 0;
  }
  let offset = ((index - currentIndex) % total + total) % total; // 0..total-1
  if (wrap && offset === total - 1) {
    offset = -1;
  }
  return offset;
}

/***/ },

/***/ "./src/shared/carousel-nav.js"
/*!************************************!*\
  !*** ./src/shared/carousel-nav.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nextIndex: () => (/* binding */ nextIndex),
/* harmony export */   prevIndex: () => (/* binding */ prevIndex),
/* harmony export */   slideOffset: () => (/* binding */ slideOffset),
/* harmony export */   visibleIndices: () => (/* binding */ visibleIndices)
/* harmony export */ });
// Navigazione circolare condivisa tra i carousel.

function nextIndex(currentIndex, total) {
  if (total <= 0) {
    return 0;
  }
  return (currentIndex + 1) % total;
}
function prevIndex(currentIndex, total) {
  if (total <= 0) {
    return 0;
  }
  return (currentIndex - 1 + total) % total;
}

// Percorso circolare più corto tra index e currentIndex.
function slideOffset(index, currentIndex, total) {
  if (total <= 0) {
    return 0;
  }
  let diff = index - currentIndex;
  const half = Math.floor(total / 2);
  if (diff > half) {
    diff -= total;
  }
  if (diff < -half) {
    diff += total;
  }
  return diff;
}
function visibleIndices(currentIndex, total, visible = 1) {
  if (total <= 0) {
    return [];
  }
  const result = [];
  for (let i = 0; i < total; i++) {
    if (Math.abs(slideOffset(i, currentIndex, total)) <= visible) {
      result.push(i);
    }
  }
  return result;
}

/***/ },

/***/ "@wordpress/interactivity"
/*!*******************************************!*\
  !*** external "@wordpress/interactivity" ***!
  \*******************************************/
(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__;

/***/ }

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	if (!(moduleId in __webpack_modules__)) {
/******/ 		delete __webpack_module_cache__[moduleId];
/******/ 		var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 		e.code = 'MODULE_NOT_FOUND';
/******/ 		throw e;
/******/ 	}
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***********************************!*\
  !*** ./src/carousel-flat/view.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/* harmony import */ var _logic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logic */ "./src/carousel-flat/logic.js");
/**
 * Runtime Interactivity API del carousel "flat": track left-anchored infinito.
 * Calcoli puri in ./logic. Il riciclo delle card avviene off-screen (snap senza
 * transition) così il movimento di riposizionamento non è mai visibile.
 */


const STORE_NAMESPACE = 'livemuseum/carousel-flat';
const instanceState = new WeakMap();
const initialized = new WeakSet();
function getInstanceState(ctx) {
  let s = instanceState.get(ctx);
  if (!s) {
    s = {
      touchStartX: null,
      touchStartY: null
    };
    instanceState.set(ctx, s);
  }
  return s;
}

// Card visibili, misurate dal DOM (card width + gap vs viewport).
function measureVisible(ref) {
  const track = ref.querySelector('.lm-carousel-flat__track');
  const card = track && track.querySelector('.lm-carousel-flat__card');
  if (!track || !card) {
    return 1;
  }
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = card.offsetWidth + gap;
  return (0,_logic__WEBPACK_IMPORTED_MODULE_1__.visibleCount)(track.clientWidth, step);
}

// Avanza/indietreggia: infinito (wrap circolare) se ci sono più card di quante
// ne entrano, altrimenti clamp (le card stanno tutte a video, niente scroll).
function advance(ctx, ref, delta) {
  const visible = measureVisible(ref);
  if (ctx.total > visible) {
    ctx.currentIndex = delta > 0 ? (0,_logic__WEBPACK_IMPORTED_MODULE_1__.nextIndex)(ctx.currentIndex, ctx.total) : (0,_logic__WEBPACK_IMPORTED_MODULE_1__.prevIndex)(ctx.currentIndex, ctx.total);
  } else {
    ctx.currentIndex = (0,_logic__WEBPACK_IMPORTED_MODULE_1__.clampIndex)(ctx.currentIndex + delta, ctx.total, visible);
  }
}
function applyCards(ref, ctx, snapAll) {
  const visible = measureVisible(ref);
  const wrap = ctx.total > visible;
  const cards = ref.querySelectorAll('.lm-carousel-flat__card');
  cards.forEach((cardEl, index) => {
    const offset = (0,_logic__WEBPACK_IMPORTED_MODULE_1__.trackOffset)(index, ctx.currentIndex, ctx.total, wrap);

    // Snap (transition: none) al primo render e quando una card ricicla
    // dall'altro lato (offset cambiato di >1): il riposizionamento avviene
    // nel buffer off-screen, quindi non è visibile.
    const prev = cardEl.dataset.lmPos !== undefined ? parseInt(cardEl.dataset.lmPos, 10) : offset;
    const snap = snapAll || Math.abs(offset - prev) > 1;
    if (snap) {
      cardEl.style.transition = 'none';
    }
    cardEl.style.setProperty('--lm-cfl-pos', String(offset));
    cardEl.dataset.lmPos = String(offset);
    if (snap) {
      void cardEl.offsetHeight;
      cardEl.style.transition = '';
    }

    // Lazy-load nelle card vicine al range visibile (buffer incluso).
    if (offset >= -1 && offset <= visible + 1) {
      const img = cardEl.querySelector('img[data-src]');
      if (img) {
        img.classList.add('is-loading');
        const finish = () => {
          img.classList.remove('is-loading');
          img.removeAttribute('data-src');
          img.removeEventListener('load', finish);
          img.removeEventListener('error', finish);
        };
        img.addEventListener('load', finish);
        img.addEventListener('error', finish);
        img.src = img.dataset.src;
      }
    }
  });
}
(0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)(STORE_NAMESPACE, {
  actions: {
    next() {
      advance((0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)(), (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)().ref, 1);
    },
    prev() {
      advance((0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)(), (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)().ref, -1);
    },
    onKeyDown(event) {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
        return;
      }
      event.preventDefault();
      advance((0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)(), (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)().ref, event.key === 'ArrowRight' ? 1 : -1);
    },
    onTouchStart(event) {
      const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const s = getInstanceState(ctx);
      const t = event.touches[0];
      s.touchStartX = t.clientX;
      s.touchStartY = t.clientY;
    },
    onTouchEnd(event) {
      const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      const s = getInstanceState(ctx);
      if (s.touchStartX === null) {
        return;
      }
      const t = event.changedTouches[0];
      const dx = t.clientX - s.touchStartX;
      const dy = t.clientY - s.touchStartY;
      s.touchStartX = null;
      s.touchStartY = null;
      if (Math.abs(dy) > Math.abs(dx) || Math.abs(dx) < 50) {
        return;
      }
      advance(ctx, ref, dx < 0 ? 1 : -1);
    }
  },
  callbacks: {
    applyTransforms() {
      const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      if (!ref) {
        return;
      }
      const firstRun = !initialized.has(ctx);
      initialized.add(ctx);
      applyCards(ref, ctx, firstRun);
    }
  }
});
})();


//# sourceMappingURL=view.js.map