import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ "./src/carousel-flat/logic.js"
/*!************************************!*\
  !*** ./src/carousel-flat/logic.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cardTransform: () => (/* binding */ cardTransform),
/* harmony export */   nextIndex: () => (/* reexport safe */ _shared_carousel_nav__WEBPACK_IMPORTED_MODULE_0__.nextIndex),
/* harmony export */   prevIndex: () => (/* reexport safe */ _shared_carousel_nav__WEBPACK_IMPORTED_MODULE_0__.prevIndex),
/* harmony export */   slideOffset: () => (/* reexport safe */ _shared_carousel_nav__WEBPACK_IMPORTED_MODULE_0__.slideOffset)
/* harmony export */ });
/* harmony import */ var _shared_carousel_nav__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/carousel-nav */ "./src/shared/carousel-nav.js");
// Logica pura del carousel "flat". Navigazione condivisa in ../shared.



// Card: distribuzione lineare via offset. Overflow:hidden della section
// taglia quelle fuori viewport, niente cutoff esplicito qui.
function cardTransform(offset) {
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
/*!***********************************!*\
  !*** ./src/carousel-flat/view.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/* harmony import */ var _logic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logic */ "./src/carousel-flat/logic.js");
/**
 * Runtime Interactivity API del carousel "flat".
 * Calcoli puri in ./logic; qui DOM, eventi e store.
 */


const STORE_NAMESPACE = 'livemuseum/carousel-flat';

// Touch coords per istanza, fuori dal ctx reattivo.
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

// Ctx già inizializzati: primo applyTransforms snap-only per evitare fan-out.
const initialized = new WeakSet();
function applyCards(cards, total, currentIndex, snapAll) {
  cards.forEach((card, index) => {
    const offset = (0,_logic__WEBPACK_IMPORTED_MODULE_1__.slideOffset)(index, currentIndex, total);
    const result = (0,_logic__WEBPACK_IMPORTED_MODULE_1__.cardTransform)(offset);
    const prevOffset = card.dataset.lmOffset !== undefined ? parseInt(card.dataset.lmOffset, 10) : offset;
    const isWrapping = Math.abs(offset - prevOffset) > 1;
    const snap = snapAll || isWrapping;
    if (snap) {
      card.style.transition = 'none';
    }
    card.style.setProperty('--lm-cfl-offset', String(result.offset));
    card.style.zIndex = String(result.zIndex);
    card.style.pointerEvents = result.pointerEvents;
    card.dataset.lmOffset = String(offset);
    if (snap) {
      void card.offsetHeight;
      card.style.transition = '';
    }
    card.style.opacity = String(result.opacity);
  });
}
function applyVisuals(ref, ctx) {
  const cards = ref.querySelectorAll('.lm-carousel-flat__card');
  const firstRun = !initialized.has(ctx);
  initialized.add(ctx);
  applyCards(cards, ctx.total, ctx.currentIndex, firstRun);

  // Lazy-load delle thumbnail nelle card vicine (range ±2).
  const total = ctx.total;
  cards.forEach((card, index) => {
    const offset = (0,_logic__WEBPACK_IMPORTED_MODULE_1__.slideOffset)(index, ctx.currentIndex, total);
    if (Math.abs(offset) > 2) {
      return;
    }
    const img = card.querySelector('img[data-src]');
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