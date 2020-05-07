import Intact from 'intact';
import template from './index.vdt';
import './index.styl';
import {graph} from '../../utils/graph';
import mx from '../../mxgraph';
import getState from './getState';
import getStyle from './getStyle';

const {mxEvent, mxConstants, mxUtils, mxClient, mxCircleLayout} = mx;

function saveSelection() {
    if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0);
        }
    } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
    }
    return null;
}

function restoreSelection(range) {
    if (range) {
        if (window.getSelection) {
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (document.selection && range.select) {
            range.select();
        }
    }
}

export default class Panel extends Intact {
    @Intact.template()
    static template = template;

    defaults() {
        return {
            show: true,
            state: null,
            // expandedKeys: [],
            expandedKeys: ['style', 'text', 'layout'],
            isEditing: false,
            cssStyle: null,
        };
    }

    _mount() {
        graph.getSelectionModel().addListener(mxEvent.CHANGE, this._refresh);

        // preventDefault for Select and Colorpicker dropdown menu on mousedown
        const save = this._save = (e) => {
            e.stopPropagation();
            if (document.activeElement === graph.cellEditor.textarea) {
                this.selState = saveSelection();
            }
        };
        (this.selectDropdown = this.refs.fontFamily.refs.menu.refs.menu.element)
            .addEventListener('mousedown', this._preventDefault);
        const colorpickerDropdown = this.colorpickerDropdown =
            this.refs.fontColor.vdt.vNode.children[1].children.refs.menu.element;
        colorpickerDropdown.addEventListener('mousedown', (this._saveForColor = (e) => {
            if (e.target.tagName === 'INPUT') {
                save(e);
            } else {
                e.preventDefault();
            }
        }));
        (this._fontSize = this.refs.fontSize.element).addEventListener('mousedown', save);

        let updating = false;
        this._updateCssHandler = () => {
            if (updating) return;
            updating = true;
            setTimeout(() => {
                const style = getStyle(this.get('state'));
                console.log(style);
                this.set('cssStyle', style);
                updating = false;
            });
        };
    }

    _toggle() {
        this.set('show', !this.get('show'));
    }

    _refresh() {
        if (graph.isSelectionEmpty()) {
            this.set({state: null, expandedKeys: [], isEditing: false});
        // } else if (graph.isEditing()) {
            // console.log('isEditing');
        } else {
            console.log(getState());
            const isEditing = graph.cellEditor.isContentEditing();
            this.set({
                state: getState(),
                expandedKeys: isEditing ? ['text'] : ['style', 'text', 'layout'],
                isEditing, 
            });
            // bind events to get style of selected text
            if (isEditing) {
                if (mxClient.IS_FF || mxClient.IS_EDGE || mxClient.IS_IE || mxClient.IS_IE11) {
                    mxEvent.addListener(graph.cellEditor.textarea, 'DOMSubtreeModified', this._updateCssHandler);
                }
                ['input', 'touchend', 'mouseup', 'keyup'].forEach(item => {
                    mxEvent.addListener(graph.cellEditor.textarea, item, this._updateCssHandler);
                });
                this._updateCssHandler();
            }
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

    _getLineShape() {
        const state = this.get('state');
        if (!state) return;

        const shape = state.style.shape;
        if (shape === 'connector') return 'line';
        return shape;
    }

    _getEdgeStyle() {
        const state = this.get('state');
        if (!state) return;

        const style = state.style;
        let edgeStyle = mxUtils.getValue(style, mxConstants.STYLE_EDGE, null);
        if (mxUtils.getValue(style, mxConstants.STYLE_NOEDGESTYLE, null) === 1) {
            edgeStyle = null;
        }

        if (edgeStyle === 'orthogonalEdgeStyle' && mxUtils.getValue(style, mxConstants.STYLE_CURVED, null) === 1) {
            edgeStyle = 'curved';
        } else if (edgeStyle === 'straight' || edgeStyle === 'none' || edgeStyle === null) {
            edgeStyle = 'straight';
        } else if (edgeStyle === 'entityRelationEdgeStyle') {
            edgeStyle = 'entity';
        } else if (edgeStyle === 'elbowEdgeStyle') {
            edgeStyle = mxUtils.getValue(style, mxConstants.STYLE_ELBOW, null) === 'vertical' ?
                'verticalElbow' : 'horizontalElbow';
        } else if (edgeStyle === 'isometricEdgeStyle') {
            edgeStyle = mxUtils.getValue(style, mxConstants.STYLE_ELBOW, null) === 'vertical' ?
                'verticalIsometric' : 'horizontalIsometric';
        } else {
            edgeStyle = 'orthogonal';
        }

        return edgeStyle;
    }

    _setEdgeStyle(originValue, c, v) {
        if (originValue === v) return;

        const styles = {
            [mxConstants.STYLE_EDGE]: null,
            [mxConstants.STYLE_CURVED]: null,
            [mxConstants.STYLE_NOEDGESTYLE]: null,
        };

        if (v === 'orthogonal') {
            styles[mxConstants.STYLE_EDGE] = 'orthogonalEdgeStyle';
        } else if (v === 'horizontalElbow' || v === 'verticalElbow') {
            styles[mxConstants.STYLE_EDGE] = 'elbowEdgeStyle';
            styles[mxConstants.STYLE_ELBOW] = v === 'verticalElbow' ? 'vertical' : null;
        } else if (v === 'horizontalIsometric' || v === 'verticalIsometric') {
            styles[mxConstants.STYLE_EDGE] = 'isometricEdgeStyle';
            styles[mxConstants.STYLE_ELBOW] = v === 'verticalIsometric' ? 'vertical' : null;
        } else if (v === 'curved') {
            styles[mxConstants.STYLE_EDGE] = 'orthogonalEdgeStyle';
            styles[mxConstants.STYLE_CURVED] = '1';
        } else {
            styles[mxConstants.STYLE_EDGE] = 'entityRelationEdgeStyle';
        }

        this._setStyles(styles);
        this._refresh();
    }

    _setLineShape(originValue, c, v) {
        if (originValue === v) return;

        graph.stopEditing(false);
        
        const styles = {
            [mxConstants.STYLE_SHAPE]: null,
            [mxConstants.STYLE_STARTSIZE]: null,
            [mxConstants.STYLE_ENDSIZE]: null,
            width: null,
        };

        if (v !== 'line') {
            styles[mxConstants.STYLE_SHAPE] = v;
        }

        this._setStyles(styles);
        this.set('state.style.shape', v);
    }

    _toggleColor(key, defaultColor, originValue, c, v) {
        if (v === originValue) return;

        if (!v) {
            this[`_old${key}`]= this.refs[key].get('value');
        }
        this._setStyle(key, null, v ? this[`_old${key}`] || defaultColor  : 'none');
    }

    _setFillOrStrokeColor(key, c, v) {
        if (c.get('disabled')) return;
        if (v === this.get(`state.style.${key}`)) return;

        this._setStyle(key, null, v);
    }

    _setStyle(key, c, value) {
        if (!this.get('state')) return;
        if (this.get(`state.style.${key}`) === value) return;

        graph.getModel().beginUpdate();
        graph.setCellStyles(key, value, graph.getSelectionCells());
        graph.getModel().endUpdate();
        this.set(`state.style.${key}`, value);
    }

    _setStyles(styles) {
        graph.getModel().beginUpdate();
        const cells = graph.getSelectionCells();
        for (let key in styles) {
            graph.setCellStyles(key, styles[key], cells);
        }
        graph.getModel().endUpdate();
    }

    _setStrokeStyle(originValue, c, v) {
        if (originValue === v) return;

        const styles = {};

        switch (v) {
            case 'dashed':
                styles.dashed = 1;
                styles.dashPattern = null;
                break;
            case 'dotted':
                styles.dashed = 1;
                styles.dashPattern = '1 2';
                break;
            case 'solid':
                styles.dashed = null;
                styles.dashPattern = null;
                break;
        }

        this._setStyles(styles);
    }

    _setRounded(c, v) {
        this._setStyle('rounded', null, v ? 1 : 0);
    }

    _setAlign(key, value, e) {
        if (this.get('isEditing')) {
            if (key === 'align') {
                // graph.cellEditor.setAlign(value);
                graph.cellEditor.alignText(value, e);
            } else {
                graph.cellEditor.resize();
            }
        } else {
            this._setStyle(key, null, value);
            graph.updateLabelElements(graph.getSelectionCells(), elt => {
                elt.removeAttribute('align');
                elt.style.textAlign = null;
            });
        }
    }

    _toggleFontStyle(key) {
        // because user maybe only select a sub-string, we can't change the whole font style
        // in this case we only change its style by call execCommand
        if (graph.cellEditor.isContentEditing()) {
            document.execCommand(key.toLowerCase(), false, null);
        } else {
            graph.getModel().beginUpdate();
            try {
                const cells = graph.getSelectionCells();
                const style = mxConstants[`FONT_${key}`];
                graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, style, cells);
                // Removes bold and italic tags and CSS styles inside labels
                if ((style & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD) {
                    graph.updateLabelElements(graph.getSelectionCells(), function(elt) {
                        elt.style.fontWeight = null;

                        if (elt.nodeName == 'B') {
                            graph.replaceElement(elt);
                        }
                    });
                } else if ((style & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC) {
                    graph.updateLabelElements(graph.getSelectionCells(), function(elt) {
                        elt.style.fontStyle = null;

                        if (elt.nodeName == 'I') {
                            graph.replaceElement(elt);
                        }
                    });
                } else if ((style & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE) {
                    graph.updateLabelElements(graph.getSelectionCells(), function(elt) {
                        elt.style.textDecoration = null;

                        if (elt.nodeName == 'U') {
                            graph.replaceElement(elt);
                        }
                    });
                }
					
                cells.forEach(cell => {
                    if (graph.model.getChildCount(cell) === 0) {
                        graph.autoSizeCell(cell, false);
                    }
                });
            } finally {
                graph.getModel().endUpdate();
            }
            this._refresh();
        }
    }

    _setFontSize(size) {
        if (this.get('isEditing')) {
            if (this.get('cssStyle.fontSize') === size) return;

            if (this.selState) {
                restoreSelection(this.selState);
                this.selState = null;
            }
            const selection = window.getSelection();
            const textarea = graph.cellEditor.textarea;
            let container = selection.rangeCount > 0 ? 
                selection.getRangeAt(0).commonAncestorContainer :
                graph.cellEditor.textarea;
            if (container === textarea || container.nodeType !== mxConstants.NODETYPE_ELEMENT) {
                document.execCommand('fontSize', false, '1');
            }
            if (container !== textarea) {
                container = container.parentNode;
            }
            if (container !== null && container.nodeType === mxConstants.NODETYPE_ELEMENT) {
                const elts = container.getElementsByTagName('*');
                this._updateSize(container, selection, size);
                for (let i = 0; i < elts.length; i++) {
                    this._updateSize(elts[i], selection, size);
                }
            }
        } else {
            this._setStyle('fontSize', null, size); 
            graph.updateLabelElements(graph.getSelectionCells(), elt => {
                elt.style.fontSize = size + 'px';
                elt.removeAttribute('size');
            });
        }
    }

    _updateSize(elt, selection, fontSize) {
        const {textarea} = graph.cellEditor;
        if (
            textarea != null && 
            elt !== textarea &&
            textarea.contains(elt) &&
            selection.containsNode(elt, true)
        ) {
            if (elt.nodeName === 'FONT') {
                elt.removeAttribute('size');
                elt.style.fontSize = fontSize + 'px';
            } else {
                var css = mxUtils.getCurrentStyle(elt);
                
                if (css.fontSize !== fontSize + 'px') {
                    if (mxUtils.getCurrentStyle(elt.parentNode).fontSize !== fontSize + 'px') {
                        elt.style.fontSize = fontSize + 'px';
                    } else {
                        elt.style.fontSize = '';
                    }
                }
            }
        }
    }

    _setFontFamily(c, font) {
        if (this.get('isEditing')) {
            if (this.get('cssStyle.fontFamily') === font) return;

            document.execCommand('fontname', false, font);
        } else {
            if (this.get('state.style.fontFamily') === font) return;

            this._setStyle('fontFamily', null, font);
            graph.updateLabelElements(graph.getSelectionCells(), elt => {
                elt.removeAttribute('face');
                elt.style.fontFamily = null;
                if (elt.nodeName === 'PRE') {
                    graph.replaceElement(elt, 'div');
                }
            });
        }
    }

    _setFontColor(c, color) {
        if (this.get('isEditing')) {
            if (this.get('cssStyle.color') === color) return;

            if (this.selState) {
                restoreSelection(this.selState);
                this.selState = null;
            }
            document.execCommand('forecolor', false, color);
        } else {
            if (this.get('state.style.fontColor') === color) return;

            graph.updateLabelElements(graph.getSelectionCells(), elt => {
                elt.removeAttribute('color');
                elt.style.color = null;
            });
            this._setStyle('fontColor', null, color);
        }
    }

    /**
     * preventDefault to preserve the selected text
     */
    _preventDefault(e) {
        e.preventDefault();
    }


    /**
     * Layout
     */
    _layoutCells(type) {
        switch (type) {
            case 'horizontal':
            case 'vertical':
                return import('./layouts/stack').then(({default: Dialog}) => {
                    new Dialog({type}).show();
                });
            case 'circle':
                return new mxCircleLayout(graph).execute(graph.getDefaultParent());
            case 'tree':
                return import('./layouts/tree').then(({default: Dialog}) => {
                    new Dialog().show();
                });
            case 'radial':
                return import('./layouts/radial').then(({default: Dialog}) => {
                    new Dialog().show();
                });
        }
    }

    _destroy() {
        graph.getSelectionModel().removeListener(this._refresh);

        if (mxClient.IS_FF || mxClient.IS_EDGE || mxClient.IS_IE || mxClient.IS_IE11) {
            mxEvent.removeListener(graph.cellEditor.textarea, 'DOMSubtreeModified', this._updateCssHandler);
        }
        ['input', 'touchend', 'mouseup', 'keyup'].forEach(item => {
            mxEvent.removeListener(graph.cellEditor.textarea, item, this._updateCssHandler);
        });

        this.colorpickerDropdown.removeEventListener('mousedown', this._saveForColor);
        this._fontSize.removeEventListener('mousedown', this._save);
        this.selectDropdown.removeEventListener('mousedown', this._preventDefault);
    }
}
