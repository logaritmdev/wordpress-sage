//--------------------------------------------------------------------------
// Variables
//--------------------------------------------------------------------------

/**
 * The subscribers data.
 * @var subscribers
 * @since 1.0.0
 */
var subscribers = {}

//--------------------------------------------------------------------------
// Functions
//--------------------------------------------------------------------------

/**
 * Subscribes to a global event.
 * @function subscribe
 * @since 1.0.0
 */
$.subscribe = function (type, listener) {

    type = type.toLowerCase()

    var listeners = subscribers[type]
    if (listeners == null) {
        listeners = subscribers[type] = []
    }

    var index = listeners.indexOf(listener)
    if (index === -1) {
        listeners.push(listener)
    }
}

/**
 * Unsubscribes from a global event.
 * @function unsubscribe
 * @since 1.0.0
 */
$.unsubscribe = function (type, listener) {

    type = type.toLowerCase()

    var listeners = subscribers[type]
    if (listeners == null) {
        listeners = subscribers[type] = []
    }

    var index = listeners.indexOf(listener)
    if (index > -1) {
        listeners.splice(index, 1)
    }
}

/**
 * Publish a global event.
 * @function publish
 * @since 1.0.0
 */
$.publish = function (type) {

    var listeners = subscribers[type]
    if (listeners == null)
        return this

    var args = Array.prototype.slice.call(arguments, 1)

    for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i]
        if (listener) {
            listener.apply(null, args)
        }
    }
}
