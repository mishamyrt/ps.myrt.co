<?php
$url = $_POST['url'];
if ($url == '/search/'){
echo json_encode(array('url' => '/search/'));
}
else{
$content = get_web_page($url);
preg_match("/<meta\sproperty=\"og:video\"\scontent=\"(.*)\">/", $content, $matches);
echo json_encode(array('count' => strlen($content), 'url' => $matches[1]));
}
exit(0);