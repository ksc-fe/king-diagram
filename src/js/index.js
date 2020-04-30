import Intact from 'intact';
import template from './index.vdt';
import Editor from './editor';
import '../css/all.styl';

class App extends Intact {
    @Intact.template()
    static template = template;

    defaults() {
        return {Editor};
    }
}

const app = Intact.mount(App, document.getElementById('app'));

if (module.hot) {
    module.hot.accept('./editor', () => {
        const Editor = require('./editor').default;
        app.set({Editor});
    });
}
