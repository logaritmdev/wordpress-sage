/*
 * Animates the loading screen.
 */

$.attach('.main-layout-loader', (i, element) => {

	let value = element.find('.main-layout-loader-bar-value')

	function onLoadedEnough(e) {

		if (e.target == document.body) {

			element.addClass('main-layout-loader--leave')
			element.addClass('main-layout-loader--leave-active', 750)

			element.addClass('main-layout-loader--gone', 1500)
			element.removeClass('main-layout-loader--leave', 1500)
			element.removeClass('main-layout-loader--leave-active', 1500)
		}
	}

	function onComplete() {
		setTimeout(() => {
			value.css('width', 0)
		}, 1000)
	}

	function onProgress(progress) {
		value.css('width', progress + '%')
	}

	$(document.body).on('loadedenough', onLoadedEnough)

	$.subscribe('loading/progress', onProgress)
	$.subscribe('loading/complete', onComplete)

	if ($(document.body).hasClass('loaded-enough')) {
		onLoadedEnough({ target: document.body })
	}

	/*
	 * Show the exit animation by delaying external links
	 */

	$('a:not([data-fancybox])').each(function (i, link) {

		if (link.host != location.host) {
			return
		}

		if (link.host == location.host &&
			link.protocol == location.protocol &&
			link.pathname == location.pathname &&
			link.search == location.search) {
			return
		}

		link = $(link)

		link.on('click', function (e) {

			e.preventDefault()

			element.addClass('main-layout-loader--unload')
			element.addClass('main-layout-loader--unload-active', 50)
			element.removeClass('main-layout-loader--gone')

			setTimeout(function () {
				location.href = link.prop('href')
			}, 500)

		})
	})
})

/*
 * Makes the wpadminbar usable
 */

$.attach('#wpadminbar', (i, element) => {
	element.remove()
	element.appendTo('body')
})
