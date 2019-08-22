/**
 * Break lines into elements
 * @function breakLines
 * @since 1.0.0
 */
$.fn.breakLines = function (options) {
	this.each((i, e) => breakLines(i, e, options))
}

/**
 * @function breakLines
 * @since 1.0.0
 */
function breakLines(i, element, options) {

	element = $(element)

	//--------------------------------------------------------------------------
	// Variables
	//--------------------------------------------------------------------------

	/**
	 * The element root node.
	 * @var children
	 * @since 1.0.0
	 */
	let root = null

	/**
	 * The element html.
	 * @var children
	 * @since 1.0.0
	 */
	let html = null

	/**
	 * The last layout measured font size.
	 * @var measuredFontSize
	 * @since 1.0.0
	 */
	let measuredFontSize = null

	/**
	 * The last layout measured font weight.
	 * @var measuredFontWeight
	 * @since 1.0.0
	 */
	let measuredFontWeight = null

	/**
	 * The last layout measured width;
	 * @var measuredWidth
	 * @since 1.0.0
	 */
	let measuredWidth = null

	/**
	 * The last layout measured height
	 * @var measuredHeight
	 * @since 1.0.0
	 */
	let measuredHeight = null

	//--------------------------------------------------------------------------
	// Functions
	//--------------------------------------------------------------------------

	/**
	 * Updates the lines
	 * @function update
	 * @since 1.0.0
	 */
	function update() {

		if (root == null) {
			return
		}

		let bounds = element.bounds()
		let fontSize = element.css('font-size')
		let fontWeight = element.css('font-weight')

		if (measuredWidth == bounds.width &&
			measuredHeight == bounds.height &&
			measuredFontSize == fontSize &&
			measuredFontWeight == fontWeight) {

			/*
			 * The area did not change thus the lines should remain
			 * the same.
			 */

			return
		}

		measuredWidth = bounds.width
		measuredHeight = bounds.height
		measuredFontSize = fontSize
		measuredFontWeight = fontWeight

		root.innerHTML = html

		element.toggleClass('multiline', false)

		let fragment = document.createDocumentFragment()

		breakNode(root, fragment)
		emptyNode(root)

		root.appendChild(fragment)

		element.toggleClass('multiline', true)

		element.find('.line').each((i, line) => {

			line = $(line)

			line.attr('data-text', line.text())

			let others = line.find(':not(.word)')
			line.toggleClass('plain', others.length == 0)
			line.toggleClass('mixed', others.length != 0)

		})

		if (options &&
			options.onComplete) {
			options.onComplete(element)
		}

		element.emit('breaklines/complete', element)
	}

	/**
	 * Breaks the node lines.
	 * @function breakNode
	 * @since 1.0.0
	 */
	function breakNode(root, into) {

		let base = null
		let line = createLine()

		let nodes = root.childNodes

		for (let i = 0; i < nodes.length; i++) {

			let node = nodes[i]
			let name = nodes[i].tagName
			let type = nodes[i].nodeType

			let copy = node.cloneNode(true)

			if (type == Node.TEXT_NODE) {
				line.appendChild(copy)
				continue
			}

			if (type == Node.ELEMENT_NODE) {

				let b = nodes[i].getBoundingClientRect()
				let t = b.top
				let h = b.height

				if (base == null) {
					base = t + h
				}

				if (name == 'BR') {
					continue
				}

				if (base < t + h) {
					base = t + h
					into.appendChild(line)
					line = createLine()
				}

				line.appendChild(copy)

				continue
			}
		}

		if (line.parentNode == null) {
			into.appendChild(line)
		}
	}

	/**
	 * Creates a line element.
	 * @function createLine
	 * @since 1.0.0
	 */
	function createLine() {
		let element = document.createElement('span')
		element.className = 'line'
		return element
	}

	/**
	 * @function clearText
	 * @since 1.0.0
	 * @hidden
	 */
	function emptyNode(node) {
		while (node.firstChild) {
			node.removeChild(node.firstChild)
		}
	}

	//--------------------------------------------------------------------------
	// Body
	//--------------------------------------------------------------------------

	element.breakWords({

		onComplete(element) {

			if (root == null) {
				root = element.get(0)
				html = element.get(0).innerHTML
			}

			update()

			element.emit('breakwords')
		}

	})

	$(window).on('load', update)
	$(window).on('resize', update)

}

/**
 * Attach style
 * @since 1.0.0
 */
$.attach('[data-break-lines]', function (i, element) {

	let target = element.attr('data-break-lines')
	if (target) {
		element = element.find(target)
	}

	element.breakLines()
})