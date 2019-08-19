<?php
/**
 * Created by PhpStorm.
 * User: Mecxi
 * Date: 5/19/2017
 * Time: 9:46 PM
 */

/* check if the page is been requested directly */
if (!defined('BASE_URI')){
    require_once('../../config.php');
    /* redirect to the dashboard */
    header('location:'. BASE_URI );
    exit();
}

?>


</div>

<!-- Scripts -->
<script src="<?php echo ASSETS; ?>js/jquery.min.js"></script>
<script src="<?php echo ASSETS; ?>js/skel.min.js"></script>
<script src="<?php echo ASSETS; ?>js/util.js"></script>
<!--[if lte IE 8]><script src="<?php echo ASSETS; ?>js/ie/respond.min.js"></script><![endif]-->
<script src="<?php echo ASSETS; ?>js/main.js"></script>

<!-- plugins scripts -->
<script src="<?php echo ASSETS; ?>plugins/bootstrap/js/bootstrap.min.js"></script>
<script src="<?php echo ASSETS; ?>plugins/bootstrap-notify/bootstrap-notify.min.js"></script>

<!-- big5sports modules scripts -->
<script>
    /* set required global variables */
    var server = "<?php echo LOCALHOST;?>";
    var base_uri = "<?php echo BASE_URI; ?>";
</script>
<script src="<?php echo BASE_URI; ?>/modules/main.js"></script>

</body>
</html>
