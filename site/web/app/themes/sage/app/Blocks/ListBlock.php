<?php

namespace App\Blocks;

use Cortex;
use CortexBlock;

class ListBlock extends CortexBlock {

	/**
	 * Render and returns the block items using a specified block.
	 * @method render_items
	 * @since 1.0.0
	 */
	protected function render_items($data, $type, $as = 'item') {
		return $this->grab(function() use ($data, $type, $as) {
			foreach ($data as $item) {
				Cortex::render_block($type, array($as => $item));
			}
		});
	}

	/**
	 * Utility method to retrieve echoed content.
	 * @method grab
	 * @since 1.0.0
	 */
	protected function grab($callback) {

		ob_start();
		$callback();
		$contents = ob_get_contents();
		ob_end_clean();

		return $contents;
	}

}