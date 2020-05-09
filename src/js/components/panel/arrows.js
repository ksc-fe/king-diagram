import mx from '~/mxgraph';

const {
    mxConstants,
    mxMarker,
} = mx;

export const arrows = {
    none: [mxConstants.NONE, 0],
    classic: [mxConstants.ARROW_CLASSIC, 1],
    classicthin: [mxConstants.ARROW_CLASSIC_THIN, 1],
    open: [mxConstants.ARROW_OPEN, 0],
    // openthin: [mxConstants.ARROW_OPEN_THIN, 0],
    openasync: ['openAsync', 0],
    block: [mxConstants.ARROW_BLOCK, 1],
    blockthin: [mxConstants.ARROW_BLOCK_THIN, 1],
    async: ['async', 1],
    oval: [mxConstants.ARROW_OVAL, 1],
    diamond: [mxConstants.ARROW_DIAMOND, 1],
    thindiamond: [mxConstants.ARROW_DIAMOND_THIN, 1],
    classictrans: [mxConstants.ARROW_CLASSIC, 0],
    // classicthintrans: [mxConstants.ARROW_CLASSIC_THIN, 0],
    blocktrans: [mxConstants.ARROW_BLOCK, 0],
    // blockthintrans: [mxConstants.ARROW_BLOCK_THIN, 0],
    // asynctrans: ['async', 0],
    ovaltrans: [mxConstants.ARROW_OVAL, 0],
    // diamondtrans: [mxConstants.ARROW_DIAMOND, 0],
    // thindiamondtrans: [mxConstants.ARROW_DIAMOND_THIN, 0],
    // box: ['box', 0],
    // halfcircle: ['halfCircle', 0],
    // dash: ['dash', 0],
    // cross: ['cross', 0],
    // circleplush: ['circlePlus', 0],
    // circle: ['circle', 0],
    // one: ['ERone', 0],
    // eronetoone: ['ERmandOne', 0],
    // ermany: ['ERmany', 0],
    // eronetomany: ['ERoneToMany', 0],
    // eroneopt: ['ERzeroToOne', 1],
    // ermanyopt: ['ERzeroToMany', 1],
};

// Registers and defines the custom marker
mxMarker.addMarker('dash', function(c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
    var nx = unitX * (size + sw + 1);
    var ny = unitY * (size + sw + 1);

    return function() {
        c.begin();
        c.moveTo(pe.x - nx / 2 - ny / 2, pe.y - ny / 2 + nx / 2);
        c.lineTo(pe.x + ny / 2 - 3 * nx / 2, pe.y - 3 * ny / 2 - nx / 2);
        c.stroke();
    };
});

// Registers and defines the custom marker
mxMarker.addMarker('box', function(c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
    var nx = unitX * (size + sw + 1);
    var ny = unitY * (size + sw + 1);
    var px = pe.x + nx / 2;
    var py = pe.y + ny / 2;

    pe.x -= nx;
    pe.y -= ny;

    return function() {
        c.begin();
        c.moveTo(px - nx / 2 - ny / 2, py - ny / 2 + nx / 2);
        c.lineTo(px - nx / 2 + ny / 2, py - ny / 2 - nx / 2);
        c.lineTo(px + ny / 2 - 3 * nx / 2, py - 3 * ny / 2 - nx / 2);
        c.lineTo(px - ny / 2 - 3 * nx / 2, py - 3 * ny / 2 + nx / 2);
        c.close();

        if (filled) {
            c.fillAndStroke();
        } else {
            c.stroke();
        }
    };
});

// Registers and defines the custom marker
mxMarker.addMarker('cross', function(c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
    var nx = unitX * (size + sw + 1);
    var ny = unitY * (size + sw + 1);

    return function() {
        c.begin();
        c.moveTo(pe.x - nx / 2 - ny / 2, pe.y - ny / 2 + nx / 2);
        c.lineTo(pe.x + ny / 2 - 3 * nx / 2, pe.y - 3 * ny / 2 - nx / 2);
        c.moveTo(pe.x - nx / 2 + ny / 2, pe.y - ny / 2 - nx / 2);
        c.lineTo(pe.x - ny / 2 - 3 * nx / 2, pe.y - 3 * ny / 2 + nx / 2);
        c.stroke();
    };
});

