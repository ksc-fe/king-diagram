import mx from '../mxgraph';
import defaultStyle from '../data/defaultStyle';

const {mxGraph, mxRubberband} = mx;

// temp graph for create thumbnails
export function createTempGraph(container = document.createElement('div')) {
    const graph = new mxGraph(container);
    graph.resetViewOnRootChange = false;
    graph.foldingEnabled = false;
    graph.gridEnabled = false;
    graph.autoScroll = false;
    graph.setTooltips(false);
    graph.setConnectable(false);
    graph.setEnabled(false);

    initStylesheet(graph);

    return graph;
}

// set style
export function initStylesheet(graph) {
    for (let key in defaultStyle) {
        graph.getStylesheet().putCellStyle(key, defaultStyle[key]);
    }
}

export function createGraph(container) {
    const graph = new mxGraph(container); 

    initStylesheet(graph);

    graph.setConnectable(true);
    graph.setDropEnabled(true);
    graph.setPanning(true);
    graph.setTooltips(false);
    graph.setAllowLoops(true);
    graph.allowAutoPanning = true;
    graph.resetEdgesOnConnect = false;
    graph.constrainChildren = false;
    graph.constrainRelativeChildren = true;
    
    // Do not scroll after moving cells
    graph.graphHandler.scrollOnMove = false;
    graph.graphHandler.scaleGrid = true;

    new mxRubberband(graph);

    return graph;
}

export function findTreeRoot(graph) {
    let tmp = graph.getSelectionCell();
    let roots;
    if (!tmp || graph.getModel().getChildCount(tmp) === 0) {
        if (graph.getModel().getEdgeCount(tmp) === 0) {
            roots = graph.findTreeRoots(graph.getDefaultParent());
        }
    } else {
        roots = graph.findTreeRoots(tmp);
    }

    if (roots && roots.length) {
        tmp = roots[0];
    }

    return tmp;
}

export const graph = createGraph();
