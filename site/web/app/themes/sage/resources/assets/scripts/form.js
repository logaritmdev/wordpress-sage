/*
 * Removes empty paragraph.
 */

$.attach('.form-section, .form-footer', (i, element) => {
	element.find('p:empty').remove()
})

/*
 * Updates the visual state of the form field.
 */

$.attach('.form-field', (i, element) => {

	element = $(element)

	var label = element.find('label')
	var input = element.find('input, select, textarea')

	if (label.length == 0 ||
		input.attr('type') == 'radio' ||
		input.attr('type') == 'checkbox') {
		return
	}

	input.attr('placeholder', '')

	var hasFocus = false
	var hasValue = false

	function update() {
		element.toggleClass('form-field--focus', hasFocus)
		element.toggleClass('form-field--active', hasFocus || hasValue)
	}

	function value() {

		var val = input.val()
		if (val) {
			val = val.trim()
		}

		return val
	}

	input.on('input', function () {
		hasValue = value().length > 0
		update()
	})

	input.on('change', function () {
		hasValue = value().length > 0
		update()
	})

	input.on('focus', function () {
		hasFocus = true
		update()
	})

	input.on('blur', function () {
		hasFocus = false
		update()
	})

	hasValue = value().length > 0

	update()

})
