import mx from '../mx';

const {
	mxGraph,
	mxConstants,
	mxUtils,
	mxConnectionConstraint,
	mxPoint,
	mxRectangle,
	mxEvent,
	mxEventObject,
} = mx;

// Adds support for HTML labels via style. Note: Currently, only the Java
// backend supports HTML labels but CSS support is limited to the following:
// http://docs.oracle.com/javase/6/docs/api/index.html?javax/swing/text/html/CSS.html
// TODO: Wrap should not affect isHtmlLabel output (should be handled later)
// const isHtmlLabel = mxGraph.prototype.isHtmlLabel;
mxGraph.prototype.isHtmlLabel = function(cell) {
	const state = this.view.getState(cell);
	const style = (state != null) ? state.style : this.getCellStyle(cell);

	return (style != null) ? (style['html'] == '1' || style[mxConstants.STYLE_WHITE_SPACE] == 'wrap') : false;
};

/**
 * Overrides method to provide connection constraints for shapes.
 */
mxGraph.prototype.getAllConnectionConstraints = function(terminal, source) {
	if (terminal != null) {
		var constraints = mxUtils.getValue(terminal.style, 'points', null);

		if (constraints != null) {
			// Requires an array of arrays with x, y (0..1), an optional
			// [perimeter (0 or 1), dx, and dy] eg. points=[[0,0,1,-10,10],[0,1,0],[1,1]]
			var result = [];

			try {
				var c = JSON.parse(constraints);

				for (var i = 0; i < c.length; i++) {
					var tmp = c[i];
					result.push(new mxConnectionConstraint(new mxPoint(tmp[0], tmp[1]), (tmp.length > 2) ? tmp[2] != '0' : true,
						null, (tmp.length > 3) ? tmp[3] : 0, (tmp.length > 4) ? tmp[4] : 0));
				}
			} catch (e) {
				// ignore
			}

			return result;
		} else if (terminal.shape != null && terminal.shape.bounds != null) {
			var dir = terminal.shape.direction;
			var bounds = terminal.shape.bounds;
			var scale = terminal.shape.scale;
			var w = bounds.width / scale;
			var h = bounds.height / scale;

			if (dir == mxConstants.DIRECTION_NORTH || dir == mxConstants.DIRECTION_SOUTH) {
				var tmp = w;
				w = h;
				h = tmp;
			}

			constraints = terminal.shape.getConstraints(terminal.style, w, h);

			if (constraints != null) {
				return constraints;
			} else if (terminal.shape.stencil != null && terminal.shape.stencil.constraints != null) {
				return terminal.shape.stencil.constraints;
			} else if (terminal.shape.constraints != null) {
				return terminal.shape.constraints;
			}
		}
	}

	return null;
};

/**
 * Returns a point that specifies the location for inserting cells.
 */
mxGraph.prototype.getInsertPoint = function() {
	var gs = this.getGridSize();
	var dx = this.container.scrollLeft / this.view.scale - this.view.translate.x;
	var dy = this.container.scrollTop / this.view.scale - this.view.translate.y;

	var layout = this.getPageLayout();
	var page = this.getPageSize();
	dx = Math.max(dx, layout.x * page.width);
	dy = Math.max(dy, layout.y * page.height);

	return new mxPoint(this.snap(dx + gs), this.snap(dy + gs));
};

mxGraph.prototype.getFreeInsertPoint = function() {
	var view = this.view;
	var bds = this.getGraphBounds();
	var pt = this.getInsertPoint();

	// Places at same x-coord and 2 grid sizes below existing graph
	var x = this.snap(Math.round(Math.max(pt.x, bds.x / view.scale - view.translate.x +
		((bds.width == 0) ? 2 * this.gridSize : 0))));
	var y = this.snap(Math.round(
		Math.max(pt.y, (bds.y + bds.height) / view.scale - view.translate.y + 2 * this.gridSize)
	));

	return new mxPoint(x, y);
};

