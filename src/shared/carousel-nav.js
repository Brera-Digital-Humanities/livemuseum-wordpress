// Navigazione circolare condivisa tra i carousel.

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

// Percorso circolare più corto tra index e currentIndex.
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
