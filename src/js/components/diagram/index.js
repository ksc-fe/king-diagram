import Intact from 'intact';
import template from './index.vdt';
import './index.styl';
import {graph} from '../../utils/graph';
import mx from '../../mxgraph';

const {mxGraph, mxRubberband} = mx;

export default class Diagram extends Intact {
    @Intact.template()
    static template = template;

    _mount() {
        graph.init(this.element);
    }
    
    _destroy() {
        graph.destroy();
    }
}
