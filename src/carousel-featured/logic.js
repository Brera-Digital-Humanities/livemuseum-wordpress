// Logica pura del carousel "featured". Navigazione condivisa in ../shared.
// CSS gestisce posizionamento (--lm-cf-offset * gap) e dimensioni (.is-current).

export { nextIndex, prevIndex, slideOffset, visibleIndices } from '../shared/carousel-nav';

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