function circleMarker(c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
    var a = size / 2;
    var size = size + sw;

    var pt = pe.clone();

    pe.x -= unitX * (2 * size + sw);
    pe.y -= unitY * (2 * size + sw);

    unitX = unitX * (size + sw);
    unitY = unitY * (size + sw);

    return function() {
        c.ellipse(pt.x - unitX - size, pt.y - unitY - size, 2 * size, 2 * size);

        if (filled) {
            c.fillAndStroke();
        } else {
            c.stroke();
        }
    };
};

mxMarker.addMarker('circle', circleMarker);
mxMarker.addMarker('circlePlus', function(c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
    var pt = pe.clone();
    var fn = circleMarker.apply(this, arguments);
    var nx = unitX * (size + 2 * sw); // (size + sw + 1);
    var ny = unitY * (size + 2 * sw); //(size + sw + 1);

    return function() {
        fn.apply(this, arguments);

        c.begin();
        c.moveTo(pt.x - unitX * (sw), pt.y - unitY * (sw));
        c.lineTo(pt.x - 2 * nx + unitX * (sw), pt.y - 2 * ny + unitY * (sw));
        c.moveTo(pt.x - nx - ny + unitY * sw, pt.y - ny + nx - unitX * sw);
        c.lineTo(pt.x + ny - nx - unitY * sw, pt.y - ny - nx + unitX * sw);
        c.stroke();
    };
});

// Registers and defines the custom marker
mxMarker.addMarker('halfCircle', function(c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
    var nx = unitX * (size + sw + 1);
    var ny = unitY * (size + sw + 1);
    var pt = pe.clone();

    pe.x -= nx;
    pe.y -= ny;

    return function() {
        c.begin();
        c.moveTo(pt.x - ny, pt.y + nx);
        c.quadTo(pe.x - ny, pe.y + nx, pe.x, pe.y);
        c.quadTo(pe.x + ny, pe.y - nx, pt.x + ny, pt.y - nx);
        c.stroke();
    };
});

mxMarker.addMarker('async', function(c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
    // The angle of the forward facing arrow sides against the x axis is
    // 26.565 degrees, 1/sin(26.565) = 2.236 / 2 = 1.118 ( / 2 allows for
    // only half the strokewidth is processed ).
    var endOffsetX = unitX * sw * 1.118;
    var endOffsetY = unitY * sw * 1.118;

    unitX = unitX * (size + sw);
    unitY = unitY * (size + sw);

    var pt = pe.clone();
    pt.x -= endOffsetX;
    pt.y -= endOffsetY;

    var f = 1;
    pe.x += -unitX * f - endOffsetX;
    pe.y += -unitY * f - endOffsetY;

    return function() {
        c.begin();
        c.moveTo(pt.x, pt.y);

        if (source) {
            c.lineTo(pt.x - unitX - unitY / 2, pt.y - unitY + unitX / 2);
        } else {
            c.lineTo(pt.x + unitY / 2 - unitX, pt.y - unitY - unitX / 2);
        }

        c.lineTo(pt.x - unitX, pt.y - unitY);
        c.close();

        if (filled) {
            c.fillAndStroke();
        } else {
            c.stroke();
        }
    };
});

function createOpenAsyncArrow(widthFactor) {
    widthFactor = (widthFactor != null) ? widthFactor : 2;

    return function(c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
        unitX = unitX * (size + sw);
        unitY = unitY * (size + sw);

        var pt = pe.clone();

        return function() {
            c.begin();
            c.moveTo(pt.x, pt.y);

            if (source) {
                c.lineTo(pt.x - unitX - unitY / widthFactor, pt.y - unitY + unitX / widthFactor);
            } else {
                c.lineTo(pt.x + unitY / widthFactor - unitX, pt.y - unitY - unitX / widthFactor);
            }

            c.stroke();
        };
    }
};

mxMarker.addMarker('openAsync', createOpenAsyncArrow(2));
