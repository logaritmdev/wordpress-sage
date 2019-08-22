/**
 * Add classes on img tag to help define their ratio and transform their
 * width and height in rem
 */
$.attach('.wysiwyg img', (i, element) => {

	let src = element.attr('src')
	if (src == '' ||
		src == null) {
		return
	}

	function onLoad() {

		let w = element.fattr('width')
		let h = element.fattr('height')

		if (w != null &&
			h != null) {

			w = w / 16
			h = h / 16

			element.attr('width', '').css('width', w + 'rem')
			element.attr('height', '').css('height', h + 'rem')
		}

		let naturalW = loader.naturalWidth
		let naturalH = loader.naturalHeight

		if (naturalW > naturalH) {
			element.addClass('landscape').css('height', '')
		} else {
			element.addClass('portrait').css('width', '')
		}

	}

	function onError() {
		element.addClass('error')
	}

	let loader = new Image()
	loader.addEventListener('load', onLoad)
	loader.addEventListener('error', onError)
	loader.src = src

	if (loader.complete) {
		onLoad()
	}

})
