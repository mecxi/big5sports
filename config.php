<?php
/**
 * @date: 19/11/2016
 * @project: big5games apper
 */

/* determine a script is being called through a server or not */
if (isset($_SERVER['HTTP_HOST'])){
    /* Determine whether we are working on a local server or a on the live server */
    $host = substr($_SERVER['HTTP_HOST'], 0, 5);
    $local = null;
    if (in_array($host, array('local', '127.0', '192.1', '10.0'))){
        $local = true;
    }

    /* set time zone */
    date_default_timezone_set("Africa/Johannesburg");

    /* set project directory */
    $project_dir = $_SERVER['DOCUMENT_ROOT'].'/big5sports';

    /* set log directory */
    $log_dir = $project_dir.'/log';
    if (!file_exists($log_dir)){
        if (!mkdir($log_dir)){
            echo ' Error creating directory: '. $log_dir;
        }
    }

    /* set stories directory */
    $story_dir = $project_dir .'/data';
    if (!file_exists($story_dir)){
        if (!mkdir($story_dir)){
            echo ' Error creating directory: '. $story_dir;
        }
    }

    /* Determine location of files and the URL of the site:
    Allow for development on different servers. */
    if ($local){
        /* set display errors */
        error_reporting(E_ALL); ini_set('display_errors', 1);

        /* Define the constants:*/
        define("LOG_FILE_PATH", $log_dir.'/');
        define("LOG_DATE", date("Y-m-d"));
        define('DB_HOST', 'localhost');
        define('DB_USERNAME', 'webuser');
        define('DB_PASSWORD', '0023353');
        define('DB_LOG_DIR', $log_dir);
        define('STORY_DIR', $story_dir);
        /* define the base URI */
        define('BASE_URI', '/big5sports/hub');
        /* define the assets location */
        define('ASSETS', BASE_URI. '/assets/');
        /* local server */
        define('LOCALHOST', 'http://'.$_SERVER['HTTP_HOST']);

    } else {
        /* Define the constants for live server */
        define("LOG_FILE_PATH", $log_dir.'/');
        define("LOG_DATE", date("Y-m-d"));
        define('DB_HOST', 'localhost');
        define('DB_USERNAME', 'webuser');
        define('DB_PASSWORD', '0023353');
        define('DB_LOG_DIR', $log_dir);/* define the base URI */
        define('STORY_DIR', $story_dir);
        define('BASE_URI', '/big5sports/hub');
        /* define the assets location */
        define('ASSETS', BASE_URI. '/assets/');
        /* local server */
        define('LOCALHOST', 'http://'.$_SERVER['HTTP_HOST']);
    }

    /* set default database */
    define('DB_NAME', 'big5sports');

    /* register CLASSPATH */
    function my_autoloader($class) {
        $classpath = '/classes/class.'.$class.'.php';
        $file = $_SERVER['DOCUMENT_ROOT'].'/big5sports' . $classpath;

        /* check class root folder*/
        if (file_exists($file)) {
            include $file;
            return true;
        } else {
            return false;
        }
    }

    spl_autoload_register('my_autoloader');

    /* for standalone scripts calls */
} else {

    /* set project directory */
    $project_dir = '/var/www/html/big5sports';

    /* set time zone */
    date_default_timezone_set("Africa/Johannesburg");

    /* set log directory */
    $log_dir = $project_dir.'/log';
    if (!file_exists($log_dir)){
        if (!mkdir($log_dir)){
            echo ' Error creating directory: '. $log_dir;
        }
    }

    /* set stories directory */
    $story_dir = $project_dir .'/data';
    if (!file_exists($story_dir)){
        if (!mkdir($story_dir)){
            echo ' Error creating directory: '. $story_dir;
        }
    }

    /* Define the constants:*/
    define("LOG_FILE_PATH", $log_dir.'/');
    define("LOG_DATE", date("Y-m-d"));
    define('DB_HOST', 'localhost');
    define('DB_USERNAME', 'webuser');
    define('DB_PASSWORD', '0023353');
    define('DB_LOG_DIR', $log_dir);
    define('STORY_DIR', $story_dir);
    define('DB_NAME', 'big5sports');
    /* define the base URI */
    define('BASE_URI', '/big5sports/hub');
    /* define the assets location */
    define('ASSETS', BASE_URI. '/assets/');
    /* local server */
    define('LOCALHOST', 'http://'.$_SERVER['HTTP_HOST']);

    /* register CLASSPATH */
    function my_autoloader($class) {
        $classpath = '/classes/class.'.$class.'.php';
        $file = '/var/www/html/big5sports' . $classpath;

        /* check class root folder*/
        if (file_exists($file)) {
            include $file;
            return true;
        } else {
            return false;
        }
    }

    spl_autoload_register('my_autoloader');
}



