import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ServerSideRender from '@wordpress/server-side-render';
import metadata from './block.json';
import './style.scss';

function Edit( { attributes, setAttributes } ) {
	const { placeholder, buttonLabel, actionUrl, paramName } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Ricerca', 'livemuseum' ) } initialOpen={ true }>
					<TextControl
						label={ __( 'Placeholder', 'livemuseum' ) }
						value={ placeholder || '' }
						onChange={ ( v ) => setAttributes( { placeholder: v } ) }
					/>
					<TextControl
						label={ __( 'Etichetta bottone', 'livemuseum' ) }
						value={ buttonLabel || '' }
						onChange={ ( v ) => setAttributes( { buttonLabel: v } ) }
					/>
					<TextControl
						label={ __( 'URL di destinazione', 'livemuseum' ) }
						value={ actionUrl || '' }
						onChange={ ( v ) => setAttributes( { actionUrl: v } ) }
						help={ __( 'Indirizzo provvisorio a cui inviare la ricerca.', 'livemuseum' ) }
					/>
					<TextControl
						label={ __( 'Nome parametro', 'livemuseum' ) }
						value={ paramName || '' }
						onChange={ ( v ) => setAttributes( { paramName: v } ) }
						help={ __( 'Chiave query string, es. q → ?q=…', 'livemuseum' ) }
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
