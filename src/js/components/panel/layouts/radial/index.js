import Intact from 'intact';
import Dialog from 'kpc/components/dialog';
import template from './index.vdt';
import mx from '~/mxgraph';
import {graph, findTreeRoot} from '~/utils/graph';

const {mxRadialTreeLayout} = mx;

export default class RadialLayoutDialog extends Dialog {
    @Intact.template()
    static template = template;

    defaults() {
        return {
            ...super.defaults(),
            levelDistance: 60,
            nodeDistance: 16,
            size: 'mini',
            title: '放射布局',
        }
    }

    ok() {
        const root = findTreeRoot(graph);
        if (root) {
            const {levelDistance, nodeDistance} = this.get();
            const layout = new mxRadialTreeLayout(graph);

            layout.autoRadius = true;
            layout.nodeDistance = +nodeDistance;
            layout.levelDistance = +levelDistance;
            layout.edgeRouting = false;

            layout.execute(graph.getDefaultParent(), root);
        }

        this.close();
    }
}
