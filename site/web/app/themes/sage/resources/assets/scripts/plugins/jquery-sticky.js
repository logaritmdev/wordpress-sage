$.attach('.sticky', (i, element) => {

	let parent = element.parent()
	let layout = element.closest('.main')
	let sticky = element

	let min = 0
	let max = 0

	let enabled = false

	function update() {

		enabled = shouldEnable()

		if (enabled == false) {

			min = 0
			max = 0

			element.css('transform', null)

			return
		}

		let stickyBounds = sticky.bounds(layout)
		let parentBounds = parent.bounds(layout)

		min = parentBounds.top
		max = parentBounds.top + parentBounds.height - stickyBounds.height
	}

	function render() {

		if (enabled == false) {
			return
		}

		let t = 0

		let scroll = $(window).scrollTop()

		if (scroll >= min &&
			scroll <= max) {

			t = scroll - min

		} else if (scroll < min) {

			t = 0

		} else if (scroll > max) {

			t = max - min

		}

		sticky.css('transform', 'translateY(' + t + 'px)')
	}

	function shouldEnable() {

		if (isNative() ||
			isSticky() == false) {
			return false
		}

		let node = parent.parent()

		while (node.length) {

			if (node.get(0) == document) {
				return false
			}

			let oo = node.css('overflow')
			let ox = node.css('overflow-x')
			let oy = node.css('overflow-y')

			if (oo == 'hidden' ||
				ox == 'hidden' ||
				oy == 'hidden') {
				return true
			}

			node = node.parent()
		}

		return false
	}

	function isNative() {
		return $('html').hasClass('native-scrolling')
	}

	function isSticky() {
		return element.css('position') == 'sticky'
	}

	function onLoad() {
		update()
		render()
	}

	function onScroll() {
		render()
	}

	function onResize() {
		update()
		render()
	}

	$(window).on('load', onLoad)
	$(window).on('scroll', onScroll)
	$(window).on('resize', onResize)

	update()
	render()

})