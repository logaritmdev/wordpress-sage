<?php

namespace App;

use Timber;
use App\Controllers\App;
use Roots\Sage\Container;
use Roots\Sage\Assets\JsonManifest;
use Roots\Sage\Template\Blade;
use Roots\Sage\Template\BladeProvider;

/**
 * Starts session
 */
if (session_id() == '') {
	session_start();
}

/**
 * Theme assets
 */
add_action('wp_enqueue_scripts', function () {

	wp_deregister_style('schedule');
	wp_deregister_script('schedule');
	wp_deregister_script('jquery');

	wp_register_script('jquery', 'https://code.jquery.com/jquery-3.5.1.min.js', array(), '3.5.1');
	wp_enqueue_script('jquery');

	wp_enqueue_style('sage/main.css', asset_path('styles/main.css'), false, null);
	wp_enqueue_script('sage/main.js', asset_path('scripts/main.js'), false, null, true);

	wp_localize_script('sage/main.js', 'app', array(
		'theme' => array(
			'dist' => preg_replace('/resources$/', 'dist', get_stylesheet_directory_uri()),
		)
	));

}, 20);

/**
 * Theme setup
 */
add_action('after_setup_theme', function () {

	load_theme_textdomain('sage', get_template_directory() . '/languages');

	add_theme_support('soil-clean-up');
	add_theme_support('soil-jquery-cdn');
	add_theme_support('soil-nav-walker');
	add_theme_support('soil-nice-search');
	add_theme_support('soil-relative-urls');

	register_nav_menus([
		'primary_menu' => __('Primary Menu', 'sage'),
		'secondary_menu' => __('Secondary Menu', 'sage'),
	]);

	add_theme_support('title-tag');
	add_theme_support('post-thumbnails');
	add_theme_support('html5', ['caption', 'comment-form', 'comment-list', 'gallery', 'search-form']);
	add_theme_support('customize-selective-refresh-widgets');

	add_editor_style(get_stylesheet_directory_uri() . '/editor-style-shared.css');
	add_editor_style(get_stylesheet_directory_uri() . '/editor-style.css');

	register_post_type('acf-clone', array(

		'labels' => array(
			'name'               => _x('ACF Clones', 'post type general name', 'sage'),
			'singular_name'      => _x('ACF Clone', 'post type ACF Clone name', 'sage'),
			'menu_name'          => _x('ACF Clones', 'admin menu', 'sage'),
			'name_admin_bar'     => _x('ACF Clone', 'add new on admin bar', 'sage'),
			'add_new'            => _x('Add New', 'ACF Clone', 'sage'),
			'add_new_item'       => __('Add New ACF Clone', 'sage'),
			'new_item'           => __('New ACF Clone', 'sage'),
			'edit_item'          => __('Edit ACF Clone', 'sage'),
			'view_item'          => __('View ACF Clone', 'sage'),
			'all_items'          => __('All ACF Clones', 'sage'),
			'search_items'       => __('Search ACF Clones', 'sage'),
			'parent_item_colon'  => __('Parent ACF Clones:', 'sage'),
			'not_found'          => __('No ACF Clones found.', 'sage'),
			'not_found_in_trash' => __('No ACF Clones found in Trash.', 'sage')
		),

		'description'        => __('ACF Clones.', 'sage'),
		'public'             => false,
		'publicly_queryable' => false,
		'show_ui'            => true,
		'show_in_menu'       => false,
		'query_var'          => true,
		'rewrite'            => array('slug' => 'acf-clone'),
		'capability_type'    => 'post',
		'has_archive'        => false,
		'hierarchical'       => false,
		'menu_position'      => null,
		'menu_icon'          => '',
		'show_in_rest'       => false,
		'supports'           => array('title', 'thumbnail', 'editor')
	));

	/*
	register_post_type('example', array(

		'labels' => array(
			'name'               => _x('Examples', 'post type general name', 'sage'),
			'singular_name'      => _x('Example', 'post type Example name', 'sage'),
			'menu_name'          => _x('Examples', 'admin menu', 'sage'),
			'name_admin_bar'     => _x('Example', 'add new on admin bar', 'sage'),
			'add_new'            => _x('Add New', 'Example', 'sage'),
			'add_new_item'       => __('Add New Example', 'sage'),
			'new_item'           => __('New Example', 'sage'),
			'edit_item'          => __('Edit Example', 'sage'),
			'view_item'          => __('View Example', 'sage'),
			'all_items'          => __('All Examples', 'sage'),
			'search_items'       => __('Search Examples', 'sage'),
			'parent_item_colon'  => __('Parent Examples:', 'sage'),
			'not_found'          => __('No Examples found.', 'sage'),
			'not_found_in_trash' => __('No Examples found in Trash.', 'sage')
		),

		'description'        => __('Examples.', 'sage'),
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'rewrite'            => array('slug' => 'example'),
		'capability_type'    => 'post',
		'has_archive'        => false,
		'hierarchical'       => false,
		'menu_position'      => null,
		'menu_icon'          => 'dashicons-businessman',
		'show_in_rest'       => false,
		'supports'           => array('title', 'thumbnail', 'editor')
	));

	register_taxonomy('example-category', array('example'), array(

		'labels'           => array(
			'name'             => _x('Categories','taxonomy general name', 'sage'),
			'singular_name'    => _x('Category','taxonomy singular name', 'sage'),
			'search_items'     => __('Search Categories', 'sage'),
			'all_items'        => __('All Categories', 'sage'),
			'parent_item'      => __('Parent Category', 'sage'),
			'parent_item_colon'=> __('Parent Category:', 'sage'),
			'edit_item'        => __('Edit Category', 'sage'),
			'update_item'      => __('Update Category', 'sage'),
			'add_new_item'     => __('Add New Category', 'sage'),
			'new_item_name'    => __('New Category Name', 'sage'),
			'menu_name'        => __('Category', 'sage'),
		),

		'hierarchical'     => true,
		'show_ui'          => true,
		'show_admin_column'=> true,
		'show_in_rest'     => true,
		'query_var'        => true,
		'rewrite'          => array('slug' => 'example-category'),
	));
	*/

}, 20);

