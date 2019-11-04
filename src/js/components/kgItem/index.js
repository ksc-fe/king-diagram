import Intact from 'intact';
import template from './index.vdt';
import mx, {createTempGraph} from '../../utils/mxgraph';
import '../../shapes/process';
// import {mxCell, mxGeometry, mxGraph} from '../../utils/Graph';
import './index.styl';

const {mxCell, mxGeometry, mxGraph} = mx;

const graph = createTempGraph();

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
        this.trigger('dragend', this);
    }
}
