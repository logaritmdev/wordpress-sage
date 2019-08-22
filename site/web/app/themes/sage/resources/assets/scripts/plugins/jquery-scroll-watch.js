import Scrollbar from '../vendors/smooth-scrollbar.min'

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
	 * The element that scrolls.
	 * @var scroller
	 * @since 1.0.0
	 */
	let scroller = element.closest('[data-scroller]')

	/**
	 * The scrollbar manager.
	 * @var scrollbar
	 * @since 1.0.0
	 */
	let scrollbar = null

	/**
	 * The scrollable container.
	 * @var container
	 * @since 1.0.0
	 */
	let container = scroller.find('.scroll-content')
	if (container.length == 0) {
		container = scroller
	}

	/**
	 * The element current top offset.
	 * @var offsetTop
	 * @since 1.0.0
	 */
	let offsetTop = 0

	/**
	 * The element current bottom offset.
	 * @var offsetBot
	 * @since 1.0.0
	 */
	let offsetBot = 0

	/**
	 * How often to check whether the offset have changed.
	 * @var enter
	 * @since 1.0.0
	 */
	let check = element.fattr('data-watch-check') || 0

	/**
	 * The value where the element enters hte screen;
	 * @var enter
	 * @since 1.0.0
	 */
	let enter = element.fattr('data-watch-enter') || 0.6

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
	 * The horizontal layout.
	 * @var horizontalLayoutElement
	 * @since 1.0.0
	 */
	let horizontalLayoutElement = element.closest('.horizontal-layout')

	/**
	 * The horizontal layout wrapper element.
	 * @var hlw
	 * @since 1.0.0
	 */
	let horizontalLayoutWrapper = element.closest('.horizontal-layout-wrapper')

	/**
	 * The horizontal layout content element.
	 * @var horizontalLayoutContent
	 * @since 1.0.0
	 */
	let horizontalLayoutContent = element.closest('.horizontal-layout-content')

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
		return scrollbar ? scrollbar.containerEl.getBoundingClientRect().width : window.innerWidth
	}

	/**
	 * Returns the scrollable container's height.
	 * @function getFrameHeight
	 * @since 1.0.0
	 */
	function getFrameHeight() {
		return scrollbar ? scrollbar.containerEl.getBoundingClientRect().height : window.innerHeight
	}

	/**
	 * Returns the scroll value to compute the progress with.
	 * @function getScroll
	 * @since 1.0.0
	 */
	function getScroll() {
		return getScrollTop() - offsetTop
	}

	/**
	 * Returns the length use to compute the progress.
	 * @function getLength
	 * @since 1.0.0
	 */
	function getLength() {
		return (offsetBot - offsetTop) * (1 - enter)
	}

	/**
	 * Updates the element offset.
	 * @function update
	 * @since 1.0.0
	 */
	function update() {

		if (horizontalLayoutElement.length &&
			horizontalLayoutElement.hasClass('horizontal-layout--enabled')) {

			let rhl = horizontalLayoutElement.bounds(scroller)
			let rhw = horizontalLayoutWrapper.bounds(scroller)

			let offset = element.bounds(horizontalLayoutContent).left + parseFloat(horizontalLayoutContent.css('margin-left')) || 0

			if (offset > rhw.width) {
				offsetTop = rhl.top + (offset - rhw.width)
				offsetBot = rhl.top + (offset - rhw.width) + getFrameWidth()
				return
			}
		}

		let bounds = element.bounds('.main')

		if (margins) {
			bounds.top -= parseFloat(element.css('margin-top')) || 0
			bounds.bottom -= parseFloat(element.css('margin-bottom')) || 0
		}

		offsetTop = bounds.top
		offsetBot = bounds.top + getFrameHeight()

		offsetTop = offsetTop - $(window).height()
		offsetBot = offsetBot - $(window).height()
	}

	/**
	 * Updates the css classes used to indicate the visibility state.
	 * @function render
	 * @since 1.0.0
	 */
	function render() {

		let progress = 0

		let scroll = getScrollTop()

		if (scroll >= offsetTop && scroll <= offsetBot) {

			let length = getLength()
			let scroll = getScroll()

			progress = scroll / length

		} else if (scroll < offsetTop) {

			progress = 0

		} else if (scroll > offsetBot) {

			progress = 1

		}

		if (progress > 0 && scroll == 0) {
			progress = 1
		}

		if (progress < 0) progress = 0
		if (progress > 1) progress = 1

		if (progress > 0 && progress <= 1) {

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
							element.emit('watch/enter').addClass('in-viewport')
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
							element.emit('watch/leave')
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
		update()
		render()
	}

	/**
	 * Update the offsets when the window scrolls.
	 * @function onWindowScroll
	 * @since 1.0.0
	 */
	function onWindowScroll() {
		render()
	}

	/**
	 * Called when a scroller is attached.
	 * @function onAttachScrollbar
	 * @since 1.0.0
	 */
	function onAttachScrollbar() {

		if (scrollbar == null) {
			scrollbar = Scrollbar.get(scroller.get(0))
		}

		if (scrollbar) {
			scrollbar.addListener(onWindowScroll)
		}

		update()
		render()
	}

	/**
	 * Called when a scroller is detached.
	 * @function onAttachScrollbar
	 * @since 1.0.0
	 */
	function onDetachScrollbar() {

		if (scrollbar) {
			scrollbar.removeListener(onWindowResize)
			scrollbar = null
		}

		update()
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

		onAttachScrollbar()

		if (check) {
			setInterval(onWindowResize, check)
		}

		$(scroller).on('attachscrollbar', onAttachScrollbar)
		$(scroller).on('detachscrollbar', onDetachScrollbar)
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