$.attach('.carousel', function (i, element) {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * Control to show the previous carousel item.
	 * @var prevButtonElement
	 * @since 1.0.0
	 */
	let prevButtonElement = null

	/**
	 * Control to show the next carousel item.
	 * @var nextButtonElement
	 * @since 1.0.0
	 */
	let nextButtonElement = null

	/**
	 * Images contained in the carousel.
	 * @var slideElements
	 * @since 1.0.0
	 */
	let slideElements = null

	/**
	 * Controls to indicate/change carousel status.
	 * @var indicatorElements
	 * @since 1.0.0
	 */
	let dotElements = null

	/**
	 * The carousel's index.
	 * @var index
	 * @since 1.0.0
	 */
	let index = 0

	/**
	 * The image being animated to enter.
	 * @var slideToEnter
	 * @since 1.0.0
	 */
	let slideToEnter = null

	/**
	 * The image being animated to leave.
	 * @var slideToLeave
	 * @since 1.0.0
	 */
	let slideToLeave = null

	/**
	 * Whether the carousel is in the process of animating or not.
	 * @var animating
	 * @since 1.0.0
	 */
	let animating = false

	/**
	 * Whether the carousel autoplays.
	 * @var autoplay
	 * @since 1.0.0
	 */
	let autoplay = element.attr('data-autoplay')

	/**
	 * The carousel autoplay delay.
	 * @var autoplayDelay
	 * @since 1.0.0
	 */
	let autoplayDelay = parseInt(element.attr('data-autoplay-delay') || 0)

	/**
	 * The enter animation duration.
	 * @var enterAnimationDuration
	 * @since 1.0.0
	 */
	let enterAnimationDuration = parseInt(element.attr('data-enter-animation-duration') || 1250)

	/**
	 * The leave animation duration.
	 * @var enterAnimationDuration
	 * @since 1.0.0
	 */
	let leaveAnimationDuration = parseInt(element.attr('data-leave-animation-duration') || 1250)

	//--------------------------------------------------------------------------
	// Functions
	//--------------------------------------------------------------------------

	/**
	 * Animates to a specified slide.
	 * @var gotoSlide
	 * @since 1.0.0
	 */
	function gotoSlide(k, direction) {

		if (animating || index === k)
			return

		animating = true

		let next = k
		let curr = index

		let enterAnimationFailsafe = null
		let leaveAnimationFailsafe = null

		element.attr('data-slide', k)

		dotElements.removeClass('carousel-dot--current').eq(next).addClass('carousel-dot--current')

		function onSlideToEnterAnimationEnd(e) {

			if (slideToEnter.is(e.target) === false) {
				return
			}

			enterAnimationFailsafe = clearTimeout(enterAnimationFailsafe)

			index = next
			animating = false
			slideToEnter.off('transitionend', onSlideToEnterAnimationEnd)
			slideToEnter.addClass('carousel-slide--current')
			slideToEnter.removeClass('carousel-slide--enter-rg')
			slideToEnter.removeClass('carousel-slide--enter-rg-transition')
			slideToEnter.removeClass('carousel-slide--enter-lf')
			slideToEnter.removeClass('carousel-slide--enter-lf-transition')

			resetTimeout()
		}

		function onSlideToLeaveAnimationEnd(e) {

			if (slideToLeave.is(e.target) === false) {
				return
			}

			leaveAnimationFailsafe = clearTimeout(leaveAnimationFailsafe)

			slideToLeave.off('transitionend', onSlideToLeaveAnimationEnd)
			slideToLeave.removeClass('carousel-slide--current')
			slideToLeave.removeClass('carousel-slide--leave-rg')
			slideToLeave.removeClass('carousel-slide--leave-rg-transition')
			slideToLeave.removeClass('carousel-slide--leave-lf')
			slideToLeave.removeClass('carousel-slide--leave-lf-transition')

			slideToLeave.removeClass('carousel-slide--active')

			resetTimeout()
		}

		slideToEnter = slideElements.eq(next)
		slideToLeave = slideElements.eq(curr)

		if (direction == null) {
			direction = next > curr ? 'next' : 'prev'
		}

		slideToEnter.addClass('carousel-slide--active')

		enterAnimationFailsafe = clearTimeout(enterAnimationFailsafe)
		leaveAnimationFailsafe = clearTimeout(leaveAnimationFailsafe)

		enterAnimationFailsafe = setTimeout(function () {

			let e = {
				target: slideToEnter
			}

			onSlideToEnterAnimationEnd(e)

		}, enterAnimationDuration)

		leaveAnimationFailsafe = setTimeout(function () {

			let e = {
				target: slideToLeave
			}

			onSlideToLeaveAnimationEnd(e)

		}, leaveAnimationDuration)

		if (direction === 'next') {

			slideToEnter.addClass('carousel-slide--enter-rg')
			slideToLeave.addClass('carousel-slide--leave-lf')
			slideToEnter.on('transitionend', onSlideToEnterAnimationEnd)
			slideToLeave.on('transitionend', onSlideToLeaveAnimationEnd)

			setTimeout(function () {
				slideToEnter.addClass('carousel-slide--enter-rg-transition')
				slideToLeave.addClass('carousel-slide--leave-lf-transition')
			}, 50)

			let height = slideToEnter.get(0).getBoundingClientRect().height
			element.emit('gotoslide', [next, height])
			element.emit('gotonext', height)

			return
		}

		if (direction === 'prev') {

			slideToEnter.addClass('carousel-slide--enter-lf')
			slideToLeave.addClass('carousel-slide--leave-rg')
			slideToEnter.on('transitionend', onSlideToEnterAnimationEnd)
			slideToLeave.on('transitionend', onSlideToLeaveAnimationEnd)

			setTimeout(function () {
				slideToEnter.addClass('carousel-slide--enter-lf-transition')
				slideToLeave.addClass('carousel-slide--leave-rg-transition')
			}, 50)

			let height = slideToEnter.get(0).getBoundingClientRect().height
			element.emit('gotoslide', [next, height])
			element.emit('gotoprev', height)

			return
		}
	}

	/**
	 * Animates to the next slide.
	 * @var gotoNextSlide
	 * @since 1.0.0
	 */
	function gotoNextSlide() {
		gotoSlide(index + 1 > slideElements.length - 1 ? 0 : index + 1, 'next')
		resetTimeout()
	}

	/**
	 * Animates to the previous slide.
	 * @var gotoPrevSlide
	 * @since 1.0.0
	 */
	function gotoPrevSlide() {
		gotoSlide(index - 1 < 0 ? slideElements.length - 1 : index - 1, 'prev')
		resetTimeout()
	}

	/**
	 * Resets the auto changes timeout
	 * @var resetTimeout
	 * @since 1.0.0
	 */
	function resetTimeout() {
		if (autoplay) {
			timeout = clearTimeout(timeout)
			timeout = setTimeout(function () {
				gotoNextSlide()
			}, autoplayDelay)
		}
	}

	//--------------------------------------------------------------------------
	// Events
	//--------------------------------------------------------------------------

	/**
	 * Called when the previous button is clicked.
	 * @var onPrevButtonClick
	 * @since 1.0.0
	 */
	function onPrevButtonClick() {
		gotoPrevSlide()
	}

	/**
	 * Called when the next button is clicked.
	 * @var onNextButtonClick
	 * @since 1.0.0
	 */
	function onNextButtonClick() {
		gotoNextSlide()
	}

	/**
	 * Called when a specified indicator is clicked.
	 * @var onDotClick
	 * @since 1.0.0
	 */
	function onDotClick(e) {
		gotoSlide($(e.target).index())
	}

	//----------------------------------------------------------------------
	// Initialization
	//----------------------------------------------------------------------

	let timeout = null

	slideElements = element.find('.carousel-slide')
	dotElements = element.find('.carousel-dot')

	element.attr('data-slide', 0)

	slideElements.eq(0)
		.addClass('carousel-slide--current')
		.addClass('carousel-slide--active')

	dotElements.on('click', onDotClick)
	dotElements.eq(0)
		.addClass('carousel-dot--current')

	element.emit('gotoslide', [0, slideElements.get(0).getBoundingClientRect().height])

	prevButtonElement = element.find('.carousel-prev')
	nextButtonElement = element.find('.carousel-next')

	if (slideElements.length <= 1) {
		prevButtonElement.hide()
		nextButtonElement.hide()
	}

	element.on('click', '.carousel-prev', onPrevButtonClick)
	element.on('click', '.carousel-next', onNextButtonClick)

	// element.on('swipeleft', onNextButtonClick)
	// element.on('swiperight', onPrevButtonClick)

	element.on('next', onNextButtonClick)
	element.on('prev', onPrevButtonClick)
	element.on('goto', function (e, k) {
		gotoSlide(k, k > index ? 'next' : 'prev')
	})

	element.on('enterscreen', resetTimeout)

})
