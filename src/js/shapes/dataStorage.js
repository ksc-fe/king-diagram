// Data storage
import mx from '../mxgraph';

const {
    mxUtils,
    mxCellRenderer,
    mxActor,
    mxRectangleShape,
} = mx;

function DataStorageShape() {
    mxActor.call(this);
};
mxUtils.extend(DataStorageShape, mxActor);
DataStorageShape.prototype.size = 0.1;
DataStorageShape.prototype.redrawPath = function(c, x, y, w, h) {
    var s = w * Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));

    c.moveTo(s, 0);
    c.lineTo(w, 0);
    c.quadTo(w - s * 2, h / 2, w, h);
    c.lineTo(s, h);
    c.quadTo(s - s * 2, h / 2, s, 0);
    c.close();
    c.end();
};

mxCellRenderer.registerShape('dataStorage', DataStorageShape);

DataStorageShape.prototype.constraints = mxRectangleShape.prototype.constraints;