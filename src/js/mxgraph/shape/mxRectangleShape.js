import mx from '../mx';

const {mxRectangleShape, mxConnectionConstraint, mxPoint, mxUtils, mxConstants} = mx;

mxRectangleShape.prototype.constraints = [
	new mxConnectionConstraint(new mxPoint(0.25, 0), true),
	new mxConnectionConstraint(new mxPoint(0.5, 0), true),
	new mxConnectionConstraint(new mxPoint(0.75, 0), true),
	new mxConnectionConstraint(new mxPoint(0, 0.25), true),
	new mxConnectionConstraint(new mxPoint(0, 0.5), true),
	new mxConnectionConstraint(new mxPoint(0, 0.75), true),
	new mxConnectionConstraint(new mxPoint(1, 0.25), true),
	new mxConnectionConstraint(new mxPoint(1, 0.5), true),
	new mxConnectionConstraint(new mxPoint(1, 0.75), true),
	new mxConnectionConstraint(new mxPoint(0.25, 1), true),
	new mxConnectionConstraint(new mxPoint(0.5, 1), true),
	new mxConnectionConstraint(new mxPoint(0.75, 1), true)
];

/**
 * Overrides to avoid call to rect
 */
var mxRectangleShapeIsHtmlAllowed0 = mxRectangleShape.prototype.isHtmlAllowed;
mxRectangleShape.prototype.isHtmlAllowed = function() {
	return (this.style == null || mxUtils.getValue(this.style, 'comic', '0') == '0') &&
		mxRectangleShapeIsHtmlAllowed0.apply(this, arguments);
};

var mxRectangleShapePaintBackground0 = mxRectangleShape.prototype.paintBackground;
mxRectangleShape.prototype.paintBackground = function(c, x, y, w, h) {
	if (c.handJiggle == null) {
		mxRectangleShapePaintBackground0.apply(this, arguments);
	}
	else {
		var events = true;

		if (this.style != null) {
			events = mxUtils.getValue(this.style, mxConstants.STYLE_POINTER_EVENTS, '1') == '1';
		}

		if (events || (this.fill != null && this.fill != mxConstants.NONE) ||
			(this.stroke != null && this.stroke != mxConstants.NONE)) {
			if (!events && (this.fill == null || this.fill == mxConstants.NONE)) {
				c.pointerEvents = false;
			}

			c.begin();

			if (this.isRounded) {
				var r = 0;

				if (mxUtils.getValue(this.style, mxConstants.STYLE_ABSOLUTE_ARCSIZE, 0) == '1') {
					r = Math.min(w / 2, Math.min(h / 2, mxUtils.getValue(this.style,
						mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2));
				}
				else {
					var f = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE,
						mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100;
					r = Math.min(w * f, h * f);
				}

				c.moveTo(x + r, y);
				c.lineTo(x + w - r, y);
				c.quadTo(x + w, y, x + w, y + r);
				c.lineTo(x + w, y + h - r);
				c.quadTo(x + w, y + h, x + w - r, y + h);
				c.lineTo(x + r, y + h);
				c.quadTo(x, y + h, x, y + h - r);
				c.lineTo(x, y + r);
				c.quadTo(x, y, x + r, y);
			}
			else {

				c.moveTo(x, y);
				c.lineTo(x + w, y);
				c.lineTo(x + w, y + h);
				c.lineTo(x, y + h);
				c.lineTo(x, y);
			}

			// LATER: Check if close is needed here
			c.close();
			c.end();

			c.fillAndStroke();
		}
	}
};

/**
 * Disables glass effect with hand jiggle.
 */
var mxRectangleShapePaintForeground0 = mxRectangleShape.prototype.paintForeground;
mxRectangleShape.prototype.paintForeground = function(c, x, y, w, h) {
	if (c.handJiggle == null) {
		mxRectangleShapePaintForeground0.apply(this, arguments);
	}
};