import $ from 'jquery';

import 'block/common';
import 'layout/work';
import 'jquery.inputmask/index.js';

require('fancybox')($);

(function() {
    if ($('body').hasClass('c-homepage')) {
        require.ensure([], (require) => {
            require('page/main');
        }, 'main');
    }
	


})();

$(function(){
	$('.fancybox-frame').fancybox({
		type: 'iframe'
	});
	
	$('.fancybox').fancybox();
})
