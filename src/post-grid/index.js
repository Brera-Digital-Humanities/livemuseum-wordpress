// Registrazione lato Site Editor: solo controlli + ServerSideRender per l'anteprima.
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
		postSource,
		categoryIds,
		initialCount,
		batchSize,
		maxPosts,
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

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Testata', 'livemuseum' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Titolo sezione', 'livemuseum' ) }
						value={ heading || '' }
						onChange={ ( v ) => setAttributes( { heading: v } ) }
						help={ __( 'Lascia vuoto per nascondere l\'intera testata.', 'livemuseum' ) }
					/>
					<TextControl
						label={ __( 'Etichetta link', 'livemuseum' ) }
						value={ linkLabel || '' }
						onChange={ ( v ) => setAttributes( { linkLabel: v } ) }
					/>
					<TextControl
						label={ __( 'URL link', 'livemuseum' ) }
						value={ linkUrl || '' }
						onChange={ ( v ) => setAttributes( { linkUrl: v } ) }
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
						] }
						onChange={ ( v ) => setAttributes( { postSource: v } ) }
						help={
							source === 'current_category'
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
				</PanelBody>

				<PanelBody title={ __( 'Infinite scroll', 'livemuseum' ) } initialOpen={ false }>
					<RangeControl
						label={ __( 'Card iniziali', 'livemuseum' ) }
						value={ initialCount ?? 12 }
						onChange={ ( v ) => setAttributes( { initialCount: v } ) }
						min={ 1 }
						max={ 60 }
						help={ __( 'Numero di card visibili al primo render.', 'livemuseum' ) }
					/>
					<RangeControl
						label={ __( 'Batch per scroll', 'livemuseum' ) }
						value={ batchSize ?? 12 }
						onChange={ ( v ) => setAttributes( { batchSize: v } ) }
						min={ 1 }
						max={ 30 }
						help={ __( 'Quante card aggiungere ad ogni trigger di scroll.', 'livemuseum' ) }
					/>
					<RangeControl
						label={ __( 'Massimo totale', 'livemuseum' ) }
						value={ maxPosts ?? 200 }
						onChange={ ( v ) => setAttributes( { maxPosts: v } ) }
						min={ 10 }
						max={ 500 }
						step={ 10 }
						help={ __( 'Limite massimo di post renderizzati dal server.', 'livemuseum' ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() }>
				<ServerSideRender
					block={ metadata.name }
					attributes={ attributes }
					EmptyResponsePlaceholder={ () => (
						<Placeholder
							label={ __( 'Post Grid', 'livemuseum' ) }
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
