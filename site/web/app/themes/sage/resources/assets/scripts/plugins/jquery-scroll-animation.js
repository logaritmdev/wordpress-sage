import Scrollbar from '../vendors/smooth-scrollbar.min'

/**
 * @function scrollAnimation
 * @since 1.0.0
 */
$.fn.scrollAnimation = function () {

    let element = this

    //------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------

	/**
	 * The element that scrolls.
	 * @var scroller
	 * @since 1.0.0
	 */
    let scroller = element.closest('[data-scroller]')

	/**
	 * The scrollbar manager.
	 * @var scrollbar
	 * @since 1.0.0
	 */
    let scrollbar = null

	/**
	 * The scrollable container.
	 * @var container
	 * @since 1.0.0
	 */
    let container = scroller.find('.scroll-content')
    if (container.length == 0) {
        container = scroller
    }

    /**
     * The child element to receive the styles.
     * @property target
     * @since 1.0.0
     */
    let target = element.attr('data-scroll-animation-target')

    /**
     * The animated property.
     * @property propertyName
     * @since 1.0.0
     */
    let propertyName = ['transform']

    /**
     * The animated property format.
     * @property propertyFormat
     * @since 1.0.0
     */
    let propertyFormat = ['%v%']

    /**
     * The animated property minimal value.
     * @property propertyMinValue
     * @since 1.0.0
     */
    let propertyMinValue = [0]

    /**
     * The animated property maximal value.
     * @property propertyMaxValue
     * @since 1.0.0
     */
    let propertyMaxValue = [100]

    /**
     * The animated property unit.
     * @property propertyUnit
     * @since 1.0.0
     */
    let propertyUnit = ['px']

    /**
     * The element enter offset.
     * @property offsetTop
     * @since 1.0.1
     */
    let offsetTop = 0

    /**
     * The element leave offset.
     * @property offsetBot
     * @since 1.0.1
     */
    let offsetBot = 0

	/**
	 * The horizontal layout.
	 * @var horizontalLayoutElement
	 * @since 1.0.0
	 */
    let horizontalLayoutElement = element.closest('.horizontal-layout')

	/**
	 * The horizontal layout wrapper element.
	 * @var hlw
	 * @since 1.0.0
	 */
    let horizontalLayoutWrapper = element.closest('.horizontal-layout-wrapper')

	/**
	 * The horizontal layout content element.
	 * @var horizontalLayoutContent
	 * @since 1.0.0
	 */
    let horizontalLayoutContent = element.closest('.horizontal-layout-content')

    /**
     * Returns the scroll value on the y axis.
     * @function getScrollTop
     * @since 1.0.0
     */
    function getScrollTop() {
        return scrollbar ? scrollbar.scrollTop : $(window).scrollTop()
    }

    /**
     * Returns the scroll value on the x axis.
     * @function getScrollLeft
     * @since 1.0.0
     */
    function getScrollLeft() {
        return scrollbar ? scrollbar.scrollLeft : $(window).scrollLeft()
    }

    /**
     * Returns the scrollable container's width.
     * @function getFrameWidth
     * @since 1.0.0
     */
    function getFrameWidth() {
        return scrollbar ? scrollbar.containerEl.getBoundingClientRect().width : $(window).width()
    }

    /**
     * Returns the scrollable container's height.
     * @function getFrameHeight
     * @since 1.0.0
     */
    function getFrameHeight() {
        return scrollbar ? scrollbar.containerEl.getBoundingClientRect().height : window.innerHeight
    }

    /**
     * Returns the progress of the element within the screen
     * @function getProgress
     * @since 1.0.1
     */
    function getProgress() {

        let scroll = getScrollTop()

        let progress = 0

        if (scroll >= offsetTop && scroll <= offsetBot) {
            progress = (scroll - offsetTop) / (offsetBot - offsetTop)
        } else if (scroll < offsetTop) {
            progress = 0
        } else if (scroll > offsetBot) {
            progress = 1
        }

        if (progress > 0 && scroll == 0) {
            progress = 1
        }

        if (progress < 0) progress = 0
        if (progress > 1) progress = 1

        return progress
    }

    /**
     * Update animation element measures.
     * @function update
     * @since 1.0.0
     */
    function update() {

        if (horizontalLayoutElement.length) {

            let rhl = horizontalLayoutElement.bounds(scroller)
            let rhw = horizontalLayoutWrapper.bounds(scroller)

            let offset = element.bounds(horizontalLayoutContent).left + parseFloat(horizontalLayoutContent.css('margin-left')) || 0

            if (offset > rhw.width) {

                offsetTop = rhl.top + (offset - rhw.width)
                offsetBot = rhl.top + (offset - rhw.width) + element.bounds().width + rhw.width

            } else {

                offsetTop = rhl.top
                offsetBot = rhl.top + element.bounds().width + rhw.width

            }

            return
        }

        let bounds = element.bounds(container)
        offsetTop = bounds.top
        offsetBot = bounds.top + bounds.height + $(window).height()

        offsetTop = offsetTop - $(window).height()
        offsetBot = offsetBot - $(window).height()
    }

    /**
     * Update the animation progress.
     * @function updateProgress
     * @since 1.0.0
     */
    function render() {

        let progress = getProgress()

        if (progress > 1) progress = 1
        if (progress < 0) progress = 0

        $.each(propertyName, function (i, property) {

            let name = propertyName[i]
            let fmrt = propertyFormat[i]
            let min = propertyMinValue[i]
            let max = propertyMaxValue[i]
            let unit = propertyUnit[i]

            let el = (Array.isArray(target) ? (target[i] || target[0]) : target)

            let value = interpolate(progress, min, max)

            switch (unit) {

                case 'px': value = (value / 16) + 'rem'; break
                case 'rvw': value = (value / 1440 * 100) + 'vw'; break
                case 'rvh': value = (value / 1440 * 100) + 'vh'; break

                case 'none':
                    break

                default:
                    value = value + propertyUnit
                    break
            }

            el.css(name, fmrt.replace('%v', value))
        })
    }

    //--------------------------------------------------------------------------
    // Events
    //--------------------------------------------------------------------------

    let delay = null

    /**
     * updateOffsets and update the animation.
     * @function onWindowResize
     * @since 1.0.0
     */
    function onWindowResize() {
        delay = cancelAnimationFrame(delay)
        delay = requestAnimationFrame(function () {
            update()
            render()
        })
    }

    /**
     * Update the animation.
     * @function onWindowScroll
     * @since 1.0.0
     */
    function onWindowScroll() {
        render()
    }

    /**
     * Update
     * @function onWindowLoad
     * @since 1.0.0
     */
    function onWindowLoad() {
        update()
        render()
    }

    /**
     * Called when a scroller is attached.
     * @function onAttachScrollbar
     * @since 1.0.0
     */
    function onAttachScrollbar() {

        if (scrollbar == null) {
            scrollbar = Scrollbar.get(scroller.get(0))
        }

        if (scrollbar) {
            scrollbar.addListener(onWindowScroll)
        }

        update()
        render()
    }

    /**
     * Called when a scroller is detached.
     * @function onAttachScrollbar
     * @since 1.0.0
     */
    function onDetachScrollbar() {

        if (scrollbar) {
            scrollbar.removeListener(onWindowResize)
            scrollbar = null
        }

        update()
        render()
    }

    /**
     * Interpolate the value based on a progress value.
     * @function interpolate
     * @since 1.0.0
     */
    function interpolate(progress, min, max) {
        return progress * (max - min) + min
    }

    //--------------------------------------------------------------------------
    // Initialization
    //--------------------------------------------------------------------------

    function trim(string) {
        return string.trim()
    }

    if (target == null) {
        target = element
    } else {

        target = target.split(',').map(t => element.find(t.trim()))

        if (target.length === 1) {
            target = target[0]
        }

    }

    propertyName = (element.attr('data-scroll-animation') || 'transform').split(',').map(trim)
    propertyUnit = (element.attr('data-scroll-animation-unit') || 'px').split(',').map(trim)
    propertyFormat = (element.attr('data-scroll-animation-format') || '%v').split(',').map(trim)
    propertyMinValue = (element.attr('data-scroll-animation-min') || '').split(',').map(trim).map(parseFloat)
    propertyMaxValue = (element.attr('data-scroll-animation-max') || '').split(',').map(trim).map(parseFloat)

    $(window).on('resize', onWindowResize)
    $(window).on('scroll', onWindowScroll)
    $(window).on('load', onWindowLoad)

    onAttachScrollbar()

    $(scroller).on('attachscrollbar', onAttachScrollbar)
    $(scroller).on('detachscrollbar', onDetachScrollbar)

    update()
    render()
}

/**
 * Creates animations on an element based on the scroll.
 * @author Jean-Philippe Dery (jeanphilippe.dery@jblp.ca)
 * @version 1.0.0
 */

$.attach('[data-scroll-animation]', function (i, element) {
    element.scrollAnimation()
})
