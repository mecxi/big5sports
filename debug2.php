<?php
require_once('config.php');
/* set display errors */
error_reporting(E_ALL); ini_set('display_errors', 1);
/* set time zone */
date_default_timezone_set("Africa/Johannesburg");
/**
 * Created by PhpStorm.
 * User: Mecxi
 * Date: 6/13/2017
 * Time: 1:00 PM
 */

$str = '2017-6-13 14:39:42:8';
$mil = explode(':', $str);
echo end($mil);


//echo substr('2017-6-13 14:39:42:8', 0, -5) . '<br>';
//
//echo strtotime(substr('2017-6-13 14:39:42:8', 0, -5));
//echo strtotime(substr('2017-5-13 13:24:1:677', -3));


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