<header class="main-layout-header">
	<div class="container">

		<div class="main-layout-header-logo">
			<a href="{{ $site_url }}">
				<span>{{ $site_name }}</span>
			</a>
		</div>

		<div class="main-layout-header-menu">
			@php wp_nav_menu(array('theme_location' => 'primary_navigation', 'container_class' => 'primary-navigation-container')) @endphp
		</div>

	</div>
</header>
