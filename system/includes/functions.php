<?php
function get_web_page($url)
{
        ob_start();
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch,CURLOPT_ENCODING , "gzip");
        curl_setopt ($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36");
        $headers = array
        (
        'Accept: application/json',
        'Accept-Language: ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4',
        'Accept-Encoding: gzip,deflate',
        'Accept-Charset: windows-1251,utf-8;q=0.7,*;q=0.7'
        );
        $tmpfname = CACHE_PATH.'cookie.txt';
        curl_setopt($ch, CURLOPT_COOKIEJAR, $tmpfname);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $tmpfname);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $result = curl_exec($ch);
        curl_close($ch);
        return ob_get_clean();
}
function get_films_from_html($html){
    $doc = new DOMDocument();
        libxml_use_internal_errors(true);
        $doc->loadHTML($html); 
        libxml_use_internal_errors(false);

        $selector = new DOMXPath($doc);
        $result = $selector->query('//div[contains(@class,"title-main")]//a');
        $links = array();
        foreach($result as $node) {
            $a = trim($node->nodeValue);
            preg_match('/(.*)\((.*)\)/s', $a, $matches);
            $title = trim($matches[1]);
            if (strpos($matches[0], 'сезон'))
                $title .= ' (' . $matches[2] . ')';
            $links[] = array('title' => $title, 'url' => $node->getAttribute('href'));
        }
        return $links;
}