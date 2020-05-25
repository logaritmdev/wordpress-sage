const medias = {}
const mediaEnterListeners = []
const mediaLeaveListeners = []

/**
 * @function defineMedia
 * @since 1.0.0
 */
$.defineMedia = function (name, media) {
	medias[media] = name
}

/**
 * @function addMediaEnterListener
 * @since 1.0.0
 */
$.matchMedia = function (media, callback) {

	let mql = matchMedia(media)

	mql.addListener(callback)

	if (callback) {
		callback(mql)
	}

	return mql
}

/**
 * @function addMediaEnterListener
 * @since 1.0.0
 */
$.addMediaEnterListener = function (callback) {
	mediaEnterListeners.push(callback)
}

/**
 * @function addMediaLeaveListener
 * @since 1.0.0
 */
$.addMediaLeaveListener = function (callback) {
	mediaLeaveListeners.push(callback)
}

$(function () {

	let current = ''

	/**
	 * @function update
	 * @since 1.0.0
	 * @hidden
	 */
	function update() {

		let node = $('html')

		let items = Object.entries(medias)
		let found = false

		for (let entry of items) {

			let [
				query,
				media
			] = entry

			let match = matchMedia(query).matches
			if (match &&
				found == false) {
				found = true
				node.toggleClass(media, true)

				mediaLeaveListeners.forEach(callback => callback(current))
				current = media
				mediaEnterListeners.forEach(callback => callback(current))

			} else {
				node.toggleClass(media, false)
			}
		}

		node.attr('data-vw', window.innerWidth)
		node.attr('data-vh', window.innerHeight)
	}

	$(window).on('resize', $.throttle(update))

	update()
})