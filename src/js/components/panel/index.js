import Intact from 'intact';
import template from './index.vdt';
import './index.styl';
import {graph} from '../../utils/graph';
import mx from '../../mxgraph';
import getState from './getState';

const {mxEvent, mxConstants} = mx;

export default class Panel extends Intact {
    @Intact.template()
    static template = template;

    defaults() {
        return {
            show: true,
            state: null,
            // expandedKeys: [],
            expandedKeys: ['style', 'text', 'layout'],
        };
    }

    _mount() {
        graph.getSelectionModel().addListener(mxEvent.CHANGE, this._refresh);
    }

    _toggle() {
        this.set('show', !this.get('show'));
    }

    _refresh() {
        if (graph.isSelectionEmpty()) {
            this.set({state: null, expandedKeys: []});
        } else if (graph.isEditing()) {
            console.log('isEditing');
        } else {
            console.log(getState());
            this.set({
                state: getState(),
                expandedKeys: ['style', 'text', 'layout']
            });
        }
    }

    _getStrokeColor() {
        const state = this.get('state');
        if (!state) return;

        const strokeKey = state.style.shape === 'image' ? mxConstants.STYLE_IMAGE_BORDER : mxConstants.STYLE_STROKECOLOR;
        return state.style[strokeKey];
    }

    _getStrokeStyle() {
        const state = this.get('state');
        if (!state) return;

        const {style} = state;
        if (style[mxConstants.STYLE_DASHED] === 1) {
            if (!style[mxConstants.STYLE_DASH_PATTERN]) {
                return 'dashed';
            } else {
                return 'dotted';
            }
        } else  {
            return 'solid';
        }
    }
}
