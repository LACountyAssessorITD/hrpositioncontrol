<?php
/*
Define global constants here.
*/

define("SQL_SERVER_USERNAME", "superadmin");
define("SQL_SERVER_PASSWORD", "admin");
define("SQL_SERVER_NAME", "hrpersonneldev");

// $serverName = SQL_SERVER_NAME;
// $uid = SQL_SERVER_USERNAME;
// $pwd = SQL_SERVER_PASSWORD;
$serverName = "Assessor";
$uid = "zhdllwyc";
$pwd = "19960806Wyc";
$connectionInfo = array(
    "UID"=>$uid,
    "PWD"=>$pwd,
    "Database"=>"PositionControl",
    "ReturnDatesAsStrings"=>true);

$conn = sqlsrv_connect($serverName, $connectionInfo);
?>
