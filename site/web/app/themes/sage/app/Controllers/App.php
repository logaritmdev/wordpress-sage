<?php

namespace App\Controllers;

use Sober\Controller\Controller;
use Illuminate\Support\Arr;
use Cortex;
use ob_start;
use ob_end_clean;
use ob_get_contents;

class App extends Controller {

    /**
     * Returns the page title.
     * @method title
     * @since 1.0.0
     */
    public static function title() {

        if (is_home()) {

            if ($home = get_option('page_for_posts', true)) {
                return get_the_title($home);
            }

            return __('Latest Posts', 'sage');
        }

        if (is_archive()) {
            return get_the_archive_title();
        }

        if (is_search()) {
            return sprintf(__('Search Results for %s', 'sage'), get_search_query());
        }

        if (is_404()) {
            return __('Not Found', 'sage');
        }

        return get_the_title();
    }

    /**
     * Returns the post title.
     * @method get_post_title
     * @since 1.0.0
     */
    public static function get_post_title($post = null) {
        return get_the_title($post);
    }

    /**
     * Returns the post date and author.
     * @method get_post_infos
     * @since 1.0.0
     */
    public static function get_post_infos($post = null) {

        $post = get_post($post);
        $date = self::get_post_date($post);
        $name = self::get_post_author($post);

        if ($date && $name) {
            return sprintf('%s / %s %s', $date, __('By', 'sage'), $name);
        }

        return $date;
    }

    /**
     * Returns the post date.
     * @method get_post_date
     * @since 1.0.0
     */
    public static function get_post_date($post = null) {
        $post = get_post($post);
        return get_the_date('' , $post);
    }

    /**
     * Returns the post author.
     * @method get_post_author
     * @since 1.0.0
     */
    public static function get_post_author($post = null) {
        $post = get_post($post);
        return get_the_author_meta('user_nicename' , $post->post_author);
    }

    /**
     * Resizes an image.
     * @method resize
     * @since 1.0.0
     */
    public static function resize($image, $resizeW = null, $resizeH = null, $format = null) {

        if (empty($image)) {
            return;
        }

        $image = new \TimberImage($image);

        if ($resizeW != null ||
            $resizeH != null) {

            $w = $image->width();
            $h = $image->height();

            if (($resizeW && $w > $resizeW) ||
                ($resizeH && $h > $resizeH)) {
                $image = \TimberImageHelper::resize($image, $resizeW, $resizeH);
            }
        }

        switch ($format) {
            case 'url': return sprintf('url(%s);', $image);
            case 'src': return sprintf('src="%s"', $image);
        }

        return $image;
    }

    /**
     * Returns the site name.
     * @method site_name
     * @since 1.0.0
     */
    public function site_name() {
        return get_bloginfo('name');
    }

    /**
     * Returns the site name.
     * @method site_url
     * @since 1.0.0
     */
    public function site_url() {
        return get_home_url();
    }

    /**
     * Returns the body classes.
     * @method body_classes
     * @since 1.0.0
     */
    public function body_classes() {
        return $this->grab(function() { body_class(); });
    }

    /**
     * Utility method to retrieve echoed content.
     * @method grab
     * @since 1.0.0
     */
    protected function grab($callback) {

        ob_start();
        $callback();
        $contents = ob_get_contents();
        ob_end_clean();

        return $contents;
    }
}
