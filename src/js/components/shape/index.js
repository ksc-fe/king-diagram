import Intact from 'intact';
import template from './index.vdt';
import {
    createTempGraph,
    graph
} from '../../utils/graph';
import mx from '../../mxgraph';
import '../../shapes';
import './index.styl';
import {
    createDropHandler,
    createPreviewShape,
    createDragSource
} from './createDragSource';

const {
    mxCell,
    mxGeometry,
    mxRectangle,
    mxPoint
} = mx;

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
            edge: false,
            cell: undefined,
        };
    }

    _create() {
        const graph = tempGraph;
        const {
            width,
            height,
            stylesheet,
            previewWidth,
            previewHeight,
            value,
            basic,
            edge,
            cell,
        } = this.get();

        if (cell) {
            this.cells = [cell];
        } else {
            const cell = new mxCell(value, new mxGeometry(0, 0, previewWidth, previewHeight), stylesheet);
            this.cells = [cell];
            if (!edge) {
                cell.vertex = true;
            } else {
                cell.geometry.setTerminalPoint(new mxPoint(0, previewWidth), true);
                cell.geometry.setTerminalPoint(new mxPoint(previewHeight, 0), false);
                cell.geometry.relative = true;
                cell.edge = true;
            }
        }
        const cells = this.cells;
        
        const padding = 10;
        graph.view.scaleAndTranslate(1, padding, padding);
        graph.addCells(cells);
        
        const oNode = graph.view.getCanvas().ownerSVGElement;
        if (!basic) {
            const previewNode = oNode.cloneNode(true);
            const bounds = graph.getGraphBounds();
            previewNode.style.width = `${bounds.width + 2 * padding}px`;
            previewNode.style.height = `${bounds.height + 2 * padding}px`;
            // previewNode.style.width = `${bounds.width + bounds.x}px`;
            // previewNode.style.height = `${bounds.height + bounds.y}px`;
            this.refs.preview.appendChild(previewNode);
        }
        graph.view.setTranslate(0, 0);
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
        const position = {
            at: 'right top'
        };
        const offsetLeft = this.element.offsetLeft;
        const parentWidth = this.element.offsetParent.offsetWidth;
        position.my = `left+${parentWidth - offsetLeft - this.get('width')} top`;
        this.set({
            position
        });
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
        const {
            previewWidth,
            previewHeight
        } = this.get();
        const bounds = new mxRectangle(0, 0, previewWidth, previewHeight);
        const cells = this.cells;
        const preview = createPreviewShape(previewWidth, previewHeight);
        const dropHandler = createDropHandler(cells, true, null, bounds);

        this.ds = createDragSource(this.element, dropHandler, preview, cells, bounds);
    }

    _destroy() {
        tempGraph.destroy();
        const {
            basic
        } = this.get();
        if (!basic) {
            this.refs.preview.innerHTML = '';
        }
        this.refs.container.innerHTML = '';
        this.ds.destroy();
    }
}
