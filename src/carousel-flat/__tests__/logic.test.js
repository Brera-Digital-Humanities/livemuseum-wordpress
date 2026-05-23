import { visibleCount, clampIndex } from '../logic';

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
} );
