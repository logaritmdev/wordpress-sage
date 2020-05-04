import { SmoothScroller } from 'smooth-scroller'

/**
 * @function smoothScroll
 * @since 1.0.0
 */
$.fn.smoothScroll = function () {
	new SmoothScroller(this.get(0))
}
