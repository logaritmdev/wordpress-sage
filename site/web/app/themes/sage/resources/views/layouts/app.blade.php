<!doctype html>
<html {!! get_language_attributes() !!}>
@include('partials.head')
<body {!! $body_classes !!}>

	{{--
	<button style="position: fixed; top: 25px; left: 25px; z-index: 100" onClick="jQuery(document.body).toggleClass('ready')">Toggle</button>
	--}}

	@include('partials.loader')

	@php do_action('get_header') @endphp

	<div class="main-layout">

		@include('partials.header')

		<section class="main-layout-content">
			<main class="main">
				@yield('content')
			</main>
		</section>

		@include('partials.footer')

	</div>

	@php do_action('get_footer') @endphp

	@include('partials.menu')

	@php wp_footer() @endphp

</body>
</html>
