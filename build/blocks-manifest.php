<?php
// This file is generated. Do not modify it manually.
return array(
	'carousel-featured' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'livemuseum/carousel-featured',
		'version' => '1.0.0',
		'title' => 'LiveMuseum — Carousel Featured (3D)',
		'category' => 'widgets',
		'icon' => 'slides',
		'description' => 'Carousel con slide centrale ingrandita in stile 3D. Sorgente: post WordPress filtrati per categorie selezionate.',
		'textdomain' => 'livemuseum',
		'supports' => array(
			'html' => false,
			'align' => array(
				'full',
				'wide'
			)
		),
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => 'Mostre ed eventi'
			),
			'linkLabel' => array(
				'type' => 'string',
				'default' => 'Scopri di più'
			),
			'linkUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'postSource' => array(
				'type' => 'string',
				'default' => 'all',
				'enum' => array(
					'all',
					'current_category',
					'fixed_categories'
				)
			),
			'categoryIds' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'number'
				)
			),
			'postCount' => array(
				'type' => 'number',
				'default' => 20
			)
		),
		'render' => 'file:./render.php',
		'editorScript' => 'file:./index.js',
		'viewScriptModule' => 'file:./view.js',
		'style' => 'file:./style-index.css'
	),
	'carousel-flat' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'livemuseum/carousel-flat',
		'version' => '1.0.0',
		'title' => 'LiveMuseum — Carousel Flat',
		'category' => 'widgets',
		'icon' => 'screenoptions',
		'description' => 'Carousel orizzontale con card unificate (immagine + testo). Sorgente post configurabile: tutti, categoria corrente, categorie selezionate, oppure modalità related (stessi tag/categorie).',
		'textdomain' => 'livemuseum',
		'supports' => array(
			'html' => false,
			'align' => array(
				'full',
				'wide'
			)
		),
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => 'News'
			),
			'linkLabel' => array(
				'type' => 'string',
				'default' => 'Scopri di più'
			),
			'linkUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'variant' => array(
				'type' => 'string',
				'default' => 'arch',
				'enum' => array(
					'arch',
					'square'
				)
			),
			'postSource' => array(
				'type' => 'string',
				'default' => 'all',
				'enum' => array(
					'all',
					'current_category',
					'fixed_categories',
					'same_tags',
					'same_categories',
					'same_tags_or_categories'
				)
			),
			'categoryIds' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'number'
				)
			),
			'postCount' => array(
				'type' => 'number',
				'default' => 20
			)
		),
		'render' => 'file:./render.php',
		'editorScript' => 'file:./index.js',
		'viewScriptModule' => 'file:./view.js',
		'style' => 'file:./style-index.css'
	),
	'post-grid' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'livemuseum/post-grid',
		'version' => '1.0.0',
		'title' => 'LiveMuseum — Post Grid',
		'category' => 'widgets',
		'icon' => 'grid-view',
		'description' => 'Griglia di post con infinite scroll. Sorgente: tutti, categoria corrente (archivio) o categorie selezionate.',
		'textdomain' => 'livemuseum',
		'supports' => array(
			'html' => false,
			'align' => array(
				'full',
				'wide'
			)
		),
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => ''
			),
			'linkLabel' => array(
				'type' => 'string',
				'default' => ''
			),
			'linkUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'postSource' => array(
				'type' => 'string',
				'default' => 'all',
				'enum' => array(
					'all',
					'current_category',
					'fixed_categories'
				)
			),
			'categoryIds' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'number'
				)
			),
			'initialCount' => array(
				'type' => 'number',
				'default' => 12
			),
			'batchSize' => array(
				'type' => 'number',
				'default' => 12
			),
			'maxPosts' => array(
				'type' => 'number',
				'default' => 200
			)
		),
		'render' => 'file:./render.php',
		'editorScript' => 'file:./index.js',
		'viewScriptModule' => 'file:./view.js',
		'style' => 'file:./style-index.css'
	),
	'section-header' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'livemuseum/section-header',
		'version' => '1.0.0',
		'title' => 'LiveMuseum — Section Header',
		'category' => 'design',
		'icon' => 'heading',
		'description' => 'Header di sezione (bordo tratteggiato + titolo con quadratino accent + link opzionale). Stesso componente usato nei carousel.',
		'textdomain' => 'livemuseum',
		'supports' => array(
			'html' => false,
			'align' => array(
				'full',
				'wide'
			)
		),
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => 'Titolo sezione'
			),
			'linkLabel' => array(
				'type' => 'string',
				'default' => 'Scopri di più'
			),
			'linkUrl' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'render' => 'file:./render.php',
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style-index.css'
	)
);
