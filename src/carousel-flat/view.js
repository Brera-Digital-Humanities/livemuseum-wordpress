/**
 * Runtime Interactivity API del carousel "flat": track left-anchored infinito.
 * Calcoli puri in ./logic. Il riciclo delle card avviene off-screen (snap senza
 * transition) così il movimento di riposizionamento non è mai visibile.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';
import { nextIndex, prevIndex, visibleCount, clampIndex, trackOffset } from './logic';

const STORE_NAMESPACE = 'livemuseum/carousel-flat';

const instanceState = new WeakMap();
const initialized = new WeakSet();

function getInstanceState( ctx ) {
	let s = instanceState.get( ctx );
	if ( ! s ) {
		s = { touchStartX: null, touchStartY: null };
		instanceState.set( ctx, s );
	}
	return s;
}

// Card visibili, misurate dal DOM (card width + gap vs viewport).
function measureVisible( ref ) {
	const track = ref.querySelector( '.lm-carousel-flat__track' );
	const card = track && track.querySelector( '.lm-carousel-flat__card' );
	if ( ! track || ! card ) {
		return 1;
	}
	const gap = parseFloat( getComputedStyle( track ).columnGap ) || 0;
	const step = card.offsetWidth + gap;
	return visibleCount( track.clientWidth, step );
}

// Avanza/indietreggia: infinito (wrap circolare) se ci sono più card di quante
// ne entrano, altrimenti clamp (le card stanno tutte a video, niente scroll).
function advance( ctx, ref, delta ) {
	const visible = measureVisible( ref );
	if ( ctx.total > visible ) {
		ctx.currentIndex = delta > 0
			? nextIndex( ctx.currentIndex, ctx.total )
			: prevIndex( ctx.currentIndex, ctx.total );
	} else {
		ctx.currentIndex = clampIndex( ctx.currentIndex + delta, ctx.total, visible );
	}
}

function applyCards( ref, ctx, snapAll ) {
	const visible = measureVisible( ref );
	const wrap = ctx.total > visible;
	const cards = ref.querySelectorAll( '.lm-carousel-flat__card' );

	cards.forEach( ( cardEl, index ) => {
		const offset = trackOffset( index, ctx.currentIndex, ctx.total, wrap );

		// Snap (transition: none) al primo render e quando una card ricicla
		// dall'altro lato (offset cambiato di >1): il riposizionamento avviene
		// nel buffer off-screen, quindi non è visibile.
		const prev = cardEl.dataset.lmPos !== undefined
			? parseInt( cardEl.dataset.lmPos, 10 )
			: offset;
		const snap = snapAll || Math.abs( offset - prev ) > 1;

		if ( snap ) {
			cardEl.style.transition = 'none';
		}
		cardEl.style.setProperty( '--lm-cfl-pos', String( offset ) );
		cardEl.dataset.lmPos = String( offset );
		if ( snap ) {
			void cardEl.offsetHeight;
			cardEl.style.transition = '';
		}

		// Lazy-load nelle card vicine al range visibile (buffer incluso).
		if ( offset >= -1 && offset <= visible + 1 ) {
			const img = cardEl.querySelector( 'img[data-src]' );
			if ( img ) {
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
			}
		}
	} );
}

store( STORE_NAMESPACE, {
	actions: {
		next() {
			advance( getContext(), getElement().ref, 1 );
		},
		prev() {
			advance( getContext(), getElement().ref, -1 );
		},
		onKeyDown( event ) {
			if ( event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' ) {
				return;
			}
			event.preventDefault();
			advance( getContext(), getElement().ref, event.key === 'ArrowRight' ? 1 : -1 );
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
			advance( ctx, ref, dx < 0 ? 1 : -1 );
		},
	},
	callbacks: {
		applyTransforms() {
			const ctx = getContext();
			const { ref } = getElement();
			if ( ! ref ) {
				return;
			}
			const firstRun = ! initialized.has( ctx );
			initialized.add( ctx );
			applyCards( ref, ctx, firstRun );
		},
	},
} );
