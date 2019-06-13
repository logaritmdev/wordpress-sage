import Swiper from '../vendors/swiper.min'

$.attach('.slider', (i, element) => {

	/**
	 * Creates wrappers for the slides
	 * @since 1.0.0
	 */
	function build() {

		frame.empty()

		for (let i = 0; i < items.length; i++) {

			let slide = $('<div class="slider-slide swiper-slide"></div>')

			slide.append(items.get(i))
			slide.wrapInner('<div class="slider-slide-cell"></div>')
			slide.wrapInner('<div class="slider-slide-container"></div>')

			frame.append(slide)
		}

		if (swiper) {
			swiper.update()
		}

		dots.empty()

		let pages = Math.ceil(items.length)
		if (pages) {

			for (let i = 0; i < pages; i++) {
				dots.append('<div class="dot"></div>')
			}

			if (swiper) {
				dots.find('.slider-dot').eq(swiper.realIndex).addClass('slider-dot--current')
			}
		}

		if (pages == 1) {
			dots.hide()
		} else {
			dots.show()
		}
	}

	/**
	 * @function onNext
	 * @since 1.0.0
	 */
	function onNext() {
		if (swiper.isEnd == false) {
			swiper.slideNext(750)
		} else {
			swiper.slideTo(0, 750)
		}
	}

	/**
	 * @function onPrev
	 * @since 1.0.0
	 */
	function onPrev() {
		if (swiper.isBeginning == false) {
			swiper.slidePrev(750)
		} else {
			swiper.slideTo(swiper.slides.length - 1, 750)
		}
	}

	/**
	 * @function onPage
	 * @since 1.0.0
	 */
	function onPage(e) {
		swiper.slideTo($(e.target).index(), 750, false)
	}

	/**
	 * @function onSlideChange
	 * @since 1.0.0
	 */
	function onSlideChange() {

		let min = 0
		let max = swiper.slides.length - 1

		element.find('.slider-prev').toggleClass('button-hidden', swiper.realIndex == min)
		element.find('.slider-next').toggleClass('button-hidden', swiper.realIndex == max)

		dots.find('.slider-dot')
			.toggleClass('slider-dot--current', false)
			.eq(swiper.realIndex)
			.toggleClass('slider-dot--current', true)

		requestAnimationFrame(() => {
			element.emit('change', swiper.realIndex)
		})
	}

	let swiper = null

	let initial = element.attr('data-initial-slide')

	let dots = element.find('.slider-dots')
	let items = element.find('.slider-item')
	let frame = element.find('.slider-items')

	let outer = $('<div class="slider-outer"></div>')
	let inner = $('<div class="slider-inner swiper-container"></div>')

	frame.after(outer)
	outer.append(inner)
	inner.append(frame)

	frame.addClass('swiper-wrapper')

	let container = element.find('.swiper-container')

	swiper = new Swiper(container, { initialSlide: initial, threshold: 30 })
	swiper.on('slideChange', onSlideChange)

	element.on('click', '.slider-prev', onPrev)
	element.on('click', '.slider-next', onNext)
	element.on('click', '.slider-dot', onPage)

	element.on('goto', (e, index) => {
		swiper.slideTo(index, 750, false)
	})

	build()

	onSlideChange()
})
