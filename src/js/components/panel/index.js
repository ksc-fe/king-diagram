import Intact from 'intact';
import template from './index.vdt';
import './index.styl';

export default class Panel extends Intact {
    @Intact.template()
    static template = template;

    defaults() {
        return {
            show: true,
        };
    }

    _toggle() {
        this.set('show', !this.get('show'));
    }
}
