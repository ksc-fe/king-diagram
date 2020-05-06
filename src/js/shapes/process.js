import mx from '../mxgraph';

const {
    mxRectangleShape,
    mxUtils,
    mxConstants,
    mxRectangle,
    mxCellRenderer
} = mx;

function ProcessShape() {
    mxRectangleShape.call(this);
};
mxUtils.extend(ProcessShape, mxRectangleShape);
ProcessShape.prototype.size = 0.1;
ProcessShape.prototype.isHtmlAllowed = function() {
    return false;
};
ProcessShape.prototype.getLabelBounds = function(rect) {
    if (mxUtils.getValue(this.state.style, mxConstants.STYLE_HORIZONTAL, true) ==
        (this.direction == null ||
            this.direction == mxConstants.DIRECTION_EAST ||
            this.direction == mxConstants.DIRECTION_WEST)
    ) {
        var w = rect.width;
        var h = rect.height;
        var r = new mxRectangle(rect.x, rect.y, w, h);

        var inset = w * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));

        if (this.isRounded) {
            var f = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE,
                mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100;
            inset = Math.max(inset, Math.min(w * f, h * f));
        }

        r.x += Math.round(inset);
        r.width -= Math.round(2 * inset);

        return r;
    }

    return rect;
};
ProcessShape.prototype.paintForeground = function(c, x, y, w, h) {
    var inset = w * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));

    if (this.isRounded) {
        var f = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE,
            mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100;
        inset = Math.max(inset, Math.min(w * f, h * f));
    }

    // Crisp rendering of inner lines
    inset = Math.round(inset);

    c.begin();
    c.moveTo(x + inset, y);
    c.lineTo(x + inset, y + h);
    c.moveTo(x + w - inset, y);
    c.lineTo(x + w - inset, y + h);
    c.end();
    c.stroke();
    mxRectangleShape.prototype.paintForeground.apply(this, arguments);
};

mxCellRenderer.registerShape('process', ProcessShape);