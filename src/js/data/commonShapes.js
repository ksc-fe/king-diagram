import mx from '../mxgraph';

const {
    mxPoint,
    mxCell,
    mxGeometry,
} = mx;

const shapes = [
    {
        stylesheet: 'rounded=0;whiteSpace=wrap;html=1;',
    },
    {
        stylesheet: 'rounded=1;whiteSpace=wrap;html=1;',
    },
    {
        stylesheet: 'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;',
        value: 'Text',
        width: 40,
        height: 20,
    },
    {
        stylesheet: 'text;html=1;strokeColor=none;fillColor=none;spacing=5;whiteSpace=wrap;overflow=hidden;rounded=0;',
        value: '<h1>Heading</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
        width: 190,
        height: 120,
    },
    {
        stylesheet: 'ellipse;whiteSpace=wrap;html=1;',
        width: 120,
        height: 80,
    },
    {
        stylesheet: 'whiteSpace=wrap;html=1;aspect=fixed;',
        width: 80,
        height: 80,
    },
    {
        stylesheet: 'ellipse;whiteSpace=wrap;html=1;aspect=fixed;',
        width: 80,
        height: 80,
    },
    {
        stylesheet: 'shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;',
    },
    {
        stylesheet: 'rhombus;whiteSpace=wrap;html=1;',
        width: 80,
        height: 80,
    },
    {
        stylesheet: 'shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;',
    },
    {
        stylesheet: 'shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;',
        height: 80,
    },
    {
        stylesheet: 'triangle;whiteSpace=wrap;html=1;',
        width: 60,
        height: 80,
    },
    {
        stylesheet: 'shape=cylinder;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;',
        width: 60,
        height: 80,
    },
    {
        stylesheet: 'ellipse;shape=cloud;whiteSpace=wrap;html=1;',
        height: 80,
    },
    {
        stylesheet: 'shape=document;whiteSpace=wrap;html=1;boundedLbl=1;',
        height: 80,
    },
    {
        stylesheet: 'shape=internalStorage;whiteSpace=wrap;html=1;backgroundOutline=1;',
        width: 80,
        height: 80,
    },
    {
        stylesheet: 'shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;darkOpacity=0.05;darkOpacity2=0.1;',
        height: 80,
    },
    {
        stylesheet: 'shape=step;perimeter=stepPerimeter;whiteSpace=wrap;html=1;fixedSize=1;',
        height: 80,
    },
    {
        stylesheet: 'shape=trapezoid;perimeter=trapezoidPerimeter;whiteSpace=wrap;html=1;',
    },
    {
        stylesheet: 'shape=tape;whiteSpace=wrap;html=1;',
        height: 100,
    },
    {
        stylesheet: 'shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;darkOpacity=0.05;',
        width: 80,
        height: 100,
    },
    {
        stylesheet: 'shape=card;whiteSpace=wrap;html=1;',
        width: 80,
        height: 100,
    },
    {
        stylesheet: 'shape=callout;whiteSpace=wrap;html=1;perimeter=calloutPerimeter;',
        height: 80,
    },
    {
        stylesheet: 'shape=umlActor;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;html=1;outlineConnect=0;',
        width: 30,
    },
    {
        stylesheet: 'shape=xor;whiteSpace=wrap;html=1;',
        width: 60,
        height: 80,
    },
    {
        stylesheet: 'shape=or;whiteSpace=wrap;html=1;',
        width: 60,
        height: 80,
    },
    {
        stylesheet: 'shape=dataStorage;whiteSpace=wrap;html=1;',
        width: 100,
        height: 80,
    },
    {
        cell: (() => {
            const curve =  new mxCell('', new mxGeometry(0, 0, 50, 50), 'curved=1;endArrow=classic;html=1;');
            curve.geometry.setTerminalPoint(new mxPoint(0, 50), true);
            curve.geometry.setTerminalPoint(new mxPoint(50, 0), false);
            curve.geometry.points = [new mxPoint(50, 50), new mxPoint(0, 0)];
            curve.geometry.relative = true;
            curve.edge = true;

            return curve;
        })(),
        width: 50,
        height: 50,
        edge: true,
    },
    {
        stylesheet: 'shape=flexArrow;endArrow=classic;startArrow=classic;html=1;',
        width: 50,
        height: 50,
        edge: true,
    },
    {
        stylesheet: 'shape=flexArrow;endArrow=classic;html=1;',
        width: 50,
        height: 50,
        edge: true,
    },
    {
        stylesheet: 'shape=link;html=1;',
        width: 50,
        height: 50,
        edge: true,
    },
    {
        stylesheet: 'endArrow=none;dashed=1;html=1;',
        width: 50,
        height: 50,
        edge: true,
    },
    {
        stylesheet: 'endArrow=none;html=1;',
        width: 50,
        height: 50,
        edge: true,
    },
    {
        stylesheet: 'endArrow=classic;startArrow=classic;html=1;',
        width: 50,
        height: 50,
        edge: true,
    },
    {
        stylesheet: 'endArrow=classic;html=1;',
        width: 50,
        height: 50,
        edge: true,
    },
];

export default shapes;
