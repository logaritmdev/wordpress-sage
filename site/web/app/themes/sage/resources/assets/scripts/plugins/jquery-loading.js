$(document.body).attr('data-loaded', 0)

let loaded = 0
let length = 0
let object = { value: 0 }

let sources = {}

if (document.readyState !== 'complete') {
	length = 1
}

let timeout = $(document.body).attr('data-load-timeout') || 10
if (timeout) {
	timeout = parseFloat(timeout)
}

let autoplays = []

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
	requestAnimationFrame(function () {
		onFinishLoading(element, visible, source)
	})
}

/**
 * Indicates whether an element is currently visible on screen.
 * @function isVisible
 * @since 1.0.0
 */
function isVisible(element) {

	let rect = $(element).get(0).getBoundingClientRect()

	let r1x1 = 0
	let r1y1 = 0
	let r1x2 = window.innerWidth
	let r1y2 = window.innerHeight

	let r2x1 = rect.x
	let r2y1 = rect.y
	let r2x2 = rect.x + rect.width
	let r2y2 = rect.y + rect.height

	let overlaps = (
		r1x1 > r2x2 ||
		r2x1 > r1x2 ||
		r1y1 > r2y2 ||
		r2y1 > r1y2
	) == false

	return overlaps
}

/**
 * Indicates whether the element is inside the document.
 * @function isInsideDocument
 * @since 1.0.0
 */
function isInsideDocument(element) {
	return $(element).closest(document.documentElement).length > 0
}

/**
 * @function setClosestObserver
 * @since 1.0.0
 */
function setClosestObserver(element, observer) {
	element['_closest_observer_'] = observer
}

/**
 * @function getClosestObserver
 * @since 1.0.0
 */
function getClosestObserver(element) {
	return element['_closest_observer_']
}

/**
 * Called when an element has began its loading.
 * @function onBeginLoading
 * @since 1.0.0
 */
function onBeginLoading(element, visible, source) {

	let observer = $(element).closest("[data-preload]")
	if (observer.length) {

		if (getClosestObserver(element) == null) {
			setClosestObserver(element, observer)
		}

		let key = observer.get(0)

		if ($.data(key, 'load_start_time') == null) {
			$.data(key, 'load_start_time', Date.now())
		}

		let preloadCount = $.data(key, 'preload_count') || 0
		let visibleCount = $.data(key, 'visible_count') || 0

		preloadCount++

		if (visible) {
			visibleCount++
		}

		$.data(key, 'preload_count', preloadCount)
		$.data(key, 'visible_count', visibleCount)

		onBeginLoading(observer.parent(), visible, source)
	}
}

/**
 * Called when an element has finished its loading.
 * @function onFinishLoading
 * @since 1.0.0
 */
function onFinishLoading(element, visible, source) {

	let observer = isInsideDocument(element) == false ? getClosestObserver(element) : $(element).closest('[data-preload]')
	if (observer == null) {
		observer = $(document.body)
	}

	if (observer.length) {

		let key = observer.get(0)

		let preloadLoadedCount = $.data(key, 'preload_loaded_count') || 0
		let visibleLoadedCount = $.data(key, 'visible_loaded_count') || 0

		preloadLoadedCount++

		if (visible) {
			visibleLoadedCount++
		}

		$.data(key, 'preload_loaded_count', preloadLoadedCount)
		$.data(key, 'visible_loaded_count', visibleLoadedCount)

		let preloadCount = $.data(key, 'preload_count') || 0
		let visibleCount = $.data(key, 'visible_count') || 0

		if (preloadCount == preloadLoadedCount ||
			visibleCount == visibleLoadedCount) {

			let hold = observer.attr('data-preload-hold') || 0
			if (hold) {
				hold = parseInt(hold)
			}

			let elapsed = Date.now() - $.data(key, 'load_start_time')

			if (visibleCount == visibleLoadedCount) {

				if ($.data(key, 'visible_count_reached') == null) {
					$.data(key, 'visible_count_reached', true)

					setTimeout(function () {

						if (observer.hasClass('loaded-enough') == false) {
							observer.addClass('loaded-enough')
							observer.trigger('loadedenough')
						}

					}, Math.max(0, hold - elapsed))
				}
			}

			if (preloadCount == preloadLoadedCount) {

				if ($.data(key, 'preload_count_reached') == null) {
					$.data(key, 'preload_count_reached', true)

					setTimeout(function () {

						if (observer.hasClass('loaded') == false) {
							observer.addClass('loaded')
							observer.addClass('loaded-enough')
							observer.trigger('loaded')
							observer.trigger('loadedenough')
						}

					}, Math.max(0, hold - elapsed))
				}
			}
		}

		onFinishLoading(observer.parent(), visible, source)
	}
}