/**
 * Updates the `$post` variable on each iteration of the loop.
 * Note: updated value is only available for subsequently loaded views, such as partials
 */
add_action('the_post', function ($post) {
	sage('blade')->share('post', $post);
});

/**
 * Setup Sage options
 */
add_action('after_setup_theme', function () {

	/**
	 * Add JsonManifest to Sage container
	 */
	sage()->singleton('sage.assets', function () {
		return new JsonManifest(config('assets.manifest'), config('assets.uri'));
	});

	/**
	 * Add Blade to Sage container
	 */
	sage()->singleton('sage.blade', function (Container $app) {
		$cachePath = config('view.compiled');
		if (!file_exists($cachePath)) {
			wp_mkdir_p($cachePath);
		}
		(new BladeProvider($app))->register();
		return new Blade($app['view']);
	});

	/**
	 * Create @asset() Blade directive
	 */
	sage('blade')->compiler()->directive('asset', function ($asset) {
		return "<?= " . __NAMESPACE__ . "\\asset_path({$asset}); ?>";
	});
});

/**
 * Add theme specific styles.
 */
add_action('wp_head', function() {
?>
	<!--
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,800,900" crossorigin="anonymous">
	-->
<?php
});

/**
 * Adding admin styles.
 */
add_action('admin_head', function() {
	echo '
		<style>

			.cortex-create-block-page .acf-admin-toolbar,
			.cortex-update-block-page .acf-admin-toolbar {
				display: none;
			}

			.acf-field-wysiwyg.small-editor iframe {
				min-height: 120px !important;
				max-height: 120px !important;
				height: 120px !important;
			}

			.acf-field .acf-radio-list {
				margin-bottom: 0px;
			}

			.block-editor-writing-flow {
				height: auto;
			}

			.acf-field .acf-radio-list {
				margin-left: 0px !important;
				padding-left: 0px !important;
			}

		</style>
	';
});

