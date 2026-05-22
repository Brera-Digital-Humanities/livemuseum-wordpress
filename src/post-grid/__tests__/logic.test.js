import { isCardVisible, nextCount, hasMore } from '../logic';

describe( 'post-grid/logic', () => {
	describe( 'isCardVisible', () => {
		it( 'card con index < visibleCount: visibile', () => {
			expect( isCardVisible( 0, 12 ) ).toBe( true );
			expect( isCardVisible( 11, 12 ) ).toBe( true );
		} );
		it( 'card con index >= visibleCount: nascosta', () => {
			expect( isCardVisible( 12, 12 ) ).toBe( false );
			expect( isCardVisible( 20, 12 ) ).toBe( false );
		} );
	} );

	describe( 'nextCount', () => {
		it( 'incrementa di batchSize', () => {
			expect( nextCount( 12, 100, 12 ) ).toBe( 24 );
		} );
		it( 'satura al totale', () => {
			expect( nextCount( 95, 100, 12 ) ).toBe( 100 );
			expect( nextCount( 100, 100, 12 ) ).toBe( 100 );
		} );
		it( 'ritorna 0 se total è 0', () => {
			expect( nextCount( 0, 0 ) ).toBe( 0 );
		} );
	} );

	describe( 'hasMore', () => {
		it( 'true quando ci sono ancora post da rivelare', () => {
			expect( hasMore( 12, 24 ) ).toBe( true );
		} );
		it( 'false quando tutti i post sono visibili', () => {
			expect( hasMore( 24, 24 ) ).toBe( false );
		} );
	} );
} );
