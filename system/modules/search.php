<?php
$request = urlencode($_POST['request']);
echo json_encode(get_films_from_html(get_web_page('http://kinoprofi.org/search/f:'.$request)));
// var_dump(get_web_page('http://kinoprofi.org/search/f:'.$request));
exit(0);