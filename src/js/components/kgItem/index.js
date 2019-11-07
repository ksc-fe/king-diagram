import Intact from 'intact';
import template from './index.vdt';
import {createTempGraph, graph} from '../../utils/graph';
import mx from '../../mxgraph';
import '../../shapes/process';
import './index.styl';
import {createDropHandler, createPreviewShape, createDragSource} from './createDragSource';

const {mxCell, mxGeometry, mxUtils, mxEvent, mxRectangle} = mx;

const tempGraph = createTempGraph();

export default class KgItem extends Intact {
    @Intact.template()
    static template = template;

    defaults() {
        return {
            width: 32,
            height: 30,
            stylesheet: "rounded=0;whiteSpace=wrap;html=1;",
            previewWidth: 120,
            previewHeight: 60,
            value: '',
        };
    }

    _create() {
        const graph = tempGraph;
        const {width, height, stylesheet, previewWidth, previewHeight, value} = this.get();
        const cells = this.cells = [new mxCell(value, new mxGeometry(0, 0, previewWidth, previewHeight), stylesheet)];
        cells[0].vertex = true;
        graph.view.scaleAndTranslate(1, 0, 0);
        graph.addCells(cells);

        const oNode = graph.view.getCanvas().ownerSVGElement;
        const previewNode = oNode.cloneNode(true);
        previewNode.style.width = `${previewWidth}px`;
        previewNode.style.height = `${previewHeight}px`;
        this.refs.preview.appendChild(previewNode);

        const bounds = graph.getGraphBounds();
        const s = Math.floor(Math.min((width - 2) / bounds.width, (height - 2) / bounds.height) * 100) / 100;
        graph.view.scaleAndTranslate(
            s,
            Math.floor((width - bounds.width * s) / 2 / s - bounds.x),
            Math.floor((height - bounds.height * s) / 2 / s - bounds.y)
        );

        this.refs.container.appendChild(oNode.cloneNode(true));

        graph.getModel().clear();

        this._createDragSource();
    }

    _position() {
        // calculate position of preivew tooltip
        const position = {at: 'right top'};
        const offsetLeft = this.element.offsetLeft;
        const parentWidth = this.element.offsetParent.offsetWidth;
        position.my = `left+${parentWidth - offsetLeft - this.get('width')} top`;
        this.set({position});
    }

    _onMouseUp() {
        graph.model.beginUpdate();
        try {
            graph.importCells(this.cells);
        } catch (e) {

        } finally {
            graph.model.endUpdate();
        }
    }

    _createDragSource() {
        const {previewWidth, previewHeight} = this.get();
        const bounds = new mxRectangle(0, 0, previewWidth, previewHeight);
        const cells = this.cells;
        const preview = createPreviewShape(previewWidth, previewHeight);
        const dropHandler = createDropHandler(cells, true, null, bounds);

        createDragSource(this.element, dropHandler, preview, cells, bounds);
    }

    _createDropHandler(cells, allowSplit, allowCellsIn) {
        let elt = force ? null : (mxEvent.isTouchEvent(evt) || mxEvent.isPenEvent(evt)) ?
            document.elementFromPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt)) :
            mxEvent.getSource(evt);
        while (elt && elt !== this.container) {
            elt = elt.parentNode;
        }
    }

    _createDragPreview() {
        const {previewWidth, previewHeight} = this.get();

        const el = document.createElement('div');
        el.style.width = previewWidth + 'px';
        el.style.height = previewHeight + 'px';

        return el;
    }

    // Stops dragging if cancel is pressed
    _resetOnCancel(dragSource) {
		graph.addListener(mxEvent.ESCAPE, function(sender, evt) {
			if (dragSource.isActive()) {
				dragSource.reset();
			}
		});
    }

    // Overrides mouseDown to ignore popup triggers
    _overrideMouseDown(dragSource) {
        var mouseDown = dragSource.mouseDown;

        dragSource.mouseDown = function(evt) {
            if (!mxEvent.isPopupTrigger(evt) && !mxEvent.isMultiTouchEvent(evt)) {
                graph.stopEditing();
                mouseDown.apply(this, arguments);
            }
        };
    }
}
