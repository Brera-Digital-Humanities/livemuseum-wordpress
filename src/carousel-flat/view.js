/**
 * Runtime Interactivity API del carousel "flat".
 * Calcoli puri in ./logic; qui DOM, eventi e store.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';
import {
	nextIndex,
	prevIndex,
	slideOffset,
	cardTransform,
} from './logic';

const STORE_NAMESPACE = 'livemuseum/carousel-flat';

// Touch coords per istanza, fuori dal ctx reattivo.
const instanceState = new WeakMap();

function getInstanceState( ctx ) {
	let s = instanceState.get( ctx );
	if ( ! s ) {
		s = { touchStartX: null, touchStartY: null };
		instanceState.set( ctx, s );
	}
	return s;
}

// Ctx già inizializzati: primo applyTransforms snap-only per evitare fan-out.
const initialized = new WeakSet();

function applyCards( cards, total, currentIndex, snapAll ) {
	cards.forEach( ( card, index ) => {
		const offset = slideOffset( index, currentIndex, total );
		const result = cardTransform( offset );

		const prevOffset = card.dataset.lmOffset !== undefined
			? parseInt( card.dataset.lmOffset, 10 )
			: offset;
		const isWrapping = Math.abs( offset - prevOffset ) > 1;
		const snap = snapAll || isWrapping;

		if ( snap ) {
			card.style.transition = 'none';
		}

		card.style.setProperty( '--lm-cfl-offset', String( result.offset ) );
		card.style.zIndex = String( result.zIndex );
		card.style.pointerEvents = result.pointerEvents;
		card.dataset.lmOffset = String( offset );

		if ( snap ) {
			void card.offsetHeight;
			card.style.transition = '';
		}

		card.style.opacity = String( result.opacity );
	} );
}

function applyVisuals( ref, ctx ) {
	const cards = ref.querySelectorAll( '.lm-carousel-flat__card' );
	const firstRun = ! initialized.has( ctx );
	initialized.add( ctx );
	applyCards( cards, ctx.total, ctx.currentIndex, firstRun );

	// Lazy-load delle thumbnail nelle card vicine (range ±2).
	const total = ctx.total;
	cards.forEach( ( card, index ) => {
		const offset = slideOffset( index, ctx.currentIndex, total );
		if ( Math.abs( offset ) > 2 ) {
			return;
		}
		const img = card.querySelector( 'img[data-src]' );
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
		onKeyDown( event ) {
			const ctx = getContext();
			if ( event.key === 'ArrowRight' ) {
				event.preventDefault();
				ctx.currentIndex = nextIndex( ctx.currentIndex, ctx.total );
			} else if ( event.key === 'ArrowLeft' ) {
				event.preventDefault();
				ctx.currentIndex = prevIndex( ctx.currentIndex, ctx.total );
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