/**
 * Removes the margin top applied by the wp admin bar.
 * @since 1.0.0
 */
add_action('get_header', function() {
	remove_action('wp_head', '_admin_bar_bump_cb');
});

/**
 * Customizes the login page
 * @since 1.0.0
 */
add_action('login_enqueue_scripts', function() {
	// wp_enqueue_style('sage/css', asset_path('styles/main.css'), false, null);
});

/**
 * Theme editor
 */
add_filter('mce_buttons_2', function($buttons) {
	$buttons[] = 'superscript';
	$buttons[] = 'subscript';
	return $buttons;
});

/**
 * Always paste as text
 */
add_filter('tiny_mce_before_init', function($init) {
	$init['paste_as_text'] = true;
	return $init;
});

/**
 * SVG Support
 */
add_filter('upload_mimes', function($mimes) {
	$mimes['svg'] = 'image/svg+xml';
	return $mimes;
});

/**
 * Twig functions
 */
add_filter('get_twig', function($twig) {

	/**
	 * @filter date
	 * @since 1.0.0
	 */
	$twig->addFilter('date', new \Twig_Filter_Function(function($date, $format = null) {

		if ($format === null) {
			$format = get_option('date_format');
		}

		if ($date instanceof DateTime) {
			$timestamp = $date->getTimestamp();
		} else if (is_numeric($date)) {
			$timestamp = intval($date);
		} else {
			$timestamp = strtotime($date);
		}

		return date_i18n($format, $timestamp);
	}));

	/**
	 * @filter image
	 * @since 1.0.0
	 */
	$twig->addFilter(new \Twig\TwigFilter('image', function($image, $rw = null, $rh = null, $mode = 'fill', $class = '') {

		if ($image == null ||
			$image == false) {
			return '';
		}

		if (is_string($rw)) {
			$mode = $rw;
			$rw = null;
		}

		if (is_string($rh)) {
			$mode = $rh;
			$rh = null;
		}

		$image = new \TimberImage($image);

		if ($rw != null ||
			$rh != null) {

			$w = $image->width();
			$h = $image->height();

			if (($rw && $w > $rw) ||
				($rh && $h > $rh)) {
				$image = \TimberImageHelper::resize($image, $rw, $rh);
			}
		}

		switch (pathinfo($image, PATHINFO_EXTENSION)) {

			case 'jpg':
				$type = 'image/jpeg';
				break;

			case 'png':
				$type = 'image/png';
				break;

			case 'gif':
				$type = 'image/gif';
				break;

			case 'svg':
				$type = 'image/svg';
				break;

			default;
				$type = 'image/jpeg';
				break;
		}

		return sprintf(
			'<div class="image image--%s %s">
				<div class="frame">
					<picture>
						<source srcset="%s" type="%s"/>
						<img src="%s">
					</picture>
				</div>
			</div>',
			$mode,
			$class,
			$image,
			$type,
			$image
		);

	}));

	/**
	 * @filter video
	 * @since 1.0.0
	 */
	$twig->addFilter(new \Twig_SimpleFilter('video', function($video, $play = true, $load = true, $mute = true, $loop = true) {

		$video = is_array($video) ? $video['url'] : $video;

		if ($play) {
			$play = 'autoplay playsinline';
		}

		if ($mute) {
			$mute = 'muted';
		}

		if ($loop) {
			$loop = 'loop';
		}

		if ($load) {
			$load = 'preload="auto"';
		} else {
			$load = 'preload="none"';
		}

		return sprintf(

			'<div class="video">
				<video class="background" %s %s %s %s>
					<source src="%s" type="video/mp4">
				</video>
			</div>',

			$play, $mute,
			$loop, $load,
			$video

		);
	}));

	/**
	 * @filter autodetect
	 * @since 1.0.0
	 */
	$twig->addFilter(new \Twig_SimpleFilter('autodetect', function($value) {

		$value = strip_tags($value, '<br>');

		$searches = [];
		$replaces = [];

		if (preg_match_all('#\b[0-9]{3}\s*[-]?\s*[0-9]{3}\s*[-]?\s*[0-9]{4}\b#i', $value, $matches)) {

			foreach ($matches[0] as $match) {

				$text = $match;
				$link = $match;
				$link = preg_replace('/\s+/', '', $link);

				if (in_array($match, $searches) == false) {
					$searches[] = $text;
					$replaces[] = sprintf('<a class="phone" href="tel:%s">%s</a>', $link, $text);
				}
			}
		}

		if (preg_match_all('#[a-z0-9_\-\+\.]+@[a-z0-9\-]+\.([a-z]{2,4})(?:\.[a-z]{2})?#i', $value, $matches)) {

			foreach ($matches[0] as $match) {

				$text = $match;
				$link = $match;
				$link = preg_replace('/\s+/', '', $link);

				if (in_array($match, $searches) == false) {
					$searches[] = $match;
					$replaces[] = sprintf('<a class="email" href="mailto:%s">%s</a>', $link, $text);
				}
			}
		}

		if (preg_match_all('#\bhttps?://[^,\s()<>]+(?:\([\w\d]+\)|([^,[:punct:]\s]|/))#i', $value, $matches)) {

			foreach ($matches[0] as $match) {

				$text = $match;
				$link = $match;

				$text = preg_replace('/^http:\/\//', '', $text);
				$text = preg_replace('/^https:\/\//', '', $text);
				$text = preg_replace('/^www\./', '', $text);

				if (in_array($match, $searches) == false) {
					$searches[] = $match;
					$replaces[] = sprintf('<a class="website" target="_blank" href="%s">%s</a>', $link, $text);
				}
			}
		}

		$value = str_replace(
			$searches,
			$replaces,
			$value
		);

		return $value;
	}));

	/**
	 * @filter link
	 * @since 1.0.0
	 */
	$twig->addFilter(new \Twig_SimpleFilter('link', function($value, $label) {
		return sprintf('<a class="link" href="%s">%s</a>', $value, $label);
	}));

	/**
	 * @filter post_link
	 * @since 1.0.0
	 */
	$twig->addFilter(new \Twig_SimpleFilter('post_link', function($value) {
		return sprintf('<a class="post-link" href="%s">%s</a>', $post->link(), $post->title());
	}));

	/**
	 * @filter phone_link
	 * @since 1.0.0
	 */
	$twig->addFilter(new \Twig_SimpleFilter('phone_link', function($value, $label = null) {
		return sprintf('<a class="phone-link" href="tel:%s">%s</a>', $value, $label ? $label : $value);
	}));

	/**
	 * @filter email_link
	 * @since 1.0.0
	 */
	$twig->addFilter(new \Twig_SimpleFilter('email_link', function($value, $label = null) {
		return sprintf('<a class="email-link" href="mailto:%s">%s</a>', $value, $label ? $label : $value);
	}));

	/**
	 * @filter video_link
	 * @since 1.0.0
	 */
	$twig->addFilter(new \Twig_SimpleFilter('video_link', function($label, $value) {
		return sprintf('<a class="video-link" href="%s" data-fancybox>%s</a>', $value, $label);
	}));

	/**
	 * @filter wrap
	 * @since 1.0.0
	 */
	$twig->addFilter(new \Twig_SimpleFilter('wrap', function($text, $tag) {
		return sprintf('<%s>%s</%w>', $tag, $text, $tag);
	}));

	/**
	 * @filter embed
	 * @since 1.0.0
	 */
	$twig->addFunction(new \Twig_SimpleFunction('embed', function($image) {

		if (empty($image)) {
			return;
		}

		$src = '';

		if (is_string($image)) {

			$src = __DIR__ . '/../dist/' . $image;

		} else {

			if (isset($image['src']) == false) {
				$image['src'] = get_attached_file($image['id']);
			}

			$src = $image['src'];
		}

		if (is_readable($src)) {
			$contents = file_get_contents($src);
			$contents = str_replace('<?xml version="1.0" encoding="utf-8"?>', '', $contents);
			return $contents;
		}

		return null;

	}));

	return $twig;

});

