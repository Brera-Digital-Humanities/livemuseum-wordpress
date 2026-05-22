import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ "./src/carousel-featured/logic.js"
/*!****************************************!*\
  !*** ./src/carousel-featured/logic.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   boxTransform: () => (/* binding */ boxTransform),
/* harmony export */   nextIndex: () => (/* reexport safe */ _shared_carousel_nav__WEBPACK_IMPORTED_MODULE_0__.nextIndex),
/* harmony export */   prevIndex: () => (/* reexport safe */ _shared_carousel_nav__WEBPACK_IMPORTED_MODULE_0__.prevIndex),
/* harmony export */   slideOffset: () => (/* reexport safe */ _shared_carousel_nav__WEBPACK_IMPORTED_MODULE_0__.slideOffset),
/* harmony export */   slideTransform: () => (/* binding */ slideTransform),
/* harmony export */   visibleIndices: () => (/* reexport safe */ _shared_carousel_nav__WEBPACK_IMPORTED_MODULE_0__.visibleIndices)
/* harmony export */ });
/* harmony import */ var _shared_carousel_nav__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/carousel-nav */ "./src/shared/carousel-nav.js");
// Logica pura del carousel "featured". Navigazione condivisa in ../shared.
// CSS gestisce posizionamento (--lm-cf-offset * gap) e dimensioni (.is-current).



// Rail immagini: visible=1 → totale 3 slide visibili (centro + 1 per lato).
function slideTransform(offset, opts = {}) {
  const {
    visible = 1
  } = opts;
  const distance = Math.abs(offset);
  const inRange = distance <= visible;
  return {
    offset,
    opacity: inRange ? 1 : 0,
    zIndex: offset === 0 ? 100 : Math.max(1, 100 - distance * 10),
    pointerEvents: inRange ? 'auto' : 'none'
  };
}

// Rail box: opacity sempre 1, l'overflow:hidden della section taglia i fuori-viewport.
function boxTransform(offset) {
  const distance = Math.abs(offset);
  return {
    offset,
    opacity: 1,
    zIndex: Math.max(1, 100 - distance),
    pointerEvents: 'auto'
  };
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
/*!***************************************!*\
  !*** ./src/carousel-featured/view.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/* harmony import */ var _logic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logic */ "./src/carousel-featured/logic.js");
/**
 * Runtime Interactivity API del carousel "featured".
 * Calcoli puri in ./logic; qui DOM, eventi e store.
 */


const STORE_NAMESPACE = 'livemuseum/carousel-featured';

// Stato non-reattivo per istanza (touch coords): tenuto fuori da ctx
// altrimenti i data-wp-watch rifirano in modo indesiderato.
const instanceState = new WeakMap();
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
function applyRail(slides, total, currentIndex, transformFn, snapAll = false) {
  slides.forEach((slide, index) => {
    const offset = (0,_logic__WEBPACK_IMPORTED_MODULE_1__.slideOffset)(index, currentIndex, total);
    const result = transformFn(offset);

    // Snap istantaneo se: primo render (no fan-out dal centro) o wrap
    // (offset cambiato di >1, slide salta da un lato all'altro).
    const prevOffset = slide.dataset.lmOffset !== undefined ? parseInt(slide.dataset.lmOffset, 10) : offset;
    const isWrapping = Math.abs(offset - prevOffset) > 1;
    const snap = snapAll || isWrapping;
    if (snap) {
      slide.style.transition = 'none';
    }
    slide.style.setProperty('--lm-cf-offset', String(result.offset));
    slide.style.zIndex = String(result.zIndex);
    slide.style.pointerEvents = result.pointerEvents;
    slide.classList.toggle('is-current', offset === 0);
    slide.setAttribute('aria-hidden', offset === 0 ? 'false' : 'true');
    slide.dataset.lmOffset = String(offset);
    if (snap) {
      void slide.offsetHeight; // reflow sync
      slide.style.transition = '';
    }

    // Opacity dopo il restore transition → cambia con la transizione CSS.
    // Al primo render dei box: CSS 0 → JS 1 → fade-in in posizione.
    slide.style.opacity = String(result.opacity);
  });
}

