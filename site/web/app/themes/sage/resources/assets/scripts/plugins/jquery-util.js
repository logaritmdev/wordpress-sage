import Scrollbar from '../vendors/smooth-scrollbar.min'

const addClass = $.fn.addClass
const removeClass = $.fn.removeClass
const toggleClass = $.fn.toggleClass

/**
 * Emits an event.
 * @function emit
 * @since 1.0.0
 */
$.fn.emit = function (type, args) {
	this.triggerHandler(type, args)
}

/**
 * Add a convenience delay parameter to the addClass method
 * @function addClass
 * @since 1.0.0
 */
$.fn.addClass = function (className, delay) {

	if (delay) {

		setTimeout(function () {
			addClass.apply(this, [className])
		}.bind(this), delay)

		return this
	}

	return addClass.apply(this, [className])
}

/**
 * Add a convenience delay parameter to the removeClass method
 * @function removeClass
 * @since 1.0.0
 */
$.fn.removeClass = function (className, delay) {

	if (delay) {

		setTimeout(function () {
			removeClass.apply(this, [className])
		}.bind(this), delay)

		return this
	}

	return removeClass.apply(this, [className])
}

/**
 * Add a convenience delay parameter to the removeClass method
 * @function toggleClass
 * @since 1.0.0
 */
$.fn.toggleClass = function (className, toggle, delay) {

	if (delay) {

		setTimeout(function () {
			toggleClass.apply(this, [className, toggle])
		}.bind(this), delay)

		return this
	}

	return toggleClass.apply(this, [className, toggle])
}

/**
 * Override the scrollLeft to return the main scroller's position.
 * @function scrollLeft
 * @since 1.0.0
 */
$.fn.bounds = function (relative) {

	let element = this.get(0)
	if (element == null) {
		return null
	}

	let rect = {
		top: 0,
		left: 0,
		width: 0,
		height: 0
	}

	var bounds = element.getBoundingClientRect()

	rect.top = bounds.top
	rect.left = bounds.left
	rect.width = bounds.width
	rect.height = bounds.height

	relative = $(relative)

	if (relative.length) {
		relative = $(relative).get(0).getBoundingClientRect()
		rect.top -= relative.top
		rect.left -= relative.left
	}

	return rect
}

/**
 * Override the scrollLeft to return the main scroller's position.
 * @function scrollLeft
 * @since 1.0.0
 */
$.fn.scrollWidth = function () {
	return this.get(0).scrollWidth
}

/**
 * Override the scrollLeft to return the main scroller's position.
 * @function scrollLeft
 * @since 1.0.0
 */
$.fn.scrollHeight = function () {
	return this.get(0).scrollHeight
}

/**
 * @function scrollToElement
 * @since 1.0.0
 */
$.scrollToElement = function (target, duration, callback) {

	var offset = 0

	if (typeof target == 'number') {

		offset = target

	} else {

		target = $(target)

		if (target.length == 0) {
			return
		}

		offset = $(window).scrollTop() + target.bounds().top - parseInt(target.css('margin-top')) || 0
	}

	offset = Math.max(offset, 0)

	setTimeout(function () {
		callback && callback()
	}, duration)

	var container = document.querySelector('[data-scroller]')
	if (container) {

		var scrollbar = Scrollbar.get(container)
		if (scrollbar) {

			requestAnimationFrame(function () {
				scrollbar.scrollTo(0, offset, duration)
			})

			return
		}
	}

	$.scrollTo(offset, duration, { axis: 'y', })
}

/**
 * @function throttle
 * @since 1.0.0
 */
$.throttle = function (callback) {

	var request = null

	return function () {

		function exec() {

			if (callback) {
				callback()
			}

			request = null
		}

		if (request == null) {
			request = requestAnimationFrame(exec)
		}
	}
}

/**
 * Returns a float attribute.
 * @function fattr
 * @since 1.0.0
 */
$.fn.fattr = function (name) {
	return parseFloat(this.attr(name))
}

/**
 * Returns an integer attribute.
 * @function iattr
 * @since 1.0.0
 */
$.fn.iattr = function (name) {
	return parseInt(this.attr(name))
}

/**
 * Returns the max value from an array of elements.
 * @function scaled-max
 * @since 1.0.0
 */
$.fn.max = function (callback) {

	let max = null

	this.each((i, element) => {

		let val = callback(i, element)

		if (max == null ||
			max < val) {
			max = val
		}

	})

	return max
}

/**
 * Returns the min value from an array of element.
 * @function scaled-min
 * @since 1.0.0
 */
$.fn.min = function (callback) {

	let min = null

	this.each((i, element) => {

		let val = callback(i, element)

		if (min == null ||
			min > val) {
			min = val
		}

	})

	return max
}

/**
 * Indicates whether the element overflows.
 * @function overflows
 * @since 1.0.0
 */
$.fn.overflows = function (axis) {

	let bounds = this.bounds()
	if (bounds == null) {
		return false
	}

	if (axis == null) {
		axis = 'x'
	}

	let sw = Math.ceil(this.scrollWidth())
	let sh = Math.ceil(this.scrollHeight())

	let w = Math.ceil(bounds.width)
	let h = Math.ceil(bounds.height)

	switch (axis) {

		case 'x':
			return sw > w

		case 'y':
			return sh > h
	}

	return false
}