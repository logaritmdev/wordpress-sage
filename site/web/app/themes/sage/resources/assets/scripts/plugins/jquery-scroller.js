import Scrollbar from '../vendors/smooth-scrollbar.min'

let container = null
let scrollbar = null
let disabled = false

$.attach('body', (i, body) => {

	let html = $('html')

    /**
     * Add a smooth scrollbar on desktop browser. The smooth scrollbar is
     * removed when the screen is smaller than something like 1000 px
     */

	scrollbar = null
	container = document.querySelector('[data-scroller]')
	if (container == null) {
		return
	}

	let content = null
	let timeout = null
	let height = null

	/**
	 * Retriggers a scroll event when the container scrolls
	 * @function onScroll
	 * @since 1.0.0
	 */
	function onScroll() {
		$(window).trigger('scroll')
	}

	/**
	 * Creates the smooth scrollbar container.
	 * @function createScrollbars
	 * @since 1.0.0
	 */
	function createScrollbars() {

		if (scrollbar ||
			disabled) {
			return
		}

		scrollbar = Scrollbar.init(container)
		scrollbar.addListener(onScroll)

		html.toggleClass('smooth-scrolling', true)
		html.toggleClass('native-scrolling', false)

		$(container).emit('attachscrollbar')

		content = $('.scroll-content')
	}

	/**
	 * Destroys the smooth scrollbar container.
	 * @function destroyScrollbars
	 * @since 1.0.0
	 */
	function destroyScrollbars() {

		if (scrollbar == null) {
			return
		}

		Scrollbar.destroyAll()
		scrollbar = null

		html.toggleClass('smooth-scrolling', false)
		html.toggleClass('native-scrolling', true)

		$(container).emit('detachscrollbar')

		content = null
		timeout = clearTimeout(timeout)
	}

	/*
	 * Create scrollbars immediately because the breakpoints are set
	 * from desktop to mobile. This must be called before setting
	 * the media query handlers.
	 */

	createScrollbars()

	html.on('disablescroller', function () {
		if (disabled == false) {
			disabled = true
			destroyScrollbars()
		}
	})

	$(window).on('mediaenter', (e, media) => {
		if (media == 'xl') {
			createScrollbars()
		}
	})

	$(window).on('medialeave', (e, media) => {
		if (media == 'xl') {
			destroyScrollbars()
		}
	})

})

let oldScrollTop = $.fn.scrollTop
let oldScrollLeft = $.fn.scrollLeft

/**
 * Override the scrollTop to return the main scroller's position.
 * @function scrollTop
 * @since 1.0.0
 */
$.fn.scrollTop = function (value) {

	if (this.get(0) == window) {

		let scrollbar = Scrollbar.get(container)
		if (scrollbar) {

			if (value == null) {
				return scrollbar.offset.y
			}

			scrollbar.setPosition(scrollbar.offset.x, value)
			return this
		}
	}

	return oldScrollTop.apply(this, arguments)
}

/**
 * Override the scrollLeft to return the main scroller's position.
 * @function scrollLeft
 * @since 1.0.0
 */
$.fn.scrollLeft = function (value) {

	if (this.get(0) == window) {

		let scrollbar = Scrollbar.get(container)
		if (scrollbar) {

			if (value == null) {
				return scrollbar.offset.x
			}

			scrollbar.setPosition(value, scrollbar.offset.y)
			return this
		}
	}

	return oldScrollLeft.apply(this, arguments)
}

$.fn.contentWidth = function () {

	if (this.get(0) == window) {


		let scrollbar = Scrollbar.get(container)
		if (scrollbar) {
			return scrollbar.getSize().content.width
		}

		return $(document).width()
	}

	return this.scrollWidth()
}

$.fn.contentHeight = function () {

	if (this.get(0) == window) {

		let scrollbar = Scrollbar.get(container)
		if (scrollbar) {
			return scrollbar.getSize().content.height
		}

		return $(document).height()
	}

	return this.scrollHeight()
}