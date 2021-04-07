<?php
/*
Plugin Name:  Contact Form 7 Translate Messages Extension
Plugin URI:   
Description:  Translate default Contact Form 7 messages with supported languages.
Version:      1.0
Author:       Davide Marchesan
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
*/

/*
Contact Form 7 Translate Messages Extension is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.
 
Contact Form 7 Translate Messages Extension is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
 
You should have received a copy of the GNU General Public License
along with Contact Form 7 Translate Messages Extension. If not, see https://www.gnu.org/licenses/gpl-2.0.html.
*/

define( 'CFTMSG_PLUGIN_URL', untrailingslashit( plugins_url( '', __FILE__ ) ) );
define( 'CFTMSG_PLUGIN_DIR', untrailingslashit( dirname( __FILE__ ) ) );

define( 'CFTMSG_PLUGIN_JSON_URL', CFTMSG_PLUGIN_URL . '/translations' );
define( 'CFTMSG_PLUGIN_JSON_DIR', untrailingslashit( CFTMSG_PLUGIN_DIR . '/translations' ) );

define( 'CFTMSG_THEME_JSON_URL', get_stylesheet_directory_uri() . '/cftmsg_translations' );
define( 'CFTMSG_THEME_JSON_DIR', untrailingslashit( get_stylesheet_directory() . '/cftmsg_translations' ) );


/**
 * Check if Contact Form 7 is activated first
 */
add_action( 'admin_init', 'cftmsg_is_cf7_active' );
function cftmsg_is_cf7_active() {
	if ( is_admin() && current_user_can( 'activate_plugins' ) && !is_plugin_active( 'contact-form-7/wp-contact-form-7.php' ) ) {
		add_action( 'admin_notices', 'cftmsg_notice' );
		deactivate_plugins( plugin_basename( __FILE__ ) ); 
		if ( isset( $_GET['activate'] ) ) {
			unset( $_GET['activate'] );
		}
	}
}

/**
 * Message to show if Contact Form 7 is not active
 */
function cftmsg_notice(){
	echo '<div class="error"><p>Sorry, but <strong>Contact Form 7 Translate Messages Extension</strong> requires Contact Form 7 to be installed and active.</p></div>';
}

/**
 * Load scripts
 */
add_action( 'admin_enqueue_scripts', 'cftmsg_load_scripts' );
function cftmsg_load_scripts() {
	if(is_admin()){
		wp_enqueue_script( 'cftmsg_scripts', plugins_url('/js/cftmsg_functions.js', __FILE__) );
	}
}

/**
 * Add custom panel to Contact Form 7 dashboard
 */
add_filter( 'wpcf7_editor_panels', 'cftmsg_custom_tab' );
function cftmsg_custom_tab( $panels ) {
	$new_page = array(
		'translate-messages' 	=> array(
			'title' 			=> 'Translate Messages',
			'callback' 			=> 'cftmsg_view'
		)
	);
	$panels = array_merge($panels, $new_page);
	return $panels;
}

/**
 * Actual HTML of the page
 */
