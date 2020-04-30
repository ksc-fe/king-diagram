// Link shape
// Generic arrow
import mx from '../mxgraph';

const {mxUtils, mxCellRenderer, mxArrowConnector} = mx;

function LinkShape() {
    mxArrowConnector.call(this);
    this.spacing = 0;
};
mxUtils.extend(LinkShape, mxArrowConnector);
LinkShape.prototype.defaultWidth = 4;

LinkShape.prototype.isOpenEnded = function() {
    return true;
};

LinkShape.prototype.getEdgeWidth = function() {
    return mxUtils.getNumber(this.style, 'width', this.defaultWidth) + Math.max(0, this.strokewidth - 1);
};

LinkShape.prototype.isArrowRounded = function() {
    return this.isRounded;
};

// Registers the link shape
mxCellRenderer.registerShape('link', LinkShape);