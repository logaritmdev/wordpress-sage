
$.fn.preload = function () {
	requestAnimationFrame(() => {
		this.each(preload)
	})
}

/**
 * @function watch
 * @since 1.0.0
 * @hidden
 */
function preload(i, element) {

	element = $(element)

	let preloadElements = { loaded: 0, length: 0, complete: false }
	let visibleElements = { loaded: 0, length: 0, complete: false }
	let preloadComplete = null
	let visibleComplete = null
	let startedAt = Date.now()

	let updateProgressFrame = null;

	let timeout = element.attr('data-load-timeout') || 10
	if (timeout) {
		timeout = parseFloat(timeout)
	}

	let hold = element.attr('data-preload-hold') || 0
	if (hold) {
		hold = parseInt(hold)
	}

	/**
	 * Informs that an element has began preloading.
	 * @function begin
	 * @since 1.0.0
	 */
	function begin(element, visible, source) {
		onBeginLoading(element, visible, source)
	}

	/**
	 * Informs that an element has finished preloading.
	 * @function begin
	 * @since 1.0.0
	 */
	function finish(element, visible, source) {
		requestAnimationFrame(() => {
			onFinishLoading(element, visible, source)
		})
	}

	/**
	 * Indicates whether an element is currently visible on screen.
	 * @function isVisible
	 * @since 1.0.0
	 */
	function isVisible(element) {

		let rect = element.bounds()

		rect.x = rect.left
		rect.y = rect.top

		let r1x1 = 0
		let r1y1 = 0
		let r1x2 = window.innerWidth
		let r1y2 = window.innerHeight

		let r2x1 = rect.x
		let r2y1 = rect.y
		let r2x2 = rect.x + rect.width
		let r2y2 = rect.y + rect.height

		let overlaps = (
			r1x1 < r2x2 && r2x1 < r1x2 &&
			r1y1 < r2y2 && r2y1 < r1y2
		)

		if (overlaps) {

			let node = element

			while (node && node.get(0) != document) {

				if (node.css('display') == 'none' ||
					node.css('visibility') == 'hidden') {
					return false
				}

				node = node.parent()
			}
		}

		return overlaps
	}

	/**
	 * Called when an element has began its loading.
	 * @function onBeginLoading
	 * @since 1.0.0
	 */
	function onBeginLoading(element, visible, source) {

		if (visible) {
			visibleElements.length++
		}

		preloadElements.length++

		progress()
	}

	/**
	 * Called when an element has finished its loading.
	 * @function onFinishLoading
	 * @since 1.0.0
	 */
	function onFinishLoading(element, visible, source) {

		if (visible) {
			visibleElements.loaded++
		}

		preloadElements.loaded++

		progress()
	}

	/**
	 * Updates the progress value.
	 * @function progress
	 * @since 1.0.0
	 */
	function progress() {

		function updateProgress() {
			updatePreloadProgress()
			updateVisibleProgress()
		}

		if (updateProgressFrame == null) {
			updateProgressFrame = requestAnimationFrame(() => {
				updateProgressFrame = null
				updateProgress()
			})
		}
	}

	/**
	 * Updates the progress value for all preloaded items.
	 * @function updatePreloadProgress
	 * @since 1.0.0
	 */
	function updatePreloadProgress() {

		let progress = 0

		if (preloadElements.length > 0) {
			progress = preloadElements.loaded / preloadElements.length
		} else {
			progress = 1
		}

		if (progress == 1) {

			if (preloadElements.complete) {
				return
			}

			preloadElements.complete = true

			let elapsed = Date.now() - startedAt

			setTimeout(function () {

				if (element.hasClass('loaded') == false) {
					element.addClass('loaded')
					element.emit('loading/loaded')
				}

			}, Math.max(0, hold - elapsed))
		}

		function complete() {

			if (progress < 1) {
				return
			}

			element.emit('loading/complete')
		}

		function step(value) {
			element.emit('loading/progress', value * 100)
		}

		preloadComplete = clearTimeout(preloadComplete)
		preloadComplete = setTimeout(() => {
			complete()
		}, 500)

		step(progress);
	}

	/**
	 * Updates the progress value for all visible items.
	 * @function updatePreloadProgress
	 * @since 1.0.0
	 */
	function updateVisibleProgress() {

		let progress = 0

		if (visibleElements.length > 0) {
			progress = visibleElements.loaded / visibleElements.length
		} else {
			progress = 1
		}

		if (progress == 1) {

			if (visibleElements.complete) {
				return
			}

			visibleElements.complete = true

			let elapsed = Date.now() - startedAt

			setTimeout(function () {

				if (element.hasClass('loaded-enough') == false) {
					element.addClass('loaded-enough')
					element.emit('loading/loadedenough')
				}

			}, Math.max(0, hold - elapsed))
		}

		function complete() {

			if (progress < 1) {
				return
			}

			element.emit('loading/complete/visible')
		}

		function step(value) {
			element.emit('loading/progress/visible', value * 100)
		}

		visibleComplete = clearTimeout(visibleComplete)
		visibleComplete = setTimeout(() => {
			complete()
		}, 500)

		step(progress);
	}

	/**
	 * Appends an image to be preloaded.
	 * @function preloadImage
	 * @since 1.0.0
	 */
	function preloadImage(element, url, type) {

		if (url == '' ||
			url == null) {
			return
		}

		let extension = url.split('.').pop()
		if (extension) {

			extension = extension.toLowerCase()

			switch (extension) {

				case 'gif':
				case 'png':
				case 'jpg':
				case 'svg':
				case 'jpeg':
					break;

				default:
					return
			}
		}

		let visible = isVisible(element)

		begin(element, visible, url)

		let failsafe = null

		let image = new Image()

		image.src = url

		if (image.complete == false) {

			length++

			function onLoad() {
				clearTimeout(failsafe)
				image.removeEventListener('load', onLoad)
				image.removeEventListener('error', onLoad)
				finish(element, visible, url)
			}

			image.addEventListener('load', onLoad)
			image.addEventListener('error', onLoad)

			failsafe = setTimeout(function () {
				console.warn('Timeout reached for image', url)
				onLoad()
			}, timeout * 1000)

		} else {
			finish(element, visible, url)
		}
	}

	/**
	 * Appends a video element to be preloaded.
	 * @function preloadVideo
	 * @since 1.0.0
	 */
	function preloadVideo(element) {

		let video = element.get(0)

		if (hasSource(element) == false || element.attr('preload') == 'none') {
			return
		}

		let visible = isVisible(element)

		if (video.readyState === 4) {
			begin(element, visible)
			finish(element, visible)
			return
		}

		begin(element, visible, element.attr('src'))

		let failsafe = null

		function onCanPlayThrough() {

			clearTimeout(failsafe)

			video.removeEventListener('canplaythrough', onCanPlayThrough)

			finish(element, visible, element.attr('src'))
		}

		video.addEventListener('canplaythrough', onCanPlayThrough)

		failsafe = setTimeout(function () {
			console.warn('Timeout reached for video', video.currentSrc)
			onCanPlayThrough()
		}, timeout * 1000)
	}

	/**
	 * Appends a audio element to be preloaded.
	 * @function preloadVideo
	 * @since 1.0.0
	 */
	function preloadAudio(element) {

		let audio = element.get(0)

		if (hasSource(element) == false || element.attr('preload') == 'none') {
			return
		}

		let visible = isVisible(element)

		if (audio.readyState === 4) {
			begin(element, visible)
			finish(element, visible)
			return
		}

		begin(element, visible, element.attr('src'))

		let failsafe = null

		function onCanPlayThrough() {

			clearTimeout(failsafe)

			audio.removeEventListener('canplaythrough', onCanPlayThrough)

			finish(element, visible, element.attr('src'))
		}

		audio.addEventListener('canplaythrough', onCanPlayThrough)

		failsafe = setTimeout(function () {
			console.warn('Timeout reached for video', video.currentSrc)
			onCanPlayThrough()
		}, timeout * 1000)
	}

	/**
	 * Checks whether the audio or video element has a source.
	 * @function hasSource
	 * @since 1.0.0
	 */
	function hasSource(element) {
		return element.find('source').length > 0
	}

	/**
	 * Process every element in order to find whether they are attach to
	 * a resource that needs to be preloaded.
	 */

	$(element).find('*').each(function (i, element) {

		element = $(element)

		let backgroundImage = element.css('background-image').match(/url\((.*?)\)/g)
		if (backgroundImage) {
			backgroundImage = backgroundImage[0];
			backgroundImage = backgroundImage.replace(/^url\(/, '')
			backgroundImage = backgroundImage.replace(/\)$/, '')
			backgroundImage = backgroundImage.replace(/('|")/g, '')
			preloadImage(element, backgroundImage, 'background')
		}

		if (element.prop('tagName') === 'IMG') {
			preloadImage(element, element.attr('src'), 'img')
			return
		}

		if (element.prop('tagName') === 'IMAGE') {
			preloadImage(element, element.attr('xlink:href'), 'svg')
			return
		}

		if (element.prop('tagName') === 'VIDEO' && element.attr('preload')) {
			preloadVideo(element)
			return
		}

		if (element.prop('tagName') === 'AUDIO' && element.attr('preload')) {
			preloadAudio(element)
			return
		}
	})

	if (preloadElements.length == 0 ||
		visibleElements.length == 0) {
		requestAnimationFrame(function () {
			progress()
		})
	}
}

$.attach('[data-preload]', (i, element) => {
	element.preload()
})