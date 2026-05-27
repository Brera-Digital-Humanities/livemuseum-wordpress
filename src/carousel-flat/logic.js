// Logica pura del carousel "flat": track left-anchored infinito (nav condivisa in ../shared).

export { nextIndex, prevIndex } from '../shared/carousel-nav';

// Quante card entrano nel viewport dato il passo (card + gap) in px.
export function visibleCount( viewportWidth, cardStep ) {
	if ( cardStep <= 0 || viewportWidth <= 0 ) {
		return 1;
	}
	return Math.max( 1, Math.floor( viewportWidth / cardStep ) );
}

// Indice vincolato a [0, total - visible]: usato quando le card entrano tutte (niente wrap).
export function clampIndex( index, total, visible ) {
	const max = Math.max( 0, total - visible );
	return Math.min( Math.max( index, 0 ), max );
}

// Offset left-anchored (0 = bordo sinistro); con wrap, total-1 → -1 = buffer off-screen per il riciclo.
export function trackOffset( index, currentIndex, total, wrap ) {
	if ( total <= 0 ) {
		return 0;
	}
	let offset = ( ( index - currentIndex ) % total + total ) % total; // 0..total-1
	if ( wrap && offset === total - 1 ) {
		offset = -1;
	}
	return offset;
}
