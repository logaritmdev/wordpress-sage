$.fn.smooth = function (speed = 30, smooth = 10) {

	if (useNativeScrolling()) {
		return
	}

	let element = this.get(0)
	let content = getContent(element)
	let wrapper = getWrapper(element)

	let offset = getOffset()
	let moving = false

	function useNativeScrolling() {
		return navigator.userAgent.indexOf('Edge') > -1
	}

	function getContent(element) {
		return element == document ? document.documentElement : element
	}

	function getWrapper(element) {
		return element == document ? document.documentElement : element
	}

	function getMinOffset() {
		return 0
	}

	function getMaxOffset() {
		return content.scrollHeight - wrapper.clientHeight
	}

	function getOffset() {
		return content.scrollTop
	}

	function getDelta(e) {

		if (e.detail) {

			if (e.wheelDelta) {
				return e.wheelDelta / e.detail / 40 * (e.detail > 0 ? 1 : -1) // Opera
			}

			return -e.detail // Firefox
		}

		return e.wheelDelta / 120 // IE, Safari, Chrome
	}

	function update() {

		moving = true

		let delta = (offset - content.scrollTop) / smooth

		content.scrollTop += delta

		if (Math.abs(delta) > 0.9 || (delta < 0 && content.scrollTop < 10)) {
			requestAnimationFrame(update)
		} else {
			moving = false
		}
	}

	function onScroll() {
		if (moving == false) {
			offset = getOffset()
		}
	}

	function onWheel(e) {

		e.preventDefault()

		var delta = getDelta(e)

		let min = getMinOffset()
		let max = getMaxOffset()

		offset += -delta * speed

		if (offset < min) offset = min
		if (offset > max) offset = max

		if (moving == false) {
			update()
		}
	}

	window.addEventListener('scroll', onScroll)

	content.addEventListener('mousewheel', onWheel, { passive: false })
	content.addEventListener('DOMMouseScroll', onWheel, { passive: false })
}