/**
 * Returns a rectangle describing the position and count of the
 * background pages, where x and y are the position of the top,
 * left page and width and height are the vertical and horizontal
 * page count.
 */
mxGraph.prototype.getPageLayout = function() {
	var size = this.getPageSize();
	var bounds = this.getGraphBounds();

	if (bounds.width == 0 || bounds.height == 0) {
		return new mxRectangle(0, 0, 1, 1);
	} else {
		// Computes untransformed graph bounds
		var x = Math.ceil(bounds.x / this.view.scale - this.view.translate.x);
		var y = Math.ceil(bounds.y / this.view.scale - this.view.translate.y);
		var w = Math.floor(bounds.width / this.view.scale);
		var h = Math.floor(bounds.height / this.view.scale);

		var x0 = Math.floor(x / size.width);
		var y0 = Math.floor(y / size.height);
		var w0 = Math.ceil((x + w) / size.width) - x0;
		var h0 = Math.ceil((y + h) / size.height) - y0;

		return new mxRectangle(x0, y0, w0, h0);
	}
};

/**
 * Returns the size of the page format scaled with the page size.
 */
mxGraph.prototype.getPageSize = function() {
	return new mxRectangle(0, 0, this.pageFormat.width * this.pageScale, this.pageFormat.height * this.pageScale);
};
/**
 * Handles label changes for XML user objects.
 */
mxGraph.prototype.updateLabelElements = function(cells, fn, tagName) {
	cells = (cells != null) ? cells : this.getSelectionCells();
	var div = document.createElement('div');

	for (var i = 0; i < cells.length; i++) {
		// Changes font tags inside HTML labels
		if (this.isHtmlLabel(cells[i])) {
			var label = this.convertValueToString(cells[i]);

			if (label != null && label.length > 0) {
				div.innerHTML = label;
				var elts = div.getElementsByTagName((tagName != null) ? tagName : '*');

				for (var j = 0; j < elts.length; j++) {
					fn(elts[j]);
				}

				if (div.innerHTML != label) {
					this.cellLabelChanged(cells[i], div.innerHTML);
				}
			}
		}
	}
};

/**
 * Replaces the given element with a span.
 */
mxGraph.prototype.replaceElement = function(elt, tagName) {
	var span = elt.ownerDocument.createElement((tagName != null) ? tagName : 'span');
	var attributes = Array.prototype.slice.call(elt.attributes);

	let attr;
	while (attr = attributes.pop()) {
		span.setAttribute(attr.nodeName, attr.nodeValue);
	}

	span.innerHTML = elt.innerHTML;
	elt.parentNode.replaceChild(span, elt);
};

/**
 * Returns the first ancestor of the current selection with the given name.
 */
mxGraph.prototype.getSelectedElement = function() {
	var node = null;

	if (window.getSelection) {
		var sel = window.getSelection();

		if (sel.getRangeAt && sel.rangeCount) {
			var range = sel.getRangeAt(0);
			node = range.commonAncestorContainer;
		}
	} else if (document.selection) {
		node = document.selection.createRange().parentElement();
	}

	return node;
};

/**
 * Returns the first ancestor of the current selection with the given name.
 */
mxGraph.prototype.getParentByName = function(node, name, stopAt) {
	while (node != null) {
		if (node.nodeName == name) {
			return node;
		}

		if (node == stopAt) {
			return null;
		}

		node = node.parentNode;
	}

	return node;
};

mxGraph.prototype.processElements = function(elt, fn) {
	if (elt != null) {
		var elts = elt.getElementsByTagName('*');

		for (var i = 0; i < elts.length; i++) {
			fn(elts[i]);
		}
	}
};

/**
 * Allows all values in fit.
 */
mxGraph.prototype.connectionArrowsEnabled = true;


/**
 * Adds a connection to the given vertex.
 */
