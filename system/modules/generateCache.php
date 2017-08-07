<?php
$a = get_films_from_html(get_web_page('http://kinoprofi.org'));
$b = get_films_from_html(get_web_page('http://kinoprofi.org/page/2/'));
$c = get_films_from_html(get_web_page('http://kinoprofi.org/page/3/'));
file_put_contents(CACHE_PATH.'frontpage.psa', serialize(array_merge($a, $b, $c)));
file_put_contents(CACHE_PATH.'cachetime.psa', time());
header( 'Location: /' );
exit(0);