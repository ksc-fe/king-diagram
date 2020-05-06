// Or
import mx from '../mxgraph';

const {
    mxUtils,
    mxCellRenderer,
    mxConnectionConstraint,
    mxPoint,
    mxActor,
} = mx;

function OrShape() {
    mxActor.call(this);
};
mxUtils.extend(OrShape, mxActor);
OrShape.prototype.redrawPath = function(c, x, y, w, h) {
    c.moveTo(0, 0);
    c.quadTo(w, 0, w, h / 2);
    c.quadTo(w, h, 0, h);
    c.close();
    c.end();
};

mxCellRenderer.registerShape('or', OrShape);

OrShape.prototype.constraints = [
    new mxConnectionConstraint(new mxPoint(0, 0.25), false),
    new mxConnectionConstraint(new mxPoint(0, 0.5), false),
    new mxConnectionConstraint(new mxPoint(0, 0.75), false),
    new mxConnectionConstraint(new mxPoint(1, 0.5), false),
    new mxConnectionConstraint(new mxPoint(0.7, 0.1), false),
    new mxConnectionConstraint(new mxPoint(0.7, 0.9), false)
];