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
	let scroller = element.closest('.main-layout')

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
	 * Whether the element is considered visible.
	 * @var visible
	 * @since 1.0.0
	 */
	let visible = false

	/**
	 * Whether the element is on the screen.
	 * @var visible
	 * @since 1.0.0
	 */
	let tracked = false

	//--------------------------------------------------------------------------
	// Functions
	//--------------------------------------------------------------------------

	/**
	 * Returns the scroll value on the y axis.
	 * @function getScrollTop
	 * @since 1.0.0
	 */
	function getScrollTop() {
		return scrollbar ? scrollbar.scrollTop : $(window).scrollTop()
	}

	/**
	 * Returns the scroll value on the x axis.
	 * @function getScrollLeft
	 * @since 1.0.0
	 */
	function getScrollLeft() {
		return scrollbar ? scrollbar.scrollLeft : $(window).scrollLeft()
	}

	/**
	 * Returns the scrollable container's width.
	 * @function getFrameWidth
	 * @since 1.0.0
	 */
	function getFrameWidth() {
		return scrollbar ? scrollbar.containerEl.getBoundingClientRect().width : $(window).width()
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
	 * updateOffsetes the element offset.
	 * @function updateOffset
	 * @since 1.0.0
	 */
	function updateOffset() {

		let bounds = element.bounds(container)
		offsetTop = bounds.top
		offsetBot = bounds.top + bounds.height

		updateStatus()
	}

	/**
	 * Updates the css classes used to indicate the visibility state.
	 * @function updateStatus
	 * @since 1.0.0
	 */
	function updateStatus() {

		let frame = getFrameHeight()

		let limit = frame * enter

		let screenT = 0
		let screenB = frame
		let offsetT = offsetTop - getScrollTop()
		let offsetB = offsetBot - getScrollTop()
		let point = offsetT

		let progress = 0

		if (offsetT > screenB ||
			offsetB < screenT) {

			progress = 0

		} else {

			let pos = point - limit
			let len = frame - limit

			progress = 1 - (pos / len)

		}

		if (progress > 0 && getScrollTop() == 0) {
			progress = 1
		}

		if (progress < 0) progress = 0
		if (progress > 1) progress = 1

		tracked = progress > 0 && progress <= 1

		if (tracked) {

			element.emit('watch/progress', progress)

			if (progress < 1) {
				return
			}

			if (visible == false) {
				visible = true
				dispatch()
			}
		}
	}

	/**
	 * Dispatches the visibility change event.
	 * @function dispatch
	 * @since 1.0.0
	 */
	function dispatch() {
		requestAnimationFrame(function () {
			element.addClass(klass)
			element.emit('watch/visible')
		})
	}

	/**
	 * Update the offsets when the window loads.
	 * @function onWindowLoad
	 * @since 1.0.0
	 */
	function onWindowLoad() {
		updateOffset()
	}

	/**
	 * Update the offsets when the window resizes.
	 * @function onWindowResize
	 * @since 1.0.0
	 */
	function onWindowResize() {
		updateOffset()
	}

	/**
	 * Update the offsets when the window scrolls.
	 * @function onWindowScroll
	 * @since 1.0.0
	 */
	function onWindowScroll() {
		updateStatus()
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

		updateOffset()
		updateStatus()
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

		updateOffset()
		updateStatus()
	}

	//--------------------------------------------------------------------------
	// Initialization
	//--------------------------------------------------------------------------

	$(window).on('load', onWindowLoad)
	$(window).on('resize', onWindowResize)
	$(window).on('scroll', onWindowScroll)

	onAttachScrollbar()

	if (check) {
		setInterval(onWindowResize, check)
	}

	$(scroller).on('attachscrollbar', onAttachScrollbar)
	$(scroller).on('detachscrollbar', onDetachScrollbar)

	updateOffset()
	updateStatus()
}

/**
 * @attach data-watch
 * @since 1.0.0
 */
$.attach('[data-watch]', function (i, element) {
	element.watch()
})