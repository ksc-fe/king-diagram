// Note Shape, supports size style
import mx from '../mxgraph';

const {
    mxUtils,
    mxCellRenderer,
    mxConnectionConstraint,
    mxPoint,
    mxCylinder,
} = mx;

function NoteShape() {
    mxCylinder.call(this);
};
mxUtils.extend(NoteShape, mxCylinder);
NoteShape.prototype.size = 30;
NoteShape.prototype.darkOpacity = 0;

NoteShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    var s = Math.max(0, Math.min(w, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size)))));
    var op = Math.max(-1, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'darkOpacity', this.darkOpacity))));
    c.translate(x, y);

    c.begin();
    c.moveTo(0, 0);
    c.lineTo(w - s, 0);
    c.lineTo(w, s);
    c.lineTo(w, h);
    c.lineTo(0, h);
    c.lineTo(0, 0);
    c.close();
    c.end();
    c.fillAndStroke();

    if (!this.outline) {
        c.setShadow(false);

        if (op != 0) {
            c.setFillAlpha(Math.abs(op));
            c.setFillColor((op < 0) ? '#FFFFFF' : '#000000');
            c.begin();
            c.moveTo(w - s, 0);
            c.lineTo(w - s, s);
            c.lineTo(w, s);
            c.close();
            c.fill();
        }

        c.begin();
        c.moveTo(w - s, 0);
        c.lineTo(w - s, s);
        c.lineTo(w, s);
        c.end();
        c.stroke();
    }
};

mxCellRenderer.registerShape('note', NoteShape);

NoteShape.prototype.getConstraints = function(style, w, h) {
    var constr = [];
    var s = Math.max(0, Math.min(w, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size)))));

    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w - s) * 0.5, 0));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - s, 0));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - s * 0.5, s * 0.5));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, s));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, (h + s) * 0.5));
    constr.push(new mxConnectionConstraint(new mxPoint(1, 1), false));
    constr.push(new mxConnectionConstraint(new mxPoint(0.5, 1), false));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 1), false));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0.5), false));

    if (w >= s * 2) {
        constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), false));
    }

    return (constr);
};