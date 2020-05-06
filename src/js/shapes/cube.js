// Cube Shape, supports size style
import mx from '../mxgraph';

const {
    mxUtils,
    mxCellRenderer,
    mxCylinder,
    mxConnectionConstraint,
    mxPoint
} = mx;

function CubeShape() {
    mxCylinder.call(this);
};
mxUtils.extend(CubeShape, mxCylinder);
CubeShape.prototype.size = 20;
CubeShape.prototype.darkOpacity = 0;
CubeShape.prototype.darkOpacity2 = 0;

CubeShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    var s = Math.max(0, Math.min(w, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size)))));
    var op = Math.max(-1, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'darkOpacity', this.darkOpacity))));
    var op2 = Math.max(-1, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'darkOpacity2', this.darkOpacity2))));
    c.translate(x, y);

    c.begin();
    c.moveTo(0, 0);
    c.lineTo(w - s, 0);
    c.lineTo(w, s);
    c.lineTo(w, h);
    c.lineTo(s, h);
    c.lineTo(0, h - s);
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
            c.moveTo(0, 0);
            c.lineTo(w - s, 0);
            c.lineTo(w, s);
            c.lineTo(s, s);
            c.close();
            c.fill();
        }

        if (op2 != 0) {
            c.setFillAlpha(Math.abs(op2));
            c.setFillColor((op2 < 0) ? '#FFFFFF' : '#000000');
            c.begin();
            c.moveTo(0, 0);
            c.lineTo(s, s);
            c.lineTo(s, h);
            c.lineTo(0, h - s);
            c.close();
            c.fill();
        }

        c.begin();
        c.moveTo(s, h);
        c.lineTo(s, s);
        c.lineTo(0, 0);
        c.moveTo(s, s);
        c.lineTo(w, s);
        c.end();
        c.stroke();
    }
};
CubeShape.prototype.getLabelMargins = function(rect) {
    if (mxUtils.getValue(this.style, 'boundedLbl', false)) {
        var s = parseFloat(mxUtils.getValue(this.style, 'size', this.size)) * this.scale;

        return new mxRectangle(s, s, 0, 0);
    }

    return null;
};

mxCellRenderer.registerShape('cube', CubeShape);

CubeShape.prototype.getConstraints = function(style, w, h) {
    var constr = [];
    var s = Math.max(0, Math.min(w, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size)))));

    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w - s) * 0.5, 0));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - s, 0));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w - s * 0.5, s * 0.5));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, s));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, (h + s) * 0.5));
    constr.push(new mxConnectionConstraint(new mxPoint(1, 1), false));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, (w + s) * 0.5, h));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, s, h));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, s * 0.5, h - s * 0.5));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, h - s));
    constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, (h - s) * 0.5));

    return (constr);
};