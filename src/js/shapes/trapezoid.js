// Trapezoid shape
import mx from '../mxgraph';

const {
    mxUtils,
    mxCellRenderer,
    mxActor,
    mxPerimeter,
    mxStyleRegistry,
    mxRectangleShape,
    mxPoint,
    mxConstants,
} = mx;

function TrapezoidShape() {
    mxActor.call(this);
};
mxUtils.extend(TrapezoidShape, mxActor);
TrapezoidShape.prototype.size = 0.2;
TrapezoidShape.prototype.isRoundable = function() {
    return true;
};
TrapezoidShape.prototype.redrawPath = function(c, x, y, w, h) {
    var dx = w * Math.max(0, Math.min(0.5, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));
    var arcSize = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
    this.addPoints(c, [new mxPoint(0, h), new mxPoint(dx, 0), new mxPoint(w - dx, 0), new mxPoint(w, h)],
        this.isRounded, arcSize, true);
};

mxCellRenderer.registerShape('trapezoid', TrapezoidShape);

// Trapezoid Perimeter
mxPerimeter.TrapezoidPerimeter = function(bounds, vertex, next, orthogonal) {
    var size = TrapezoidShape.prototype.size;

    if (vertex != null) {
        size = mxUtils.getValue(vertex.style, 'size', size);
    }

    var x = bounds.x;
    var y = bounds.y;
    var w = bounds.width;
    var h = bounds.height;

    var direction = (vertex != null) ? mxUtils.getValue(
        vertex.style, mxConstants.STYLE_DIRECTION,
        mxConstants.DIRECTION_EAST) : mxConstants.DIRECTION_EAST;
    var points;

    if (direction == mxConstants.DIRECTION_EAST) {
        var dx = w * Math.max(0, Math.min(1, size));
        points = [new mxPoint(x + dx, y), new mxPoint(x + w - dx, y),
            new mxPoint(x + w, y + h), new mxPoint(x, y + h), new mxPoint(x + dx, y)
        ];
    } else if (direction == mxConstants.DIRECTION_WEST) {
        var dx = w * Math.max(0, Math.min(1, size));
        points = [new mxPoint(x, y), new mxPoint(x + w, y),
            new mxPoint(x + w - dx, y + h), new mxPoint(x + dx, y + h), new mxPoint(x, y)
        ];
    } else if (direction == mxConstants.DIRECTION_NORTH) {
        var dy = h * Math.max(0, Math.min(1, size));
        points = [new mxPoint(x, y + dy), new mxPoint(x + w, y),
            new mxPoint(x + w, y + h), new mxPoint(x, y + h - dy), new mxPoint(x, y + dy)
        ];
    } else {
        var dy = h * Math.max(0, Math.min(1, size));
        points = [new mxPoint(x, y), new mxPoint(x + w, y + dy),
            new mxPoint(x + w, y + h - dy), new mxPoint(x, y + h), new mxPoint(x, y)
        ];
    }

    var cx = bounds.getCenterX();
    var cy = bounds.getCenterY();

    var p1 = new mxPoint(cx, cy);

    if (orthogonal) {
        if (next.x < x || next.x > x + w) {
            p1.y = next.y;
        } else {
            p1.x = next.x;
        }
    }

    return mxUtils.getPerimeterPoint(points, p1, next);
};

mxStyleRegistry.putValue('trapezoidPerimeter', mxPerimeter.TrapezoidPerimeter);

TrapezoidShape.prototype.constraints = mxRectangleShape.prototype.constraints;