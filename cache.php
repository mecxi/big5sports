<?php
/**
 * Created by PhpStorm.
 * User: Mecxi
 * Date: 5/20/2017
 * Time: 10:05 PM
 * big5sports news cache
 */

require_once('config.php');
/* set display errors */
error_reporting(E_ALL); ini_set('display_errors', 1);
/* set time zone */
date_default_timezone_set("Africa/Johannesburg");

/* retrieve required parameters */
$params = json_decode(file_get_contents('php://input'), true);

//echo '<pre>'. json_encode($params['rendered']) . '</pre>';

echo (is_null($params)) ? 'parameter empty' :
    (count($params) < 4 && (isset($params['module'])) )
        ? process_data( $params['module'],
        (isset($params['rendered'])) ? add_substract_extra($params['sections'], $params['rendered']) :
            ((isset($params['rollback'])) ? $params['rollback'] : null),
        ((isset($params['sections']) && $params['sections'] !== null) ? $params['sections'] : null)
    ): 'Wrong parameter submitted. Please review';


/* process incoming data */
function process_data($module, $params, $section=null){
    if (is_null($params)){
        return json_encode(array('result'=>false, 'message'=>'empty arg in process data'));
    } else if (is_int($params)) {
        /* retrieve cache data */
        return json_encode(($section == 'rugby_espnnews' || $section == 'rugby_foxnews') ?
            news_merger_by_pubdata($module, $params, $section) :fetch_cache($module, $params, $section));
    }else {
        /* save current data */
        if (save_cache($module, $params, $section) !== false){
            return json_encode(array('result'=>true, 'message'=>'success'));
        } else {
            return json_encode(array('result'=>false, 'message'=>'data is identical. Update not required'));
        }
    }
}


/* save current data */
function save_cache($module, $data, $section=null) {
    $dir = (is_null($section)) ? STORY_DIR. '/'. $module : STORY_DIR. '/'. $module.'/'.$section;
    $filename = $dir .'/cache.big5';

    if (!file_exists($dir)){
        mkdir($dir, 0744, true);
    }
    /* check if current data has been changed */
    if ($section == 'rugby_espnnews' || $section == 'rugby_foxnews'){
        if (news_check_current($module, $section, $data) === false){
            return false;
        }
    } else {
        if ( strlen(json_encode(fetch_cache($module, 0, $section))) == strlen(json_encode($data))){
            return false;
        }
    }

    return ($section == 'rugby_espnnews' || $section == 'rugby_foxnews') ?
        ( (news_process_timestamp($module, $section, $data) === true) ? file_put_contents($filename,  json_encode($data))
            : file_put_contents($filename,  json_encode(news_process_timestamp($module, $section, $data))) )
        :
        file_put_contents($filename,  json_encode($data));
}

/* retrieve cache data */
function fetch_cache($module, $rollback, $section=null) {
    $dir = (is_null($section)) ? STORY_DIR. '/'. $module :  STORY_DIR. '/'. $module.'/'.$section;

    $filename = $rollback == 0 ? $dir .'/cache.big5' : $dir .'/'. date('Y-m-d', strtotime(" -$rollback days"));
    $buffer = null;

    if (file_exists($filename)){
        /* read current file */
        $tempfile = fopen($filename, 'r');

        while (!feof($tempfile)) {
            /* read data per line */
            $buffer[] = fgets($tempfile, 4096);
        }
        fclose($tempfile);
    } else {
        return array('result'=> false, 'message'=>date('Y-m-d', strtotime(" -$rollback days")). (!is_null($section)) ? $section . ' cache doesn\'t exist' : ' cache doesn\'t exist');
    }

    if (is_array($buffer)){
        return json_decode(implode('', $buffer), true);
    } else {
        return null;
    }
}

/* add extra features before caching */
function add_substract_extra($params, $data){
    switch($params){
        case 'fixtures':
            return str_replace('..', 'http://rugby.ultimatedreamteams.com/superrugby', $data);
            break;
        case 'standings':
            return str_replace(array('watch','discuss','edit'), '', $data);
            break;
        case 'results':
            $temp = str_replace('href="/match_centre/', 'id="', $data);
            return str_replace('<td></td>', '', $temp);
            break;
        default:
            return $data;
            break;
    }
}

/* check news timestamps in order to save */
function news_check_current($module, $section, $data){
    /* retrieved stored news */
    $stored_data = fetch_cache($module, 0, $section);
    /* check if upcoming data is same as the stored ones */
    if (is_null($stored_data) || isset($stored_data['result'])){
        return true; // write data
    } else {
        if ($stored_data[0]['title'] == $data[0]['title']){
            return false; // update not required */
        } else {
            return true; // write data
        }
    }
}

/* save news as per the timestamp */
function news_process_timestamp($module, $section, $data){
    /* retrieved stored news */
    $stored_data = fetch_cache($module, 0, $section);
    $update_stored = null;
    /* collect updated news */
    if (is_null($stored_data) || isset($stored_data['result'])){
        return true; // write data
    } else {
        for($i=0; $i < count($data); ++$i){
            $pointer = news_was_stored($stored_data, $data[$i]['title']);
            if (!is_null($pointer)){
                $update_stored[] = $stored_data[$pointer];
            } else {
                /* save this update */
                $update_stored[] = $data[$i];
            }
        }
    }
    /* sort by pub_date */
    sort_by_pubdate($update_stored);

    return $update_stored;
}

/* check if record already stored */
function news_was_stored($stored, $reference){
    for ($i=0; $i < count($stored); ++$i){
        if ($stored[$i]['title'] == $reference){
            return $i;
            break;
        }
    }

    return null;
}


