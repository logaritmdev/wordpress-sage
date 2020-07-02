import 'jquery'
import scrollTo from './vendors/jquery-scroll-to.min'
import './vendors/modernizr.min'

let $ = window.$ = jQuery

/*
 * ScrollTo
 */

if ($.scrollTo == null) {
	$.scrollTo = scrollTo
}

if ($.fn.scrollTo == null) {
	$.fn.scrollTo = scrollTo
}
