import Intact from 'intact';
import template from './index.vdt';
import './index.styl';
import {initStylesheet} from '../../utils/graph';
import mx from '../../mxgraph';

const {mxGraph} = mx;

export default class Diagram extends Intact {
    @Intact.template()
    static template = template;

    _mount() {
        this.graph = new mxGraph(this.element); 
        initStylesheet(this.graph);
        this.graph.setConnectable(true);
		this.graph.setDropEnabled(true);
		this.graph.setPanning(true);
		this.graph.setTooltips(true);
		this.graph.setAllowLoops(true);
		this.graph.allowAutoPanning = true;
		this.graph.resetEdgesOnConnect = false;
		this.graph.constrainChildren = false;
		this.graph.constrainRelativeChildren = true;
		
		// Do not scroll after moving cells
		this.graph.graphHandler.scrollOnMove = false;
		this.graph.graphHandler.scaleGrid = true;
    }

    insertCells(cells) {
        const graph = this.graph;
        graph.model.beginUpdate();
        try {
            graph.importCells(cells);
        } catch (e) {

        } finally {
            graph.model.endUpdate();
        }
    }
}
