<?php
switch (uri) {
    case '/':
        // if ((time() - intval(file_get_contents(CACHE_PATH.'cachetime.psa'))) > 3600)
            // header( 'Location: /recache' );
        $links = unserialize(file_get_contents(CACHE_PATH.'frontpage.psa'));
        $view->set('links', $links);
        break;
    case '/recache':
        runModule('generateCache');
    break;
    case '/getplayer':
        runModule('getPlayer');
    break;
    case '/search/':
        $view->set('template', 'search.tpl');
    break;
    case '/dosearch':
        runModule('search');
    break;
}
