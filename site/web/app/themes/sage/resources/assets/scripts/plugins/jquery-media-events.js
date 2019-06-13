const medias = {}
const on = $.fn.on
const once = $.fn.once

/**
 * Defines a new media size.
 * @function defineMedia
 * @since 1.0.0
 */
$.defineMedia = function (name, media) {
	if (medias[media] == null) {
		medias[media] = name
		matchMedia(media).addListener(onMediaMatch)
	}
}

/**
 * @function on
 * @since 1.0.0
 * @hidden
 */
$.fn.on = function (type, callback) {

	if (type === 'medialeave') {
		$.each(medias, function (q, name) {
			let mql = matchMedia(q)
			if (mql.matches == false) {
				callback('medialeave', medias[mql.media], mql)
			}
		})
	}

	return on.apply(this, arguments)
}

/**
 * @function once
 * @since 1.0.0
 * @hidden
 */
$.fn.once = function (type, callback) {

	if (type === 'medialeave') {
		$.each(medias, function (q, name) {
			let mql = matchMedia(q)
			if (mql.matches == false) {
				callback('medialeave', medias[mql.media], mql)
			}
		})
	}

	return once.apply(this, arguments)
}

/**
 * Media change callback.
 * @function onMediaMatch
 * @since 1.0.0
 */
function onMediaMatch(mql) {
	if (mql.matches) {
		$(window).emit('mediaenter', medias[mql.media], mql)
	} else {
		$(window).emit('medialeave', medias[mql.media], mql)
	}
}

/**
 * @function onMediaEnter
 * @since 1.0.0
 * @hidden
 */
function onMediaEnter(e, media) {
	$('html').addClass('media-' + media)
}

/**
 * @function onMediaLeave
 * @since 1.0.0
 * @hidden
 */
function onMediaLeave(e, media) {
	$('html').removeClass('media-' + media)
}

/**
 * @function onReady
 * @since 1.0.0
 * @hidden
 */
function onReady() {

	/*
	 * Executes this on a domready event to give some time
	 * to define some media sizes
	 */

	$.each(medias, function (q, name) {

		/*
		 * Starting from the largest media, goes down until the
		 * media is matched, trigger medialeave event until
		 * we find a matched media
		 */

		let mql = matchMedia(q)
		if (mql.matches == false) {
			$(window).emit('medialeave', medias[mql.media], mql)
		}
	})

	$.each(Object.keys(medias).reverse(), function (i, key) {

		/*
		 * Adds css classes in the html element to describe which medias
		 * are currently matched. This is mostly for debugging.
		 */

		var mql = matchMedia(key)
		if (mql.matches) {
			$('html').addClass('media-' + medias[key])
		}
	})
}

$(window).on('mediaenter', onMediaEnter)
$(window).on('medialeave', onMediaLeave)
$(onReady)


/**
 * @function matchMedia
 * @since 1.0.0
 */
