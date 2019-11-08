import mx from '../../mxgraph';
import {graph} from '../../utils/graph';

const {mxEvent, mxUtils} = mx;

export function createDragSource(elt, dropHandler, preview, cells, bounds) {
    let freeSourceEdge = null;
    let firstVertex = null;

    for (let i = 0; i < cells.length; i++) {
        const model = graph.model;
        if (firstVertex === null && model.isVertex(cells[i])) {
            firstVertex = i;
        } else if (
            freeSourceEdge === null && 
            model.isVertex(cells[i]) && 
            model.getTerminal(cells[i], true) === null
        ) {
            freeSourceEdge = i;
        }
        if (firstVertex !== null && freeSourceEdge !== null) {
            break;
        }
    }

    const dragSource = mxUtils.makeDraggable(elt, graph, function(graph, evt, target, x, y) {
		// if (cells != null && currentStyleTarget != null && activeArrow == styleTarget) {
			// var tmp = graph.isCellSelected(currentStyleTarget.cell) ? graph.getSelectionCells() : [currentStyleTarget.cell];
			// var updatedCells = this.updateShapes((graph.model.isEdge(currentStyleTarget.cell)) ? cells[0] : cells[firstVertex], tmp);
			// graph.setSelectionCells(updatedCells);
		// } else if (cells != null && activeArrow != null && currentTargetState != null && activeArrow != styleTarget) {
			// var index = (graph.model.isEdge(currentTargetState.cell) || freeSourceEdge == null) ? firstVertex : freeSourceEdge;
			// graph.setSelectionCells(this.dropAndConnect(currentTargetState.cell, cells, direction, index, evt));
		// } else {
			dropHandler.apply(null, arguments);
		// }
	}, preview, 0, 0, graph.autoscroll, true, true);

    dragSource.isGuidesEnabled = function() {
        return graph.graphHandler.guidesEnabled;
    };

    // Stops dragging if cancel is pressed
	graph.addListener(mxEvent.ESCAPE, function(sender, evt) {
		if (dragSource.isActive()) {
			dragSource.reset();
		}
	});

    return dragSource;
}


export function createPreviewShape(width, height) {
    const el = document.createElement('div');
    el.style.width = width + 'px';
    el.style.height = height + 'px';
    el.style.border = '1px dashed #000';

    return el;
}

export function createDropHandler(cells, allowSplit, allowCellsInserted, bounds) {
    allowCellsInserted = (allowCellsInserted != null) ? allowCellsInserted : true;

    return function(graph, evt, target, x, y, force) {
        cells = graph.getImportableCells(cells);

        if (cells.length > 0) {
            graph.stopEditing();

            // Holding alt while mouse is released ignores drop target
            var validDropTarget = (target != null && !mxEvent.isAltDown(evt)) ?
                graph.isValidDropTarget(target, cells, evt) : false;
            var select = null;

            if (target != null && !validDropTarget) {
                target = null;
            }

            if (!graph.isCellLocked(target || graph.getDefaultParent())) {
                graph.model.beginUpdate();
                try {
                    x = Math.round(x);
                    y = Math.round(y);

                    // Splits the target edge or inserts into target group
                    if (allowSplit && graph.isSplitTarget(target, cells, evt)) {
                        var clones = graph.cloneCells(cells);
                        graph.splitEdge(target, clones, null, x - bounds.width / 2, y - bounds.height / 2);
                        select = clones;
                    } else if (cells.length > 0) {
                        select = graph.importCells(cells, x, y, target);
                    }

                    // Executes parent layout hooks for position/order
                    if (graph.layoutManager != null) {
                        var layout = graph.layoutManager.getLayout(target);

                        if (layout != null) {
                            var s = graph.view.scale;
                            var tr = graph.view.translate;
                            var tx = (x + tr.x) * s;
                            var ty = (y + tr.y) * s;

                            for (var i = 0; i < select.length; i++) {
                                layout.moveCell(select[i], tx, ty);
                            }
                        }
                    }

                    if (allowCellsInserted && (evt == null || !mxEvent.isShiftDown(evt))) {
                        graph.fireEvent(new mxEventObject('cellsInserted', 'cells', select));
                    }
                }
                catch (e) {
                    // this.editorUi.handleError(e);
                }
                finally {
                    graph.model.endUpdate();
                }

                if (select != null && select.length > 0) {
                    graph.scrollCellToVisible(select[0]);
                    graph.setSelectionCells(select);
                }

                if (graph.editAfterInsert && evt != null && mxEvent.isMouseEvent(evt) &&
                    select != null && select.length == 1) {
                    window.setTimeout(function() {
                        graph.startEditing(select[0]);
                    }, 0);
                }
            }
        }

        mxEvent.consume(evt);
    }
}
