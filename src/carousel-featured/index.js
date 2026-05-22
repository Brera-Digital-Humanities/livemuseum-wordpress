// Registrazione lato Site Editor: solo controlli + ServerSideRender per l'anteprima.
// Il rendering reale è in render.php.
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	RangeControl,
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
	const { heading, linkLabel, linkUrl, categoryIds, postCount } = attributes;

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
				<PanelBody title={ __( 'Sorgente post', 'livemuseum' ) } initialOpen={ true }>
					{ isLoading ? (
						<Spinner />
					) : (
						<FormTokenField
							label={ __( 'Categorie selezionate', 'livemuseum' ) }
							value={ selectedNames }
							suggestions={ categoryNames }
							onChange={ ( names ) => {
								const ids = names
									.map( ( n ) => nameToId[ n ] )
									.filter( ( id ) => typeof id === 'number' );
								setAttributes( { categoryIds: ids } );
							} }
							__experimentalExpandOnFocus={ true }
							help={ __(
								'Nessuna categoria selezionata = tutti i post.',
								'livemuseum'
							) }
						/>
					) }
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
							label={ __( 'Carousel Featured', 'livemuseum' ) }
							instructions={ __(
								'Nessun post trovato per le categorie selezionate.',
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
