import { visibleCount, clampIndex, trackOffset } from '../logic';

describe( 'carousel-flat/logic', () => {
	describe( 'visibleCount', () => {
		it( 'calcola quante card entrano nel viewport', () => {
			expect( visibleCount( 1400, 455 ) ).toBe( 3 );
			expect( visibleCount( 910, 455 ) ).toBe( 2 );
			expect( visibleCount( 400, 455 ) ).toBe( 1 ); // almeno 1
		} );
		it( 'ritorna 1 con input non validi', () => {
			expect( visibleCount( 0, 455 ) ).toBe( 1 );
			expect( visibleCount( 1400, 0 ) ).toBe( 1 );
		} );
	} );

	describe( 'clampIndex', () => {
		it( 'non scende sotto 0', () => {
			expect( clampIndex( -1, 10, 3 ) ).toBe( 0 );
		} );
		it( 'non supera total - visible (ultima pagina piena)', () => {
			expect( clampIndex( 99, 10, 3 ) ).toBe( 7 );
		} );
		it( 'lascia passare valori intermedi', () => {
			expect( clampIndex( 4, 10, 3 ) ).toBe( 4 );
		} );
		it( 'max 0 se le card entrano tutte', () => {
			expect( clampIndex( 5, 3, 5 ) ).toBe( 0 );
		} );
	} );

	describe( 'trackOffset', () => {
		it( 'la card corrente è a offset 0 (bordo sinistro)', () => {
			expect( trackOffset( 0, 0, 5, true ) ).toBe( 0 );
			expect( trackOffset( 2, 2, 5, true ) ).toBe( 0 );
		} );
		it( 'le card successive scalano a destra', () => {
			expect( trackOffset( 1, 0, 5, true ) ).toBe( 1 );
			expect( trackOffset( 3, 0, 5, true ) ).toBe( 3 );
		} );
		it( 'con wrap, la posizione più lontana diventa -1 (buffer off-screen sx)', () => {
			expect( trackOffset( 4, 0, 5, true ) ).toBe( -1 );
			expect( trackOffset( 0, 1, 5, true ) ).toBe( -1 );
		} );
		it( 'senza wrap la posizione resta in [0, total-1]', () => {
			expect( trackOffset( 4, 0, 5, false ) ).toBe( 4 );
		} );
		it( 'ritorna 0 con total 0', () => {
			expect( trackOffset( 0, 0, 0, true ) ).toBe( 0 );
		} );
	} );
} );
