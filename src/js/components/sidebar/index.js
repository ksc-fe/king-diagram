import Intact from 'intact';
import template from './index.vdt';
import './index.styl';
import commonShapes from '../../data/commonShapes';

export default class Sidebar extends Intact {
    @Intact.template()
    static template = template;

    _init() {
        this.set({
            commonShapes,
        });
    }

    _onDragEnd(item) {
        this.trigger('dragend', item);
    }
}
