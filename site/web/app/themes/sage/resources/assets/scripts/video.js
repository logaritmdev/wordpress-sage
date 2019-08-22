$.attach('.video', (i, element) => {

	let player = element.find('video').get(0)

	/**
	 * Called when the video player starts loading.
	 * @function onPlayerLoad
	 * @since 1.0.0
	 */
	function onPlayerLoad() {
		element.toggleClass('video--loading', true)
	}

	/**
	 * Called when the video is playing.
	 * @function onPlayerPlay
	 * @since 1.0.0
	 */
	function onPlayerPlay() {
		element.toggleClass('video--playing', true)
		element.toggleClass('video--loading', false)
	}

	/**
	 * Called when the video is paused.
	 * @function onPlayerPause
	 * @since 1.0.0
	 */
	function onPlayerPause() {
		element.toggleClass('video--playing', false)
	}

	/**
	 * Called when the video is ended.
	 * @function onPlayerEnded
	 * @since 1.0.0
	 */
	function onPlayerEnded() {
		element.toggleClass('video--playing', false)
	}

	/**
	 * Called when the video can be played.
	 * @function onPlayerCanPlayThrough
	 * @since 1.0.0
	 */
	function onPlayerCanPlayThrough() {
		if (player.autoplay) {
			player.play()
		}
	}

	/**
	 * Called on a load request.
	 * @function onLoad
	 * @since 1.0.0
	 */
	function onLoad() {
		player.load()
	}

	/**
	 * Called on a play request.
	 * @function onPlay
	 * @since 1.0.0
	 */
	function onPlay() {
		player.play()
	}

	/**
	 * Called on a pause request.
	 * @function onPause
	 * @since 1.0.0
	 */
	function onPause() {
		player.pause()
	}

	function isPlaying() {
		return !!(player.currentTime > 0 && !player.paused && !player.ended && player.readyState > 2)
	}

	player.addEventListener('loadstart', onPlayerLoad)
	player.addEventListener('play', onPlayerPlay)
	player.addEventListener('pause', onPlayerPause)
	player.addEventListener('ended', onPlayerEnded)
	player.addEventListener('canplaythrough', onPlayerCanPlayThrough)

	if (isPlaying()) {
		element.addClass('video--playing')
	}

	if (player.readyState == 1) {
		element.addClass('video--loading')
	}

	element.on('load', onLoad)
	element.on('play', onPlay)
	element.on('pause', onPause)

	element.append('<div class="spinner"></div>')

})
