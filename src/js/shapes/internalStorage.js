// Internal storage
import mx from '../mxgraph';

const {
    mxUtils,
    mxCellRenderer,
    mxRectangleShape
} = mx;

function InternalStorageShape() {
    mxRectangleShape.call(this);
};
mxUtils.extend(InternalStorageShape, mxRectangleShape);
InternalStorageShape.prototype.dx = 20;
InternalStorageShape.prototype.dy = 20;
InternalStorageShape.prototype.isHtmlAllowed = function() {
    return false;
};
InternalStorageShape.prototype.paintForeground = function(c, x, y, w, h) {
    mxRectangleShape.prototype.paintForeground.apply(this, arguments);
    var inset = 0;

    if (this.isRounded) {
        var f = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE,
            mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100;
        inset = Math.max(inset, Math.min(w * f, h * f));
    }

    var dx = Math.max(inset, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'dx', this.dx))));
    var dy = Math.max(inset, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'dy', this.dy))));

    c.begin();
    c.moveTo(x, y + dy);
    c.lineTo(x + w, y + dy);
    c.end();
    c.stroke();

    c.begin();
    c.moveTo(x + dx, y);
    c.lineTo(x + dx, y + h);
    c.end();
    c.stroke();
};

mxCellRenderer.registerShape('internalStorage', InternalStorageShape);

InternalStorageShape.prototype.constraints = mxRectangleShape.prototype.constraints;