/**
 * Updates the progress value.
 * @function progress
 * @since 1.0.0
 */
function progress() {

	let value = length ? (++loaded / length) * 100 : 100

	function complete() {

		if (value < 100) {
			return
		}

		for (let i = 0; i < autoplays.length; i++) {
			autoplays[i].play()
		}

		$.publish('loading/complete')
	}

	function step(value) {
		$.publish('loading/progress', value)
	}

	$(object).stop().animate({ value: value }, {
		duration: 500,
		complete: complete,
		step: step
	})

	$(document.body).attr('data-loaded', value)
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
			progress()
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

	if (hasSource(element) == false || $(element).attr('data-preload') == 'false') {
		return
	}

	let visible = isVisible(element)

	if (element.readyState === 4) {
		begin(element, visible)
		finish(element, visible)
		return
	}

	begin(element, visible, $(element).attr('src'))

	length++

	let autoplay = element.autoplay
	let failsafe = null

	function onCanPlayThrough() {

		clearTimeout(failsafe)

		element.removeEventListener('canplaythrough', onCanPlayThrough)

		finish(element, visible, $(element).attr('src'))

		progress()

		if (autoplay) {
			autoplays.push(element)
		}
	}

	element.autoplay = false
	element.pause()
	element.addEventListener('canplaythrough', onCanPlayThrough)
	element.load()

	failsafe = setTimeout(function () {
		console.warn('Timeout reached for video', element.currentSrc)
		onCanPlayThrough()
	}, timeout * 1000)
}

/**
 * Appends a audio element to be preloaded.
 * @function preloadVideo
 * @since 1.0.0
 */
function preloadAudio(element) {

	if (hasSource(element) == false || $(element).attr('data-preload') == 'false') {
		return
	}

	if (element.readyState === 4) {
		begin(element, visible)
		finish(element, visible)
		return
	}

	length++

	begin(element, true, $(element).attr('src'))

	let autoplay = element.autoplay
	let failsafe = null

	function onCanPlayThrough() {

		clearTimeout(failsafe)

		element.removeEventListener('canplaythrough', onCanPlayThrough)

		finish(element, true, $(element).attr('src'))

		progress()

		if (autoplay) {
			autoplays.push(element)
		}
	}

	element.autoplay = false
	element.pause()
	element.addEventListener('canplaythrough', onCanPlayThrough)
	element.load()

	failsafe = setTimeout(function () {
		console.warn('Timeout reached for audio', element.currentSrc)
		onCanPlayThrough()
	}, timeout * 1000)
}

/**
 * Checks whether the audio or video element has a source.
 * @function hasSource
 * @since 1.0.0
 */
function hasSource(element) {

	let has = false

	for (let i = 0; i < element.children.length; i++) {
		let source = element.children[i]
		if (source.src) {
			has = true
		}
	}

	if (has == false) {
		has = element.src.length > 0
	}

	return has
}

/**
 * Process every element in order to find whether they are attach to
 * a resource that needs to be preloaded.
 */
$('*').each(function (i, element) {

	let backgroundImage = $(element).css('background-image').match(/url\((.*?)\)/g)
	if (backgroundImage) {
		backgroundImage = backgroundImage[0];
		backgroundImage = backgroundImage.replace(/^url\(/, '')
		backgroundImage = backgroundImage.replace(/\)$/, '')
		backgroundImage = backgroundImage.replace(/('|")/g, '')
		preloadImage(element, backgroundImage, 'background')
	}

	if (element.tagName === 'IMG') {
		preloadImage(element, $(element).attr('src'), 'img')
		return
	}

	if (element.tagName === 'IMAGE') {
		preloadImage(element, $(element).attr('xlink:href'), 'svg')
		return
	}

	if (element.tagName === 'VIDEO' && $(element).attr('preload')) {
		preloadVideo(element)
		return
	}

	if (element.tagName === 'AUDIO' && $(element).attr('preload')) {
		preloadAudio(element)
		return
	}
})

$(window).on('load', progress)

$("[data-preload]").each(function (i, element) {

	element = $(element)

	let key = element.get(0)
	let preloadCount = $.data(key, 'preload_count') || 0
	let visibleCount = $.data(key, 'visible_count') || 0

	if (preloadCount == 0) {
		requestAnimationFrame(function () {
			element.addClass('loaded')
			element.addClass('loaded-enough')
			element.trigger('loaded')
			element.trigger('loadedenough')
		})
	}

	if (visibleCount == 0) {
		requestAnimationFrame(function () {
			element.addClass('loaded-enough')
			element.trigger('loadedenough')
		})
	}

})
