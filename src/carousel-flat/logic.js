// Logica pura del carousel "flat". Navigazione condivisa in ../shared.

export { nextIndex, prevIndex, slideOffset } from '../shared/carousel-nav';

// Card: distribuzione lineare via offset. Overflow:hidden della section
// taglia quelle fuori viewport, niente cutoff esplicito qui.
export function cardTransform( offset ) {
	const distance = Math.abs( offset );

	return {
		offset,
		opacity: 1,
		zIndex: Math.max( 1, 100 - distance ),
		pointerEvents: 'auto',
	};
}
