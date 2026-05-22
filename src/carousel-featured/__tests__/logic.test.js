import {
	nextIndex,
	prevIndex,
	slideOffset,
	slideTransform,
	boxTransform,
	visibleIndices,
} from '../logic';

describe( 'carousel-featured/logic', () => {
	describe( 'nextIndex / prevIndex', () => {
		it( 'wrappa circolarmente in avanti', () => {
			expect( nextIndex( 0, 3 ) ).toBe( 1 );
			expect( nextIndex( 2, 3 ) ).toBe( 0 );
		} );
		it( 'wrappa circolarmente all\'indietro', () => {
			expect( prevIndex( 0, 3 ) ).toBe( 2 );
			expect( prevIndex( 2, 3 ) ).toBe( 1 );
		} );
		it( 'ritorna 0 quando total è 0', () => {
			expect( nextIndex( 0, 0 ) ).toBe( 0 );
			expect( prevIndex( 0, 0 ) ).toBe( 0 );
		} );
	} );

	describe( 'slideOffset', () => {
		it( 'la slide al centro ha offset 0', () => {
			expect( slideOffset( 2, 2, 5 ) ).toBe( 0 );
		} );
		it( 'usa il percorso circolare più corto', () => {
			expect( slideOffset( 4, 0, 5 ) ).toBe( -1 );
			expect( slideOffset( 1, 0, 5 ) ).toBe( 1 );
		} );
		it( 'ritorna 0 quando total è 0', () => {
			expect( slideOffset( 0, 0, 0 ) ).toBe( 0 );
		} );
	} );

	describe( 'slideTransform', () => {
		it( 'slide centrale: offset 0, opacity 1, pointer events attivi', () => {
			const t = slideTransform( 0 );
			expect( t.offset ).toBe( 0 );
			expect( t.opacity ).toBe( 1 );
			expect( t.pointerEvents ).toBe( 'auto' );
			expect( t.zIndex ).toBe( 100 );
		} );
		it( 'slide laterale immediatamente adiacente (default visible=1): visibile', () => {
			expect( slideTransform( 1 ).opacity ).toBe( 1 );
			expect( slideTransform( -1 ).opacity ).toBe( 1 );
		} );
		it( 'slide oltre la visibilità (default visible=1): opacity 0 e pointer-events none', () => {
			const t = slideTransform( 2 );
			expect( t.opacity ).toBe( 0 );
			expect( t.pointerEvents ).toBe( 'none' );
		} );
	} );

	describe( 'boxTransform', () => {
		it( 'box centrale: offset 0, opacity 1', () => {
			const t = boxTransform( 0 );
			expect( t.offset ).toBe( 0 );
			expect( t.opacity ).toBe( 1 );
			expect( t.pointerEvents ).toBe( 'auto' );
		} );
		it( 'box laterali: offset preservato, sempre opacity 1 (overflow:hidden taglia i fuori-viewport)', () => {
			expect( boxTransform( 1 ).offset ).toBe( 1 );
			expect( boxTransform( -3 ).offset ).toBe( -3 );
			expect( boxTransform( 10 ).opacity ).toBe( 1 );
		} );
	} );

	describe( 'visibleIndices', () => {
		it( 'restituisce gli indici nel range di visibilità', () => {
			expect( visibleIndices( 0, 5 ).sort() ).toEqual( [ 0, 1, 4 ] );
			expect( visibleIndices( 2, 5, 2 ).sort() ).toEqual( [ 0, 1, 2, 3, 4 ] );
		} );
		it( 'array vuoto quando total è 0', () => {
			expect( visibleIndices( 0, 0 ) ).toEqual( [] );
		} );
	} );
} );
