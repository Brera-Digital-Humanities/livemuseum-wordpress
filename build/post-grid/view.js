import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ "./src/post-grid/logic.js"
/*!********************************!*\
  !*** ./src/post-grid/logic.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasMore: () => (/* binding */ hasMore),
/* harmony export */   isCardVisible: () => (/* binding */ isCardVisible),
/* harmony export */   nextCount: () => (/* binding */ nextCount)
/* harmony export */ });
// Logica pura del post-grid. Niente DOM, niente Interactivity API.

function isCardVisible(index, visibleCount) {
  return index < visibleCount;
}
function nextCount(currentCount, total, batchSize = 12) {
  if (total <= 0) {
    return 0;
  }
  return Math.min(currentCount + batchSize, total);
}
function hasMore(visibleCount, total) {
  return visibleCount < total;
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
/*!*******************************!*\
  !*** ./src/post-grid/view.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/* harmony import */ var _logic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logic */ "./src/post-grid/logic.js");
// Runtime Interactivity API del post-grid: infinite scroll via IntersectionObserver.


const STORE_NAMESPACE = 'livemuseum/post-grid';

// IntersectionObserver per istanza, fuori dal ctx reattivo.
const instanceObservers = new WeakMap();
function applyVisibility(ref, ctx) {
  const cards = ref.querySelectorAll('.lm-post-grid__card');
  cards.forEach((card, index) => {
    const visible = (0,_logic__WEBPACK_IMPORTED_MODULE_1__.isCardVisible)(index, ctx.visibleCount);
    card.classList.toggle('is-hidden', !visible);
  });

  // Lazy-load delle thumbnail nelle card visibili.
  cards.forEach((card, index) => {
    if (!(0,_logic__WEBPACK_IMPORTED_MODULE_1__.isCardVisible)(index, ctx.visibleCount)) {
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

  // Messaggio "fine risultati" visibile solo a fine lista.
  const status = ref.querySelector('.lm-post-grid__status--end');
  if (status) {
    status.classList.toggle('is-visible', !(0,_logic__WEBPACK_IMPORTED_MODULE_1__.hasMore)(ctx.visibleCount, ctx.total) && ctx.total > 0);
  }
}
function loadMore(ctx, sentinel) {
  if (!(0,_logic__WEBPACK_IMPORTED_MODULE_1__.hasMore)(ctx.visibleCount, ctx.total)) {
    return;
  }
  ctx.visibleCount = (0,_logic__WEBPACK_IMPORTED_MODULE_1__.nextCount)(ctx.visibleCount, ctx.total, ctx.batchSize || 12);

  // Se la sentinel resta intersecata (viewport alto), si rilancia in rAF finché esce dal trigger.
  requestAnimationFrame(() => {
    if (!(0,_logic__WEBPACK_IMPORTED_MODULE_1__.hasMore)(ctx.visibleCount, ctx.total)) {
      return;
    }
    const rect = sentinel.getBoundingClientRect();
    if (rect.top < window.innerHeight + 300) {
      loadMore(ctx, sentinel);
    }
  });
}
(0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)(STORE_NAMESPACE, {
  callbacks: {
    init() {
      const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      if (!ref) {
        return;
      }

      // Stato iniziale: nasconde le card oltre visibleCount + lazy-load delle prime.
      applyVisibility(ref, ctx);
      const sentinel = ref.querySelector('.lm-post-grid__sentinel');
      if (!sentinel) {
        return;
      }
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadMore(ctx, sentinel);
          }
        });
      }, {
        rootMargin: '300px'
      });
      observer.observe(sentinel);
      instanceObservers.set(ctx, observer);
    },
    applyVisibility() {
      const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      if (!ref) {
        return;
      }
      applyVisibility(ref, ctx);
    }
  }
});
})();


//# sourceMappingURL=view.js.map