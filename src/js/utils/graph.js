import mx from '../mxgraph';
import defaultStyle from '../data/defaultStyle';

const {mxGraph} = mx;

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