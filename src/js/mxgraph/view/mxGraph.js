import mx from '../mx';

const {mxGraph, mxConstants, mxUtils, mxConnectionConstraint} = mx;

// Adds support for HTML labels via style. Note: Currently, only the Java
// backend supports HTML labels but CSS support is limited to the following:
// http://docs.oracle.com/javase/6/docs/api/index.html?javax/swing/text/html/CSS.html
// TODO: Wrap should not affect isHtmlLabel output (should be handled later)
// const isHtmlLabel = mxGraph.prototype.isHtmlLabel;
mxGraph.prototype.isHtmlLabel = function(cell) {
    const state = this.view.getState(cell);
    const style = (state != null) ? state.style : this.getCellStyle(cell);
    
    return (style != null) ? (style['html'] == '1' || style[mxConstants.STYLE_WHITE_SPACE] == 'wrap') : false;
};

/**
 * Overrides method to provide connection constraints for shapes.
 */
mxGraph.prototype.getAllConnectionConstraints = function(terminal, source) {
    if (terminal != null) {
        var constraints = mxUtils.getValue(terminal.style, 'points', null);

        if (constraints != null) {
            // Requires an array of arrays with x, y (0..1), an optional
            // [perimeter (0 or 1), dx, and dy] eg. points=[[0,0,1,-10,10],[0,1,0],[1,1]]
            var result = [];

            try {
                var c = JSON.parse(constraints);

                for (var i = 0; i < c.length; i++) {
                    var tmp = c[i];
                    result.push(new mxConnectionConstraint(new mxPoint(tmp[0], tmp[1]), (tmp.length > 2) ? tmp[2] != '0' : true,
                        null, (tmp.length > 3) ? tmp[3] : 0, (tmp.length > 4) ? tmp[4] : 0));
                }
            }
            catch (e) {
                // ignore
            }

            return result;
        }
        else if (terminal.shape != null && terminal.shape.bounds != null) {
            var dir = terminal.shape.direction;
            var bounds = terminal.shape.bounds;
            var scale = terminal.shape.scale;
            var w = bounds.width / scale;
            var h = bounds.height / scale;

            if (dir == mxConstants.DIRECTION_NORTH || dir == mxConstants.DIRECTION_SOUTH) {
                var tmp = w;
                w = h;
                h = tmp;
            }

            constraints = terminal.shape.getConstraints(terminal.style, w, h);

            if (constraints != null) {
                return constraints;
            }
            else if (terminal.shape.stencil != null && terminal.shape.stencil.constraints != null) {
                return terminal.shape.stencil.constraints;
            }
            else if (terminal.shape.constraints != null) {
                return terminal.shape.constraints;
            }
        }
    }

    return null;
};
