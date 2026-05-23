// Logica pura del carousel "flat": track left-anchored infinito.
// nextIndex/prevIndex (circolari) sono condivisi con il featured.

export { nextIndex, prevIndex } from '../shared/carousel-nav';

// Quante card entrano nel viewport dato il passo (card + gap) in px.
export function visibleCount( viewportWidth, cardStep ) {
	if ( cardStep <= 0 || viewportWidth <= 0 ) {
		return 1;
	}
	return Math.max( 1, Math.floor( viewportWidth / cardStep ) );
}

// Indice vincolato a [0, total - visible]: usato quando le card entrano tutte
// (niente scroll infinito, niente wrap).
export function clampIndex( index, total, visible ) {
	const max = Math.max( 0, total - visible );
	return Math.min( Math.max( index, 0 ), max );
}

// Offset di display left-anchored: offset 0 = card al bordo sinistro.
// Con wrap, la posizione più lontana (total-1) diventa -1 → la card finisce
// nel buffer off-screen a sinistra, pronta a riciclarsi senza salto visibile.
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
