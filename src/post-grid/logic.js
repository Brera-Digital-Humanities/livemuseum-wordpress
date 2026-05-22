// Logica pura del post-grid. Niente DOM, niente Interactivity API.

export function isCardVisible( index, visibleCount ) {
	return index < visibleCount;
}

export function nextCount( currentCount, total, batchSize = 12 ) {
	if ( total <= 0 ) {
		return 0;
	}
	return Math.min( currentCount + batchSize, total );
}

export function hasMore( visibleCount, total ) {
	return visibleCount < total;
}
