$.attach('a', function (i, element) {

	if (element.attr('data-fancybox')) {
		return
	}

	var link = element.get(0)
	if (link.hash == '') {
		return
	}

	if (link.host != location.host ||
		link.protocol != location.protocol ||
		link.pathname != location.pathname) {
		return
	}

	var hash = link.hash.replace(/^#/, '')
	if (hash == '') {
		return
	}

	var target = document.getElementById(hash)
	if (target == null) {
		return
	}

	element.on('click', function (e) {
		e.preventDefault()
		$.scrollTo(target, 500, function () {
			location.hash = hash
		})
	})

})
