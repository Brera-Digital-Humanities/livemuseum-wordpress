/**
 * Runtime Interactivity API del carousel "featured".
 * Calcoli puri in ./logic; qui DOM, eventi e store.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';
import {
	nextIndex,
	prevIndex,
	slideOffset,
	slideTransform,
	boxTransform,
	visibleIndices,
} from './logic';

const STORE_NAMESPACE = 'livemuseum/carousel-featured';

// Stato non-reattivo per istanza (touch coords): tenuto fuori da ctx
// altrimenti i data-wp-watch rifirano in modo indesiderato.
const instanceState = new WeakMap();

function getInstanceState( ctx ) {
	let s = instanceState.get( ctx );
	if ( ! s ) {
		s = { touchStartX: null, touchStartY: null };
		instanceState.set( ctx, s );
	}
	return s;
}

function applyRail( slides, total, currentIndex, transformFn, snapAll = false ) {
	slides.forEach( ( slide, index ) => {
		const offset = slideOffset( index, currentIndex, total );
		const result = transformFn( offset );

		// Snap istantaneo se: primo render (no fan-out dal centro) o wrap
		// (offset cambiato di >1, slide salta da un lato all'altro).
		const prevOffset = slide.dataset.lmOffset !== undefined
			? parseInt( slide.dataset.lmOffset, 10 )
			: offset;
		const isWrapping = Math.abs( offset - prevOffset ) > 1;
		const snap = snapAll || isWrapping;

		if ( snap ) {
			slide.style.transition = 'none';
		}

		slide.style.setProperty( '--lm-cf-offset', String( result.offset ) );
		slide.style.zIndex = String( result.zIndex );
		slide.style.pointerEvents = result.pointerEvents;
		slide.classList.toggle( 'is-current', offset === 0 );
		slide.setAttribute( 'aria-hidden', offset === 0 ? 'false' : 'true' );
		slide.dataset.lmOffset = String( offset );

		if ( snap ) {
			void slide.offsetHeight; // reflow sync
			slide.style.transition = '';
		}

		// Opacity dopo il restore transition → cambia con la transizione CSS.
		// Al primo render dei box: CSS 0 → JS 1 → fade-in in posizione.
		slide.style.opacity = String( result.opacity );
	} );
}

// Ctx già inizializzati: primo applyTransforms snap-only sui box.
const initializedBoxes = new WeakSet();

function applyVisuals( ref, ctx ) {
	const total = ctx.total;

	const imageSlides = ref.querySelectorAll( '.lm-carousel-featured__image-slide' );
	applyRail( imageSlides, total, ctx.currentIndex, slideTransform );

	const boxSlides = ref.querySelectorAll( '.lm-carousel-featured__box-slide' );
	const boxesFirstRun = ! initializedBoxes.has( ctx );
	initializedBoxes.add( ctx );
	applyRail( boxSlides, total, ctx.currentIndex, boxTransform, boxesFirstRun );

	// Lazy-load delle immagini nelle slide visibili.
	visibleIndices( ctx.currentIndex, total ).forEach( ( i ) => {
		const slide = imageSlides[ i ];
		if ( ! slide ) {
			return;
		}
		const img = slide.querySelector( 'img[data-src]' );
		if ( ! img ) {
			return;
		}
		img.classList.add( 'is-loading' );
		const finish = () => {
			img.classList.remove( 'is-loading' );
			img.removeAttribute( 'data-src' );
			img.removeEventListener( 'load', finish );
			img.removeEventListener( 'error', finish );
		};
		img.addEventListener( 'load', finish );
		img.addEventListener( 'error', finish );
		img.src = img.dataset.src;
	} );
}

store( STORE_NAMESPACE, {
	actions: {
		next() {
			const ctx = getContext();
			ctx.currentIndex = nextIndex( ctx.currentIndex, ctx.total );
		},
		prev() {
			const ctx = getContext();
			ctx.currentIndex = prevIndex( ctx.currentIndex, ctx.total );
		},
		onSlideClick( event ) {
			const ctx = getContext();
			const target = event.currentTarget;
			const targetIndex = parseInt( target.getAttribute( 'data-index' ), 10 );
			if ( Number.isNaN( targetIndex ) ) {
				return;
			}
			if ( targetIndex !== ctx.currentIndex ) {
				ctx.currentIndex = targetIndex;
				return;
			}
			// Click sulla slide al centro: segui il link del titolo (è nel box-slide).
			const section = target.closest( '.lm-carousel-featured' );
			const box = section && section.querySelector(
				`.lm-carousel-featured__box-slide[data-index="${ targetIndex }"]`
			);
			const link = box && box.querySelector( '.lm-carousel-featured__title a' );
			if ( link ) {
				link.click();
			}
		},
		onTouchStart( event ) {
			const ctx = getContext();
			const s = getInstanceState( ctx );
			const t = event.touches[ 0 ];
			s.touchStartX = t.clientX;
			s.touchStartY = t.clientY;
		},
		onTouchEnd( event ) {
			const ctx = getContext();
			const s = getInstanceState( ctx );
			if ( s.touchStartX === null ) {
				return;
			}
			const t = event.changedTouches[ 0 ];
			const dx = t.clientX - s.touchStartX;
			const dy = t.clientY - s.touchStartY;
			s.touchStartX = null;
			s.touchStartY = null;
			if ( Math.abs( dy ) > Math.abs( dx ) ) {
				return;
			}
			if ( Math.abs( dx ) < 50 ) {
				return;
			}
			ctx.currentIndex =
				dx < 0
					? nextIndex( ctx.currentIndex, ctx.total )
					: prevIndex( ctx.currentIndex, ctx.total );
		},
	},
	callbacks: {
		applyTransforms() {
			const ctx = getContext();
			const { ref } = getElement();
			if ( ! ref ) {
				return;
			}
			applyVisuals( ref, ctx );
		},
	},
} );
