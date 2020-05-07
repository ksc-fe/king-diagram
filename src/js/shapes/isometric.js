import mx from '../mxgraph';

const {
    mxUtils,
    mxStyleRegistry,
    mxPoint,
    mxEdgeStyle,
    mxGraph,
    mxElbowEdgeHandler,
} = mx;

var isoHVector = new mxPoint(1, 0);
var isoVVector = new mxPoint(1, 0);

var alpha1 = mxUtils.toRadians(-30);

var cos1 = Math.cos(alpha1);
var sin1 = Math.sin(alpha1);

isoHVector = mxUtils.getRotatedPoint(isoHVector, cos1, sin1);

var alpha2 = mxUtils.toRadians(-150);

var cos2 = Math.cos(alpha2);
var sin2 = Math.sin(alpha2);

isoVVector = mxUtils.getRotatedPoint(isoVVector, cos2, sin2);

mxEdgeStyle.IsometricConnector = function(state, source, target, points, result) {
    var view = state.view;
    var pt = (points != null && points.length > 0) ? points[0] : null;
    var pts = state.absolutePoints;
    var p0 = pts[0];
    var pe = pts[pts.length - 1];

    if (pt != null) {
        pt = view.transformControlPoint(state, pt);
    }

    if (p0 == null) {
        if (source != null) {
            p0 = new mxPoint(source.getCenterX(), source.getCenterY());
        }
    }

    if (pe == null) {
        if (target != null) {
            pe = new mxPoint(target.getCenterX(), target.getCenterY());
        }
    }

    var a1 = isoHVector.x;
    var a2 = isoHVector.y;

    var b1 = isoVVector.x;
    var b2 = isoVVector.y;

    var elbow = mxUtils.getValue(state.style, 'elbow', 'horizontal') == 'horizontal';

    if (pe != null && p0 != null) {
        var last = p0;

        function isoLineTo(x, y, ignoreFirst) {
            var c1 = x - last.x;
            var c2 = y - last.y;

            // Solves for isometric base vectors
            var h = (b2 * c1 - b1 * c2) / (a1 * b2 - a2 * b1);
            var v = (a2 * c1 - a1 * c2) / (a2 * b1 - a1 * b2);

            if (elbow) {
                if (ignoreFirst) {
                    last = new mxPoint(last.x + a1 * h, last.y + a2 * h);
                    result.push(last);
                }

                last = new mxPoint(last.x + b1 * v, last.y + b2 * v);
                result.push(last);
            } else {
                if (ignoreFirst) {
                    last = new mxPoint(last.x + b1 * v, last.y + b2 * v);
                    result.push(last);
                }

                last = new mxPoint(last.x + a1 * h, last.y + a2 * h);
                result.push(last);
            }
        };

        if (pt == null) {
            pt = new mxPoint(p0.x + (pe.x - p0.x) / 2, p0.y + (pe.y - p0.y) / 2);
        }

        isoLineTo(pt.x, pt.y, true);
        isoLineTo(pe.x, pe.y, false);
    }
};

mxStyleRegistry.putValue('isometricEdgeStyle', mxEdgeStyle.IsometricConnector);

var graphCreateEdgeHandler = mxGraph.prototype.createEdgeHandler;
mxGraph.prototype.createEdgeHandler = function(state, edgeStyle) {
    if (edgeStyle == mxEdgeStyle.IsometricConnector) {
        var handler = new mxElbowEdgeHandler(state);
        handler.snapToTerminals = false;

        return handler;
    }

    return graphCreateEdgeHandler.apply(this, arguments);
};