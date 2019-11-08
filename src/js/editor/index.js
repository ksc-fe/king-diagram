import Intact from 'intact';
import template from './index.vdt';
import {graph} from '../utils/graph';
import './index.styl';

const {mxKeyHandler} = mx;

export default class Editor extends Intact {
    @Intact.template()
    static template = template;

    defaults() {
        return {
            sidebarWidth: '250px',
        }
    }

    _mount() {
        const keyHandler = new mxKeyHandler(graph);
    }
}
