<?php

namespace App;

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

	wp_enqueue_style('sage/main.css', asset_path('styles/main.css'), false, null);
	wp_enqueue_script('sage/main.js', asset_path('scripts/main.js'), ['jquery'], null, true);

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
		'primary_navigation' => __('Primary Navigation', 'sage'),
    ]);

    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['caption', 'comment-form', 'comment-list', 'gallery', 'search-form']);
    add_theme_support('customize-selective-refresh-widgets');

	add_editor_style(get_stylesheet_directory_uri() . '/editor-style-shared.css');
	add_editor_style(get_stylesheet_directory_uri() . '/editor-style.css');

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
 * Fixed metabox overlap.
 */
add_action('admin_head', function() {
	echo '
		<style>
			.block-editor-writing-flow {
				height: auto;
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
	 * @filter embed
	 * @since 1.0.0
	 */
	$twig->addFilter(new \Twig_SimpleFilter('embed', function($image) {

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

	/**
	 * @filter image
	 * @since 1.0.0
	 */
	$twig->addFilter(new \Twig_SimpleFilter('image', function($image, $element = 'div') {

		if ($element == 'img') {
			return sprintf('
				<div class="image image--mode-foreground">
					<div class="frame">
						<img class="layer" src="%s">
					</div>
				</div>
			', $image);
		}

		return sprintf(
			'<div class="image image--mode-background">
				<div class="frame">
					<div class="layer" style="background-image: url(%s)"></div>
				</div>
			</div>
		', $image);
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
	 * @filter phone_link
	 * @since 1.0.0
	 */
	$twig->addFilter(new \Twig_SimpleFilter('phone_link', function($value, $label = null) {
		return sprintf('<a href="tel:%s">%s</a>', $value, $label ? $label : $value);
	}));

	/**
	 * @filter email_link
	 * @since 1.0.0
	 */
	$twig->addFilter(new \Twig_SimpleFilter('email_link', function($value, $label = null) {
		return sprintf('<a href="mailto:%s">%s</a>', $value, $label ? $label : $value);
	}));

	/**
	 * @filter wrap
	 * @since 1.0.0
	 */
	$twig->addFilter(new \Twig_SimpleFilter('wrap', function($text, $tag) {
		return sprintf('<%s>%s</%w>', $tag, $text, $tag);
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