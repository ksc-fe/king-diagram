import Intact from 'intact';
import template from './index.vdt';

class App extends Intact {
    @Intact.template()
    static template = template;
}

Intact.mount(App, document.getElementById('app'));
