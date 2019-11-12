import {graph} from '../../utils/graph';
import mx from '../../mxgraph';

const {mxUtils, mxConstants} = mx;

export default function getState() {
    var cells = graph.getSelectionCells();
	var result = initSelectionState();

	for (var i = 0; i < cells.length; i++) {
		updateSelectionStateForCell(result, cells[i], cells);
	}

	return result;
}

function initSelectionState() {
    return {
		vertices: [],
		edges: [],
		x: null,
		y: null,
		width: null,
		height: null,
		style: {},
		containsImage: false,
		containsLabel: false,
		fill: true,
		glass: true,
		rounded: true,
		comic: true,
		autoSize: false,
		image: true,
		shadow: true,
		lineJumps: true
	};
}

function updateSelectionStateForCell(result, cell, cells) {
    if (graph.getModel().isVertex(cell)) {
		result.vertices.push(cell);
		var geo = graph.getCellGeometry(cell);

		if (geo != null) {
			if (geo.width > 0) {
				if (result.width == null) {
					result.width = geo.width;
				} else if (result.width != geo.width) {
					result.width = '';
				}
			} else {
				result.containsLabel = true;
			}

			if (geo.height > 0) {
				if (result.height == null) {
					result.height = geo.height;
				} else if (result.height != geo.height) {
					result.height = '';
				}
			} else {
				result.containsLabel = true;
			}

			if (!geo.relative || geo.offset != null) {
				var x = (geo.relative) ? geo.offset.x : geo.x;
				var y = (geo.relative) ? geo.offset.y : geo.y;

				if (result.x == null) {
					result.x = x;
				} else if (result.x != x) {
					result.x = '';
				}

				if (result.y == null) {
					result.y = y;
				} else if (result.y != y) {
					result.y = '';
				}
			}
		}
	} else if (graph.getModel().isEdge(cell)) {
		result.edges.push(cell);
	}

    var state = graph.view.getState(cell);

	if (state != null) {
		result.autoSize = result.autoSize || isAutoSizeState(state);
		result.glass = result.glass && isGlassState(state);
		result.rounded = result.rounded && isRoundedState(state);
		result.lineJumps = result.lineJumps && isLineJumpState(state);
		result.comic = result.comic && isComicState(state);
		result.image = result.image && isImageState(state);
		result.shadow = result.shadow && isShadowState(state);
		result.fill = result.fill && isFillState(state);

		var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
		result.containsImage = result.containsImage || shape == 'image';

		for (var key in state.style) {
			var value = state.style[key];

			if (value != null) {
				if (result.style[key] == null) {
					result.style[key] = value;
				} else if (result.style[key] != value) {
					result.style[key] = '';
				}
			}
		}
	}
}

function isAutoSizeState(state) {
    return mxUtils.getValue(state.style, mxConstants.STYLE_AUTOSIZE, null) == '1';
}

function isGlassState(state) {
    var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

    return (shape == 'label' || shape == 'rectangle' || shape == 'internalStorage' ||
        shape == 'ext' || shape == 'umlLifeline' || shape == 'swimlane' ||
        shape == 'process');
}

function isRoundedState(state) {
    return state.shape != null ? state.shape.isRoundable() :
        mxUtils.indexOf(
            this.roundableShapes, 
            mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null)
        ) >= 0;
}

function isLineJumpState(state) {
    var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
	var curved = mxUtils.getValue(state.style, mxConstants.STYLE_CURVED, false);

	return !curved && (shape == 'connector' || shape == 'filledEdge');
}

function isComicState(state) {
    var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

	return mxUtils.indexOf(['label', 'rectangle', 'internalStorage', 'corner', 'parallelogram', 'note', 'collate',
		'swimlane', 'triangle', 'trapezoid', 'ext', 'step', 'tee', 'process', 'link', 'rhombus',
		'offPageConnector', 'loopLimit', 'hexagon', 'manualInput', 'singleArrow', 'doubleArrow',
		'flexArrow', 'filledEdge', 'card', 'umlLifeline', 'connector', 'folder', 'component', 'sortShape',
		'cross', 'umlFrame', 'cube', 'isoCube', 'isoRectangle', 'partialRectangle'
	], shape) >= 0;
}

function isImageState(state) {
    var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

	return (shape === 'label' || shape === 'image');
}

function isShadowState(state) {
    var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

	return shape !== 'image';
}

function isFillState(state) {
    return state.view.graph.model.isVertex(state.cell) ||
		mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) == 'arrow' ||
		mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) == 'filledEdge' ||
		mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) == 'flexArrow';
}
