<!doctype html>
<html {!! get_language_attributes() !!}>
@include('partials.head')
<body {!! $body_classes !!} data-preload>

	{{--
	<button style="position: fixed; top: 25px; left: 25px; z-index: 100" onClick="jQuery(document.body).toggleClass('ready')">Toggle</button>
	--}}

	@include('partials.loader')

	<div class="main-layout-scroller" data-scroller>

		@php do_action('get_header') @endphp

		<div class="main-layout">

			@include('partials.header')

			<div class="main-layout-content">
				<main class="main">
					@yield('content')
				</main>
			</div>

			@include('partials.footer')

		</div>

		@php do_action('get_footer') @endphp

	</div>

	@include('partials.menu')

	@php wp_footer() @endphp

</body>
</html>
