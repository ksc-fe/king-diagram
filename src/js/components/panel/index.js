import Intact from 'intact';
import template from './index.vdt';
import './index.styl';
import {graph} from '../../utils/graph';
import mx from '../../mxgraph';
import getState from './getState';

const {mxEvent, mxConstants, mxUtils} = mx;

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
        const colorpickerDropdown = this.colorpickerDropdown = this.refs.fontColor.vdt.vNode.children[1].children.refs.menu.element;
        colorpickerDropdown.addEventListener('mousedown', (this._saveForColor = (e) => {
            if (e.target.tagName === 'INPUT') {
                save(e);
            } else {
                e.preventDefault();
            }
        }));
        (this._fontSize = this.refs.fontSize.element).addEventListener('mousedown', save);
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

        graph.getModel().beginUpdate();
        for (let key in styles) {
            graph.setCellStyles(key, styles[key], graph.getSelectionCells());
        }
        graph.getModel().endUpdate();
    }

    _setRounded(c, v) {
        this._setStyle('rounded', null, v ? 1 : 0);
    }

    _setAlign(key, value) {
        this._setStyle(key, null, value);
        if (graph.cellEditor.isContentEditing()) {
            if (key === 'align') {
                graph.cellEditor.setAlign(value);
            } else {
                graph.cellEditor.resize();
            }
        }
    }

    _toggleFontStyle(key) {
        if (graph.cellEditor.isContentEditing()) {
            document.execCommand(key.toLowerCase(), false, null);
        } 
        // else {
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
        // }
    }

    _setFontSize(size) {
        this._setStyle('fontSize', null, size); 
        if (this.get('isEditing')) {
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
        this._setStyle('fontFamily', null, font);
        if (this.get('isEditing')) {
            document.execCommand('fontname', false, font);
        }
    }

    _setFontColor(c, color) {
        this._setStyle('fontColor', null, color);
        if (this.get('isEditing')) {
            if (this.selState) {
                restoreSelection(this.selState);
                this.selState = null;
            }
            document.execCommand('forecolor', false, color);
        }
    }

    /**
     * preventDefault to preserve the selected text
     */
    _preventDefault(e) {
        e.preventDefault();
    }

    _destroy() {
        graph.getSelectionModel().removeListener(this._refresh);
        this.colorpickerDropdown.removeEventListener('mousedown', this._saveForColor);
        this._fontSize.removeEventListener('mousedown', this._save);
        this.selectDropdown.removeEventListener('mousedown', this._preventDefault);
    }
}
