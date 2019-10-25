@extends('layouts.app')

@section('content')

<section class="error-404" data-watch>
	<div class="container">
		<div class="error-404-content">
			<h1><?php echo __('Not found', 'sage') ?></h1>
			<p><?php echo __('The page you are trying to access does not exist.', 'sage') ?></p>
		</div>
	</div>
</div>

@endsection
