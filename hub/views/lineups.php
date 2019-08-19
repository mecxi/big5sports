<?php
/**
 * Created by PhpStorm.
 * User: Mecxi
 * Date: 5/21/2017
 * Time: 5:22 PM
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
<!-- lineups -->
<section id="lineups">
    <div class="features">
        <div class="content">

        </div>
    </div>
</section>