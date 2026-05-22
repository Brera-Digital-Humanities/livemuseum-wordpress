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
	)
);
