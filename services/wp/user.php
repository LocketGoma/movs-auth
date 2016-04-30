<?php

// [wp insert user ≪ WordPress Codex](http://codex.wordpress.org/Function_Reference/wp_insert_user)

require_once "config.php";
require_once WP_INSTALLED_PATH . "/wp-load.php";

function refresh_user($name, $pass, $dispname, $charid, $role) {
  // Find a user from WP
  $user = get_user_by("login", $name);

  if ($user) {
    // Already exist, Update user
    $ret = wp_update_user(array(
      "ID"            => $user->ID,
      "user_pass"     => $pass,
      "user_nicename" => $name,
      "user_email"    => $name . "@movingstar.org",
      "display_name"  => $dispname,
      "first_name"    => $charid,
      "role"          => $role,
    ));

    if (is_wp_error($ret)) {
      return false;
    } else {
      return true;
    }
  } else {
    // NOT exist, create a new user
    $ret = wp_insert_user(array(
      "user_pass"     => $pass,
      "user_login"    => $name,
      "user_nicename" => $name,
      "user_email"    => $name . "@movingstar.org",
      "display_name"  => $dispname,
      "first_name"    => $charid,
      "role"          => $role,
    ));

    if (is_wp_error($ret)) {
      return false;
    } else {
      return true;
    }
  }
}

?>