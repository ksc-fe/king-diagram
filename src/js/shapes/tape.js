// Tape shape
import mx from '../mxgraph';

const {
    mxUtils,
    mxCellRenderer,
    mxActor,
    mxConnectionConstraint,
    mxPoint,
    mxConstants,
} = mx;

function TapeShape() {
    mxActor.call(this);
};
mxUtils.extend(TapeShape, mxActor);
TapeShape.prototype.size = 0.4;
TapeShape.prototype.redrawPath = function(c, x, y, w, h) {
    var dy = h * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
    var fy = 1.4;

    c.moveTo(0, dy / 2);
    c.quadTo(w / 4, dy * fy, w / 2, dy / 2);
    c.quadTo(w * 3 / 4, dy * (1 - fy), w, dy / 2);
    c.lineTo(w, h - dy / 2);
    c.quadTo(w * 3 / 4, h - dy * fy, w / 2, h - dy / 2);
    c.quadTo(w / 4, h - dy * (1 - fy), 0, h - dy / 2);
    c.lineTo(0, dy / 2);
    c.close();
    c.end();
};

TapeShape.prototype.getLabelBounds = function(rect) {
    if (mxUtils.getValue(this.style, 'boundedLbl', false)) {
        var size = mxUtils.getValue(this.style, 'size', this.size);
        var w = rect.width;
        var h = rect.height;

        if (this.direction == null ||
            this.direction == mxConstants.DIRECTION_EAST ||
            this.direction == mxConstants.DIRECTION_WEST) {
            var dy = h * size;

            return new mxRectangle(rect.x, rect.y + dy, w, h - 2 * dy);
        } else {
            var dx = w * size;

            return new mxRectangle(rect.x + dx, rect.y, w - 2 * dx, h);
        }
    }

    return rect;
};

mxCellRenderer.registerShape('tape', TapeShape);

TapeShape.prototype.constraints = [
    new mxConnectionConstraint(new mxPoint(0, 0.35), false),
    new mxConnectionConstraint(new mxPoint(0, 0.5), false),
    new mxConnectionConstraint(new mxPoint(0, 0.65), false),
    new mxConnectionConstraint(new mxPoint(1, 0.35), false),
    new mxConnectionConstraint(new mxPoint(1, 0.5), false),
    new mxConnectionConstraint(new mxPoint(1, 0.65), false),
    new mxConnectionConstraint(new mxPoint(0.25, 1), false),
    new mxConnectionConstraint(new mxPoint(0.75, 0), false)
];