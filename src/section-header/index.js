import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ServerSideRender from '@wordpress/server-side-render';
import metadata from './block.json';
import './style.scss';

function Edit( { attributes, setAttributes } ) {
	const { heading, linkLabel, linkUrl } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Contenuti', 'livemuseum' ) } initialOpen={ true }>
					<TextControl
						label={ __( 'Titolo', 'livemuseum' ) }
						value={ heading || '' }
						onChange={ ( v ) => setAttributes( { heading: v } ) }
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
						help={ __( 'Lascia vuoto per nascondere il link.', 'livemuseum' ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() }>
				<ServerSideRender block={ metadata.name } attributes={ attributes } />
			</div>
		</>
	);
}

registerBlockType( metadata.name, { edit: Edit } );
