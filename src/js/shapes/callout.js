// Callout shape
import mx from '../mxgraph';

const {
    mxUtils,
    mxCellRenderer,
    mxActor,
    mxConnectionConstraint,
    mxPoint,
    mxStyleRegistry,
    mxPerimeter,
    mxHexagon,
    mxConstants,
} = mx;

function CalloutShape() {
    mxActor.call(this);
};
mxUtils.extend(CalloutShape, mxHexagon);
CalloutShape.prototype.size = 30;
CalloutShape.prototype.position = 0.5;
CalloutShape.prototype.position2 = 0.5;
CalloutShape.prototype.base = 20;
CalloutShape.prototype.getLabelMargins = function() {
    return new mxRectangle(0, 0, 0, parseFloat(mxUtils.getValue(
        this.style, 'size', this.size)) * this.scale);
};
CalloutShape.prototype.isRoundable = function() {
    return true;
};
CalloutShape.prototype.redrawPath = function(c, x, y, w, h) {
    var arcSize = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
    var s = Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
    var dx = w * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'position', this.position))));
    var dx2 = w * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'position2', this.position2))));
    var base = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'base', this.base))));

    this.addPoints(c, [new mxPoint(0, 0), new mxPoint(w, 0), new mxPoint(w, h - s),
            new mxPoint(Math.min(w, dx + base), h - s), new mxPoint(dx2, h),
            new mxPoint(Math.max(0, dx), h - s), new mxPoint(0, h - s)
        ],
        this.isRounded, arcSize, true, [4]);
};

mxCellRenderer.registerShape('callout', CalloutShape);

// Callout Perimeter
mxPerimeter.CalloutPerimeter = function(bounds, vertex, next, orthogonal) {
    return mxPerimeter.RectanglePerimeter(mxUtils.getDirectedBounds(bounds, new mxRectangle(0, 0, 0,
            Math.max(0, Math.min(bounds.height, parseFloat(mxUtils.getValue(vertex.style, 'size',
                CalloutShape.prototype.size)) * vertex.view.scale))),
        vertex.style), vertex, next, orthogonal);
};

mxStyleRegistry.putValue('calloutPerimeter', mxPerimeter.CalloutPerimeter);

CalloutShape.prototype.getConstraints = function(style, w, h) {
    var constr = [];
    var arcSize = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
    var s = Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
    var dx = w * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'position', this.position))));
    var dx2 = w * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'position2', this.position2))));
    var base = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'base', this.base))));

    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false));
    constr.push(new mxConnectionConstraint(new mxPoint(0.25, 0), false));
    constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), false));
    constr.push(new mxConnectionConstraint(new mxPoint(0.75, 0), false));
    constr.push(new mxConnectionConstraint(new mxPoint(1, 0), false));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, (h - s) * 0.5));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, h - s));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, dx2, h));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, h - s));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, (h - s) * 0.5));

    if (w >= s * 2) {
        constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), false));
    }

    return (constr);
};