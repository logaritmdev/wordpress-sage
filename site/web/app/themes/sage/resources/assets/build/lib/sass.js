const fs = require('fs')
const path = require('path')
const graph = require('sass-graph')
const through = require('through2')
const config = require('../gulpfile.config')
const files = {}

/**
 * Returns the file modification time.
 * @function fdeps
 * @since 1.0.0
 */
const fdeps = (file) => {

	let options = {
		loadPaths: [
			path.join(config.paths.assets, 'styles')
		]
	}

	let result = graph.parseFile(file, options)
	if (result &&
		result.index[file] &&
		result.index[file].imports) {
		return result.index[file].imports
	}

	return []
}

/**
 * Returns the file modification time.
 * @function ftime
 * @since 1.0.0
 */
const ftime = (src) => {
	return fs.statSync(src).mtime.getTime()
}

/**
 * Returns the file modification time.
 * @function ftime
 * @since 1.0.0
 */
const collect = (file) => {

	if (files[file] == null) {
		files[file] = {
			time: ftime(file),
			deps: fdeps(file)
		}
	}

	for (let dep of files[file].deps) {
		collect(dep)
	}
}

/**
 * Check whether a file or one of its dependency changed.
 * @function check
 * @since 1.0.0
 */
const check = (file) => {

	let data = files[file]
	if (data == null) {
		throw new Error('uh oh')
	}

	let time = ftime(file)
	if (time != data.time) {
		return true
	}

	for (let dep of data.deps) {
		let newer = check(dep)
		if (newer) {
			return true
		}
	}

	return false
}

module.exports = () => through.obj(function (file, enc, callback) {

	/*
	 * The file has not been processed before, we assume
	 * it has changed and we compile it.
	 */

	if (files[file.path] == null) {
		collect(file.path)
		callback(null, file)
		return
	}

	let time = ftime(file.path)

	/*
	 * The file has been processed before but its modification
	 * time has changed, compile it.
	 */

	if (files[file.path].time != time) {
		files[file.path].time = time
		files[file.path].deps = fdeps(file.path)
		callback(null, file)
		return
	}

	/*
	 * At this point we check if a dependency has changed to
	 * recompile this file
	 */

	for (let dep of files[file.path].deps) {
		let newer = check(dep)
		if (newer) {
			callback(null, file)
			return
		}
	}

	this.emit('end')
})
