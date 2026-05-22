/**
 * Logica pura del carousel: niente DOM, niente import da @wordpress/interactivity.
 * Il CSS gestisce posizionamento (--lm-cf-offset * gap) e dimensioni (.is-current).
 */

export function nextIndex( currentIndex, total ) {
	if ( total <= 0 ) {
		return 0;
	}
	return ( currentIndex + 1 ) % total;
}

export function prevIndex( currentIndex, total ) {
	if ( total <= 0 ) {
		return 0;
	}
	return ( currentIndex - 1 + total ) % total;
}

// Offset circolare: percorso più corto tra index e currentIndex.
export function slideOffset( index, currentIndex, total ) {
	if ( total <= 0 ) {
		return 0;
	}
	let diff = index - currentIndex;
	const half = Math.floor( total / 2 );
	if ( diff > half ) {
		diff -= total;
	}
	if ( diff < -half ) {
		diff += total;
	}
	return diff;
}

// Rail immagini: visible=1 → totale 3 slide visibili (centro + 1 per lato).
export function slideTransform( offset, opts = {} ) {
	const { visible = 1 } = opts;
	const distance = Math.abs( offset );
	const inRange = distance <= visible;

	return {
		offset,
		opacity: inRange ? 1 : 0,
		zIndex: offset === 0 ? 100 : Math.max( 1, 100 - distance * 10 ),
		pointerEvents: inRange ? 'auto' : 'none',
	};
}

// Rail box: opacity sempre 1, l'overflow:hidden della section taglia i fuori-viewport.
export function boxTransform( offset ) {
	const distance = Math.abs( offset );

	return {
		offset,
		opacity: 1,
		zIndex: Math.max( 1, 100 - distance ),
		pointerEvents: 'auto',
	};
}

// Indici nel range [-visible, +visible] — usato dal lazy-load.
export function visibleIndices( currentIndex, total, visible = 1 ) {
	if ( total <= 0 ) {
		return [];
	}
	const result = [];
	for ( let i = 0; i < total; i++ ) {
		if ( Math.abs( slideOffset( i, currentIndex, total ) ) <= visible ) {
			result.push( i );
		}
	}
	return result;
}
