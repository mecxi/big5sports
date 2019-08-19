<?php
/**
 * Created by PhpStorm.
 * User: Mecxi
 * Date: 5/19/2017
 * Time: 11:33 PM
 */
/* check if the page is been requested directly */
if (!defined('BASE_URI')){
    require_once('../../config.php');
    /* redirect to the homepage */
    header('location:'. BASE_URI);
    exit();
}
/* find the current base uri */
$base_uri = str_replace('/big5sports/public/', '', $_SERVER['REQUEST_URI']);
?>

<!-- Section : FoxSports / ESPN -->
<section id="news_hub">
    <div class="posts">

    </div>
</section>


