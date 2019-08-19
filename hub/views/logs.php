<?php
/**
 * Created by PhpStorm.
 * User: Mecxi
 * Date: 5/22/2017
 * Time: 12:26 AM
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
<!-- Section : Rugby Sports logs -->
<section id="logs">
    <div class="table-wrapper">

    </div>
</section>