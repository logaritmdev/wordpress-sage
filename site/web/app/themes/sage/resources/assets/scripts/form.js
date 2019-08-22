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

	let label = element.find('label')
	let input = element.find('input, select, textarea')

	if (label.length == 0 ||
		input.attr('type') == 'radio' ||
		input.attr('type') == 'checkbox') {
		return
	}

	input.attr('placeholder', '')

	let hasFocus = false
	let hasValue = false

	function update() {
		element.toggleClass('form-field--focus', hasFocus)
		element.toggleClass('form-field--active', hasFocus || hasValue)
	}

	function value() {

		let val = input.val()
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

/*
 * Manages file form input.
 */

$.attach('.form-field--file', function (i, element) {

	let input = element.find('input')
	let value = element.find('.form-file-value-text')
	let initial = value.text()

	input.appendTo(element)

	input.on('change', function () {
		let files = input.get(0).files
		if (files.length) {
			value.text(files[0].name)
		} else {
			value.text(initial)
		}
	})

	let wpcf7Elm = document.querySelector('.wpcf7')
	if (wpcf7Elm) {
		wpcf7Elm.addEventListener('wpcf7mailsent', function (event) {
			value.text(initial)
		}, false)
	}

})
