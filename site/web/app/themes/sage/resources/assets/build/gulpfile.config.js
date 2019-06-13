const fs = require('fs')
const path = require('path')
const util = require('gulp-util')

/**
 * The root directory.
 * @const root
 * @since 1.0.0
 */
const root = process.cwd()

/**
 * Wheher the environment is production.
 * @const prod
 * @since 1.0.0
 */
const prod = !!util.env.production

/**
 * Absolutes paths.
 * @const paths
 * @since 1.0.0
 */
const paths = {
	root: path.resolve(root),
	dist: path.resolve(root, 'dist'),
	assets: path.resolve(root, 'resources/assets'),
	blocks: path.resolve(root, 'resources/blocks'),
}

module.exports = {

	prod: prod,

	paths: paths,

	files: {

		styles: [{
			src: path.join(paths.root, 'resources/assets/styles/main.scss'),
			dst: path.join(paths.dist, 'styles')
		}],

		scripts: [{
			src: path.join(paths.root, 'resources/assets/scripts/main.js'),
			dst: path.join(paths.dist, 'scripts')
		}]

	},

	urls: {
		proxy: 'http://localhost:3000',
		local: 'http://example.test'
	},

	features: {
		prefix: prod,
		optimize: prod,
		sourcemap: true
	},

	blocks: fs.readdirSync(paths.blocks).map(file => path.join(paths.blocks, file)).filter(file => fs.lstatSync(file).isDirectory())
}