function cftmsg_view(){

	// Checking default translations
	if(is_dir(CFTMSG_PLUGIN_JSON_DIR)){
		$default_files = array_diff( scandir(CFTMSG_PLUGIN_JSON_DIR, 1), array(".", "..") );
		foreach($default_files as $file){
			$code = cftmsg_get_lang($file);
			$lang_supported[$code] = array(
				"url"	=> urlencode( CFTMSG_PLUGIN_JSON_URL . '/' . $file ),
				"theme"	=> false
			);
		}
	}
	
	// Adding custom translations from the theme
	if(is_dir(CFTMSG_THEME_JSON_DIR)){
		$theme_files = array_diff( scandir(CFTMSG_THEME_JSON_DIR, 1), array(".", "..") );
		foreach($theme_files as $file){
			$code = cftmsg_get_lang($file);
			$lang_supported[$code] = array(
				"url"	=> urlencode( CFTMSG_THEME_JSON_URL . '/' . $file ),
				"theme"	=> true
			);
		}
	}
	
	// Sort by language code
	ksort($lang_supported);
	
	?>
		<style>
			.lang-wrapper{
				border:1px solid rgba(0,0,0,0.3);
				max-height:500px;
				overflow-y:scroll;
				position:relative;
			}
			.lang-wrapper > .single-lang{
				padding:15px;
				text-transform:uppercase;
				cursor:pointer;
			}
			.lang-wrapper > .single-lang:hover{
				background-color:rgba(0,0,0,0.1);
			}
			.lang-wrapper > .single-lang:not(:last-child){
				border-bottom:1px solid rgba(0,0,0,0.3);
			}
			.useful-links a:not(:last-child){
				margin-right:10px;
			}
			.lang-wrapper-frame{
				position:relative;
			}
			#lang-wrapper-loading{
				position:absolute;
				top:0;
				left:0;
				width:100%;
				height:100%;
				display:none;
				background:rgba(255,255,255,0.7);
				text-align:center;
				font-size:20px;
				z-index:99;
			}
			#lang-wrapper-loading.active{
				display:flex !important;
				align-items:center !important;
				justify-content:center !important;
			}
			#lang-wrapper-loading img{
				margin-bottom:15px;
			}
			.lang-wrapper-translating,
			.lang-wrapper-translated{
				display:none;
			}
		</style>
		<p>Click on a language code to translate messages; remember to save! Below you will find some useful links.</p>
		<p class="useful-links">
		 	<a href="#add-languages">How to add languages</a>
			<a href="https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes" target="_blank">Languages ISO codes (Wikipedia)</a>
			<a href="https://www.paypal.me/davidemarchesan" target="_blank">Support the developer :) (PayPal)</a>
		</p>
		<div class="lang-wrapper-frame">
			<div id="lang-wrapper-loading">
				<div>
					<div class="lang-wrapper-translating">
						<div><img src="<?php echo CFTMSG_PLUGIN_URL . '/images/ajax-loader.gif' ?>" alt="ajax-loader"></div>
						Translating
					</div>
					<div class="lang-wrapper-translated">Messages translated, remember to save!</div>
				</div>
			</div>
			<div class="lang-wrapper">
				<?php foreach($lang_supported as $key => $lang) : 
					$label = $lang['theme'] ? $key . ' (from theme folder)' : $key;
					?>
					<div class="single-lang" data-url="<?php echo $lang['url'] ?>" data-lang="<?php echo $key ?>">
						<?php echo $label ?>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
		<div id="add-languages">
			<h3>How to add languages</h3>
			<p>To add languages to the list, you have to download translations from the <a href="https://translate.wordpress.org/projects/wp-plugins/contact-form-7" target="_blank">official page of Contact Form 7 on translate.wordpress.org</a>. Click on a language (Image 1) and a new page will open. Always choose the "Stable (latest release)" (Image 2). Another page with all the string translations will appear, scroll down to the end of the table and just under the Legend, click on "Export as JSON" (Image 3). Move the downloaded translations files to /your-theme/cftmsg_translations folder (create it if does not exists) (Image 4). Refresh this page.</p>
			<ul>
				<li><a href="<?php echo CFTMSG_PLUGIN_URL . '/images/tutorial/add-languages-1.png' ?>" target="_blank">Image 1</a></li>
				<li><a href="<?php echo CFTMSG_PLUGIN_URL . '/images/tutorial/add-languages-2.png' ?>" target="_blank">Image 2</a></li>
				<li><a href="<?php echo CFTMSG_PLUGIN_URL . '/images/tutorial/add-languages-3.png' ?>" target="_blank">Image 3</a></li>
				<li><a href="<?php echo CFTMSG_PLUGIN_URL . '/images/tutorial/add-languages-4.png' ?>" target="_blank">Image 4</a></li>
			</ul>
		</div>
	<?php
}

/**
 * Get file language based on the filename
 * 
 * @param string $filename
 * 
 * @return $language_code
 */
function cftmsg_get_lang( $filename ){
	$language_code = str_replace('wp-plugins-contact-form-7-stable-', '', $filename);
	$language_code = str_replace('.json', '', $language_code);
	return $language_code;
}