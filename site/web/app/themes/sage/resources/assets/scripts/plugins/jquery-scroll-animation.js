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
     * @let scroller
     * @since 1.0.0
     */
    let scroller = element.closest('[data-scroller]')

    /**
     * The scrollbar manager.
     * @let scrollbar
     * @since 1.0.0
     */
    let scrollbar = null

    /**
     * The child element to receive the styles.
     * @property target
     * @since 1.0.0
     */
    let target = element.attr('data-scroll-animation-target')
    if (target == null) {
        target = element
    } else {

        target = target.split(',').map(function (t) {
            return element.find(t.trim())
        })

        if (target.length === 1) {
            target = target[0]
        }

    }

    /**
     * The animated property.
     * @property propertyName
     * @since 1.0.0
     */
    let propertyName = ['background-position']

    /**
     * The animated property format.
     * @property propertyFormat
     * @since 1.0.0
     */
    let propertyFormat = ['0px %v%']

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

        let offsetT = offsetTop
        let offsetB = offsetBot
        let scrollX = getScrollLeft()
        let scrollY = getScrollTop()
        let windowSizeX = getFrameWidth()
        let windowSizeY = getFrameHeight()

        let minScroll = Math.max(offsetT - windowSizeY, 0)
        let maxScroll = offsetB

        if (scrollY < minScroll) {
            return 0
        }

        if (scrollY > maxScroll) {
            return 1
        }

        return (scrollY - minScroll) / (maxScroll - minScroll)
    }

    /**
     * Update the animation progress.
     * @function updateProgress
     * @since 1.0.0
     */
    function updateProgress() {

        let progress = getProgress()

        if (progress > 1) progress = 1
        if (progress < 0) progress = 0

        $.each(propertyName, function (i, property) {

            let name = propertyName[i]
            let fmrt = propertyFormat[i]
            let min = propertyMinValue[i]
            let max = propertyMaxValue[i]

            let el = (Array.isArray(target) ? (target[i] || target[0]) : target)

            el.css(name, fmrt.replace('%v', interpolate(progress, min, max)))
        })
    }

    /**
     * Update animation element measures.
     * @function updateOffsets
     * @since 1.0.0
     */
    function updateOffsets() {

        let offset = element.offset()
        offsetTop = offset.top
        offsetBot = offset.top + element.outerHeight()

        if (scrollbar) {
            offsetTop += scrollbar.scrollTop
            offsetBot += scrollbar.scrollTop
        }
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
            updateOffsets()
            updateProgress()
        })
    }

    /**
     * Update the animation.
     * @function onWindowScroll
     * @since 1.0.0
     */
    function onWindowScroll() {
        updateProgress()
    }

    /**
     * Update
     * @function onWindowLoad
     * @since 1.0.0
     */
    function onWindowLoad() {
        updateOffsets()
        updateProgress()
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

        updateOffsets()
        updateProgress()
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

        updateOffsets()
        updateProgress()
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

    propertyName = element.attr('data-scroll-animation').split(',').map(trim) || ['background-position']
    propertyFormat = element.attr('data-scroll-animation-format').split(',').map(trim) || ['0px %v%']
    propertyMinValue = element.attr('data-scroll-animation-min').split(',').map(trim).map(parseFloat) || [0]
    propertyMaxValue = element.attr('data-scroll-animation-max').split(',').map(trim).map(parseFloat) || [0]

    $(window).on('resize', onWindowResize)
    $(window).on('scroll', onWindowScroll)
    $(window).on('load', onWindowLoad)

    onAttachScrollbar()

    $(scroller).on('attachscrollbar', onAttachScrollbar)
    $(scroller).on('detachscrollbar', onDetachScrollbar)

    updateOffsets()
    updateProgress()
}

/**
 * Creates animations on an element based on the scroll.
 * @author Jean-Philippe Dery (jeanphilippe.dery@jblp.ca)
 * @version 1.0.0
 */

$.attach('[data-scroll-animation]', function (i, element) {
    element.scrollAnimation()
})
