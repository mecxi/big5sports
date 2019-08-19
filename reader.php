<?php
/**
 * data fetcher
 * */

require_once('config.php');
/* set display errors */
error_reporting(E_ALL); ini_set('display_errors', 1);
/* set time zone */
date_default_timezone_set("Africa/Johannesburg");

function curlHTTPRequest($url){
    /* initialise curl resource */
    $curl = curl_init();

    /* result container, whether we are getting a feedback form url or an error */
    $result = null;

    /* set resources options for GET REQUEST */
    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_URL => $url,
        CURLOPT_CONNECTTIMEOUT => 10000, //attempt a connection within 10sec
        CURLOPT_FAILONERROR => 1,
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_SSL_VERIFYPEER => 0,
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/x-www-form-urlencoded; charset=utf-8',
            'Cache-Control: no-cache'
        ),
        CURLINFO_HEADER_OUT => 1,
        CURLOPT_FOLLOWLOCATION => 1
    ));


    /* execute curl */
    $result = curl_exec($curl);

    if(curl_error($curl)){
        $result = 'Error: "' . curl_error($curl) . '" - Code: ' . curl_errno($curl)
            . ' - HTTP HEADER INFO - '. print_r(curl_getinfo ( $curl), true);
    }
    /* close request to clear up some memory */
    curl_close($curl);

    /* return the result */
    return $result;
}

function process_request($url){
    $html = curlHTTPRequest($url);
    $config = array(
        'indent' => TRUE,
        'output-xhtml' => TRUE,
        'wrap' => 200
    );
    $parse_html = new tidy;
    $parse_html->parseString($html, $config, 'utf8');
    $parse_html->cleanRepair();
    return trim(preg_replace("/(<\/?)(\w+):([^>]*>)/", "$1$2$3", $parse_html));
}

/* enable fetch data locally on testing */
$fetch_local = false;

/* retrieve required parameters */
$params = json_decode(file_get_contents('php://input'), true);

echo (is_null($params)) ? 'parameter empty' :
    (count($params) == 1 && (isset($params['link']))) ? ( ($fetch_local == true) ?
        fetch_data('foxnews_5') : process_request($params['link']) ): 'Wrong parameter submitted. Please review';


/* retrieve cache data */
 function fetch_data($file='cache') {
    $dir_path= DB_LOG_DIR;
    $filename = $dir_path. '/'. $file;
    $buffer = array();

    if (file_exists($filename)){
        /* read current file */
        $tempfile = fopen($filename, 'r');

        while (!feof($tempfile)) {
            /* read data per line */
            $buffer[] = fgets($tempfile, 4096);
        }
        fclose($tempfile);
    } else {
        /* create the file */
        if (is_int(file_put_contents($filename, '0'))){
            save_file('');
        }
    }

    if (is_array($buffer)){
        return implode(' ', $buffer);
    } else {
        return null;
    }
}

/* save current round line up */
 function save_file($data, $file='cache') {
    $dir_path= DB_LOG_DIR;
    $filename = $dir_path. '/'. $file;

    if (!file_exists($dir_path)){
        mkdir($dir_path, 0744);
    }
    /* insert current process info */
    return file_put_contents($filename,  $data);
}