mxGraph.prototype.connectVertex = function(source, direction, length, evt, forceClone, ignoreCellAt) {
	// Ignores relative edge labels
	if (source.geometry.relative && this.model.isEdge(source.parent)) {
		return [];
	}

	ignoreCellAt = (ignoreCellAt) ? ignoreCellAt : false;

	var pt = (source.geometry.relative && source.parent.geometry != null) ?
		new mxPoint(source.parent.geometry.width * source.geometry.x, source.parent.geometry.height * source.geometry.y) :
		new mxPoint(source.geometry.x, source.geometry.y);

	if (direction == mxConstants.DIRECTION_NORTH) {
		pt.x += source.geometry.width / 2;
		pt.y -= length;
	} else if (direction == mxConstants.DIRECTION_SOUTH) {
		pt.x += source.geometry.width / 2;
		pt.y += source.geometry.height + length;
	} else if (direction == mxConstants.DIRECTION_WEST) {
		pt.x -= length;
		pt.y += source.geometry.height / 2;
	} else {
		pt.x += source.geometry.width + length;
		pt.y += source.geometry.height / 2;
	}

	var parentState = this.view.getState(this.model.getParent(source));
	var s = this.view.scale;
	var t = this.view.translate;
	var dx = t.x * s;
	var dy = t.y * s;

	if (parentState != null && this.model.isVertex(parentState.cell)) {
		dx = parentState.x;
		dy = parentState.y;
	}

	// Workaround for relative child cells
	if (this.model.isVertex(source.parent) && source.geometry.relative) {
		pt.x += source.parent.geometry.x;
		pt.y += source.parent.geometry.y;
	}

	// Checks actual end point of edge for target cell
	var target = (ignoreCellAt || (mxEvent.isControlDown(evt) && !forceClone)) ?
		null : this.getCellAt(dx + pt.x * s, dy + pt.y * s);

	if (this.model.isAncestor(target, source)) {
		target = null;
	}

	// Checks if target or ancestor is locked
	var temp = target;

	while (temp != null) {
		if (this.isCellLocked(temp)) {
			target = null;
			break;
		}

		temp = this.model.getParent(temp);
	}

	// Checks if source and target intersect
	if (target != null) {
		var sourceState = this.view.getState(source);
		var targetState = this.view.getState(target);

		if (sourceState != null && targetState != null && mxUtils.intersects(sourceState, targetState)) {
			target = null;
		}
	}

	var duplicate = !mxEvent.isShiftDown(evt) || forceClone;

	if (duplicate) {
		if (direction == mxConstants.DIRECTION_NORTH) {
			pt.y -= source.geometry.height / 2;
		} else if (direction == mxConstants.DIRECTION_SOUTH) {
			pt.y += source.geometry.height / 2;
		} else if (direction == mxConstants.DIRECTION_WEST) {
			pt.x -= source.geometry.width / 2;
		} else {
			pt.x += source.geometry.width / 2;
		}
	}

	// Uses connectable parent vertex if one exists
	if (target != null && !this.isCellConnectable(target)) {
		var parent = this.getModel().getParent(target);

		if (this.getModel().isVertex(parent) && this.isCellConnectable(parent)) {
			target = parent;
		}
	}

	if (target == source || this.model.isEdge(target) || !this.isCellConnectable(target)) {
		target = null;
	}

	var result = [];

	this.model.beginUpdate();
	try {
		var swimlane = target != null && this.isSwimlane(target);
		var realTarget = (!swimlane) ? target : null;

		if (realTarget == null && duplicate) {
			// Handles relative children
			var cellToClone = source;
			var geo = this.getCellGeometry(source);

			while (geo != null && geo.relative) {
				cellToClone = this.getModel().getParent(cellToClone);
				geo = this.getCellGeometry(cellToClone);
			}

			// Handle consistuents for cloning
			cellToClone = this.getCompositeParent(cellToClone);
			realTarget = this.duplicateCells([cellToClone], false)[0];

			var geo = this.getCellGeometry(realTarget);

			if (geo != null) {
				geo.x = pt.x - geo.width / 2;
				geo.y = pt.y - geo.height / 2;
			}

			if (swimlane) {
				this.addCells([realTarget], target, null, null, null, true);
				target = null;
			}
		}

		// Never connects children in stack layouts
		var layout = null;

		if (this.layoutManager != null) {
			layout = this.layoutManager.getLayout(this.model.getParent(source));
		}

		var edge = ((mxEvent.isControlDown(evt) && duplicate) || (target == null && layout != null && layout.constructor == mxStackLayout)) ? null :
			this.insertEdge(this.model.getParent(source), null, '', source, realTarget, this.createCurrentEdgeStyle());

		// Inserts edge before source
		if (edge != null && this.connectionHandler.insertBeforeSource) {
			var index = null;
			var tmp = source;

			while (tmp.parent != null && tmp.geometry != null &&
				tmp.geometry.relative && tmp.parent != edge.parent) {
				tmp = this.model.getParent(tmp);
			}

			if (tmp != null && tmp.parent != null && tmp.parent == edge.parent) {
				var index = tmp.parent.getIndex(tmp);
				this.model.add(tmp.parent, edge, index);
			}
		}

		// Special case: Click on west icon puts clone before cell
		if (target == null && realTarget != null && layout != null && source.parent != null &&
			layout.constructor == mxStackLayout && direction == mxConstants.DIRECTION_WEST) {
			var index = source.parent.getIndex(source);
			this.model.add(source.parent, realTarget, index);
		}

		if (edge != null) {
			result.push(edge);
		}

		if (target == null && realTarget != null) {
			result.push(realTarget);
		}

		if (realTarget == null && edge != null) {
			edge.geometry.setTerminalPoint(pt, false);
		}

		if (edge != null) {
			this.fireEvent(new mxEventObject('cellsInserted', 'cells', [edge]));
		}
	} finally {
		this.model.endUpdate();
	}

	return result;
};

