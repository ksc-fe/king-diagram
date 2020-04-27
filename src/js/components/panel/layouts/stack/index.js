import Intact from 'intact';
import Dialog from 'kpc/components/dialog';
import template from './index.vdt';
import mx from '~/mxgraph';
import {graph} from '~/utils/graph';

const {mxStackLayout} = mx;

export default class StackLayoutDialog extends Dialog {
    @Intact.template()
    static template = template;

    defaults() {
        return {
            ...super.defaults(),
            border: 20,
            spacing: 30, 
            type: 'horizontal',
            size: 'mini',
            title: '水平布局',
        }
    }

    _init() {
        super._init();
        const {type} = this.get();
        if (type === 'vertical') {
            this.set('title', '垂直布局');
        }
    }

    ok() {
        const {type, border, spacing} = this.get();
        const layout = new mxStackLayout(graph, type === 'horizontal');

        layout.spacing = +spacing;
        layout.border = +border;

        layout.execute(graph.getDefaultParent(), graph.getSelectionCells());

        this.close();
    }
}
