import Intact from 'intact';
import template from './index.vdt';
import './index.styl';

export default class KdIcon extends Intact {
    @Intact.template()
    static template = template;

    defaults() {
        return {
            size: undefined
        };
    }
}
