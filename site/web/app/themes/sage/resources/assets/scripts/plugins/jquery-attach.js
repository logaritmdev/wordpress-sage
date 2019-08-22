

//------------------------------------------------------------------------------
// Variables
//------------------------------------------------------------------------------

/**
 * The attached element ids.
 * @var selectors
 * @since 1.1.0
 */
var ids = 1

/**
 * The selector map
 * @var selectors
 * @since 1.0.0
 */
var map = {}

/**
 * The selector bounds to callbacks.
 * @var selectors
 * @since 1.0.0
 */
var selectors = []

//------------------------------------------------------------------------------
// Functions
//------------------------------------------------------------------------------

/**
 * Attach a callback to a selector.
 * @function attach
 * @since 1.0.0
 */
$.attach = function (selector, callback) {

	var executors = map[selector]
	if (executors == null) {
		executors = map[selector] = { selector: selector, callback: [] }
		selectors.push(executors)
	}

	executors.callback.push(callback)
}

/**
 * Executes all callbacks from a specific element.
 * @function attach.refresh
 * @since 1.0.0
 */
$.attach.refresh = function () {

	function process(elements) {

		$.each(selectors, function (i, builder) {

			var selector = builder.selector
			var callback = builder.callback

			$(selector).each(function (i, element) {

				element = $(element)

				if ($.data(element.get(0), 'attach-id-' + selector) == null || element.get(0) == document.body) {
					$.data(element.get(0), 'attach-id-' + selector, ids++)
					$.each(callback, function (k, callback) {
						callback(i, element)
					})
				}

			})
		})
	}

	process()
}

$(function () {
	$.attach.refresh()
})