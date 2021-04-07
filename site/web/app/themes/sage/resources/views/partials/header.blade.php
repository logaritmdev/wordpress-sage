<header class="main-layout-header">
	<div class="container">

		<div class="main-layout-header-logo">
			<a href="{{ $site_url }}">
				<img src="{{ get_stylesheet_directory_uri() }}/../dist/images/logo.svg">
			</a>
		</div>

		<div class="main-layout-header-menu">
			@php wp_nav_menu(array('theme_location' => 'primary_menu', 'menu_class' => 'menu', 'container' => false)) @endphp
		</div>

	</div>
</header>