// Ctx già inizializzati: primo applyTransforms snap-only sui box.
const initializedBoxes = new WeakSet();
function applyVisuals(ref, ctx) {
  const total = ctx.total;
  const imageSlides = ref.querySelectorAll('.lm-carousel-featured__image-slide');
  applyRail(imageSlides, total, ctx.currentIndex, _logic__WEBPACK_IMPORTED_MODULE_1__.slideTransform);
  const boxSlides = ref.querySelectorAll('.lm-carousel-featured__box-slide');
  const boxesFirstRun = !initializedBoxes.has(ctx);
  initializedBoxes.add(ctx);
  applyRail(boxSlides, total, ctx.currentIndex, _logic__WEBPACK_IMPORTED_MODULE_1__.boxTransform, boxesFirstRun);

  // Lazy-load delle immagini nelle slide visibili.
  (0,_logic__WEBPACK_IMPORTED_MODULE_1__.visibleIndices)(ctx.currentIndex, total).forEach(i => {
    const slide = imageSlides[i];
    if (!slide) {
      return;
    }
    const img = slide.querySelector('img[data-src]');
    if (!img) {
      return;
    }
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
  });
}
(0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)(STORE_NAMESPACE, {
  actions: {
    next() {
      const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      ctx.currentIndex = (0,_logic__WEBPACK_IMPORTED_MODULE_1__.nextIndex)(ctx.currentIndex, ctx.total);
    },
    prev() {
      const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      ctx.currentIndex = (0,_logic__WEBPACK_IMPORTED_MODULE_1__.prevIndex)(ctx.currentIndex, ctx.total);
    },
    onSlideClick(event) {
      const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const target = event.currentTarget;
      const targetIndex = parseInt(target.getAttribute('data-index'), 10);
      if (Number.isNaN(targetIndex)) {
        return;
      }
      if (targetIndex !== ctx.currentIndex) {
        ctx.currentIndex = targetIndex;
        return;
      }
      // Click sulla slide al centro: segui il link del titolo (è nel box-slide).
      const section = target.closest('.lm-carousel-featured');
      const box = section && section.querySelector(`.lm-carousel-featured__box-slide[data-index="${targetIndex}"]`);
      const link = box && box.querySelector('.lm-carousel-featured__title a');
      if (link) {
        link.click();
      }
    },
    onKeyDown(event) {
      const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        ctx.currentIndex = (0,_logic__WEBPACK_IMPORTED_MODULE_1__.nextIndex)(ctx.currentIndex, ctx.total);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        ctx.currentIndex = (0,_logic__WEBPACK_IMPORTED_MODULE_1__.prevIndex)(ctx.currentIndex, ctx.total);
      }
    },
    onWheel(event) {
      // Naviga solo se il delta orizzontale domina (non rubare lo scroll verticale).
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
        return;
      }
      event.preventDefault();
      const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      ctx.currentIndex = event.deltaX > 0 ? (0,_logic__WEBPACK_IMPORTED_MODULE_1__.nextIndex)(ctx.currentIndex, ctx.total) : (0,_logic__WEBPACK_IMPORTED_MODULE_1__.prevIndex)(ctx.currentIndex, ctx.total);
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
      const s = getInstanceState(ctx);
      if (s.touchStartX === null) {
        return;
      }
      const t = event.changedTouches[0];
      const dx = t.clientX - s.touchStartX;
      const dy = t.clientY - s.touchStartY;
      s.touchStartX = null;
      s.touchStartY = null;
      if (Math.abs(dy) > Math.abs(dx)) {
        return;
      }
      if (Math.abs(dx) < 50) {
        return;
      }
      ctx.currentIndex = dx < 0 ? (0,_logic__WEBPACK_IMPORTED_MODULE_1__.nextIndex)(ctx.currentIndex, ctx.total) : (0,_logic__WEBPACK_IMPORTED_MODULE_1__.prevIndex)(ctx.currentIndex, ctx.total);
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
      applyVisuals(ref, ctx);
    }
  }
});
})();


//# sourceMappingURL=view.js.map