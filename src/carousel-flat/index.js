// Registrazione lato Site Editor: solo controlli + ServerSideRender per l'anteprima.
// Il rendering reale è in render.php.
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	RangeControl,
	SelectControl,
	FormTokenField,
	Placeholder,
	Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import ServerSideRender from '@wordpress/server-side-render';
import metadata from './block.json';
import './style.scss';

function Edit( { attributes, setAttributes } ) {
	const {
		heading,
		linkLabel,
		linkUrl,
		variant,
		postSource,
		categoryIds,
		postCount,
	} = attributes;
	const source = postSource || 'all';

	const categories = useSelect(
		( select ) =>
			select( coreStore ).getEntityRecords( 'taxonomy', 'category', {
				per_page: -1,
				hide_empty: false,
				_fields: 'id,name,slug',
			} ),
		[]
	);

	const isLoading = categories === null;
	const categoryNames = ( categories || [] ).map( ( c ) => c.name );
	const nameToId = Object.fromEntries(
		( categories || [] ).map( ( c ) => [ c.name, c.id ] )
	);
	const idToName = Object.fromEntries(
		( categories || [] ).map( ( c ) => [ c.id, c.name ] )
	);
	const selectedNames = ( categoryIds || [] )
		.map( ( id ) => idToName[ id ] )
		.filter( Boolean );

	const isRelatedMode = [ 'same_tags', 'same_categories', 'same_tags_or_categories' ].includes( source );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Testata', 'livemuseum' ) } initialOpen={ true }>
					<TextControl
						label={ __( 'Titolo sezione', 'livemuseum' ) }
						value={ heading || '' }
						onChange={ ( v ) => setAttributes( { heading: v } ) }
					/>
					<TextControl
						label={ __( 'Etichetta link "Scopri di più"', 'livemuseum' ) }
						value={ linkLabel || '' }
						onChange={ ( v ) => setAttributes( { linkLabel: v } ) }
					/>
					<TextControl
						label={ __( 'URL link', 'livemuseum' ) }
						value={ linkUrl || '' }
						onChange={ ( v ) => setAttributes( { linkUrl: v } ) }
						help={ __( 'Lascia vuoto per nascondere il link.', 'livemuseum' ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Layout', 'livemuseum' ) } initialOpen={ true }>
					<SelectControl
						label={ __( 'Variante grafica', 'livemuseum' ) }
						value={ variant || 'arch' }
						options={ [
							{ label: __( 'Arco (immagine top-rounded)', 'livemuseum' ), value: 'arch' },
							{ label: __( 'Quadrata (immagine non arrotondata)', 'livemuseum' ), value: 'square' },
						] }
						onChange={ ( v ) => setAttributes( { variant: v } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Sorgente post', 'livemuseum' ) } initialOpen={ true }>
					<SelectControl
						label={ __( 'Sorgente', 'livemuseum' ) }
						value={ source }
						options={ [
							{ label: __( 'Tutti i post', 'livemuseum' ), value: 'all' },
							{
								label: __( 'Categoria corrente (template archivio)', 'livemuseum' ),
								value: 'current_category',
							},
							{
								label: __( 'Categorie selezionate', 'livemuseum' ),
								value: 'fixed_categories',
							},
							{
								label: __( 'Related — stessi tag', 'livemuseum' ),
								value: 'same_tags',
							},
							{
								label: __( 'Related — stesse categorie', 'livemuseum' ),
								value: 'same_categories',
							},
							{
								label: __( 'Related — stessi tag o categorie', 'livemuseum' ),
								value: 'same_tags_or_categories',
							},
						] }
						onChange={ ( v ) => setAttributes( { postSource: v } ) }
						help={
							isRelatedMode
								? __(
										'Modalità related: filtra in base al post in vista. Solo nel template single; fuori da quel contesto: tutti i post.',
										'livemuseum'
								  )
								: source === 'current_category'
								? __(
										'Mostra solo i post della categoria visualizzata. Fuori dal template archivio: nessun filtro.',
										'livemuseum'
								  )
								: undefined
						}
					/>
					{ source === 'fixed_categories' &&
						( isLoading ? (
							<Spinner />
						) : (
							<FormTokenField
								label={ __( 'Categorie', 'livemuseum' ) }
								value={ selectedNames }
								suggestions={ categoryNames }
								onChange={ ( names ) => {
									const ids = names
										.map( ( n ) => nameToId[ n ] )
										.filter( ( id ) => typeof id === 'number' );
									setAttributes( { categoryIds: ids } );
								} }
								__experimentalExpandOnFocus={ true }
							/>
						) ) }
					<RangeControl
						label={ __( 'Numero post', 'livemuseum' ) }
						value={ postCount ?? 20 }
						onChange={ ( v ) => setAttributes( { postCount: v } ) }
						min={ 1 }
						max={ 50 }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() }>
				<ServerSideRender
					block={ metadata.name }
					attributes={ attributes }
					EmptyResponsePlaceholder={ () => (
						<Placeholder
							label={ __( 'Carousel Flat', 'livemuseum' ) }
							instructions={ __(
								'Nessun post trovato con i parametri selezionati.',
								'livemuseum'
							) }
						/>
					) }
				/>
			</div>
		</>
	);
}

registerBlockType( metadata.name, { edit: Edit } );