var matchMedia = (function (win) {
	'use strict';
	var _doc = win.document, _viewport = _doc.documentElement, _queries = [], _queryID = 0, _type = '', _features = {}, _typeExpr = /\s*(only|not)?\s*(screen|print|[a-z\-]+)\s*(and)?\s*/i, _mediaExpr = /^\s*\(\s*(-[a-z]+-)?(min-|max-)?([a-z\-]+)\s*(:?\s*([0-9]+(\.[0-9]+)?|portrait|landscape)(px|em|dppx|dpcm|rem|%|in|cm|mm|ex|pt|pc|\/([0-9]+(\.[0-9]+)?))?)?\s*\)\s*$/, _timer = 0, _matches = function (media) {
		var mql = media.indexOf(',') !== -1 && media.split(',') || [media], mqIndex = mql.length - 1, mqLength = mqIndex, mq = null, negateType = null, negateTypeFound = '', negateTypeIndex = 0, negate = false, type = '', exprListStr = '', exprList = null, exprIndex = 0, exprLength = 0, expr = null, prefix = '', length = '', unit = '', value = '', feature = '', match = false;
		if (media === '') {
			return true;
		}
		do {
			mq = mql[mqLength - mqIndex];
			negate = false;
			negateType = mq.match(_typeExpr);
			if (negateType) {
				negateTypeFound = negateType[0];
				negateTypeIndex = negateType.index;
			}
			if (!negateType || mq.substring(0, negateTypeIndex).indexOf('(') === -1 && (negateTypeIndex || !negateType[3] && negateTypeFound !== negateType.input)) {
				match = false;
				continue;
			}
			exprListStr = mq;
			negate = negateType[1] === 'not';
			if (!negateTypeIndex) {
				type = negateType[2];
				exprListStr = mq.substring(negateTypeFound.length);
			}
			match = type === _type || type === 'all' || type === '';
			exprList = exprListStr.indexOf(' and ') !== -1 && exprListStr.split(' and ') || [exprListStr];
			exprIndex = exprList.length - 1;
			exprLength = exprIndex;
			if (match && exprIndex >= 0 && exprListStr !== '') {
				do {
					expr = exprList[exprIndex].match(_mediaExpr);
					if (!expr || !_features[expr[3]]) {
						match = false;
						break;
					}
					prefix = expr[2];
					length = expr[5];
					value = length;
					unit = expr[7];
					feature = _features[expr[3]];
					if (unit) {
						if (unit === 'px') {
							value = Number(length);
						} else if (unit === 'em' || unit === 'rem') {
							value = 16 * length;
						} else if (expr[8]) {
							value = (length / expr[8]).toFixed(2);
						} else if (unit === 'dppx') {
							value = length * 96;
						} else if (unit === 'dpcm') {
							value = length * 0.3937;
						} else {
							value = Number(length);
						}
					}
					if (prefix === 'min-' && value) {
						match = feature >= value;
					} else if (prefix === 'max-' && value) {
						match = feature <= value;
					} else if (value) {
						match = feature === value;
					} else {
						match = !!feature;
					}
					if (!match) {
						break;
					}
				} while (exprIndex--);
			}
			if (match) {
				break;
			}
		} while (mqIndex--);
		return negate ? !match : match;
	}, _setFeature = function () {
		var w = win.innerWidth || _viewport.clientWidth, h = win.innerHeight || _viewport.clientHeight, dw = win.screen.width, dh = win.screen.height, c = win.screen.colorDepth, x = win.devicePixelRatio;
		_features.width = w;
		_features.height = h;
		_features['aspect-ratio'] = (w / h).toFixed(2);
		_features['device-width'] = dw;
		_features['device-height'] = dh;
		_features['device-aspect-ratio'] = (dw / dh).toFixed(2);
		_features.color = c;
		_features['color-index'] = Math.pow(2, c);
		_features.orientation = h >= w ? 'portrait' : 'landscape';
		_features.resolution = x && x * 96 || win.screen.deviceXDPI || 96;
		_features['device-pixel-ratio'] = x || 1;
	}, _watch = function () {
		clearTimeout(_timer);
		_timer = setTimeout(function () {
			var query = null, qIndex = _queryID - 1, qLength = qIndex, match = false;
			if (qIndex >= 0) {
				_setFeature();
				do {
					query = _queries[qLength - qIndex];
					if (query) {
						match = _matches(query.mql.media);
						if (match && !query.mql.matches || !match && query.mql.matches) {
							query.mql.matches = match;
							if (query.listeners) {
								for (var i = 0, il = query.listeners.length; i < il; i++) {
									if (query.listeners[i]) {
										query.listeners[i].call(win, query.mql);
									}
								}
							}
						}
					}
				} while (qIndex--);
			}
		}, 10);
	}, _init = function () {
		var head = _doc.getElementsByTagName('head')[0], style = _doc.createElement('style'), info = null, typeList = [
			'screen',
			'print',
			'speech',
			'projection',
			'handheld',
			'tv',
			'braille',
			'embossed',
			'tty'
		], typeIndex = 0, typeLength = typeList.length, cssText = '#mediamatchjs { position: relative; z-index: 0; }', eventPrefix = '', addEvent = win.addEventListener || (eventPrefix = 'on') && win.attachEvent;
		style.type = 'text/css';
		style.id = 'mediamatchjs';
		head.appendChild(style);
		info = win.getComputedStyle && win.getComputedStyle(style) || style.currentStyle;
		for (; typeIndex < typeLength; typeIndex++) {
			cssText += '@media ' + typeList[typeIndex] + ' { #mediamatchjs { position: relative; z-index: ' + typeIndex + ' } }';
		}
		if (style.styleSheet) {
			style.styleSheet.cssText = cssText;
		} else {
			style.textContent = cssText;
		}
		_type = typeList[info.zIndex * 1 || 0];
		head.removeChild(style);
		_setFeature();
		addEvent(eventPrefix + 'resize', _watch);
		addEvent(eventPrefix + 'orientationchange', _watch);
	};
	_init();
	return function (media) {
		var id = _queryID, mql = {
			matches: false,
			media: media,
			addListener: function addListener(listener) {
				_queries[id].listeners || (_queries[id].listeners = []);
				listener && _queries[id].listeners.push(listener);
			},
			removeListener: function removeListener(listener) {
				var query = _queries[id], i = 0, il = 0;
				if (!query) {
					return;
				}
				il = query.listeners.length;
				for (; i < il; i++) {
					if (query.listeners[i] === listener) {
						query.listeners.splice(i, 1);
					}
				}
			}
		};
		if (media === '') {
			mql.matches = true;
			return mql;
		}
		mql.matches = _matches(media);
		_queryID = _queries.push({
			mql: mql,
			listeners: null
		});
		return mql;
	};
}(window));
