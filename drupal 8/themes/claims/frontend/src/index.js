import $ from 'jquery';
import svg4everybody from 'svg4everybody';

import 'block/common';
import 'layout/work';
import 'foundation-sites/dist/foundation';
import 'periodicjs.component.selectfx/lib/component.selectfx';
import 'jquery.inputmask/dist/jquery.inputmask.bundle';

svg4everybody();

(function() {
    if ($('body').hasClass('c-homepage')) {
        require.ensure([], (require) => {
            require('page/main');
        }, 'main');
    }
	
})();
