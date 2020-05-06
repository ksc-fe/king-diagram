// Card shape
import mx from '../mxgraph';

const {
    mxUtils,
    mxCellRenderer,
    mxConnectionConstraint,
    mxPoint,
    mxActor,
    mxConstants,
} = mx;

function CardShape() {
    mxActor.call(this);
};
mxUtils.extend(CardShape, mxActor);
CardShape.prototype.size = 30;
CardShape.prototype.isRoundable = function() {
    return true;
};
CardShape.prototype.redrawPath = function(c, x, y, w, h) {
    var s = Math.max(0, Math.min(w, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size)))));
    var arcSize = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
    this.addPoints(c, [new mxPoint(s, 0), new mxPoint(w, 0), new mxPoint(w, h), new mxPoint(0, h), new mxPoint(0, s)],
        this.isRounded, arcSize, true);
    c.end();
};

mxCellRenderer.registerShape('card', CardShape);

CardShape.prototype.getConstraints = function(style, w, h) {
    var constr = [];
    var s = Math.max(0, Math.min(w, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size)))));

    constr.push(new mxConnectionConstraint(new mxPoint(1, 0), false));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w + s) * 0.5, 0));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, s, 0));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, s * 0.5, s * 0.5));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, s));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, (h + s) * 0.5));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 1), false));
    constr.push(new mxConnectionConstraint(new mxPoint(0.5, 1), false));
    constr.push(new mxConnectionConstraint(new mxPoint(1, 1), false));
    constr.push(new mxConnectionConstraint(new mxPoint(1, 0.5), false));

    if (w >= s * 2) {
        constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), false));
    }

    return (constr);
};