/**
 * Returns the first parent that is not a part.
 */
mxGraph.prototype.isPart = function(cell) {
	return (!this.model.isVertex(cell)) ? false :
		mxUtils.getValue(this.getCurrentCellStyle(cell), 'part', '0') == '1';
};

/**
 * Returns the first parent that is not a part.
 */
mxGraph.prototype.getCompositeParent = function(cell) {
	while (this.isPart(cell)) {
		cell = this.model.getParent(cell);
	}

	return cell;
};

/**
 * Function: getCurrentCellStyle
 * 
 * Returns the style for the given cell from the cell state, if one exists,
 * or using <getCellStyle>.
 * 
 * Parameters:
 * 
 * cell - <mxCell> whose style should be returned as an array.
 * ignoreState - Optional boolean that specifies if the cell state should be ignored.
 */
mxGraph.prototype.getCurrentCellStyle = function(cell, ignoreState) {
	var state = (ignoreState) ? null : this.view.getState(cell);

	return (state != null) ? state.style : this.getCellStyle(cell);
};

/**
 * Duplicates the given cells and returns the duplicates.
 */
mxGraph.prototype.duplicateCells = function(cells, append) {
	cells = (cells != null) ? cells : this.getSelectionCells();
	append = (append != null) ? append : true;

	cells = this.model.getTopmostCells(cells);

	var model = this.getModel();
	var s = this.gridSize;
	var select = [];

	model.beginUpdate();
	try {
		var clones = this.cloneCells(cells, false, null, true);

		for (var i = 0; i < cells.length; i++) {
			var parent = model.getParent(cells[i]);
			var child = this.moveCells([clones[i]], s, s, false)[0];
			select.push(child);

			if (append) {
				model.add(parent, clones[i]);
			} else {
				// Maintains child index by inserting after clone in parent
				var index = parent.getIndex(cells[i]);
				model.add(parent, clones[i], index + 1);
			}
		}
	} finally {
		model.endUpdate();
	}

	return select;
};

