/**
 * Break lines into elements
 * @function breakWords
 * @since 1.0.0
 */
$.fn.breakWords = function (options) {
	this.each((i, e) => breakWords(i, e, options))
}

/**
 * @function breakWords
 * @since 1.0.0
 */
function breakWords(i, element, options) {

	element = $(element)

	//--------------------------------------------------------------------------
	// Variables
	//--------------------------------------------------------------------------

	/**
	 * The root node.
	 * @var root
	 * @since 1.0.0
	 */
	let root = element.get(0)

	/**
	 * The html.
	 * @var html
	 * @since 1.0.0
	 */
	let html = element.get(0).innerHTML

	//--------------------------------------------------------------------------
	// Functions
	//--------------------------------------------------------------------------

	/**
	 * @function update
	 * @since 1.0.0
	 * @hidden
	 */
	function update() {

		root.innerHTML = html

		let fragment = document.createDocumentFragment()

		breakNode(root, fragment)
		emptyNode(root)

		root.appendChild(fragment)

		if (options &&
			options.onComplete) {
			options.onComplete(element)
		}
	}

	/**
	 * @function breakNode
	 * @since 1.0.0
	 * @hidden
	 */
	function breakNode(root, into) {

		let word = ''

		let nodes = root.childNodes

		for (let i = 0; i < nodes.length; i++) {

			let orig = nodes[i]
			let node = nodes[i].cloneNode(true)

			let name = node.tagName
			let type = node.nodeType
			let text = node.nodeValue

			if (type == Node.TEXT_NODE) {

				text = text.trim()

				for (let j = 0; j < text.length; j++) {

					let char = text[j]
					if (char == ' ' ||
						char == '\xa0') {

						appendWord(word, into)
						appendChar(char, into)

						word = ''

					} else {
						word = word + char.trim()
					}
				}

				if (word) {
					appendWord(word, into)
					word = ''
				}
			}

			if (type == Node.ELEMENT_NODE) {

				if (name == 'BR') {

					let display = getComputedStyle(orig).display
					if (display == 'none') {
						appendChar(' ', into)
						continue;
					}

				}

				let fragment = document.createDocumentFragment()

				breakNode(node, fragment)
				emptyNode(node)

				node.appendChild(fragment)

				appendChar(' ', into)
				into.appendChild(node)
				appendChar(' ', into)

				continue
			}
		}
	}

	/**
	 * @function appendWord
	 * @since 1.0.0
	 * @hidden
	 */
	function appendWord(text, into) {

		let word = document.createElement('span')
		word.className = 'word'
		word.innerText = text

		into.appendChild(word)
	}

	/**
	 * @function appendChar
	 * @since 1.0.0
	 * @hidden
	 */
	function appendChar(char, into) {
		into.appendChild(document.createTextNode(char))
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

	update()
}

/**
 * @since 1.0.0
 */
$.attach('[data-break-words]', function (i, element) {

	let target = element.attr('data-break-words')
	if (target) {
		element = element.find(target)
	}

	element.breakWords()
})