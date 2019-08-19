<?php
/**
 * Created by PhpStorm.
 * User: Mecxi
 * Date: 5/19/2017
 * Time: 9:44 PM
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
</div>
<!-- Sidebar -->
<div id="sidebar">
    <div class="inner">

        <!-- Search -->
<!--        <section id="search" class="alt">-->
<!--            <form method="post" action="#">-->
<!--                <input type="text" name="query" id="query" placeholder="Search" />-->
<!--            </form>-->
<!--        </section>-->

        <!-- Menu -->
        <nav id="menu">
            <header class="major">
                <h2>Super Rugby</h2>
            </header>
            <ul>
                <li><a href="<?php echo BASE_URI; ?>">Homepage</a></li>
                <li><a href="<?php echo BASE_URI; ?>/rugby/news">News</a></li>
                <li><a href="<?php echo BASE_URI; ?>/rugby/lineups">Team Sheets</a></li>
                <li><a href="<?php echo BASE_URI; ?>/rugby/fixtures">Fixtures</a></li>
                <li><a href="<?php echo BASE_URI; ?>/rugby/logs">Logs</a></li>
                <li><a href="<?php echo BASE_URI; ?>/rugby/predictions">Predictions</a></li>
                <li><a href="<?php echo BASE_URI; ?>/rugby/results">Results</a></li>
<!--                <li><a href="--><?php //echo BASE_URI; ?><!--/rugby/bookies">Bookies Odds</a></li>-->
            </ul>
        </nav>

        <!-- Section
        <section id="most_reads">
            <header class="major">
                <h2>Most Read</h2>
            </header>
            <div class="mini-posts">

            </div>
        </section>-->

        <!-- Section -->
        <section>
            <header class="major">
                <h2>Get in touch</h2>
            </header>
            <p>We build mobile games designed around fans' real world passion for sports, entertainment, finance and eSports.</p>
        </section>

        <!-- Footer -->
        <footer id="footer">
            <p class="copyright">&copy; big5sports HUB. All rights reserved.</p>
        </footer>

    </div>
</div>