/**
 * Options Page
 */
if (function_exists('acf_add_options_page')) {
	acf_add_options_page();
}

/**
 * Remove default block styles.
 */
add_action('wp_print_styles', function() {

	wp_dequeue_style('wp-block-library');

}, 100);

/**
 * Disable unwanted blocks in gutenberg
 */
add_filter('allowed_block_types', function($allowed_block_types, $post) {

	$allowed_blocks = array_values(

		array_map(function($block) {
			return 'acf/' . $block->get_type();
		}, \Cortex::get_blocks())

	);

	$default_blocks = array(
		// 'core/columns'
		// 'core/image',
		// 'core/paragraph',
		// 'core/heading',
		// 'core/list'
	);

	return array_merge(
		$allowed_blocks,
		$default_blocks
	);

}, 10, 2);

/**
 * Fixes WPML link url in multisite.
 */
add_filter('icl_ls_languages', function($languages) {

	foreach ($languages as & $language) {
		$language['url'] = str_replace(WP_SITEURL, WP_HOME, $language['url']);
	}

	return $languages;

});

/**
 * Remove some WPML meta boxes.
 */
add_action('admin_head', function() {

	global $post;

	if ($post) {
		remove_meta_box('icl_div_config', $post->post_type, 'normal');
	}

}, 99);

