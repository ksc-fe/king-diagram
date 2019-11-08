import Intact from 'intact';
import template from './index.vdt';
import './index.styl';

export default class Line extends Intact {
    @Intact.template()
    static template = template;

    default() {
        return {
            height: undefined
        }
    }
}
