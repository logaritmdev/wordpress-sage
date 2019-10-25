import 'jquery'
import './vendors/jquery-global'
import './vendors/modernizr.min'
import './vendors/jquery-scroll-to.min'
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

$.defineMedia('xxxl', '(min-width: 1920px)')
$.defineMedia('xxl', '(min-width: 1600px)')
$.defineMedia('xl', '(min-width: 1200px)')
$.defineMedia('lg', '(min-width: 992px)')
$.defineMedia('md', '(min-width: 768px)')
$.defineMedia('sm', '(min-width: 576px)')
$.defineMedia('xs', '(min-width: 0px)')

/*
 * Enable smooth scrolling.
 */

$(document).smooth()

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
 * Redirects on the new page on pop state
 */

window.addEventListener('popstate', (e) => {
    location.href = document.location
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

/*
 * IE 11 Min Height Flex Fix
 */

if (window.navigator.userAgent.indexOf('Trident/7.0') > 0 ||
    window.navigator.userAgent.indexOf('Trident/6.0') > 0) {

    $('*:not(.no-ie-flex-fix').each((i, element) => {

        element = $(element)

        var timeout = null
        var display = element.css('display')
        var minimum = parseInt(element.css('min-height'))

        if ((display === 'flex' || display === '-ms-flexbox') && minimum > 0) {

            var measure = () => {

                var minimum = parseInt(element.css('min-height'))

                if (minimum > 0) {

                    element.css('height', '')

                    var height = element.get(0).scrollHeight
                    if (height < minimum) {
                        height = minimum
                    }

                    element.css('height', height)

                } else {
                    element.css('height', '')
                }

                timeout = null
            }

            $(window).on('resize', () => {
                if (timeout == null) {
                    timeout = setTimeout(measure, 16)
                }
            })

            measure()
        }
    })
}