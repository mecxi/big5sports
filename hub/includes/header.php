<?php
/**
 * Created by PhpStorm.
 * User: Mecxi
 * Date: 5/19/2017
 * Time: 9:40 PM
 */

/* check if the page is been requested directly */
if (!defined('BASE_URI')){
    require_once('../../config.php');
    /* redirect to the homepage */
    header('location:'. BASE_URI );
    exit();
}
?>

<!DOCTYPE HTML>
<!--
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
<head>
    <title>Big5sports | HUB</title>
    <meta charset="utf-16" />
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
    <!--[if lte IE 8]><script src="<?php echo ASSETS; ?>js/ie/html5shiv.js"></script><![endif]-->
    <link rel="stylesheet" href="<?php echo ASSETS; ?>plugins/bootstrap/css/bootstrap.min.css" />
    <link rel="stylesheet" href="<?php echo ASSETS; ?>plugins/bootstrap-notify/animate.css" />
    <link rel="stylesheet" href="<?php echo ASSETS; ?>css/main.css" />
    <link rel="stylesheet" href="<?php echo ASSETS; ?>css/custom.css" />
    <!--[if lte IE 9]><link rel="stylesheet" href="<?php echo ASSETS; ?>css/ie9.css" /><![endif]-->
    <!--[if lte IE 8]><link rel="stylesheet" href="<?php echo ASSETS; ?>css/ie8.css" /><![endif]-->
</head>
<body>
<!-- loader -->
<div id="loader"></div>
<!-- Wrapper -->
<div id="wrapper">

    <!-- Main -->
    <div id="main">
        <div class="inner">

            <!-- Header -->
            <header id="header">
                <a href="#" class="logo"><strong>Big5</strong>sports <i>HUB</i></a>
<!--                <ul class="icons">-->
<!--                    <li><a href="#" class="icon fa-twitter"><span class="label">Twitter</span></a></li>-->
<!--                    <li><a href="#" class="icon fa-facebook"><span class="label">Facebook</span></a></li>-->
<!--                </ul>-->
            </header>
