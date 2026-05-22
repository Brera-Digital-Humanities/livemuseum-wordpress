/**
 * Runtime Interactivity API del post-grid: infinite scroll via IntersectionObserver.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';
import { isCardVisible, nextCount, hasMore } from './logic';

const STORE_NAMESPACE = 'livemuseum/post-grid';

// IntersectionObserver per istanza, fuori dal ctx reattivo.
const instanceObservers = new WeakMap();

function applyVisibility( ref, ctx ) {
	const cards = ref.querySelectorAll( '.lm-post-grid__card' );
	cards.forEach( ( card, index ) => {
		const visible = isCardVisible( index, ctx.visibleCount );
		card.classList.toggle( 'is-hidden', ! visible );
	} );

	// Lazy-load delle thumbnail nelle card visibili.
	cards.forEach( ( card, index ) => {
		if ( ! isCardVisible( index, ctx.visibleCount ) ) {
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

	// Messaggio "fine risultati" visibile solo a fine lista.
	const status = ref.querySelector( '.lm-post-grid__status--end' );
	if ( status ) {
		status.classList.toggle( 'is-visible', ! hasMore( ctx.visibleCount, ctx.total ) && ctx.total > 0 );
	}
}

function loadMore( ctx, sentinel ) {
	if ( ! hasMore( ctx.visibleCount, ctx.total ) ) {
		return;
	}
	ctx.visibleCount = nextCount( ctx.visibleCount, ctx.total, ctx.batchSize || 12 );

	// Se la sentinel rimane intersecata (viewport alto / pochi post),
	// l'observer non rifirerebbe: si rilancia in rAF finché esce dalla zona
	// di trigger (300px sotto il viewport) o non ci sono più post.
	requestAnimationFrame( () => {
		if ( ! hasMore( ctx.visibleCount, ctx.total ) ) {
			return;
		}
		const rect = sentinel.getBoundingClientRect();
		if ( rect.top < window.innerHeight + 300 ) {
			loadMore( ctx, sentinel );
		}
	} );
}

store( STORE_NAMESPACE, {
	callbacks: {
		init() {
			const ctx = getContext();
			const { ref } = getElement();
			if ( ! ref ) {
				return;
			}

			// Stato iniziale: nasconde le card oltre visibleCount + lazy-load delle prime.
			applyVisibility( ref, ctx );

			const sentinel = ref.querySelector( '.lm-post-grid__sentinel' );
			if ( ! sentinel ) {
				return;
			}

			const observer = new IntersectionObserver(
				( entries ) => {
					entries.forEach( ( entry ) => {
						if ( entry.isIntersecting ) {
							loadMore( ctx, sentinel );
						}
					} );
				},
				{ rootMargin: '300px' }
			);
			observer.observe( sentinel );
			instanceObservers.set( ctx, observer );
		},
		applyVisibility() {
			const ctx = getContext();
			const { ref } = getElement();
			if ( ! ref ) {
				return;
			}
			applyVisibility( ref, ctx );
		},
	},
} );
