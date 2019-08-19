<?php
require_once('config.php');
/* set display errors */
error_reporting(E_ALL); ini_set('display_errors', 1);
/* set time zone */
date_default_timezone_set("Africa/Johannesburg");
/**
 * Created by PhpStorm.
 * User: Mecxi
 * Date: 5/20/2017
 * Time: 10:51 PM
 */

$list = array(
    array('title'=>'first1', 'pub_date'=> '2017-6-14 9:5:3:906'),
    array('title'=>'first2', 'pub_date'=> '2017-6-14 9:5:3:904'),
    array('title'=>'first3', 'pub_date'=> '2017-6-14 12:44:35:232'),
    array('title'=>'first4', 'pub_date'=> '2017-6-14 12:44:35:230'),
    array('title'=>'first5', 'pub_date'=> '2017-6-14 12:19:34:373'),
    array('title'=>'first6', 'pub_date'=> '2017-6-14 12:19:34:371'),
    array('title'=>'first7', 'pub_date'=> '2017-6-14 10:5:4:689'),
    array('title'=>'first8', 'pub_date'=> '2017-6-13 15:20:7:98')
);

///* timestamp */
//echo 'first1:'. strtotime('2017-6-14 9:5:3').'<br>';
//echo 'first2:'. strtotime('2017-6-14 9:5:3').'<br>';
//echo 'first3:'. strtotime('2017-6-14 12:44:35').'<br>';
//echo 'first8:'. strtotime('2017-6-13 15:20:7').'<br>';


//function pub_sort($x, $y){
//    return ($x['pub_date'] < $y['pub_date']);
//}

echo '<pre>'. print_r($list, true).'</pre>';

/* render timestamp */
render_timestamp($list);

usort($list, function($x, $y){
    return ($x['pub_date'] < $y['pub_date']);
});

/* render time_ago */
render_time_ago_format($list);

echo '<pre>'. print_r($list, true).'</pre>';



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
        return get_time_ago_string($time_stamp, 60, 'minute');
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

