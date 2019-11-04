import Intact from 'intact';
import template from './index.vdt';

export default class Editor extends Intact {
    @Intact.template()
    static template = template;

    defaults() {
        return {
            sidebarWidth: '250px',
        }
    }

    _onDragEnd(item) {
        this.refs.diagram.insertCells(item.cells);
    }
}
