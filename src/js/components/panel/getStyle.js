import mx from '../../mxgraph';
import {graph} from '../../utils/graph';

const {mxUtils, mxConstants, mxClient} = mx;

export default function getStyle(ss) {
    var selectedElement = graph.getSelectedElement();
    var node = selectedElement;

    while (node != null && node.nodeType != mxConstants.NODETYPE_ELEMENT) {
        node = node.parentNode;
    }

    if (node != null) {
        // Workaround for commonAncestor on range in IE11 returning parent of common ancestor
        if (node == graph.cellEditor.textarea && graph.cellEditor.textarea.children.length == 1 &&
            graph.cellEditor.textarea.firstChild.nodeType == mxConstants.NODETYPE_ELEMENT) {
            node = graph.cellEditor.textarea.firstChild;
        }

        var css = mxUtils.getCurrentStyle(node);
        var fontSize = getAbsoluteFontSize(css);
        var lineHeight = getRelativeLineHeight(fontSize, css, node);

        // Finds common font size
        var elts = node.getElementsByTagName('*');

        // IE does not support containsNode
        if (elts.length > 0 && window.getSelection && !mxClient.IS_IE && !mxClient.IS_IE11) {
            var selection = window.getSelection();

            for (var i = 0; i < elts.length; i++) {
                if (selection.containsNode(elts[i], true)) {
                    let temp = mxUtils.getCurrentStyle(elts[i]);
                    fontSize = Math.max(getAbsoluteFontSize(temp), fontSize);
                    var lh = getRelativeLineHeight(fontSize, temp, elts[i]);

                    if (lh != lineHeight || isNaN(lh)) {
                        lineHeight = '';
                    }
                }
            }
        }

        if (css) {
            var bold = css.fontWeight === 'bold' || css.fontWeight > 400 || hasParentOrOnlyChild('B', node) || hasParentOrOnlyChild('STRONG', node);
            var italic = css.fontStyle === 'italic' || hasParentOrOnlyChild('I', node) || hasParentOrOnlyChild('EM', node);
            var underline = hasParentOrOnlyChild('U', node);

            var align;
            if (!graph.cellEditor.isTableSelected()) {
                align = graph.cellEditor.align || mxUtils.getValue(ss.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
            } else {
                align = css.textAlign;
            }

            // Converts rgb(r,g,b) values
            var color = css.color.replace(
                /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                function($0, $1, $2, $3) {
                    return "#" + ("0" + Number($1).toString(16)).substr(-2) + ("0" + Number($2).toString(16)).substr(-2) + ("0" + Number($3).toString(16)).substr(-2);
                }
            );
            if (color[0] !== '#') color = '#000000';

            var backgroundColor = css.backgroundColor.replace(
                /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                function($0, $1, $2, $3) {
                    return "#" + ("0" + Number($1).toString(16)).substr(-2) + ("0" + Number($2).toString(16)).substr(-2) + ("0" + Number($3).toString(16)).substr(-2);
                }
            );
            if (backgroundColor[0] !== '#') backgroundColor = null;

            var fontFamily = css.fontFamily.replace(/^['"]|['"]$/g, '');
        }

        return {color, backgroundColor, fontFamily, lineHeight, fontSize, align, bold, italic, underline};
    }
}

function getRelativeLineHeight(fontSize, css, elt) {
    if (elt.style != null && css != null) {
        var lineHeight = css.lineHeight

        if (elt.style.lineHeight != null && elt.style.lineHeight.substring(elt.style.lineHeight.length - 1) == '%') {
            return parseInt(elt.style.lineHeight) / 100;
        } else {
            return (lineHeight.substring(lineHeight.length - 2) == 'px') ?
                parseFloat(lineHeight) / fontSize : parseInt(lineHeight);
        }
    } else {
        return '';
    }
}

function getAbsoluteFontSize(css) {
    var fontSize = (css != null) ? css.fontSize : null;

    if (fontSize != null && fontSize.substring(fontSize.length - 2) == 'px') {
        return parseFloat(fontSize);
    } else {
        return mxConstants.DEFAULT_FONTSIZE;
    }
};

function hasParentOrOnlyChild(name, node) {
    if (graph.getParentByName(node, name, graph.cellEditor.textarea) != null) {
        return true;
    } else {
        var child = node;

        while (child != null && child.childNodes.length == 1) {
            child = child.childNodes[0];

            if (child.nodeName == name) {
                return true;
            }
        }
    }

    return false;
}