mxGraph.prototype.defaultVertexStyle = {};

/**
 * Contains the default style for edges.
 */
mxGraph.prototype.defaultEdgeStyle = {
	'edgeStyle': 'orthogonalEdgeStyle',
	'rounded': '0',
	'jettySize': 'auto',
	'orthogonalLoop': '1'
};

/**
 * Returns the current edge style as a string.
 */
mxGraph.prototype.createCurrentEdgeStyle = function() {
	var style = 'edgeStyle=' + (this.currentEdgeStyle['edgeStyle'] || 'none') + ';';

	if (this.currentEdgeStyle['shape'] != null) {
		style += 'shape=' + this.currentEdgeStyle['shape'] + ';';
	}

	if (this.currentEdgeStyle['curved'] != null) {
		style += 'curved=' + this.currentEdgeStyle['curved'] + ';';
	}

	if (this.currentEdgeStyle['rounded'] != null) {
		style += 'rounded=' + this.currentEdgeStyle['rounded'] + ';';
	}

	if (this.currentEdgeStyle['comic'] != null) {
		style += 'comic=' + this.currentEdgeStyle['comic'] + ';';
	}

	if (this.currentEdgeStyle['jumpStyle'] != null) {
		style += 'jumpStyle=' + this.currentEdgeStyle['jumpStyle'] + ';';
	}

	if (this.currentEdgeStyle['jumpSize'] != null) {
		style += 'jumpSize=' + this.currentEdgeStyle['jumpSize'] + ';';
	}

	// Overrides the global default to match the default edge style
	if (this.currentEdgeStyle['orthogonalLoop'] != null) {
		style += 'orthogonalLoop=' + this.currentEdgeStyle['orthogonalLoop'] + ';';
	} else if (Graph.prototype.defaultEdgeStyle['orthogonalLoop'] != null) {
		style += 'orthogonalLoop=' + Graph.prototype.defaultEdgeStyle['orthogonalLoop'] + ';';
	}

	// Overrides the global default to match the default edge style
	if (this.currentEdgeStyle['jettySize'] != null) {
		style += 'jettySize=' + this.currentEdgeStyle['jettySize'] + ';';
	} else if (Graph.prototype.defaultEdgeStyle['jettySize'] != null) {
		style += 'jettySize=' + Graph.prototype.defaultEdgeStyle['jettySize'] + ';';
	}

	// Special logic for custom property of elbowEdgeStyle
	if (this.currentEdgeStyle['edgeStyle'] == 'elbowEdgeStyle' && this.currentEdgeStyle['elbow'] != null) {
		style += 'elbow=' + this.currentEdgeStyle['elbow'] + ';';
	}

	if (this.currentEdgeStyle['html'] != null) {
		style += 'html=' + this.currentEdgeStyle['html'] + ';';
	} else {
		style += 'html=1;';
	}

	return style;
};

/**
 * Sets the default target for all links in cells.
 */
mxGraph.prototype.defaultEdgeLength = 80;

/**
 * Selects cells for connect vertex return value.
 */
mxGraph.prototype.selectCellsForConnectVertex = function(cells, evt, hoverIcons) {
	// Selects only target vertex if one exists
	if (cells.length == 2 && this.model.isVertex(cells[1])) {
		this.setSelectionCell(cells[1]);
		this.scrollCellToVisible(cells[1]);

		if (hoverIcons != null) {
			// Adds hover icons for cloned vertex or hides icons
			if (mxEvent.isTouchEvent(evt)) {
				hoverIcons.update(hoverIcons.getState(this.view.getState(cells[1])));
			} else {
				hoverIcons.reset();
			}
		}
	} else {
		this.setSelectionCells(cells);
	}
};