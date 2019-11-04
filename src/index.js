import mx from 'mxgraph';
import Intact from 'intact';
import template from './index.vdt';

// const {mxGraph, mxRubberband, mxConstants} = mx();

// const container = document.getElementById('app');
// const graph = new mxGraph(container);
// // Enables rubberband selection
// new mxRubberband(graph);

// // create style
// const style = {
    // [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_RECTANGLE,
    // [mxConstants.STYLE_OPACITY]: 50,
    // [mxConstants.STYLE_FONTCOLOR]: 'red',
// };
// graph.getStylesheet().putCellStyle('ROUNDED', style);

// // Gets the default parent for inserting new cells. This
// // is normally the first child of the root (ie. layer 0).
// var parent = graph.getDefaultParent();
                
// // Adds cells to the model in a single step
// graph.getModel().beginUpdate();
// try
// {
    // var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30, 'ROUNDED');
    // var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
    // var e1 = graph.insertEdge(parent, null, '', v1, v2);
// }
// finally
// {
    // // Updates the display
    // graph.getModel().endUpdate();
// }

class Component extends Intact {
    @Intact.template()
    static template = template; 
}

Intact.mount(Component, document.getElementById('app'));
