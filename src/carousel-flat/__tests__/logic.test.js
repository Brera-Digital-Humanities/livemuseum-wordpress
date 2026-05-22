import {
	nextIndex,
	prevIndex,
	slideOffset,
	cardTransform,
} from '../logic';

describe( 'carousel-flat/logic', () => {
	it( 're-esporta la navigazione circolare condivisa', () => {
		expect( nextIndex( 0, 3 ) ).toBe( 1 );
		expect( prevIndex( 0, 3 ) ).toBe( 2 );
		expect( slideOffset( 4, 0, 5 ) ).toBe( -1 );
	} );

	describe( 'cardTransform', () => {
		it( 'card centrale: offset 0, opacity 1', () => {
			const t = cardTransform( 0 );
			expect( t.offset ).toBe( 0 );
			expect( t.opacity ).toBe( 1 );
			expect( t.pointerEvents ).toBe( 'auto' );
		} );
		it( 'card laterali: offset preservato, opacity sempre 1', () => {
			expect( cardTransform( 1 ).offset ).toBe( 1 );
			expect( cardTransform( -3 ).offset ).toBe( -3 );
			expect( cardTransform( 10 ).opacity ).toBe( 1 );
		} );
	} );
} );
