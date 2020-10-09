
import './export'
import './plugins/jquery-util'
import './plugins/jquery-css-events'
import './plugins/jquery-media-events'
import './plugins/jquery-attach'
import './plugins/jquery-publish'
import './plugins/jquery-loading'
import './plugins/jquery-scroll-smoother'
import './plugins/jquery-scroll-anchor'
import './plugins/jquery-scroll-animation'
import './plugins/jquery-scroll-watch'
import './plugins/jquery-slider'
import './plugins/jquery-break-lines'
import './plugins/jquery-break-words'
import './main-layout'
import './image'
import './video'
import './form'
import './wysiwyg'

$.defineMedia('xxxl', 1920)
$.defineMedia('xxl', 1600)
$.defineMedia('xl', 1440)
$.defineMedia('lg', 1024)
$.defineMedia('md', 768)
$.defineMedia('sm', 575)
$.defineMedia('xs', 375)

/*
 * Enable smooth scrolling.
 */

$(document).smoothScroll('y')

/*
 * Disables animations during previews
 */

if ($(document.body).hasClass('preview')) {

    $(document.body).addClass('ready')
    $(document.body).addClass('loaded')
    $(document.body).addClass('loaded-enough')

    $('[data-preload]')
        .addClass('loaded')
        .addClass('loaded-enough')

    $('[data-watch]').each((i, element) => {

        element = $(element)

        var classname = element.attr('data-watch-class')
        if (classname == null ||
            classname == '') {
            classname = 'visible-on-screen'
        }

        element.addClass(classname)

    })

    $(document.body).trigger('ready')
}

/*
 * Forces some browsers to reload when back is pressed otherwise
 * we might be stuck on the loading screen.
 */

$(window).on('pageshow', function (event) {
    if (event.originalEvent.persisted) {
        window.location.reload()
    }
})
