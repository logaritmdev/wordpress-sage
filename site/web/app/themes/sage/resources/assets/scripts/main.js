import 'jquery'
import scrollTo from './vendors/jquery-scroll-to.min'
import './vendors/jquery-global'
import './vendors/modernizr.min'
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
import './image'
import './video'
import './form'
import './wysiwyg'
import './main-layout'

$.defineMedia('xs', '(max-width: 375px)')
$.defineMedia('sm', '(max-width: 575px)')
$.defineMedia('md', '(max-width: 768px)')
$.defineMedia('lg', '(max-width: 1024px)')
$.defineMedia('xl', '(max-width: 1200px)')
$.defineMedia('xxl', '(max-width: 1600px)')
$.defineMedia('xxxl', '(max-width: 1920px)')

/*
 * Exposes scrollTo
 */

$.scrollTo = $.fn.scrollTo = scrollTo

/*
 * Enable smooth scrolling.
 */

$(document).smoothScroll()

/*
 * Adds the ready body class when the document is loaded enough.
 */

$(document.body).on('loading/loadedenough', (e) => {
    setTimeout(() => {
        $(document.body).addClass('ready')
        $(document.body).trigger('ready')
    }, 1000)
})

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
