<?php
/**
 * Created by PhpStorm.
 * User: Mecxi
 * Date: 5/21/2017
 * Time: 9:45 PM
 */
if (!defined('BASE_URI')){
    require_once('../../config.php');
    /* redirect to the homepage */
    header('location:'. BASE_URI);
    exit();
}
/* find the current base uri */
$base_uri = str_replace('/big5sports/public/', '', $_SERVER['REQUEST_URI']);
?>

<!-- Section Fixtures -->
<section id="fixtures">
    <div class="table-wrapper">

    </div>
</section>
