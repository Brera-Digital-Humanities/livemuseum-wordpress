/**
 * Runtime Interactivity API del carousel "flat": track standard, scorrimento
 * di un articolo alla volta, niente wrap. Calcoli puri in ./logic.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';
import { visibleCount, clampIndex } from './logic';

const STORE_NAMESPACE = 'livemuseum/carousel-flat';

const instanceState = new WeakMap();

function getInstanceState( ctx ) {
	let s = instanceState.get( ctx );
	if ( ! s ) {
		s = { touchStartX: null, touchStartY: null };
		instanceState.set( ctx, s );
	}
	return s;
}

// Numero di card visibili, misurato dal DOM (card width + gap vs viewport).
function measureVisible( ref ) {
	const track = ref.querySelector( '.lm-carousel-flat__track' );
	const card = track && track.querySelector( '.lm-carousel-flat__card' );
	if ( ! track || ! card ) {
		return 1;
	}
	const gap = parseFloat( getComputedStyle( track ).columnGap ) || 0;
	const step = card.offsetWidth + gap;
	return visibleCount( ref.clientWidth, step );
}

function applyPosition( ref, ctx ) {
	const track = ref.querySelector( '.lm-carousel-flat__track' );
	if ( track ) {
		track.style.setProperty( '--lm-cfl-current', String( ctx.currentIndex ) );
	}

	// Lazy-load: carica le card fino a currentIndex + finestra visibile + buffer.
	const visible = measureVisible( ref );
	const limit = ctx.currentIndex + visible + 2;
	const cards = ref.querySelectorAll( '.lm-carousel-flat__card' );
	cards.forEach( ( cardEl, index ) => {
		if ( index > limit ) {
			return;
		}
		const img = cardEl.querySelector( 'img[data-src]' );
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
			const { ref } = getElement();
			const visible = measureVisible( ref );
			ctx.currentIndex = clampIndex( ctx.currentIndex + 1, ctx.total, visible );
		},
		prev() {
			const ctx = getContext();
			const { ref } = getElement();
			const visible = measureVisible( ref );
			ctx.currentIndex = clampIndex( ctx.currentIndex - 1, ctx.total, visible );
		},
		onKeyDown( event ) {
			if ( event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' ) {
				return;
			}
			event.preventDefault();
			const ctx = getContext();
			const { ref } = getElement();
			const visible = measureVisible( ref );
			const delta = event.key === 'ArrowRight' ? 1 : -1;
			ctx.currentIndex = clampIndex( ctx.currentIndex + delta, ctx.total, visible );
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
			const { ref } = getElement();
			const s = getInstanceState( ctx );
			if ( s.touchStartX === null ) {
				return;
			}
			const t = event.changedTouches[ 0 ];
			const dx = t.clientX - s.touchStartX;
			const dy = t.clientY - s.touchStartY;
			s.touchStartX = null;
			s.touchStartY = null;
			if ( Math.abs( dy ) > Math.abs( dx ) || Math.abs( dx ) < 50 ) {
				return;
			}
			const visible = measureVisible( ref );
			const delta = dx < 0 ? 1 : -1;
			ctx.currentIndex = clampIndex( ctx.currentIndex + delta, ctx.total, visible );
		},
	},
	callbacks: {
		applyTransforms() {
			const ctx = getContext();
			const { ref } = getElement();
			if ( ! ref ) {
				return;
			}
			applyPosition( ref, ctx );
		},
	},
} );
