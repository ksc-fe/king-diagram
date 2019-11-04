import Intact from 'intact';
import template from './index.vdt';
import './index.styl';
import mx, {initStylesheet} from '../../utils/mxgraph';

const {mxGraph} = mx;

export default class Diagram extends Intact {
    @Intact.template()
    static template = template;

    _mount() {
        this.graph = new mxGraph(this.element); 
        initStylesheet(this.graph);
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
