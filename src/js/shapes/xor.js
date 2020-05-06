// Xor
import mx from '../mxgraph';

const {
    mxUtils,
    mxCellRenderer,
    mxConnectionConstraint,
    mxPoint,
    mxActor,
} = mx;

function XorShape() {
    mxActor.call(this);
};
mxUtils.extend(XorShape, mxActor);
XorShape.prototype.redrawPath = function(c, x, y, w, h) {
    c.moveTo(0, 0);
    c.quadTo(w, 0, w, h / 2);
    c.quadTo(w, h, 0, h);
    c.quadTo(w / 2, h / 2, 0, 0);
    c.close();
    c.end();
};

mxCellRenderer.registerShape('xor', XorShape);

XorShape.prototype.constraints = [
    new mxConnectionConstraint(new mxPoint(0.175, 0.25), false),
    new mxConnectionConstraint(new mxPoint(0.25, 0.5), false),
    new mxConnectionConstraint(new mxPoint(0.175, 0.75), false),
    new mxConnectionConstraint(new mxPoint(1, 0.5), false),
    new mxConnectionConstraint(new mxPoint(0.7, 0.1), false),
    new mxConnectionConstraint(new mxPoint(0.7, 0.9), false)
];