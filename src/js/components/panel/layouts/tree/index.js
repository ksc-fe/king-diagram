import Intact from 'intact';
import Dialog from 'kpc/components/dialog';
import template from './index.vdt';
import mx from '~/mxgraph';
import {graph, findTreeRoot} from '~/utils/graph';

const {mxCompactTreeLayout} = mx;

export default class TreeLayoutDialog extends Dialog {
    @Intact.template()
    static template = template;

    defaults() {
        return {
            ...super.defaults(),
            levelDistance: 30,
            nodeDistance: 30,
            groupPadding: 20,
            type: 'horizontal',
            size: 'mini',
            title: '树形布局',
        }
    }

    ok() {
        const root = findTreeRoot(graph);

        if (root) {
            const {type, levelDistance, nodeDistance, groupPadding} = this.get();
            const layout = new mxCompactTreeLayout(graph, type === 'horizontal');

            layout.nodeDistance = +nodeDistance;
            layout.groupPadding = +groupPadding;
            layout.levelDistance = +levelDistance;
            layout.edgeRouting = false;

            layout.execute(graph.getDefaultParent(), root);
        }
        
        this.close();
    }
}
