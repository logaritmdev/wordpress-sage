/**
 * @function watch
 * @since 1.0.0
 */
$.fn.watch = function () {
	this.each(watch)
}

/**
 * @function watch
 * @since 1.0.0
 * @hidden
 */
function watch(i, element) {

	element = $(element)

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The scrollable container.
	 * @var container
	 * @since 1.0.0
	 */
	let container = $(document.body)

	/**
	 * The element tracked scroll top.
	 * @var scrollTop
	 * @since 1.0.0
	 */
	let scrollTop = 0

	/**
	 * The element tracked scroll bottom.
	 * @var scrollBot
	 * @since 1.0.0
	 */
	let scrollBot = 0

	/**
	 * The element current top offset.
	 * @var offsetTop
	 * @since 1.0.0
	 */
	let offsetTop = 0

	/**
	 * The element current bottom offset.
	 * @var offsetTop
	 * @since 1.0.0
	 */
	let offsetBot = 0

	/**
	 * How often to check whether the offset have changed.
	 * @var enter
	 * @since 1.0.0
	 */
	let check = element.fattr('data-watch-check') || 1000

	/**
	 * The value where the element enters hte screen;
	 * @var enter
	 * @since 1.0.0
	 */
	let enter = element.fattr('data-watch-enter') || 0.7

	/**
	 * The class to add when an item is visible on screen.
	 * @var klass
	 * @since 1.0.0
	 */
	let klass = element.attr('data-watch-class') || 'visible-on-screen'

	/**
	 * Whether to include margins when computing the element offsets.
	 * @var margins
	 * @since 1.0.0
	 */
	let margins = element.attr('data-watch-margins') || false

	/**
	 * Whether the element has been visible.
	 * @var visible
	 * @since 1.0.0
	 */
	let visible = false

	/**
	 * Whether the element is on the screen.
	 * @var entered
	 * @since 1.0.0
	 */
	let entered = false

	/**
	 * Whether to delay the initial computation
	 * @var delay
	 * @since 1.0.0
	 */
	let delay = element.attr('data-watch-delay')

	/**
	 * The current content width.
	 * @var contentW
	 * @since 1.0.0
	 */
	let contentW = 0

	/**
	 * The current content height.
	 * @var contentH
	 * @since 1.0.0
	 */
	let contentH = 0

	/**
	 * The current window width.
	 * @var windowH
	 * @since 1.0.0
	 */
	let windowW = 0

	/**
	 * The current window width.
	 * @var windowH
	 * @since 1.0.0
	 */
	let windowH = 0

	//--------------------------------------------------------------------------
	// Functions
	//--------------------------------------------------------------------------

	/**
	 * Returns the scroll value on the y axis.
	 * @function getScrollTop
	 * @since 1.0.0
	 */
	function getScrollTop() {
		return $(window).scrollTop()
	}

	/**
	 * Returns the scroll value on the x axis.
	 * @function getScrollLeft
	 * @since 1.0.0
	 */
	function getScrollLeft() {
		return $(window).scrollLeft()
	}

	/**
	 * Returns the scrollable container's width.
	 * @function getFrameWidth
	 * @since 1.0.0
	 */
	function getFrameWidth() {
		return window.innerWidth
	}

	/**
	 * Returns the scrollable container's height.
	 * @function getFrameHeight
	 * @since 1.0.0
	 */
	function getFrameHeight() {
		return window.innerHeight
	}

	/**
	 * Returns the scroll value to compute the progress with.
	 * @function getScroll
	 * @since 1.0.0
	 */
	function getScroll() {
		return getScrollTop() - scrollTop
	}

	/**
	 * Returns the length use to compute the progress.
	 * @function getLength
	 * @since 1.0.0
	 */
	function getLength() {
		return (scrollBot - scrollTop) * (1 - enter)
	}

	/**
	 * Updates the element offset.
	 * @function update
	 * @since 1.0.0
	 */
	function update() {

		let bounds = element.bounds(container)

		if (margins) {
			bounds.top -= parseFloat(element.css('margin-top')) || 0
			bounds.bottom += parseFloat(element.css('margin-bottom')) || 0
		}

		let height = getFrameHeight()

		let top = Math.max(bounds.top - height, 0)

		offsetTop = top
		offsetBot = top + height + bounds.height

		scrollTop = top
		scrollBot = top + height

		if (scrollBot > container.bounds().height) {
			scrollBot = container.bounds().height
		}
	}

	/**
	 * Updates the css classes used to indicate the visibility state.
	 * @function render
	 * @since 1.0.0
	 */
	function render() {

		let progress = 0

		let scroll = getScrollTop()

		if (scroll >= scrollTop && scroll <= scrollBot) {

			if (scrollTop == 0) {

				progress = 1

			} else {

				let length = getLength()
				let scroll = getScroll()

				progress = scroll / length

			}

		} else if (scroll < scrollTop) {

			progress = 0

		} else if (scroll > scrollBot) {

			progress = 1

		}

		if (progress > 0 && scroll == 0) {
			progress = 1
		}

		if (progress < 0) progress = 0
		if (progress > 1) progress = 1

		let inside = false

		if (scroll >= offsetTop &&
			scroll <= offsetBot) {
			inside = true
		}

		if (inside) {

			element.emit('watch/progress', progress)

			if (entered == false && progress == 1) {
				entered = true
				element.emit('watch/visible').addClass(klass)
			}

			if (visible == false) {

				requestAnimationFrame(() => {

					let options = {
						delay: 16,
						enter: true
					}

					element.emit('watch/beforeenter', [element, options, scroll])

					if (options.enter) {
						setTimeout(function () {
							element.emit('watch/enter')
								.addClass('is-in-viewport')
								.addClass('was-in-viewport')
						}, options.delay)
					}

				})

				visible = true
			}

		} else {

			if (visible) {

				requestAnimationFrame(() => {

					let options = {
						delay: 16,
						enter: true
					}

					element.emit('watch/beforeleave', [element, options, scroll])

					if (options.enter) {
						setTimeout(function () {
							element.emit('watch/leave').removeClass('is-in-viewport')
						}, options.delay)
					}

				})

				visible = false
			}
		}
	}

	/**
	 * Update the offsets when the window loads.
	 * @function onWindowLoad
	 * @since 1.0.0
	 */
	function onWindowLoad() {
		update()
		render()
	}

	/**
	 * Update the offsets when the window resizes.
	 * @function onWindowResize
	 * @since 1.0.0
	 */
	function onWindowResize() {

		let bounds = container.bounds()

		if (contentW == bounds.width &&
			contentH == bounds.height &&
			windowW == window.innerWidth &&
			windowH == window.innerHeight) {
			return
		}

		update()
		render()

		contentW = bounds.width
		contentH = bounds.height

		windowW = window.innerWidth
		windowH = window.innerHeight
	}

	/**
	 * Update the offsets when the window scrolls.
	 * @function onWindowScroll
	 * @since 1.0.0
	 */
	function onWindowScroll() {
		render()
	}

	function onRequestUpdate() {
		update()
	}

	function onRequestRender() {
		render()
	}

	element.on('update', onRequestUpdate)
	element.on('render', onRequestRender)

	//--------------------------------------------------------------------------
	// Initialization
	//--------------------------------------------------------------------------

	function start() {

		$(window).on('load', onWindowLoad)
		$(window).on('resize', onWindowResize)
		$(window).on('scroll', onWindowScroll)

		if (check) {
			setInterval(onWindowResize, check)
		}
	}

	if (delay) {
		delay = parseFloat(delay)
		setTimeout(start, delay)
		return
	}

	start()
}

/**
 * @attach data-watch
 * @since 1.0.0
 */
$.attach('[data-watch]', function (i, element) {
	element.watch()
})