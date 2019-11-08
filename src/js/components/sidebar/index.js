import Intact from 'intact';
import template from './index.vdt';
import './index.styl';
import commonShapes from '../../data/commonShapes';

export default class Sidebar extends Intact {
    @Intact.template()
    static template = template;

    defaults() {
        return {
            shapeType: 'basic',
        };
    }

    _init() {
        this.set({
            commonShapes,
        });
    }
}
