import Intact from 'intact';
import template from './index.vdt';
import {createTempGraph, graph} from '../../utils/graph';
import mx from '../../mxgraph';
import '../../shapes';
import './index.styl';
import {createDropHandler, createPreviewShape, createDragSource} from './createDragSource';

const {mxCell, mxGeometry, mxUtils, mxEvent, mxRectangle} = mx;

const tempGraph = createTempGraph();

export default class Shape extends Intact {
    @Intact.template()
    static template = template;

    defaults() {
        return {
            width: 30,
            height: 30,
            stylesheet: "rounded=0;whiteSpace=wrap;html=1;",
            previewWidth: 120,
            previewHeight: 60,
            value: '',
            basic: false,
        };
    }

    _create() {
        const graph = tempGraph;
        const {width, height, stylesheet, previewWidth, previewHeight, value, basic} = this.get();
        const cells = this.cells = [new mxCell(value, new mxGeometry(0, 0, previewWidth, previewHeight), stylesheet)];
        cells[0].vertex = true;
        graph.view.scaleAndTranslate(1, 0, 0);
        graph.addCells(cells);

        const oNode = graph.view.getCanvas().ownerSVGElement;
        if (!basic) {
            const previewNode = oNode.cloneNode(true);
            previewNode.style.width = `${previewWidth}px`;
            previewNode.style.height = `${previewHeight}px`;
            this.refs.preview.appendChild(previewNode);
        }
        const bounds = graph.getGraphBounds();
        const s = Math.floor(Math.min((width - 2) / bounds.width, (height - 2) / bounds.height) * 100) / 100;
        graph.view.scaleAndTranslate(
            s,
            Math.floor((width - bounds.width * s) / 2 / s - bounds.x),
            Math.floor((height - bounds.height * s) / 2 / s - bounds.y)
        );

        this.refs.container.appendChild(oNode.cloneNode(true));

        graph.getModel().clear();

        if (!basic) {
            this._createDragSource();
        }
    }

    _position() {
        // calculate position of preivew tooltip
        const position = {at: 'right top'};
        const offsetLeft = this.element.offsetLeft;
        const parentWidth = this.element.offsetParent.offsetWidth;
        position.my = `left+${parentWidth - offsetLeft - this.get('width')} top`;
        this.set({position});
    }

    _onClick(e) {
        if (this.get('basic')) return;
        const pt = graph.getFreeInsertPoint();
        this.ds.drop(graph, e, null, pt.x, pt.y, true);
    }

    _getFreeInsertPoint() {
        var view = graph.view;
        var bds = graph.getGraphBounds();
        var pt = graph.getInsertPoint();
        
        // Places at same x-coord and 2 grid sizes below existing graph
        var x = this.snap(Math.round(Math.max(pt.x, bds.x / view.scale - view.translate.x +
            ((bds.width == 0) ? 2 * this.gridSize : 0))));
        var y = this.snap(Math.round(Math.max(pt.y, (bds.y + bds.height) / view.scale - view.translate.y +
            2 * this.gridSize)));
        
        return new mxPoint(x, y);
    }

    _createDragSource() {
        const {previewWidth, previewHeight} = this.get();
        const bounds = new mxRectangle(0, 0, previewWidth, previewHeight);
        const cells = this.cells;
        const preview = createPreviewShape(previewWidth, previewHeight);
        const dropHandler = createDropHandler(cells, true, null, bounds);

        this.ds = createDragSource(this.element, dropHandler, preview, cells, bounds);
    }

    _destroy() {
        tempGraph.destroy();
        const {basic} = this.get();
        if (!basic) {
            this.refs.preview.innerHTML = '';
        }
        this.refs.container.innerHTML = '';
        this.ds.destroy();
    }
}
