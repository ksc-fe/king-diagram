// UML Actor Shape
import mx from '../mxgraph';

const {
    mxUtils,
    mxCellRenderer,
    mxShape,
    mxConnectionConstraint,
    mxPoint
} = mx;

function UmlActorShape() {
    mxShape.call(this);
};
mxUtils.extend(UmlActorShape, mxShape);
UmlActorShape.prototype.paintBackground = function(c, x, y, w, h) {
    c.translate(x, y);

    // Head
    c.ellipse(w / 4, 0, w / 2, h / 4);
    c.fillAndStroke();

    c.begin();
    c.moveTo(w / 2, h / 4);
    c.lineTo(w / 2, 2 * h / 3);

    // Arms
    c.moveTo(w / 2, h / 3);
    c.lineTo(0, h / 3);
    c.moveTo(w / 2, h / 3);
    c.lineTo(w, h / 3);

    // Legs
    c.moveTo(w / 2, 2 * h / 3);
    c.lineTo(0, h);
    c.moveTo(w / 2, 2 * h / 3);
    c.lineTo(w, h);
    c.end();

    c.stroke();
};

// Replaces existing actor shape
mxCellRenderer.registerShape('umlActor', UmlActorShape);

UmlActorShape.prototype.constraints = [
    new mxConnectionConstraint(new mxPoint(0.25, 0.1), false),
    new mxConnectionConstraint(new mxPoint(0.5, 0), false),
    new mxConnectionConstraint(new mxPoint(0.75, 0.1), false),
    new mxConnectionConstraint(new mxPoint(0, 1 / 3), false),
    new mxConnectionConstraint(new mxPoint(0, 1), false),
    new mxConnectionConstraint(new mxPoint(1, 1 / 3), false),
    new mxConnectionConstraint(new mxPoint(1, 1), false),
    new mxConnectionConstraint(new mxPoint(0.5, 0.5), false)
];