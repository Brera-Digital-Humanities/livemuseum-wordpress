// Estende wp-scripts con l'entry SCSS globale (aggiunta alla config "scripts").
const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

const configs = Array.isArray( defaultConfig ) ? defaultConfig : [ defaultConfig ];
const scriptsConfig = configs[ 0 ];
const originalEntry = scriptsConfig.entry;

scriptsConfig.entry = async () => {
	const baseEntry =
		typeof originalEntry === 'function' ? await originalEntry() : originalEntry;

	return {
		...baseEntry,
		'style/style': path.resolve( __dirname, 'src/style/style.scss' ),
	};
};

module.exports = configs.length === 1 ? configs[ 0 ] : configs;