/* retrieve news as order by publish date */
function sort_news_by_pubdate($stored_data){
    //echo '<pre>'. print_r($stored_data, true).'</pre>';
    if (is_null($stored_data) || isset($stored_data['result'])) {
        return $stored_data;
    } else {
        $update_stored = $stored_data;
        /* render timestamp */
        render_timestamp($update_stored);
        /* sort by pub_date */
        sort_by_pubdate($update_stored);
        //echo '<pre>'. print_r($update_stored, true).'</pre>';
        /* render pud_date format to time ago */
        render_time_ago_format($update_stored);

        return $update_stored;
    }
}
/* reorder by publish date */
function sort_by_pubdate(&$updated){
    usort($updated, function($x, $y){
        return ($x['pub_date'] < $y['pub_date']);
    });
}

/* merge news section on retrieval */
function news_merger_by_pubdata($module, $params, $section){
    /* fetch save data as per given section */
    $cache_data = fetch_cache($module, $params, $section);
    /* fetch added section */
    $cache_data_added = ($section == 'rugby_espnnews') ?
        fetch_cache($module, $params, 'rugby_foxnews') : fetch_cache($module, $params, 'rugby_espnnews');
    /* check for errors */
    if ( (is_null($cache_data) || isset($cache_data['result'])) && (is_null($cache_data_added) || isset($cache_data_added['result'])) ) {
        return $cache_data;
    } else if (is_null($cache_data) || isset($cache_data['result'])) {
        return sort_news_by_pubdate($cache_data_added);
    } else if (is_null($cache_data_added) || isset($cache_data_added['result'])){
        return sort_news_by_pubdate($cache_data);
    } else {
        /* do a merge */
        for($i=0; $i < count($cache_data_added); ++$i){
            array_push($cache_data, $cache_data_added[$i]);
        }
        //echo '<pre>'. print_r(sort_news_by_pubdate($cache_data), true). '</pre>';
        return sort_news_by_pubdate($cache_data);
    }
}

/* render timestamp */
function render_timestamp(&$data){
    for($i=0; $i < count($data); ++$i){
        /* check the millisecond length */
        $mill = explode(':', $data[$i]['pub_date']);
        switch(strlen(end($mill))){
            case 1:
                $data[$i]['pub_date'] = strtotime(substr($data[$i]['pub_date'], 0, -2));
                break;
            case 2:
                $data[$i]['pub_date'] = strtotime(substr($data[$i]['pub_date'], 0, -3));
                break;
            default:
                $data[$i]['pub_date'] = strtotime(substr($data[$i]['pub_date'], 0, -4));
                break;
        }

    }
}

/* render time_ago format */
function render_time_ago_format(&$data){
    for($i=0; $i < count($data); ++$i){
        /* check the millisecond length */
        $mill = explode(':', $data[$i]['pub_date']);
        switch(strlen(end($mill))){
            case 1:
                $data[$i]['pub_date'] = get_time_ago($data[$i]['pub_date']);
                break;
            case 2:
                $data[$i]['pub_date'] = get_time_ago($data[$i]['pub_date']);
                break;
            default:
                $data[$i]['pub_date'] = get_time_ago($data[$i]['pub_date']);
                break;
        }

    }
}


/* return the time since last given time */
function get_time_ago($time_stamp) {
    $time_difference = strtotime('now') - $time_stamp;

    if ($time_difference >= 60 * 60 * 24 * 365.242199) {
        /*
         * 60 seconds/minute * 60 minutes/hour * 24 hours/day * 365.242199 days/year
         * This means that the time difference is 1 year or more
         */
        return get_time_ago_string($time_stamp, 60 * 60 * 24 * 365.242199, 'year');
    } elseif ($time_difference >= 60 * 60 * 24 * 30.4368499) {
        /*
         * 60 seconds/minute * 60 minutes/hour * 24 hours/day * 30.4368499 days/month
         * This means that the time difference is 1 month or more
         */
        return get_time_ago_string($time_stamp, 60 * 60 * 24 * 30.4368499, 'month');
    } elseif ($time_difference >= 60 * 60 * 24 * 7) {
        /*
         * 60 seconds/minute * 60 minutes/hour * 24 hours/day * 7 days/week
         * This means that the time difference is 1 week or more
         */
        return get_time_ago_string($time_stamp, 60 * 60 * 24 * 7, 'week');
    } elseif ($time_difference >= 60 * 60 * 24) {
        /*
         * 60 seconds/minute * 60 minutes/hour * 24 hours/day
         * This means that the time difference is 1 day or more
         */
        return get_time_ago_string($time_stamp, 60 * 60 * 24, 'day');
    } elseif ($time_difference >= 60 * 60) {
        /*
         * 60 seconds/minute * 60 minutes/hour
         * This means that the time difference is 1 hour or more
         */
        return get_time_ago_string($time_stamp, 60 * 60, 'hour');
    } else {
        /*
         * 60 seconds/minute
         * This means that the time difference is a matter of minutes
         */
        return get_time_ago_string($time_stamp, 60, 'min');
    }
}

function get_time_ago_string($time_stamp, $divisor, $time_unit) {
    $time_difference = strtotime("now") - $time_stamp;
    $time_units      = floor($time_difference / $divisor);

    settype($time_units, 'string');

    if ($time_units === '0') {
        return 'less than 1 ' . $time_unit . ' ago';
    } elseif ($time_units === '1') {
        return '1 ' . $time_unit . ' ago';
    } else {
        /*
         * More than "1" $time_unit. This is the "plural" message.
         */
        // TODO: This pluralizes the time unit, which is done by adding "s" at the end; this will not work for i18n!
        return $time_units . ' ' . $time_unit . 's ago';
    }
}