/**
 * Sets the block's compiled CSS file path.
 */
add_filter('cortex/enqueued_style_url', function($path, $type) {

	$file = $type->get_path() . '/dist/styles.css';
	$link = $type->get_link() . '/dist/styles.css';

	return file_exists($file) && filesize($file) ? $link : null;

}, 10, 2);

/**
 * Sets the block's compiled JS file path.
 */
add_filter('cortex/enqueued_script_url', function($path, $type) {

	$file = $type->get_path() . '/dist/scripts.js';
	$link = $type->get_link() . '/dist/scripts.js';

	return file_exists($file) && filesize($file) ? $link : null;

}, 10, 2);

/*
 * Disalbe CF7 Auto Paragraph
 */
add_filter('wpcf7_autop_or_not', '__return_false');

/**
 * Customize block render.
 */
add_filter('cortex/render', function($vars, $block) {

	$type = $block->get_block_type();

	if (preg_match('/item$/', $type)) {
		$block->remove_class('block');
		$block->append_class('item');
	}

	$hash = isset($vars['hash']) ? $vars['hash'] : null;

	if ($hash) {
		$block->append_attribute('id', $hash);
	}

	return $vars;

}, 10, 2);

/**
 * Address shortcode
 */
add_shortcode('address', function() {
	return sprintf('<address class="address">%s</address>', get_field('contact', 'option')['address']);
});

/**
 * Phone shortcode
 */
add_shortcode('phone', function() {
	return sprintf('<a class="phone-link" href="tel:%s">%s</a>', get_field('contact', 'option')['phone'], get_field('contact', 'option')['phone']);
});

/**
 * Email shortcode
 */
add_shortcode('email', function() {
	return sprintf('<a class="email-link" href="mailto:%s">%s</a>', get_field('contact', 'option')['email'], get_field('contact', 'option')['email']);
});

/**
 * Social Shortcode
 */
add_shortcode('social', function() {

	$context = Timber::get_context();
	$context['items'] = get_field('social', 'options');

	ob_start();

	$content = '
		<div class="social">
			{% for item in items %}
				<a class="social-item" href="{{ item.link }}">{{ embed(item.icon) }}</a>
			{% endfor %}
		</div>
	';

	Timber::render_string(
		$content,
		$context
	);

	$result = ob_get_contents();

	ob_end_clean();

	return $result;
});