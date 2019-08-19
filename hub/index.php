<?php
/**
 * Created by PhpStorm.
 * User: Mecxi
 * Date: 5/19/2017
 * Time: 9:32 PM
 */

require_once('../config.php');

/* validate the incoming view page request */
$p = null;
if (isset($_GET['view'])){
    $p = $_GET['view'];
} else if (isset($_POST['view'])){
    $p = $_POST['view'];
}

switch($p){
    case 'news':
        $view = 'news.php';
        break;
    case 'lineups':
        $view = 'lineups.php';
        break;
    case 'fixtures':
        $view = 'fixtures.php';
        break;
    case 'logs':
        $view = 'logs.php';
        break;
    case 'results':
        $view = 'results.php';
        break;
    case 'bookies':
        $view = 'bookies.php';
        break;
    case 'predictions':
        $view = 'predictions.php';
        break;
    default:
        /* welcome page */
        $view = 'welcome.php';
        break;
}

/* if the view doesn't exist redirect homepage */
if (!file_exists('./views/'. $view)){
    $view = 'welcome.php';
}
/* layout requested views */
include_once('./includes/header.php');
include_once('./views/'.$view);
include_once('./includes/nav.php');
include_once('./includes/footer.php');